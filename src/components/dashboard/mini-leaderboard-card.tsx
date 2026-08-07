import Link from "next/link";
import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserModel } from "@/generated/prisma/models";

type RankedMember = { rank: number; user: UserModel };

type MiniLeaderboardCardProps = {
  clubName: string | null;
  members: RankedMember[];
  currentUserId: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function MiniLeaderboardCard({
  clubName,
  members,
  currentUserId,
}: MiniLeaderboardCardProps) {
  if (!clubName) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6 text-center sm:p-8">
        <Trophy className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">
          Entre em um clube para ver o ranking entre amigos
        </p>
        <div className="mt-2 flex gap-2">
          <Link href="/clubs" className="text-primary text-sm font-medium">
            Ver clubes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold uppercase sm:text-lg">
          {clubName}
        </h3>
        <Trophy className="text-muted-foreground size-5" />
      </div>

      <div className="flex-1 space-y-2">
        {members.slice(0, 3).map((entry) => {
          const isMe = entry.user.id === currentUserId;
          return (
            <div
              key={entry.user.id}
              className={`flex items-center justify-between rounded-lg p-3 text-sm ${
                isMe
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-semibold">
                  {String(entry.rank).padStart(2, "0")}
                </span>
                <Avatar size="sm">
                  <AvatarImage
                    src={entry.user.avatarUrl ?? undefined}
                    alt={entry.user.name}
                  />
                  <AvatarFallback>{initials(entry.user.name)}</AvatarFallback>
                </Avatar>
                <span
                  className={`font-medium uppercase ${isMe ? "" : "text-foreground"}`}
                >
                  {isMe ? "Você" : entry.user.name}
                </span>
              </div>
              <span className="font-medium">
                {entry.user.xp.toLocaleString("pt-BR")} XP
              </span>
            </div>
          );
        })}
      </div>

      <Link
        href="/clubs"
        className="border-primary text-primary rounded-full border-2 py-3 text-center text-sm font-medium uppercase"
      >
        Ranking completo
      </Link>
    </div>
  );
}
