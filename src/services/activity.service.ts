import { prisma } from "@/lib/prisma";
import { activityRepository } from "@/repositories/activity.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { userRepository } from "@/repositories/user.repository";
import { achievementRepository } from "@/repositories/achievement.repository";
import { xpFromPoints } from "@/services/gamification/xp";
import { getLevelFromXp } from "@/services/gamification/leveling";
import { computeStreak } from "@/services/gamification/streak";
import { evaluateAchievements } from "@/services/gamification/achievements";
import { notificationService } from "@/services/notification.service";
import { ServiceError } from "@/services/errors";
import type { CreateActivityInput } from "@/utils/validators/activity.schema";
import type { AchievementModel } from "@/generated/prisma/models";

export type CreateActivityResult = {
  leveledUp: boolean;
  newAchievements: AchievementModel[];
};

export const activityService = {
  async createActivity(
    userId: string,
    input: CreateActivityInput,
    photoUrl: string
  ): Promise<CreateActivityResult> {
    const category = await categoryRepository.findById(input.categoryId);

    if (!category || (category.ownerId && category.ownerId !== userId)) {
      throw new ServiceError("Categoria inválida", "categoryId");
    }

    const points = Math.round(category.pointsPerUnit * input.quantity);
    const xpEarned = xpFromPoints(points);
    let actorName = "";

    const result = await prisma.$transaction(async (tx) => {
      await activityRepository.create(
        {
          userId,
          categoryId: category.id,
          title: input.title,
          quantity: input.quantity,
          points,
          xpEarned,
          occurredAt: new Date(input.occurredAt),
          photoUrl,
        },
        tx
      );

      const currentUser = await userRepository.findById(userId, tx);
      if (!currentUser) {
        throw new ServiceError("Usuário não encontrado");
      }
      actorName = currentUser.name;

      const newTotalPoints = currentUser.points + points;
      const newTotalXp = currentUser.xp + xpEarned;
      const newLevel = getLevelFromXp(newTotalXp);
      const leveledUp = newLevel > currentUser.level;

      const occurredDates = await activityRepository.findOccurredDatesByUser(
        userId,
        tx
      );
      const streak = computeStreak(occurredDates);

      await userRepository.updateGamificationStats(
        userId,
        {
          points: newTotalPoints,
          xp: newTotalXp,
          level: newLevel,
          currentStreak: streak.current,
          bestStreak: Math.max(currentUser.bestStreak, streak.best),
        },
        tx
      );

      const activityCount = await activityRepository.countByUser(userId, tx);
      const qualifyingCodes = evaluateAchievements({
        totalPoints: newTotalPoints,
        currentStreak: streak.current,
        activityCount,
      });

      const alreadyUnlocked = await achievementRepository.findUnlockedCodesByUser(
        userId,
        tx
      );
      const newCodes = qualifyingCodes.filter(
        (code) => !alreadyUnlocked.includes(code)
      );
      const newAchievements = await achievementRepository.unlockMany(
        userId,
        newCodes,
        tx
      );

      return { leveledUp, newAchievements };
    });

    try {
      await notificationService.notifyClubmatesOfActivity(userId, actorName, xpEarned);
    } catch (error) {
      // Notificar o clube nunca deve derrubar o registro da atividade.
      console.error("[activityService] Falha ao notificar o clube:", error);
    }

    return result;
  },
};
