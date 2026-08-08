import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Users } from "lucide-react";
import { auth } from "@/server/auth";
import { clubService } from "@/services/club.service";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClubDetailActions } from "@/components/clubs/club-detail-actions";

export const metadata: Metadata = {
  title: "Clube | LifeRank",
};

const categoryLabels: Record<string, string> = {
  SPORTS: "Esportes",
  STUDY: "Estudos",
  WORK: "Trabalho",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type ClubDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [club, ranking] = await Promise.all([
    clubService.getClubDetails(id),
    clubService.getClubRanking(id),
  ]);

  if (!club) {
    notFound();
  }

  const myEntry = ranking.find((entry) => entry.user.id === userId);
  if (!myEntry) {
    redirect("/clubs");
  }

  const isOwner = myEntry.role === "OWNER";

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">
              {categoryLabels[club.category] ?? club.category}
            </Badge>
            {club.isPrivate && <Badge variant="secondary">Privado</Badge>}
          </div>
          <h1 className="font-heading text-3xl uppercase sm:text-4xl">
            {club.name}
          </h1>
          {club.description && (
            <p className="text-muted-foreground mt-1 max-w-lg text-sm">
              {club.description}
            </p>
          )}
        </div>
        <ClubDetailActions
          clubId={club.id}
          clubName={club.name}
          isOwner={isOwner}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Users className="size-4" />
          {club._count.members}{" "}
          {club._count.members === 1 ? "membro" : "membros"}
        </span>
        {isOwner && (
          <span className="text-muted-foreground">
            Código de convite:{" "}
            <span className="font-mono tracking-wider">
              {club.inviteCode}
            </span>
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="bg-muted text-muted-foreground grid grid-cols-[48px_1fr_100px] gap-4 px-6 py-3 text-xs font-medium uppercase">
          <span>Rank</span>
          <span>Membro</span>
          <span className="text-right">XP</span>
        </div>
        {ranking.map((entry) => {
          const isMe = entry.user.id === userId;
          return (
            <div
              key={entry.user.id}
              className={`grid grid-cols-[48px_1fr_100px] items-center gap-4 border-t px-6 py-3 text-sm ${
                isMe ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <span className="font-semibold">
                {String(entry.rank).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage
                    src={entry.user.avatarUrl ?? undefined}
                    alt={entry.user.name}
                  />
                  <AvatarFallback>{initials(entry.user.name)}</AvatarFallback>
                </Avatar>
                <span className="truncate font-medium uppercase">
                  {isMe ? "Você" : entry.user.name}
                </span>
                {entry.role === "OWNER" && (
                  <Badge variant="outline" className="shrink-0">
                    Dono
                  </Badge>
                )}
              </span>
              <span className="text-right font-semibold">
                {entry.user.xp.toLocaleString("pt-BR")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
