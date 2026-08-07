"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { LevelHero } from "@/components/dashboard/level-hero";
import { StreakCard } from "@/components/dashboard/streak-card";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { AchievementsGrid } from "@/components/dashboard/achievements-grid";
import { MiniLeaderboardCard } from "@/components/dashboard/mini-leaderboard-card";
import { CelebrationCard } from "@/components/dashboard/celebration-card";
import type { DashboardData } from "@/services/dashboard.service";
import type { UserModel } from "@/generated/prisma/models";

const EvolutionChart = dynamic(
  () =>
    import("@/components/dashboard/evolution-chart").then(
      (mod) => mod.EvolutionChart
    ),
  { ssr: false, loading: () => <Skeleton className="h-[220px] w-full" /> }
);

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

type DashboardContentProps = {
  data: DashboardData;
  club: {
    name: string;
    ranking: { rank: number; user: UserModel }[];
  } | null;
};

export function DashboardContent({ data, club }: DashboardContentProps) {
  const {
    user,
    levelProgress,
    recentActivities,
    unlockedAchievements,
    lockedAchievements,
    evolution,
  } = data;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 pb-24"
    >
      <motion.div variants={item}>
        <LevelHero
          level={levelProgress.level}
          xpIntoLevel={levelProgress.xpIntoLevel}
          xpForNextLevel={levelProgress.xpForNextLevel}
          progress={levelProgress.progress}
          points={user.points}
        />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <motion.div variants={item}>
            <StreakCard
              currentStreak={user.currentStreak}
              bestStreak={user.bestStreak}
            />
          </motion.div>

          <motion.div
            variants={item}
            className="flex-1 rounded-xl border bg-white p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold uppercase">
                Badges desbloqueados
              </h3>
              <Link href="/profile" className="text-primary text-sm">
                Ver todos
              </Link>
            </div>
            <AchievementsGrid
              unlocked={unlockedAchievements}
              locked={lockedAchievements}
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <motion.div variants={item} className="rounded-xl border bg-white p-8">
            <div className="mb-4">
              <h3 className="text-xl font-semibold uppercase">
                Momentum semanal
              </h3>
              <p className="text-muted-foreground text-sm">
                Sua evolução de pontos nos últimos 30 dias.
              </p>
            </div>
            <EvolutionChart data={evolution} />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div variants={item} className="rounded-xl border bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold uppercase">
                Ganhos recentes
              </h3>
              <RecentActivities activities={recentActivities} />
            </motion.div>

            <motion.div variants={item} className="rounded-xl border bg-white p-6">
              <MiniLeaderboardCard
                clubName={club?.name ?? null}
                members={club?.ranking ?? []}
                currentUserId={user.id}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div variants={item}>
        <CelebrationCard currentStreak={user.currentStreak} />
      </motion.div>

      <Link
        href="/activities/new"
        className="bg-primary text-primary-foreground fixed right-4 bottom-4 flex size-14 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105 sm:right-8 sm:bottom-8 sm:size-16"
        aria-label="Registrar atividade"
      >
        <Plus className="size-5 sm:size-6" />
      </Link>
    </motion.div>
  );
}
