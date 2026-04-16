"use client";

import { EmptyState } from "@/components/ui/empty-state";
import Image from "next/image";
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
    <Panel className="p-5 md:p-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-brand-600 font-black">Leaderboard</p>
      <h2 className="mt-1 text-xl md:text-3xl font-bold text-accent-slate tracking-tight">Ranking do Squad</h2>
      <p className="mt-1 text-xs md:text-sm text-slate-500 font-medium">
        Ordenado pelos pontos do mês atual.
      </p>

      <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
        {ranking.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-[28px] md:rounded-[32px] border p-3.5 md:p-4 transition-all hover:shadow-lg hover:shadow-brand-500/5 ${
              index === 0 
                ? "border-brand-200 bg-brand-50/30 ring-1 ring-brand-100" 
                : "border-slate-50 bg-white"
            }`}
          >
            <div className="flex items-center justify-between md:contents">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={clsx(
                  "flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl text-base md:text-lg font-black shadow-sm",
                  index === 0 ? "bg-brand-500 text-white" : "bg-slate-50 text-slate-400"
                )}>
                  {index + 1}º
                </div>
                <div className="h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-xl md:rounded-2xl bg-slate-100 ring-2 ring-white relative">
                  {entry.avatar ? (
                    <Image 
                      src={entry.avatar} 
                      alt={entry.name} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 font-bold text-lg">
                      {entry.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-accent-slate leading-tight text-base md:text-base">{entry.name}</p>
                  <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-0.5 md:mt-1">{entry.activitiesCount} registros no sistema</p>
                </div>
              </div>

              <div className="md:hidden">
                <p className="text-xl font-black text-brand-600 leading-none">{entry.points}</p>
                <p className="text-[9px] font-bold text-slate-300 text-right uppercase mt-1">pts</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto">
              <div className="flex items-center gap-1.5 rounded-xl bg-white/50 border border-slate-100 px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold text-slate-500">
                <Zap className="h-3 w-3 text-brand-500" />
                {entry.streak} dias
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white/50 border border-slate-100 px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold text-slate-500">
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