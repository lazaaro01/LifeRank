import Link from "next/link";
import { getIcon } from "@/lib/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityRowActions } from "@/components/activities/activity-row-actions";
import type { ActivityModel, CategoryModel } from "@/generated/prisma/models";

type ActivityWithCategory = ActivityModel & { category: CategoryModel };

type ActivityHistoryContentProps = {
  activities: ActivityWithCategory[];
  categories: CategoryModel[];
  activeCategoryId: string | null;
  stats: {
    totalXp: number;
    activityCount: number;
    currentStreak: number;
  };
};

function dayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Hoje";
  if (isSameDay(date, yesterday)) return "Ontem";
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function groupByDay(activities: ActivityWithCategory[]) {
  const groups = new Map<string, ActivityWithCategory[]>();
  for (const activity of activities) {
    const label = dayLabel(activity.occurredAt);
    const existing = groups.get(label);
    if (existing) {
      existing.push(activity);
    } else {
      groups.set(label, [activity]);
    }
  }
  return Array.from(groups.entries());
}

export function ActivityHistoryContent({
  activities,
  categories,
  activeCategoryId,
  stats,
}: ActivityHistoryContentProps) {
  const groups = groupByDay(activities);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-xl space-y-1">
          <h1 className="font-heading text-3xl uppercase sm:text-5xl">
            Histórico de atividades
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe seu progresso, seus ganhos e mantenha seu status de elite.
          </p>
        </div>

        <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:gap-3">
          <Card size="sm" className="items-center text-center sm:min-w-28">
            <CardContent>
              <p className="text-muted-foreground text-xs uppercase">Total XP</p>
              <p className="text-primary text-xl font-semibold sm:text-2xl">
                {stats.totalXp}
              </p>
            </CardContent>
          </Card>
          <Card size="sm" className="items-center text-center sm:min-w-28">
            <CardContent>
              <p className="text-muted-foreground text-xs uppercase">Atividades</p>
              <p className="text-xl font-semibold sm:text-2xl">
                {stats.activityCount}
              </p>
            </CardContent>
          </Card>
          <Card
            size="sm"
            className="bg-primary text-primary-foreground items-center text-center sm:min-w-28"
          >
            <CardContent>
              <p className="text-xs uppercase opacity-80">Streak</p>
              <p className="text-xl font-semibold sm:text-2xl">
                {stats.currentStreak}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted flex items-center gap-2 overflow-x-auto rounded-full p-2">
        <Link
          href="/activities"
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategoryId === null
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          Tudo
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/activities?category=${category.id}`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategoryId === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="space-y-6">
        {groups.length === 0 && (
          <p className="text-muted-foreground py-12 text-center text-sm">
            Nenhuma atividade encontrada para esse filtro.
          </p>
        )}

        {groups.map(([label, dayActivities]) => (
          <div key={label} className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground shrink-0 text-sm font-medium uppercase">
                {label}
              </span>
              <div className="bg-border h-px flex-1" />
            </div>

            {dayActivities.map((activity) => {
              const Icon = getIcon(activity.category.icon);
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-xl border p-4 sm:p-6"
                >
                  {activity.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activity.photoUrl}
                      alt={activity.title}
                      className="size-12 shrink-0 rounded-full object-cover sm:size-14"
                    />
                  ) : (
                    <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14">
                      <Icon className="text-primary size-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium uppercase sm:text-base">
                      {activity.title}
                    </p>
                    <p className="text-muted-foreground text-xs uppercase sm:text-sm">
                      {activity.occurredAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {activity.category.name}
                    </p>
                  </div>
                  <span className="text-primary shrink-0 text-lg font-semibold sm:text-xl">
                    +{activity.xpEarned} XP
                  </span>
                  <ActivityRowActions
                    activityId={activity.id}
                    activityTitle={activity.title}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
