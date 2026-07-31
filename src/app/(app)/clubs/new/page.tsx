import type { Metadata } from "next";
import { CreateClubForm } from "@/components/clubs/create-club-form";

export const metadata: Metadata = {
  title: "Criar Clube | LifeRank",
};

export default function NewClubPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-primary text-4xl uppercase sm:text-5xl">
          Criar novo clube
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-sm">
          Funde a próxima divisão de elite. Recrute membros, defina desafios e
          domine o ranking.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-8 sm:p-12">
        <CreateClubForm />
      </div>
    </div>
  );
}
