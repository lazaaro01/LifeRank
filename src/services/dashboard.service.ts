import { userRepository } from "@/repositories/user.repository";
import { activityRepository } from "@/repositories/activity.repository";
import { achievementRepository } from "@/repositories/achievement.repository";
import { getLevelProgress } from "@/services/gamification/leveling";
import { startOfWeek, startOfMonth, startOfDay, addDays } from "@/utils/date";

const EVOLUTION_DAYS = 30;

export type EvolutionPoint = { date: string; points: number };

function sumPoints(activities: { points: number }[]) {
  return activities.reduce((sum, activity) => sum + activity.points, 0);
}

function buildEvolutionSeries(
  activities: { occurredAt: Date; points: number }[],
  start: Date,
  end: Date
): EvolutionPoint[] {
  const byDay = new Map<string, number>();
  for (const activity of activities) {
    const key = activity.occurredAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + activity.points);
  }

  const series: EvolutionPoint[] = [];
  const endDay = startOfDay(end);
  for (let cursor = startOfDay(start); cursor <= endDay; cursor = addDays(cursor, 1)) {
    const key = cursor.toISOString().slice(0, 10);
    series.push({ date: key, points: byDay.get(key) ?? 0 });
  }
  return series;
}

export const dashboardService = {
  async getDashboardData(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const evolutionStart = addDays(startOfDay(now), -(EVOLUTION_DAYS - 1));

    const [
      recentActivities,
      unlockedAchievements,
      catalog,
      weekActivities,
      monthActivities,
      evolutionActivities,
    ] = await Promise.all([
      activityRepository.findRecentByUser(userId, 8),
      achievementRepository.findUnlockedByUser(userId),
      achievementRepository.findAllCatalog(),
      activityRepository.findSinceByUser(userId, weekStart),
      activityRepository.findSinceByUser(userId, monthStart),
      activityRepository.findSinceByUser(userId, evolutionStart),
    ]);

    const unlockedCodes = new Set(
      unlockedAchievements.map((entry) => entry.achievement.code)
    );
    const lockedAchievements = catalog.filter(
      (achievement) => !unlockedCodes.has(achievement.code)
    );

    return {
      user,
      levelProgress: getLevelProgress(user.xp),
      recentActivities,
      unlockedAchievements,
      lockedAchievements,
      weeklyStats: {
        points: sumPoints(weekActivities),
        activityCount: weekActivities.length,
      },
      monthlyStats: {
        points: sumPoints(monthActivities),
        activityCount: monthActivities.length,
      },
      evolution: buildEvolutionSeries(evolutionActivities, evolutionStart, now),
    };
  },
};

export type DashboardData = Awaited<
  ReturnType<typeof dashboardService.getDashboardData>
>;
