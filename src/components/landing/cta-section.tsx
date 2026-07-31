"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-primary text-primary-foreground overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center"
      >
        <h2 className="font-heading text-4xl uppercase sm:text-5xl">
          Pronto para entrar na arena?
        </h2>
        <p className="text-primary-foreground/80 max-w-lg">
          Crie sua conta em menos de um minuto e comece a registrar suas
          primeiras atividades hoje.
        </p>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Button
            render={<Link href="/register" />}
            size="lg"
            variant="secondary"
            className="rounded-full px-8 uppercase"
          >
            Reivindicar meu perfil
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
