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
      ? "border-primary size-32 sm:size-40"
      : size === "silver"
        ? "border-muted-foreground/30 size-24 sm:size-28"
        : "border-[#cd7f32]/40 size-24 sm:size-28";

  const badgeClass =
    size === "gold"
      ? "bg-primary text-primary-foreground"
      : size === "silver"
        ? "bg-muted-foreground text-white"
        : "bg-[#cd7f32] text-white";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className={`${ringClass} border-4`}>
          <AvatarImage src={entry.user.avatarUrl ?? undefined} alt={entry.user.name} />
          <AvatarFallback className="text-xl">{initials(entry.user.name)}</AvatarFallback>
        </Avatar>
        <span
          className={`absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full text-sm font-bold ring-2 ring-background ${badgeClass}`}
        >
          {entry.rank}
        </span>
      </div>
      <div className="text-center">
        <p className="font-heading text-lg uppercase sm:text-xl">{entry.user.name}</p>
        <Badge variant="outline" className="mt-1">
          Nível {entry.user.level}
        </Badge>
      </div>
      <div className="text-center">
        <p className="text-primary text-2xl font-semibold sm:text-3xl">
          {entry.user.xp.toLocaleString("pt-BR")}
        </p>
        <p className="text-muted-foreground text-xs uppercase">Total XP</p>
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
        <h1 className="font-heading text-5xl uppercase sm:text-6xl">
          Ranking global
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-sm">
          O nível de elite da comunidade LifeRank. Seu esforço, documentado e
          ranqueado contra os melhores.
        </p>
      </div>

      {first && (
        <div className="flex items-end justify-center gap-6 sm:gap-10">
          {second && <PodiumSpot entry={second} size="silver" />}
          <PodiumSpot entry={first} size="gold" />
          {third && <PodiumSpot entry={third} size="bronze" />}
        </div>
      )}

      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border">
        <div className="bg-muted text-muted-foreground grid grid-cols-[60px_1fr_100px_120px] gap-4 px-6 py-4 text-xs font-medium uppercase">
          <span>Rank</span>
          <span>Usuário</span>
          <span className="text-center">Nível</span>
          <span className="text-right">Total XP</span>
        </div>

        {rest.map((entry) => {
          const isMe = entry.user.id === currentUserId;
          return (
            <div
              key={entry.user.id}
              className={`grid grid-cols-[60px_1fr_100px_120px] items-center gap-4 border-t px-6 py-4 ${
                isMe ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <span className="text-lg font-semibold">
                {String(entry.rank).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-3 truncate">
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
                className={`text-center text-xs ${isMe ? "" : "text-muted-foreground"}`}
              >
                Nível {entry.user.level}
              </span>
              <span className="text-right font-semibold">
                {entry.user.xp.toLocaleString("pt-BR")}
              </span>
            </div>
          );
        })}

        {showCurrentUserRow && currentUserEntry && (
          <div className="bg-primary text-primary-foreground grid grid-cols-[60px_1fr_100px_120px] items-center gap-4 border-t px-6 py-4">
            <span className="text-lg font-semibold">
              {String(currentUserEntry.rank).padStart(2, "0")}
            </span>
            <span className="flex items-center gap-3 truncate">
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
            <span className="text-center text-xs">
              Nível {currentUserEntry.user.level}
            </span>
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
