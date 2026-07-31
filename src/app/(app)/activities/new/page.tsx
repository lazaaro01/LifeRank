import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { categoryRepository } from "@/repositories/category.repository";
import { LogActivityForm } from "@/components/activities/log-activity-form";

export const metadata: Metadata = {
  title: "Registrar Atividade | LifeRank",
};

export default async function NewActivityPage() {
  const session = await auth();
  const categories = await categoryRepository.listAvailableForUser(
    session!.user.id
  );

  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl rounded-xl border bg-card p-8 sm:p-12">
        <div className="mb-8 flex items-center gap-6">
          <LevelUpBadge />
          <div>
            <h1 className="font-heading text-3xl text-primary uppercase sm:text-4xl">
              Registrar atividade
            </h1>
            <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
              Todo esforço conta pro seu ranking.
            </p>
          </div>
        </div>

        <LogActivityForm categories={categories} />
      </div>
    </div>
  );
}

function LevelUpBadge() {
  return (
    <div className="bg-primary/10 flex size-16 shrink-0 items-center justify-center rounded-full sm:size-20">
      <span className="font-heading text-primary text-2xl">LR</span>
    </div>
  );
}
