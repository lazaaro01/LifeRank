import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { LoginForm } from "@/components/auth/login-form";
import { LevelUpMascot } from "@/components/landing/level-up-mascot";

export const metadata: Metadata = {
  title: "Entrar | LifeRank",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader variant="minimal" />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 md:flex-row md:gap-16">
          <div className="flex flex-1 flex-col items-start gap-4 sm:gap-6">
            <LevelUpMascot className="text-primary size-28 sm:size-40" />
            <h1 className="font-heading text-4xl leading-[0.95] uppercase sm:text-6xl md:text-7xl">
              Bem-vindo de
              <br />
              <span className="text-primary">volta à arena</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-base">
              Pronto para reconquistar seu status? Seu plano de treino e seu
              ranking nas ligas estão esperando por você.
            </p>
          </div>

          <div className="border-border/60 w-full flex-1 rounded-xl border bg-white p-6 sm:p-10 md:p-12">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
