"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLifeRank } from "@/components/providers/life-rank-provider";
import { LandingPage } from "@/components/pages/landing-page";

export default function HomePage() {
  const router = useRouter();
  const { profile, hydrated } = useLifeRank();
  const [shouldShowLanding, setShouldShowLanding] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    
    if (profile) {
      router.replace("/dashboard");
    } else {
      setShouldShowLanding(true);
    }
  }, [hydrated, profile, router]);

  if (!hydrated || (!profile && !shouldShowLanding)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-accent-mist text-sm">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="font-medium text-slate-600 animate-pulse">Iniciando LifeRank...</p>
      </div>
    );
  }

  if (profile) return null;

  return <LandingPage />;
}