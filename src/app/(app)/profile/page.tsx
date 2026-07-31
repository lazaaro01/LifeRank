import type { Metadata } from "next";
import { Award, Trophy } from "lucide-react";
import { auth } from "@/server/auth";
import { userService } from "@/services/user.service";
import { activityRepository } from "@/repositories/activity.repository";
import { achievementRepository } from "@/repositories/achievement.repository";
import { getLevelProgress } from "@/services/gamification/leveling";
import { getIcon } from "@/lib/icon-map";
import { ProfileHeader } from "@/components/profile/profile-header";

export const metadata: Metadata = {
  title: "Perfil | LifeRank",
};

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [profile, recentActivities, activityCount, unlockedAchievements] =
    await Promise.all([
      userService.getProfile(userId),
      activityRepository.findRecentByUser(userId, 4),
      activityRepository.countByUser(userId),
      achievementRepository.findUnlockedByUser(userId),
    ]);

  if (!profile) {
    return null;
  }

  const levelProgress = getLevelProgress(profile.xp);
  const xpRemaining = Math.max(
    levelProgress.xpForNextLevel - levelProgress.xpIntoLevel,
    0
  );
  const recentMilestones = unlockedAchievements.slice(0, 2);
  const activeBadges = unlockedAchievements.slice(0, 5);

  return (
    <div className="space-y-4 py-8">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        editDefaultValues={{
          name: profile.name,
          avatarUrl: profile.avatarUrl ?? "",
          phone: profile.phone ?? "",
          bio: profile.bio ?? "",
        }}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col justify-between gap-6 rounded-xl border bg-white p-8">
          <div className="flex items-start justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              XP total de performance
            </p>
            <Trophy className="text-muted-foreground size-5" />
          </div>
          <p className="text-primary text-5xl font-semibold">
            {profile.xp.toLocaleString("pt-BR")}
          </p>
          <div className="space-y-2">
            <div className="bg-muted h-3 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${levelProgress.progress * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium uppercase">
              <span>Nível {levelProgress.level}</span>
              <span>{xpRemaining} XP para o próximo rank</span>
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl p-8">
          <p className="text-xs font-medium tracking-wide uppercase opacity-70">
            Streak atual
          </p>
          <p className="text-5xl font-semibold">{profile.currentStreak}</p>
          <div>
            <p className="text-sm tracking-wide uppercase">
              Dias ativos seguidos
            </p>
            <p className="text-sm opacity-60">
              Melhor marca: {profile.bestStreak} dias
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-xl border bg-white p-8">
          <div className="flex items-start justify-between">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Atividades concluídas
            </p>
            <Award className="text-muted-foreground size-5" />
          </div>
          <p className="text-5xl font-semibold">{activityCount}</p>
          <div className="flex gap-2">
            {recentActivities.map((activity) => {
              const Icon = getIcon(activity.category.icon);
              return (
                <div
                  key={activity.id}
                  className="bg-muted flex size-12 items-center justify-center rounded-lg"
                >
                  <Icon className="size-4" />
                </div>
              );
            })}
            {activityCount > recentActivities.length && (
              <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-lg text-sm font-medium">
                +{activityCount - recentActivities.length}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-muted rounded-xl p-8">
          <h3 className="mb-6 text-2xl font-semibold uppercase">
            Marcos recentes
          </h3>
          {recentMilestones.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Registre atividades para desbloquear conquistas.
            </p>
          ) : (
            <div className="space-y-6">
              {recentMilestones.map(({ achievement, unlockedAt }) => {
                const Icon = getIcon(achievement.icon);
                return (
                  <div key={achievement.id} className="flex items-center gap-6">
                    <div className="border-primary flex size-16 shrink-0 items-center justify-center rounded-full border-2 bg-white">
                      <Icon className="text-primary size-6" />
                    </div>
                    <div>
                      <p className="text-lg font-medium uppercase">
                        {achievement.title}
                      </p>
                      <p className="text-muted-foreground text-sm uppercase">
                        Desbloqueado em{" "}
                        {unlockedAt.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-xl border bg-white p-8">
          <h3 className="text-primary text-2xl font-semibold uppercase">
            Badges ativos
          </h3>
          {activeBadges.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum badge desbloqueado ainda.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeBadges.map(({ achievement }) => (
                <span
                  key={achievement.id}
                  className="bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-medium uppercase"
                >
                  {achievement.title}
                </span>
              ))}
            </div>
          )}
          <a
            href="/dashboard"
            className="text-primary flex items-center gap-2 text-sm font-medium uppercase"
          >
            Ver todas as conquistas →
          </a>
        </div>
      </div>
    </div>
  );
}
