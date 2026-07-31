import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { AchievementCode } from "@/services/gamification/achievements";

export const achievementRepository = {
  findAllCatalog() {
    return prisma.achievement.findMany({ orderBy: { createdAt: "asc" } });
  },

  findUnlockedByUser(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    });
  },

  findUnlockedCodesByUser(
    userId: string,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.userAchievement
      .findMany({
        where: { userId },
        select: { achievement: { select: { code: true } } },
      })
      .then((rows) => rows.map((row) => row.achievement.code as AchievementCode));
  },

  async unlockMany(
    userId: string,
    codes: AchievementCode[],
    tx: Prisma.TransactionClient = prisma
  ) {
    if (codes.length === 0) return [];

    const achievements = await tx.achievement.findMany({
      where: { code: { in: codes } },
    });

    await tx.userAchievement.createMany({
      data: achievements.map((achievement) => ({
        userId,
        achievementId: achievement.id,
      })),
      skipDuplicates: true,
    });

    return achievements;
  },
};
