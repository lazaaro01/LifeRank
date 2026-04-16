"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { Trophy, Zap } from "lucide-react";
import clsx from "clsx";

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
    <Panel className="p-6 md:p-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-brand-600 font-black">Leaderboard</p>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold text-accent-slate tracking-tight">Ranking do Squad</h2>
      <p className="mt-2 text-sm text-slate-500 font-medium">
        Ordenado pelos pontos do mês atual.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {ranking.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex flex-col md:flex-row md:items-center gap-4 rounded-[32px] border p-4 transition-all hover:shadow-lg hover:shadow-brand-500/5 ${
              index === 0 
                ? "border-brand-200 bg-brand-50/30 ring-1 ring-brand-100" 
                : "border-slate-50 bg-white"
            }`}
          >
            <div className="flex items-center justify-between md:contents">
              <div className="flex items-center gap-4">
                <div className={clsx(
                  "flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl text-lg font-black shadow-sm",
                  index === 0 ? "bg-brand-500 text-white" : "bg-slate-50 text-slate-400"
                )}>
                  {index + 1}º
                </div>
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-white">
                  {entry.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 font-bold text-xl">
                      {entry.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-accent-slate leading-tight text-lg md:text-base">{entry.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{entry.activitiesCount} registros no sistema</p>
                </div>
              </div>

              <div className="md:hidden">
                <p className="text-2xl font-black text-brand-600">{entry.points}</p>
                <p className="text-[10px] font-bold text-slate-300 text-right uppercase">pts</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto">
              <div className="flex items-center gap-1.5 rounded-xl bg-white/50 border border-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                <Zap className="h-3 w-3 text-brand-500" />
                {entry.streak} dias
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white/50 border border-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                <Trophy className="h-3 w-3 text-brand-500" />
                {entry.points} pts
              </div>
            </div>

            <div className="hidden md:block min-w-[100px] text-right">
              <p className="text-3xl font-black text-brand-600 tracking-tighter">{entry.points}</p>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest -mt-1">Pontos</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}