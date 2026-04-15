"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";

export function RankingPageContent() {
  const { profile, group, ranking } = useLifeRank();

  if (!profile || !group) {
    return (
      <EmptyState
        title="Sem ranking por enquanto"
        description="O leaderboard aparece quando o usuario esta em um grupo com membros e atividades registradas."
      />
    );
  }

  return (
    <Panel>
      <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Leaderboard</p>
      <h2 className="mt-2 text-2xl font-semibold text-accent-slate">Ranking dinamico do grupo</h2>
      <p className="mt-2 text-sm text-slate-500">
        Ordenado pelos pontos do mes atual, com contagem de streak e volume de atividades.
      </p>

      <div className="mt-6 grid gap-3">
        {ranking.map((entry, index) => (
          <div
            key={entry.userId}
            className={`grid gap-4 rounded-[28px] border p-4 md:grid-cols-[auto_auto_1fr_auto_auto_auto] md:items-center ${
              index === 0 ? "border-brand-300 bg-brand-50" : "border-slate-100 bg-white"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-slate text-lg font-semibold text-white">
              #{index + 1}
            </div>
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-brand-100">
              {entry.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div>
              <p className="font-semibold text-accent-slate">{entry.name}</p>
              <p className="text-sm text-slate-500">{entry.activitiesCount} atividades registradas</p>
            </div>
            <p className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-brand-700">
              {entry.streak} dias de streak
            </p>
            <p className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-accent-slate">
              {entry.activitiesCount} atividades
            </p>
            <p className="text-right text-2xl font-semibold text-accent-slate">{entry.points} pts</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}