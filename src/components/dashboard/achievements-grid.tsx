import { getIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/services/dashboard.service";
import type { AchievementModel } from "@/generated/prisma/models";

type AchievementsGridProps = {
  unlocked: DashboardData["unlockedAchievements"];
  locked: DashboardData["lockedAchievements"];
};

export function AchievementsGrid({ unlocked, locked }: AchievementsGridProps) {
  if (unlocked.length === 0 && locked.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhuma conquista cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {unlocked.map(({ achievement }) => (
        <AchievementBadge key={achievement.id} achievement={achievement} unlocked />
      ))}
      {locked.map((achievement) => (
        <AchievementBadge key={achievement.id} achievement={achievement} unlocked={false} />
      ))}
    </div>
  );
}

function AchievementBadge({
  achievement,
  unlocked,
}: {
  achievement: AchievementModel;
  unlocked: boolean;
}) {
  const Icon = getIcon(achievement.icon);
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center",
        unlocked
          ? "border-primary/20 bg-primary/5"
          : "border-border opacity-40"
      )}
      title={achievement.description}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          unlocked
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-5" />
      </div>
      <p className="text-xs leading-tight font-medium">{achievement.title}</p>
    </div>
  );
}
