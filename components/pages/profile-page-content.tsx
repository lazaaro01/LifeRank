"use client";

import { ChangeEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Phone, Image as ImageIcon, Check, ArrowRight, Camera, Award, Sparkles } from "lucide-react";
import { useLifeRank } from "@/components/providers/life-rank-provider";

export function ProfilePageContent() {
  const router = useRouter();
  const { profile, createProfile } = useLifeRank();
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [avatar, setAvatar] = useState(profile?.avatar ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !avatar.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    createProfile({ name: name.trim(), phone: phone.trim(), avatar: avatar.trim() });
    setIsSubmitting(false);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-5xl py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid gap-16 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center space-y-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1">
                <Sparkles className="h-3 w-3 text-brand-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                  {profile ? "Conta Ativa" : "Onboarding"}
                </span>
              </div>
              
              {profile && (
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="text-xs font-bold text-slate-400 hover:text-brand-500 transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  Voltar ao Dashboard
                </button>
              )}
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-accent-slate">
              {profile ? "Atualize seu perfil" : "Comece sua jornada"}
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Personalize sua identidade digital para o ranking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-3xl border border-slate-100 bg-slate-50/50 py-5 pl-14 pr-6 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/5 shadow-sm"
                  placeholder="Seu nome no ranking"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-3xl border border-slate-100 bg-slate-50/50 py-5 pl-14 pr-6 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/5 shadow-sm"
                  placeholder="Telefone de contato"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <input
                  value={avatar}
                  onChange={(event) => setAvatar(event.target.value)}
                  className="w-full rounded-3xl border border-slate-100 bg-slate-50/50 py-5 pl-14 pr-6 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/5 shadow-sm"
                  placeholder="URL da foto (opcional)"
                />
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50/20 py-8 text-sm text-slate-400 transition-all hover:border-brand-300 hover:bg-brand-50/10 active:scale-[0.99]">
                <Camera className="h-5 w-5" />
                <span className="font-medium">Ou selecione uma foto local</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <button
              disabled={isSubmitting || !name || !phone}
              type="submit"
              className="group relative w-full overflow-hidden rounded-[32px] bg-brand-500 py-6 text-base font-bold text-white shadow-xl shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-2xl hover:shadow-brand-500/30 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    {profile ? "Salvar alterações" : "Criar minha conta"}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-white/10 to-transparent transition-transform group-hover:translate-y-0" />
            </button>
          </form>
        </div>

        <div className="relative isolate flex items-center justify-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,138,0,0.08),transparent_70%)]" />
          
          <div className="w-full max-w-sm rounded-[56px] border border-slate-100 bg-white p-10 shadow-2xl shadow-brand-500/10">
            <div className="mb-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">LifeRank Identity</span>
              <AnimatePresence>
                {name && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-emerald-500 p-1.5 text-white">
                    <Check className="h-3 w-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="h-40 w-40 overflow-hidden rounded-[48px] bg-slate-50 ring-8 ring-brand-50 shadow-inner">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-200">
                      <User className="h-20 w-20" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 rounded-2xl bg-brand-500 p-3 text-white shadow-xl shadow-brand-500/30">
                  <Award className="h-6 w-6" />
                </div>
              </div>

              <h3 className="text-3xl font-bold tracking-tight text-accent-slate">{name || "Seu Nome"}</h3>
              <p className="mt-2 font-medium text-slate-400">{phone || "(00) 00000-0000"}</p>
              
              <div className="mt-12 flex w-full gap-4">
                <div className="flex-1 rounded-3xl bg-slate-50 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nível</p>
                  <p className="mt-1 text-2xl font-black text-brand-500">01</p>
                </div>
                <div className="flex-1 rounded-3xl bg-slate-50 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Score</p>
                  <p className="mt-1 text-2xl font-black text-brand-500">00</p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-2xl bg-brand-50/50 p-4 text-center">
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Aguardando ativação</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}