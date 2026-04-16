"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { Trophy, Award, Zap, PlusCircle, ArrowRight } from "lucide-react";
import { activityCatalog } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { XPBar } from "@/components/ui/xp-bar";
import { RankBadge } from "@/components/ui/badge";

export function DashboardPageContent() {
  const { profile, group, activities, ranking, myStats, levelInfo, achievements } =
    useLifeRank();

  if (!profile) {
    return (
      <EmptyState
        title="Crie seu perfil primeiro"
        description="A pagina de perfil prepara o login automatico e libera o restante da experiencia."
      />
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <EmptyState
          title="Faltou o seu squad!"
          description="Para ver o ranking e competir, você precisa criar um grupo ou entrar em um convite existente."
        />
        <Link 
          href="/group"
          className="mt-6 rounded-2xl bg-brand-600 px-8 py-4 font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-700 hover:scale-105 active:scale-95"
        >
          Configurar meu Grupo
        </Link>
      </div>
    );
  }

  const recentActivities = activities
    .filter((activity) => activity.groupId === group.id)
    .sort((left, right) => (left.createdAt < right.createdAt ? 1 : -1))
    .slice(0, 5);

  const myPosition = Math.max(1, ranking.findIndex((entry) => entry.userId === profile.id) + 1);

  return (
    <div className="grid gap-10">
      <XPBar 
        level={levelInfo.level} 
        currentXP={levelInfo.currentXP} 
        xpPerLevel={levelInfo.xpPerLevel} 
        progress={levelInfo.progress} 
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pontos mensais", value: myStats.monthlyPoints, icon: Trophy },
          { label: "Total acumulado", value: myStats.totalPoints, icon: Award },
          { label: "Streak de dias", value: `${myStats.streak} dias`, icon: Zap },
          { label: "Atividades", value: myStats.activitiesCount, icon: PlusCircle }
        ].map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-brand-100 hover:shadow-2xl hover:shadow-brand-500/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
              <item.icon className="h-4 w-4 text-brand-500" />
            </div>
            <p className="text-4xl font-black text-accent-slate">{item.value}</p>
            <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-brand-50/50 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[48px] border border-slate-100 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">Performance</p>
              <h2 className="mt-2 text-3xl font-bold text-accent-slate tracking-tight">Seu resumo de evolução</h2>
            </div>
            <Link
              href="/activities"
              className="flex items-center gap-2 rounded-full bg-accent-slate px-8 py-4 text-sm font-bold text-white transition-all hover:bg-black hover:px-10 active:scale-95"
            >
              Nova atividade
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-[40px] bg-accent-slate p-8 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Sua posição</p>
              <p className="mt-4 text-6xl font-black tracking-tighter">{myPosition}º</p>
              <div className="mt-6 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {ranking.slice(0, 3).map((u, i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-accent-slate bg-slate-100 overflow-hidden">
                      {u.avatar && <img src={u.avatar} className="h-full w-full object-cover" />}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/60 font-medium">Você entre {ranking.length} amigos</p>
              </div>
            </div>

            <div className="rounded-[40px] border border-brand-100 bg-brand-50/30 p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Fichas de Treino</p>
              <p className="mt-4 text-xl font-bold text-accent-slate">
                Em breve
              </p>
              <p className="mt-6 text-sm font-medium text-slate-400">
                Acompanhe seus planos diretamente aqui.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[48px] border border-slate-100 bg-white p-10 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-8">Conquistas</p>
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 rounded-3xl p-5 transition-all ${
                  achievement.unlocked
                    ? "bg-brand-50/50 border border-brand-100"
                    : "bg-slate-50/50 border border-slate-100 opacity-60"
                }`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${achievement.unlocked ? "bg-white" : "bg-slate-100"}`}>
                  {achievement.unlocked ? "🔥" : "🔒"}
                </div>
                <div>
                  <p className="font-bold text-accent-slate leading-none">{achievement.title}</p>
                  <p className="mt-1 text-xs text-slate-400 font-medium">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[48px] border border-slate-100 bg-white p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-accent-slate tracking-tight">Atividade Recente</h2>
            <Link href="/activities" className="text-xs font-bold text-brand-600 uppercase tracking-widest">Ver tudo</Link>
          </div>

          <div className="grid gap-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-5 rounded-[32px] bg-slate-50/50 p-4 transition-colors hover:bg-white hover:shadow-lg hover:shadow-brand-500/5">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-100">
                  {activityCatalog[activity.type].emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-accent-slate truncate">
                    {activity.userName} <span className="font-medium text-slate-400">fez</span> {activity.label}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{formatDate(activity.date)}</p>
                </div>
                <div className="rounded-2xl bg-brand-500 px-4 py-2 font-black text-white text-sm shadow-md shadow-brand-500/20">
                  +{activity.points}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[48px] border border-slate-100 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-accent-slate tracking-tight mb-8">Top do Mês</h2>
          <div className="grid gap-4">
            {ranking.slice(0, 3).map((entry, index) => (
              <div key={entry.userId} className="group flex items-center gap-5 rounded-[32px] border border-slate-50 p-4 transition-all hover:shadow-2xl hover:shadow-brand-500/5">
                <div className="relative">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-white shadow-sm">
                    {entry.avatar && <img src={entry.avatar} className="h-full w-full object-cover" />}
                  </div>
                  <RankBadge rank={index + 1} className="absolute -top-2 -right-2 z-10 scale-75" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-accent-slate truncate">{entry.name}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{entry.activitiesCount} Ativ.</p>
                </div>
                <p className="text-xl font-black text-brand-600">
                  {entry.points} <span className="text-xs font-bold text-slate-300 uppercase">pts</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}