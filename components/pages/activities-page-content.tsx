"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { activityCatalog } from "@/lib/constants";
import { ActivityType } from "@/lib/types";
import { getTodayKey } from "@/lib/utils";

export function ActivitiesPageContent() {
  const { profile, group, activities, addActivity } = useLifeRank();
  const [type, setType] = useState<ActivityType>("study");
  const [hours, setHours] = useState(1);
  const [date, setDate] = useState(getTodayKey());
  const [customLabel, setCustomLabel] = useState("");

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
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Panel>
        <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Nova atividade</p>
        <h2 className="mt-2 text-2xl font-semibold text-accent-slate">Transforme rotina em pontos</h2>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.entries(activityCatalog) as [ActivityType, (typeof activityCatalog)[ActivityType]][]).map(
              ([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`rounded-3xl border px-4 py-4 text-left transition ${
                    type === key ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-200"
                  }`}
                >
                  <p className="text-xl">{item.emoji}</p>
                  <p className="mt-2 font-semibold text-accent-slate">{item.label}</p>
                  <p className="text-sm text-slate-500">
                    {item.hasHours ? `${item.points} pts por hora` : `${item.points} pts por atividade`}
                  </p>
                </button>
              )
            )}
          </div>

          {type === "study" ? (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Horas de estudo
              <input
                type="number"
                min={1}
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-400"
              />
            </label>
          ) : null}

          {type === "custom" ? (
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Nome da atividade personalizada
              <input
                value={customLabel}
                onChange={(event) => setCustomLabel(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-400"
                placeholder="Ex.: Meditacao"
              />
            </label>
          ) : null}

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Data
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-400"
            />
          </label>

          <div className="rounded-3xl bg-accent-mist p-4">
            <p className="text-sm text-slate-500">Pontuacao prevista</p>
            <p className="mt-2 text-3xl font-semibold text-accent-slate">{currentPoints} pts</p>
          </div>

          <button type="submit" className="rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white">
            Salvar atividade
          </button>
        </form>
      </Panel>

      <Panel>
        <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Seu historico</p>
        <h2 className="mt-2 text-2xl font-semibold text-accent-slate">Ultimas atividades registradas</h2>

        <div className="mt-6 grid gap-3">
          {myActivities.map((activity) => (
            <div key={activity.id} className="rounded-3xl border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-accent-slate">{activity.label}</p>
                  <p className="text-sm text-slate-500">
                    {activity.date} {activity.hours ? `• ${activity.hours}h` : ""}
                  </p>
                </div>
                <p className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                  +{activity.points}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}