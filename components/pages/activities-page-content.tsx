"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { activityCatalog } from "@/lib/constants";
import { ActivityType } from "@/lib/types";
import { getTodayKey } from "@/lib/utils";

export function ActivitiesPageContent() {
  const { profile, group, activities, addActivity, levelInfo, achievements } = useLifeRank();
  const [type, setType] = useState<ActivityType>("study");
  const [hours, setHours] = useState(1);
  const [date, setDate] = useState(getTodayKey());
  const [customLabel, setCustomLabel] = useState("");

  const prevLevel = useRef(levelInfo.level);
  const prevAchievements = useRef(achievements.filter(a => a.unlocked).length);

  useEffect(() => {
    if (levelInfo.level > prevLevel.current) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff8a00", "#ffc107", "#ffffff"]
      });
      prevLevel.current = levelInfo.level;
    }

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    if (unlockedCount > prevAchievements.current) {
      confetti({
        particleCount: 100,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#10b981", "#34d399", "#ffffff"]
      });
      prevAchievements.current = unlockedCount;
    }
  }, [levelInfo.level, achievements]);

  const currentPoints = useMemo(() => {
    if (type === "study") return Math.max(1, hours) * activityCatalog.study.points;
    return activityCatalog[type].points;
  }, [hours, type]);

  if (!profile || !group) {
    return (
      <EmptyState
        title="Perfil e grupo sao obrigatorios"
        description="Antes de pontuar, configure seu perfil e entre em um grupo para que o ranking faca sentido."
      />
    );
  }

  const myActivities = activities
    .filter((activity) => activity.userId === profile.id && activity.groupId === group.id)
    .slice(0, 8);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addActivity({
      type,
      date,
      hours: type === "study" ? hours : undefined,
      label: type === "custom" ? customLabel : undefined
    });
    setCustomLabel("");
    setHours(1);
    setDate(getTodayKey());
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="p-5 md:p-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.22em] text-brand-600">Nova atividade</p>
        <h2 className="mt-1 text-xl md:text-2xl font-bold text-accent-slate">Transforme rotina em pontos</h2>

        <form onSubmit={handleSubmit} className="mt-6 md:mt-8 grid gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
            {(Object.entries(activityCatalog) as [ActivityType, (typeof activityCatalog)[ActivityType]][]).map(
              ([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`rounded-2xl md:rounded-3xl border px-3 py-3 md:px-4 md:py-4 text-left transition ${
                    type === key ? "border-brand-500 bg-brand-50 shadow-sm" : "border-slate-200 hover:border-brand-200"
                  }`}
                >
                  <p className="text-lg md:text-xl">{item.emoji}</p>
                  <p className="mt-1 md:mt-2 text-[11px] md:text-sm font-bold text-accent-slate leading-tight">{item.label}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
                    {item.hasHours ? `${item.points} pts/h` : `${item.points} pts`}
                  </p>
                </button>
              )
            )}
          </div>

          <div className="grid gap-4">
            {type === "study" ? (
              <label className="grid gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
                Horas de estudo
                <input
                  type="number"
                  min={1}
                  value={hours}
                  onChange={(event) => setHours(Number(event.target.value))}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:bg-white"
                />
              </label>
            ) : null}

            {type === "custom" ? (
              <label className="grid gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
                Nome da atividade personalizada
                <input
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:bg-white"
                  placeholder="Ex.: Meditação"
                />
              </label>
            ) : null}

            <label className="grid gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
              Data
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:bg-white"
              />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-[24px] md:rounded-3xl bg-brand-50/50 p-4 md:p-6">
            <div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-600">Pontuação prevista</p>
              <p className="mt-1 text-2xl md:text-3xl font-black text-accent-slate">{currentPoints} <span className="text-xs md:text-sm font-bold text-slate-400">pts</span></p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-xl md:text-2xl shadow-sm">
              ✨
            </div>
          </div>

          <button 
            type="submit" 
            className="rounded-[20px] md:rounded-[24px] bg-brand-600 py-4 md:py-5 font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-700 active:scale-95"
          >
            Salvar atividade
          </button>
        </form>
      </Panel>

      <Panel className="p-5 md:p-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.22em] text-brand-600">Seu histórico</p>
        <h2 className="mt-1 text-xl md:text-2xl font-bold text-accent-slate">Últimas atividades</h2>

        <div className="mt-6 md:mt-8 grid gap-3 md:gap-4">
          {myActivities.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">Nenhuma atividade registrada hoje.</p>
            </div>
          ) : (
            myActivities.map((activity) => (
              <div key={activity.id} className="rounded-[24px] md:rounded-[28px] border border-slate-50 bg-white p-4 md:p-5 transition-all hover:shadow-xl hover:shadow-brand-500/5">
                <div className="flex items-center justify-between gap-3 md:gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center text-lg md:text-xl shadow-inner">
                      {activityCatalog[activity.type]?.emoji || "⚡"}
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-accent-slate leading-tight">{activity.label}</p>
                      <p className="mt-1 text-[10px] md:text-xs text-slate-400 font-medium lowercase">
                        {activity.date} {activity.hours ? `• ${activity.hours}h` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="rounded-xl bg-brand-500 px-3 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm font-black text-white shadow-md shadow-brand-500/10">
                    +{activity.points}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}