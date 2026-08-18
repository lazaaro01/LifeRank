import { prisma } from "@/lib/prisma";

export const activityViewRepository = {
  listByUserForActivities(userId: string, activityIds: string[]) {
    return prisma.activityView.findMany({
      where: { userId, activityId: { in: activityIds } },
      select: { activityId: true, firstViewedAt: true },
    });
  },

  async recordFirstViews(userId: string, activityIds: string[]) {
    if (activityIds.length === 0) return;
    await prisma.activityView.createMany({
      data: activityIds.map((activityId) => ({ activityId, userId })),
      skipDuplicates: true,
    });
  },
};
