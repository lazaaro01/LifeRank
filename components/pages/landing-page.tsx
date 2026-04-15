"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Trophy, 
  Zap, 
  Users, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export function LandingPage() {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(255,138,0,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(255,193,7,0.03),transparent_50%)]" />

      <main className="flex-1">
        <nav className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between rounded-full border border-slate-100 bg-white/50 px-6 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/20" />
              <span className="text-xl font-bold tracking-tight text-accent-slate">LifeRank</span>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Entrar
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </nav>

        <section className="relative px-6 py-12 md:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5"
            >
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">A sua nova rotina começa aqui</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl font-bold tracking-tight text-accent-slate sm:text-8xl"
            >
              Domine sua rotina <br />
              <span className="text-brand-500">com maestria.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-500"
            >
              LifeRank transforma seus hábitos diários em uma experiência competitiva e gratificante. 
              Suba no ranking, conquiste vitórias e veja sua evolução real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-12 flex flex-col items-center justify-center gap-8 sm:flex-row"
            >
              <button
                onClick={() => router.push("/profile")}
                className="group relative overflow-hidden rounded-full bg-accent-slate px-10 py-5 text-lg font-bold text-white transition-all hover:bg-black hover:px-12 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Criar minha conta
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-brand-500 to-brand-600 opacity-0 transition-opacity group-hover:opacity-10" />
              </button>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {[
              { 
                icon: Zap, 
                title: "Alta Performance", 
                desc: "Registre atividades em segundos e veja sua pontuação subir instantaneamente.",
                color: "brand-400"
              },
              { 
                icon: Trophy, 
                title: "Ranking Global", 
                desc: "Compare seu desempenho com amigos e suba nos níveis do grupo.",
                color: "amber-400"
              },
              { 
                icon: Calendar, 
                title: "Análise Visual", 
                desc: "Calendários e estatísticas premiuns para você nunca perder o ritmo.",
                color: "orange-500"
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                variants={item}
                className="group rounded-[40px] border border-slate-100 bg-slate-50/30 p-10 transition-all hover:bg-white hover:shadow-2xl hover:shadow-brand-500/5"
              >
                <div className={`mb-8 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm transition-transform group-hover:scale-110`}>
                  <f.icon className="h-7 w-7 text-brand-500" />
                </div>
                <h3 className="text-2xl font-bold text-accent-slate">{f.title}</h3>
                <p className="mt-4 text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-50 bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-brand-500" />
            <span className="text-lg font-bold text-accent-slate">LifeRank</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 LifeRank Studio. Premium Productivity.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-500">Termos</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-500">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}