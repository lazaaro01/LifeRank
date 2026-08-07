import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserModel } from "@/generated/prisma/models";

type RankedEntry = { rank: number; user: UserModel };

type RankingContentProps = {
  ranked: RankedEntry[];
  currentUserId: string;
  currentUserEntry: RankedEntry | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function PodiumSpot({ entry, size }: { entry: RankedEntry; size: "gold" | "silver" | "bronze" }) {
  const ringClass =
    size === "gold"
      ? "border-primary size-20 sm:size-32 md:size-40"
      : size === "silver"
        ? "border-muted-foreground/30 size-16 sm:size-24 md:size-28"
        : "border-[#cd7f32]/40 size-16 sm:size-24 md:size-28";

  const badgeClass =
    size === "gold"
      ? "bg-primary text-primary-foreground"
      : size === "silver"
        ? "bg-muted-foreground text-white"
        : "bg-[#cd7f32] text-white";

  return (
    <div className="flex w-20 flex-col items-center gap-2 sm:w-auto sm:gap-3">
      <div className="relative">
        <Avatar className={`${ringClass} border-4`}>
          <AvatarImage src={entry.user.avatarUrl ?? undefined} alt={entry.user.name} />
          <AvatarFallback className="text-sm sm:text-xl">
            {initials(entry.user.name)}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full text-xs font-bold ring-2 ring-background sm:size-8 sm:text-sm ${badgeClass}`}
        >
          {entry.rank}
        </span>
      </div>
      <div className="w-full text-center">
        <p className="font-heading truncate text-xs uppercase sm:text-lg md:text-xl">
          {entry.user.name}
        </p>
        <Badge variant="outline" className="mt-1 hidden sm:inline-flex">
          Nível {entry.user.level}
        </Badge>
      </div>
      <div className="text-center">
        <p className="text-primary text-base font-semibold sm:text-2xl md:text-3xl">
          {entry.user.xp.toLocaleString("pt-BR")}
        </p>
        <p className="text-muted-foreground text-[10px] uppercase sm:text-xs">
          Total XP
        </p>
      </div>
    </div>
  );
}

export function RankingContent({
  ranked,
  currentUserId,
  currentUserEntry,
}: RankingContentProps) {
  const [first, second, third] = ranked;
  const rest = ranked.slice(3);
  const isCurrentUserInTop3 =
    currentUserEntry && ranked.slice(0, 3).some((e) => e.user.id === currentUserId);
  const showCurrentUserRow =
    currentUserEntry && !isCurrentUserInTop3 && !rest.some((e) => e.user.id === currentUserId);

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-4xl uppercase sm:text-6xl">
          Ranking global
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-sm">
          O nível de elite da comunidade LifeRank. Seu esforço, documentado e
          ranqueado contra os melhores.
        </p>
      </div>

      {first && (
        <div className="flex items-end justify-center gap-3 sm:gap-10">
          {second && <PodiumSpot entry={second} size="silver" />}
          <PodiumSpot entry={first} size="gold" />
          {third && <PodiumSpot entry={third} size="bronze" />}
        </div>
      )}

      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border">
        <div className="bg-muted text-muted-foreground grid grid-cols-[28px_1fr_44px_56px] gap-2 px-3 py-3 text-[10px] font-medium uppercase sm:grid-cols-[60px_1fr_100px_120px] sm:gap-4 sm:px-6 sm:py-4 sm:text-xs">
          <span>Rank</span>
          <span>Usuário</span>
          <span className="text-center">Nível</span>
          <span className="text-right">
            <span className="sm:hidden">XP</span>
            <span className="hidden sm:inline">Total XP</span>
          </span>
        </div>

        {rest.map((entry) => {
          const isMe = entry.user.id === currentUserId;
          return (
            <div
              key={entry.user.id}
              className={`grid grid-cols-[28px_1fr_44px_56px] items-center gap-2 border-t px-3 py-3 text-xs sm:grid-cols-[60px_1fr_100px_120px] sm:gap-4 sm:px-6 sm:py-4 sm:text-sm ${
                isMe ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <span className="text-sm font-semibold sm:text-lg">
                {String(entry.rank).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 items-center gap-2 truncate sm:gap-3">
                <Avatar size="sm">
                  <AvatarImage
                    src={entry.user.avatarUrl ?? undefined}
                    alt={entry.user.name}
                  />
                  <AvatarFallback>{initials(entry.user.name)}</AvatarFallback>
                </Avatar>
                <span className="truncate font-medium uppercase">
                  {isMe ? `Você (${entry.user.username})` : entry.user.name}
                </span>
              </span>
              <span
                className={`text-center ${isMe ? "" : "text-muted-foreground"}`}
              >
                {entry.user.level}
              </span>
              <span className="text-right font-semibold">
                {entry.user.xp.toLocaleString("pt-BR")}
              </span>
            </div>
          );
        })}

        {showCurrentUserRow && currentUserEntry && (
          <div className="bg-primary text-primary-foreground grid grid-cols-[28px_1fr_44px_56px] items-center gap-2 border-t px-3 py-3 text-xs sm:grid-cols-[60px_1fr_100px_120px] sm:gap-4 sm:px-6 sm:py-4 sm:text-sm">
            <span className="text-sm font-semibold sm:text-lg">
              {String(currentUserEntry.rank).padStart(2, "0")}
            </span>
            <span className="flex min-w-0 items-center gap-2 truncate sm:gap-3">
              <Avatar size="sm">
                <AvatarImage
                  src={currentUserEntry.user.avatarUrl ?? undefined}
                  alt={currentUserEntry.user.name}
                />
                <AvatarFallback>{initials(currentUserEntry.user.name)}</AvatarFallback>
              </Avatar>
              <span className="truncate font-medium uppercase">
                Você ({currentUserEntry.user.username})
              </span>
            </span>
            <span className="text-center">{currentUserEntry.user.level}</span>
            <span className="text-right font-semibold">
              {currentUserEntry.user.xp.toLocaleString("pt-BR")}
            </span>
          </div>
        )}

        {ranked.length === 0 && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 px-6 py-12 text-center text-sm">
            <Trophy className="size-8" />
            <p>Ninguém registrou XP ainda. Seja o primeiro do ranking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
