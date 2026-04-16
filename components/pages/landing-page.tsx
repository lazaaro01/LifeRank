"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { 
  Trophy, 
  Zap, 
  Users, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  User as UserIcon
} from "lucide-react";

export function LandingPage() {
  const router = useRouter();
  const { loginByName } = useLifeRank();
  const [loginName, setLoginName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginName.trim()) return;
    
    setIsLoggingIn(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const success = await loginByName(loginName.trim());
    setIsLoggingIn(false);
    
    if (success) {
      router.push("/dashboard");
    }
  }

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
            
            {!showLogin ? (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                Entrar apenas com o nome
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <form onSubmit={handleLogin} className="flex items-center gap-2">
                <input 
                  autoFocus
                  disabled={isLoggingIn}
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Seu nome..." 
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs outline-none focus:border-brand-500 disabled:opacity-50" 
                />
                <button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                >
                  {isLoggingIn ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Acessar"
                  )}
                </button>
              </form>
            )}
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
              className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-accent-slate"
            >
              Domine sua rotina <br />
              <span className="text-brand-500">com maestria.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mx-auto mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-7 md:leading-8 text-slate-500"
            >
              LifeRank transforma seus hábitos diários em uma experiênca competitiva e gratificante. 
              Suba no ranking, conquiste vitórias e veja sua evolução real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 md:mt-12 flex flex-col items-center justify-center gap-6 md:gap-8 sm:flex-row"
            >
              <button
                onClick={() => router.push("/profile")}
                className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-accent-slate px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-white transition-all hover:bg-black hover:px-12 active:scale-95"
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
                className="group rounded-[32px] md:rounded-[40px] border border-slate-100 bg-slate-50/30 p-8 md:p-10 transition-all hover:bg-white hover:shadow-2xl hover:shadow-brand-500/5"
              >
                <div className={`mb-6 md:mb-8 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl md:rounded-3xl bg-white shadow-sm transition-transform group-hover:scale-110`}>
                  <f.icon className="h-6 w-6 md:h-7 md:w-7 text-brand-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-accent-slate">{f.title}</h3>
                <p className="mt-4 text-sm md:text-base text-slate-500 leading-relaxed">{f.desc}</p>
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
          <p className="text-sm text-slate-400">© 2026 Todos os direitos reservados</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-500">Termos</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-500">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}