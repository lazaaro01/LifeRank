import { getIcon } from "@/lib/icon-map";
import type { DashboardData } from "@/services/dashboard.service";

type RecentActivitiesProps = {
  activities: DashboardData["recentActivities"];
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhuma atividade registrada ainda. Use o botão de + pra começar.
      </p>
    );
  }

  return (
    <ul className="divide-border -mx-2 divide-y">
      {activities.map((activity) => {
        const Icon = getIcon(activity.category.icon);
        return (
          <li
            key={activity.id}
            className="flex items-center gap-3 px-2 py-3 sm:gap-4 sm:py-4"
          >
            <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10">
              <Icon className="text-primary size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium uppercase sm:text-sm">
                {activity.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {activity.occurredAt.toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span className="text-primary shrink-0 text-base font-semibold tabular-nums sm:text-lg">
              +{activity.xpEarned} XP
            </span>
          </li>
        );
      })}
    </ul>
  );
}
