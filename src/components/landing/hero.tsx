"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LevelUpMascot } from "@/components/landing/level-up-mascot";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-6 py-20 md:flex-row">
      <div className="flex flex-1 flex-col items-start gap-6">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-primary bg-primary/10 rounded-full px-4 py-1 text-xs font-medium tracking-wide uppercase"
        >
          O clube de performance premium
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-6xl leading-[0.95] uppercase sm:text-7xl"
        >
          Suba de nível
          <br />
          <span className="text-primary">na sua rotina.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-lg text-lg"
        >
          Transforme sua produtividade em um esporte profissional. Entre numa
          comunidade de elite onde cada conquista é celebrada e cada meta é um
          marco rumo ao status lendário.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              render={<Link href="/register" />}
              size="lg"
              className="rounded-full px-8 uppercase"
            >
              Começar minha temporada
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              render={<Link href="/ranking" />}
              size="lg"
              variant="outline"
              className="rounded-full px-8 uppercase"
            >
              Ver ranking
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative flex flex-1 items-center justify-center"
      >
        <div className="border-border/60 relative rounded-2xl border bg-white p-10 shadow-xl">
          <LevelUpMascot className="text-primary size-56 sm:size-64" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -8, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-border/60 absolute -top-6 -right-6 rounded-xl border bg-white p-4 shadow-lg"
        >
          <p className="text-primary text-xs uppercase">Nova conquista</p>
          <p className="font-heading text-xl uppercase">Nível 24 alcançado</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
