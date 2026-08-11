import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ActivityModel, UserModel } from "@/generated/prisma/models";

type FeedActivity = ActivityModel & { user: UserModel };

type CalendarContentProps = {
  clubName: string | null;
  activities: FeedActivity[];
  year: number;
  month: number; // 0-indexed
};

const WEEKDAY_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const MAX_VISIBLE_AVATARS = 3;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function buildMonthGrid(year: number, month: number) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const leadingBlanks = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function groupByDay(activities: FeedActivity[]) {
  const byDay = new Map<
    number,
    { totalXp: number; contributors: Map<string, UserModel> }
  >();

  for (const activity of activities) {
    const day = Number(activity.occurredAt.toISOString().slice(8, 10));
    const entry = byDay.get(day) ?? { totalXp: 0, contributors: new Map() };
    entry.totalXp += activity.xpEarned;
    entry.contributors.set(activity.userId, activity.user);
    byDay.set(day, entry);
  }

  return byDay;
}

export function CalendarContent({
  clubName,
  activities,
  year,
  month,
}: CalendarContentProps) {
  const today = new Date();
  const isCurrentMonth =
    today.getUTCFullYear() === year && today.getUTCMonth() === month;
  const todayDay = isCurrentMonth ? today.getUTCDate() : null;

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const cells = buildMonthGrid(year, month);
  const byDay = groupByDay(activities);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl uppercase sm:text-4xl">
            Calendário
          </h1>
          <p className="text-muted-foreground text-sm">
            {clubName
              ? `Atividades do clube ${clubName} por dia.`
              : "Entre em um clube para ver as atividades por dia."}
          </p>
        </div>

        {clubName && (
          <div className="flex items-center gap-3">
            <Link
              href={`/calendar?y=${prevYear}&m=${prevMonth + 1}`}
              aria-label="Mês anterior"
              className="border-border flex size-9 items-center justify-center rounded-full border"
            >
              <ChevronLeft className="size-4" />
            </Link>
            <span className="font-heading w-40 text-center text-sm uppercase">
              {MONTH_LABELS[month]} {year}
            </span>
            <Link
              href={`/calendar?y=${nextYear}&m=${nextMonth + 1}`}
              aria-label="Próximo mês"
              className="border-border flex size-9 items-center justify-center rounded-full border"
            >
              <ChevronRight className="size-4" />
            </Link>
          </div>
        )}
      </div>

      {!clubName ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center sm:p-12">
          <CalendarDays className="text-muted-foreground size-8" />
          <p className="text-sm font-medium">
            Entre em um clube para ver o calendário de atividades
          </p>
          <Link href="/clubs" className="text-primary text-sm font-medium">
            Ver clubes
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="bg-muted grid grid-cols-7">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-muted-foreground p-2 text-center text-[10px] font-medium uppercase sm:p-3 sm:text-xs"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`blank-${index}`}
                    className="bg-muted/30 aspect-square border-t border-r"
                  />
                );
              }

              const entry = byDay.get(day);
              const contributors = entry
                ? Array.from(entry.contributors.values())
                : [];
              const visible = contributors.slice(0, MAX_VISIBLE_AVATARS);
              const overflow = contributors.length - visible.length;

              return (
                <div
                  key={day}
                  className={`flex aspect-square flex-col gap-1 border-t border-r p-1.5 sm:gap-1.5 sm:p-2 ${
                    todayDay === day ? "bg-primary/5" : ""
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium sm:text-xs ${
                      todayDay === day
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>

                  {entry && (
                    <div className="flex flex-1 flex-col items-start justify-end gap-1">
                      <span className="text-primary text-[10px] font-semibold sm:text-xs">
                        {entry.totalXp} XP
                      </span>
                      <div className="flex -space-x-1.5">
                        {visible.map((user) => (
                          <Avatar
                            key={user.id}
                            size="sm"
                            className="ring-background size-4 ring-2 sm:size-6"
                          >
                            <AvatarImage
                              src={user.avatarUrl ?? undefined}
                              alt={user.name}
                            />
                            <AvatarFallback className="text-[7px] sm:text-[9px]">
                              {initials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {overflow > 0 && (
                          <span className="bg-muted text-muted-foreground ring-background flex size-4 items-center justify-center rounded-full text-[7px] font-medium ring-2 sm:size-6 sm:text-[9px]">
                            +{overflow}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
