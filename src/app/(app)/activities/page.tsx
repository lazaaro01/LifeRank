import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { activityRepository } from "@/repositories/activity.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { userRepository } from "@/repositories/user.repository";
import { ActivityHistoryContent } from "@/components/activities/activity-history-content";

export const metadata: Metadata = {
  title: "Histórico de Atividades | LifeRank",
};

type ActivitiesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ActivitiesPage({
  searchParams,
}: ActivitiesPageProps) {
  const { category } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const [activities, categories, user, totalCount] = await Promise.all([
    activityRepository.listByUser(userId, { categoryId: category }),
    categoryRepository.listAvailableForUser(userId),
    userRepository.findById(userId),
    activityRepository.countByUser(userId),
  ]);

  const totalXp = activities.reduce((sum, activity) => sum + activity.xpEarned, 0);

  return (
    <ActivityHistoryContent
      activities={activities}
      categories={categories}
      activeCategoryId={category ?? null}
      stats={{
        totalXp: category ? totalXp : (user?.xp ?? 0),
        activityCount: category ? activities.length : totalCount,
        currentStreak: user?.currentStreak ?? 0,
      }}
    />
  );
}
