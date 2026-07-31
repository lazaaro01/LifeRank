"use client";

import { motion, type Variants } from "framer-motion";
import { Sunrise, Award, Zap, Layers, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BADGES: { icon: LucideIcon; label: string; locked?: boolean }[] = [
  { icon: Sunrise, label: "Madrugador" },
  { icon: Award, label: "Vontade de ferro" },
  { icon: Zap, label: "Velocidade" },
  { icon: Layers, label: "Polímata" },
  { icon: Lock, label: "Bloqueado", locked: true },
  { icon: Lock, label: "Bloqueado", locked: true },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function AchievementsTeaser() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-[1280px] px-6 text-center">
        <h2 className="font-heading text-primary text-4xl uppercase sm:text-5xl">
          Conquistas desbloqueadas
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm uppercase">
          A vitrine de troféus de quem nunca se acomoda.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-12 flex flex-wrap items-start justify-center gap-8"
        >
          {BADGES.map((badge, index) => (
            <motion.div
              key={`${badge.label}-${index}`}
              variants={item}
              className={`flex w-32 flex-col items-center gap-3 ${badge.locked ? "opacity-40" : ""}`}
            >
              <div className="bg-primary/5 border-border/60 flex size-20 items-center justify-center rounded-full border">
                <badge.icon className="text-primary size-8" />
              </div>
              <p className="text-xs font-medium uppercase">{badge.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
