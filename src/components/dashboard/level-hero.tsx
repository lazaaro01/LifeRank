"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type LevelHeroProps = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
  points: number;
};

export function LevelHero({
  level,
  xpIntoLevel,
  xpForNextLevel,
  progress,
  points,
}: LevelHeroProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(progress * 100));
    return () => cancelAnimationFrame(id);
  }, [progress]);

  const xpRemaining = Math.max(xpForNextLevel - xpIntoLevel, 0);

  return (
    <div className="bg-primary text-primary-foreground relative flex flex-col gap-6 overflow-hidden rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-12">
      <span className="font-heading pointer-events-none absolute -top-10 -right-10 hidden text-[160px] uppercase opacity-10 select-none sm:block">
        Level
      </span>

      <div className="relative z-10 flex-1 space-y-3 sm:space-y-4">
        <p className="text-xs font-medium tracking-widest uppercase opacity-80">
          Status nível de elite
        </p>
        <p className="font-heading flex flex-wrap items-baseline gap-2 text-4xl uppercase sm:gap-3 sm:text-6xl lg:text-7xl">
          Nível {level}
          <span className="text-base font-normal opacity-70 sm:text-lg">
            PRO
          </span>
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium tracking-wide uppercase">
            <span>
              {xpIntoLevel} / {xpForNextLevel} XP
            </span>
            <span>Sobe de nível em {xpRemaining} XP</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${width}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-start gap-1 sm:items-end">
        <p className="text-xs font-medium tracking-widest uppercase opacity-80">
          Pontos disponíveis
        </p>
        <p className="text-4xl font-semibold sm:text-6xl">
          {points.toLocaleString("pt-BR")}
        </p>
        <Button
          render={<Link href="/activities" />}
          variant="secondary"
          className="mt-2 rounded-full uppercase"
        >
          Ver histórico
        </Button>
      </div>
    </div>
  );
}
