import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LoginForm } from "@/components/auth/login-form";
import { LevelUpMascot } from "@/components/landing/level-up-mascot";

export const metadata: Metadata = {
  title: "Entrar | LifeRank",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader variant="minimal" />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 md:flex-row">
          <div className="flex flex-1 flex-col items-start gap-6">
            <LevelUpMascot className="text-primary size-40" />
            <h1 className="font-heading text-6xl leading-[0.95] uppercase sm:text-7xl">
              Bem-vindo de
              <br />
              <span className="text-primary">volta à arena</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-base">
              Pronto para reconquistar seu status? Seu plano de treino e seu
              ranking nas ligas estão esperando por você.
            </p>
          </div>

          <div className="border-border/60 flex-1 rounded-xl border bg-white p-10 sm:p-12">
            <LoginForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
