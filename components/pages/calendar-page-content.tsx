"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { formatMonth, toDateKey } from "@/lib/utils";

export function CalendarPageContent() {
  const { profile, group, activities } = useLifeRank();

  if (!profile || !group) {
    return (
      <EmptyState
        title="Calendario indisponivel por enquanto"
        description="Entre em um grupo e registre atividades para visualizar os dias com pontos e detalhes."
      />
    );
  }

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const leadingDays = firstDay.getDay();
  const totalCells = Math.ceil((leadingDays + lastDay.getDate()) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - leadingDays + 1;
    if (dayNumber < 1 || dayNumber > lastDay.getDate()) {
      return null;
    }

    const date = toDateKey(new Date(now.getFullYear(), now.getMonth(), dayNumber));
    const dayActivities = activities.filter((activity) => activity.date === date && activity.groupId === group.id);
    const dayPoints = dayActivities.reduce((total, activity) => total + activity.points, 0);

    return {
      dayNumber,
      date,
      activities: dayActivities,
      points: dayPoints
    };
  });

  return (
    <div className="grid gap-6">
      <Panel>
        <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Calendario</p>
        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-accent-slate">{formatMonth(now)}</h2>
            <p className="text-sm text-slate-500">Visual mensal das atividades e pontos por dia.</p>
          </div>
          <p className="text-sm text-slate-500">Reset mensal apenas simulado, sem apagar historico.</p>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, index) =>
            cell ? (
              <div
                key={cell.date}
                className="min-h-32 rounded-3xl border border-white/70 bg-white p-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent-slate">{cell.dayNumber}</span>
                  <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                    {cell.points} pts
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  {cell.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="rounded-2xl bg-accent-mist px-2 py-2 text-left text-xs">
                      <p className="font-medium text-accent-slate">{activity.userName}</p>
                      <p className="text-slate-500">{activity.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={`empty-${index}`} className="min-h-32 rounded-3xl bg-white/40" />
            )
          )}
        </div>
      </Panel>
    </div>
  );
}