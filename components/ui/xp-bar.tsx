"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  level: number;
  currentXP: number;
  xpPerLevel: number;
  progress: number;
}

export function XPBar({ level, currentXP, xpPerLevel, progress }: XPBarProps) {
  return (
    <div className="w-full rounded-[32px] border border-slate-100 bg-white/50 p-6 backdrop-blur-xl shadow-lg shadow-brand-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 font-black text-white shadow-lg shadow-brand-500/20">
            {level}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">Nível Atual</p>
            <p className="text-sm font-bold text-accent-slate">Guerreiro de Elite</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Progresso</p>
          <p className="text-sm font-bold text-brand-600">
            {currentXP} / {xpPerLevel} <span className="text-slate-300 ml-1">XP</span>
          </p>
        </div>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-orange-400 shadow-[0_0_20px_rgba(255,138,0,0.4)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[slide_1s_linear_infinite]" />
      </div>
    </div>
  );
}
