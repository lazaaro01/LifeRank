import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { RegisterForm } from "@/components/auth/register-form";
import { LevelUpMascot } from "@/components/landing/level-up-mascot";

export const metadata: Metadata = {
  title: "Criar conta | LifeRank",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader variant="minimal" />
      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-20">
        <div className="mb-8 flex max-w-md flex-col items-center gap-2 text-center sm:mb-10">
          <LevelUpMascot className="text-primary mb-4 size-24 sm:size-32" />
          <h1 className="font-heading text-3xl uppercase sm:text-5xl">
            Entre na elite
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Libere seu potencial. Compita com os melhores. Comece seu legado
            hoje.
          </p>
        </div>

        <div className="border-border/60 w-full max-w-md rounded-xl border bg-white p-6 shadow-sm sm:p-10">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
