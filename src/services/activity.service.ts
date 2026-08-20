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
import type { Prisma } from "@/generated/prisma/client";
import type { CreateActivityInput } from "@/utils/validators/activity.schema";
import type { AchievementModel } from "@/generated/prisma/models";

export type CreateActivityResult = {
  leveledUp: boolean;
  newAchievements: AchievementModel[];
};

// Recomputes a user's points/xp/level/streak/achievements from the full set
// of their activity rows. Recomputing from scratch (rather than incrementing)
// keeps stats correct no matter whether an activity was just created, edited,
// or deleted.
async function recomputeUserGamification(
  tx: Prisma.TransactionClient,
  userId: string
): Promise<CreateActivityResult> {
  const currentUser = await userRepository.findById(userId, tx);
  if (!currentUser) {
    throw new ServiceError("Usuário não encontrado");
  }

  const stats = await activityRepository.listStatsByUser(userId, tx);
  const totalPoints = stats.reduce((sum, activity) => sum + activity.points, 0);
  const totalXp = stats.reduce((sum, activity) => sum + activity.xpEarned, 0);
  const activityCount = stats.length;

  const streak = computeStreak(stats.map((activity) => activity.occurredAt));
  const newLevel = getLevelFromXp(totalXp);
  const leveledUp = newLevel > currentUser.level;

  await userRepository.updateGamificationStats(
    userId,
    {
      points: totalPoints,
      xp: totalXp,
      level: newLevel,
      currentStreak: streak.current,
      bestStreak: Math.max(currentUser.bestStreak, streak.best),
    },
    tx
  );

  const qualifyingCodes = evaluateAchievements({
    totalPoints,
    currentStreak: streak.current,
    activityCount,
  });
  const alreadyUnlocked = await achievementRepository.findUnlockedCodesByUser(
    userId,
    tx
  );
  const newCodes = qualifyingCodes.filter((code) => !alreadyUnlocked.includes(code));
  const newAchievements = await achievementRepository.unlockMany(userId, newCodes, tx);

  return { leveledUp, newAchievements };
}

async function resolveCategory(userId: string, categoryId: string) {
  const category = await categoryRepository.findById(categoryId);
  if (!category || (category.ownerId && category.ownerId !== userId)) {
    throw new ServiceError("Categoria inválida", "categoryId");
  }
  return category;
}

export const activityService = {
  async createActivity(
    userId: string,
    input: CreateActivityInput,
    photoUrl: string
  ): Promise<CreateActivityResult> {
    const category = await resolveCategory(userId, input.categoryId);

    const points = Math.round(category.pointsPerUnit * input.quantity);
    const xpEarned = xpFromPoints(points);

    const currentUser = await userRepository.findById(userId);
    const actorName = currentUser?.name ?? "";

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

      return recomputeUserGamification(tx, userId);
    });

    try {
      await notificationService.notifyClubmatesOfActivity(userId, actorName, xpEarned);
    } catch (error) {
      // Notificar o clube nunca deve derrubar o registro da atividade.
      console.error("[activityService] Falha ao notificar o clube:", error);
    }

    return result;
  },

  async updateActivity(
    userId: string,
    activityId: string,
    input: CreateActivityInput
  ): Promise<CreateActivityResult> {
    const activity = await activityRepository.findById(activityId);
    if (!activity || activity.userId !== userId) {
      throw new ServiceError("Atividade não encontrada");
    }

    const category = await resolveCategory(userId, input.categoryId);
    const points = Math.round(category.pointsPerUnit * input.quantity);
    const xpEarned = xpFromPoints(points);

    return prisma.$transaction(async (tx) => {
      await activityRepository.update(
        activityId,
        {
          categoryId: category.id,
          title: input.title,
          quantity: input.quantity,
          points,
          xpEarned,
          occurredAt: new Date(input.occurredAt),
        },
        tx
      );

      return recomputeUserGamification(tx, userId);
    });
  },

  async deleteActivity(userId: string, activityId: string): Promise<void> {
    const activity = await activityRepository.findById(activityId);
    if (!activity || activity.userId !== userId) {
      throw new ServiceError("Atividade não encontrada");
    }

    await prisma.$transaction(async (tx) => {
      await activityRepository.delete(activityId, tx);
      await recomputeUserGamification(tx, userId);
    });
  },
};
