import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { auth } from "@/server/auth";
import { clubService } from "@/services/club.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JoinClubForm } from "@/components/clubs/join-club-form";

export const metadata: Metadata = {
  title: "Clubes | LifeRank",
};

const categoryLabels: Record<string, string> = {
  SPORTS: "Esportes",
  STUDY: "Estudos",
  WORK: "Trabalho",
};

export default async function ClubsPage() {
  const session = await auth();
  const clubs = await clubService.listMyClubs(session!.user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl uppercase sm:text-4xl">
            Meus clubes
          </h1>
          <p className="text-muted-foreground text-sm">
            Dispute o ranking com quem treina, estuda e trabalha junto com você.
          </p>
        </div>
        <Button render={<Link href="/clubs/new" />} className="rounded-full">
          <Plus className="size-4" />
          Criar clube
        </Button>
      </div>

      <div className="rounded-xl border p-4">
        <p className="mb-3 text-sm font-medium">Tem um código de convite?</p>
        <JoinClubForm />
      </div>

      {clubs.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center">
          <Users className="size-8" />
          <p className="text-sm font-medium">
            Você ainda não faz parte de nenhum clube
          </p>
          <p className="text-xs">
            Crie o seu ou entre com um código de convite.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clubs.map((club) => (
            <div key={club.id} className="space-y-3 rounded-xl border p-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-xl uppercase">{club.name}</p>
                  {club.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {club.description}
                    </p>
                  )}
                </div>
                <Badge variant="outline">
                  {categoryLabels[club.category] ?? club.category}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {club._count.members}{" "}
                  {club._count.members === 1 ? "membro" : "membros"}
                </span>
                {club.ownerId === session!.user.id && (
                  <span className="font-mono tracking-wider">
                    {club.inviteCode}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
