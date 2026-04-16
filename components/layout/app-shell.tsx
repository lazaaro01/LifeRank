"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { navigationItems } from "@/lib/constants";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  History, 
  PlusCircle, 
  Trophy, 
  User as UserIcon,
  LogOut
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, group, logout, levelInfo } = useLifeRank();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const iconMap: Record<string, any> = {
    "/dashboard": BarChart3,
    "/activities": PlusCircle,
    "/calendar": CalendarIcon,
    "/ranking": Trophy,
    "/history": History,
    "/profile": UserIcon,
    "/group": LogOut
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col font-sans">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-brand-400/5 blur-[120px]" />
        <div className="absolute -right-[10%] -bottom-[10%] h-[500px] w-[500px] rounded-full bg-accent-sun/5 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 w-full px-4 pt-4 md:px-6 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-slate-100 bg-white/70 px-6 py-4 backdrop-blur-xl shadow-lg shadow-brand-500/5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold tracking-tight text-accent-slate">LifeRank</p>
                <p className="text-[10px] uppercase tracking-tighter text-brand-600 font-bold">Premium Edition</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = iconMap[item.href] || PlusCircle;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "relative flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300",
                      isActive 
                        ? "text-brand-600" 
                        : "text-slate-400 hover:bg-slate-50 hover:text-accent-slate"
                    )}
                  >
                    <Icon className={clsx("h-4 w-4", isActive ? "text-brand-500" : "text-slate-300")} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-2xl bg-brand-50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-accent-slate leading-none">{profile?.name ?? "Visitante"}</p>
                  <p className="text-[10px] font-bold text-brand-500 mt-1 uppercase tracking-widest leading-none">Nível {levelInfo.level}</p>
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-2xl bg-slate-50 ring-2 ring-white shadow-sm">
                  {profile?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <UserIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 shadow-sm"
                title="Sair do sistema"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="md:hidden sticky bottom-6 z-40 w-full px-4">
        <div className="mx-auto flex max-w-sm items-center justify-around rounded-[32px] border border-slate-100 bg-white/80 p-2 backdrop-blur-xl shadow-2xl shadow-brand-500/10">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.href] || PlusCircle;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative flex flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                  isActive ? "text-brand-600" : "text-slate-400"
                )}
              >
                <Icon className={clsx("h-5 w-5", isActive ? "scale-110" : "opacity-70")} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 -z-10 rounded-2xl bg-brand-50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 rounded-2xl px-4 py-3 text-slate-400 transition-all duration-300 hover:text-red-500"
          >
            <LogOut className="h-5 w-5 opacity-70" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}