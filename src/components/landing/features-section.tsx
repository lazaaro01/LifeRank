"use client";

import { motion, type Variants } from "framer-motion";
import { Coins, Flame, Medal, Trophy } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section className="bg-foreground text-background py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-16 flex flex-col gap-4">
          <h2 className="font-heading text-5xl uppercase">
            Privilégios do clube
          </h2>
          <div className="bg-primary h-2 w-32" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <motion.div
            variants={item}
            className="bg-primary text-primary-foreground col-span-1 flex flex-col items-center justify-between gap-4 rounded-xl p-10 text-center"
          >
            <Flame className="size-10" />
            <div>
              <p className="text-6xl font-semibold">124</p>
              <p className="mt-1 text-sm tracking-wide uppercase opacity-80">
                Dias de streak
              </p>
            </div>
            <p className="text-sm uppercase">
              Consistência é a marca dos campeões.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="col-span-1 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/5 p-10 text-center sm:order-3"
          >
            <div className="border-primary flex size-24 items-center justify-center rounded-full border-4">
              <span className="text-primary text-xl font-semibold">50</span>
            </div>
            <p className="text-lg font-medium uppercase">Nível de prestígio</p>
            <p className="text-sm text-white/60 uppercase">
              Desbloqueie novos degraus de liga
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="relative col-span-1 flex flex-col justify-between gap-8 overflow-hidden rounded-xl bg-white/5 p-10 sm:col-span-2 sm:order-2"
          >
            <div className="space-y-4">
              <Coins className="text-primary size-8" />
              <h3 className="font-heading text-4xl uppercase">Pontos & XP</h3>
              <p className="max-w-md text-sm text-white/60">
                Ganhe reputação por cada hora focada. Converta esforço em
                moeda e suba os ranks globais.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div className="bg-primary h-full w-3/4 rounded-full" />
              </div>
              <div className="text-primary flex justify-between text-xs font-medium tracking-wide uppercase">
                <span>Rank: Platina</span>
                <span>750/1000 XP</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="col-span-1 flex flex-col gap-6 rounded-xl bg-white/10 p-10 sm:col-span-3 sm:flex-row sm:items-center sm:order-4"
          >
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-medium uppercase">
                Rankings em tempo real
              </h3>
              <p className="text-sm text-white/60">
                Compita contra profissionais no mundo todo. Veja onde você
                está no ranking global do clube, instantaneamente.
              </p>
              <div className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium uppercase">
                <Trophy className="size-4" />
                Ver ranking
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3 text-sm">
                <span className="text-white/70">#1. Legend_Dev</span>
                <span className="text-primary font-medium">9.4k</span>
              </div>
              <div className="bg-primary flex items-center justify-between rounded-lg p-3 text-sm">
                <span className="flex items-center gap-2">
                  <Medal className="size-4" /> #4. Você (Elite)
                </span>
                <span className="font-medium">7.2k</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3 text-sm">
                <span className="text-white/70">#12. Pro_Runner</span>
                <span className="text-primary font-medium">5.8k</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
