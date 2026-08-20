"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { toggleActivityReactionAction } from "@/server/actions/club.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ActivityModel, CategoryModel, UserModel } from "@/generated/prisma/models";

type ReactionSummary = { emoji: string; count: number; reactedByMe: boolean };

type FeedActivity = ActivityModel & {
  category: CategoryModel;
  user: UserModel;
  reactions: ReactionSummary[];
};

type ClubFeedProps = {
  clubId: string | null;
  clubName: string | null;
  activities: FeedActivity[];
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "agora há pouco";
  if (diffHours < 24) return `há ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `há ${diffDays}d`;
}

export function ClubFeed({ clubId, clubName, activities }: ClubFeedProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!clubName) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center sm:p-12">
        <Camera className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">
          Entre em um clube para ver as fotos das atividades dos membros
        </p>
        <Link href="/clubs" className="text-primary text-sm font-medium">
          Ver clubes
        </Link>
      </div>
    );
  }

  const handleReact = (activityId: string, emoji: string) => {
    if (!clubId || isPending) return;
    startTransition(async () => {
      await toggleActivityReactionAction(clubId, activityId, emoji);
      router.refresh();
    });
  };

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base font-semibold uppercase sm:text-xl">
          Feed do clube {clubName}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Comprovantes das atividades registradas pelos membros.
        </p>
      </div>

      {activities.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Ninguém do clube registrou uma atividade ainda.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.category.icon);
            return (
              <div
                key={activity.id}
                className="overflow-hidden rounded-lg border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activity.photoUrl ?? undefined}
                  alt={activity.title}
                  className="aspect-square w-full object-cover"
                />
                <div className="space-y-1.5 p-2.5">
                  <p className="truncate text-xs font-medium uppercase sm:text-sm">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Avatar size="sm" className="size-5">
                      <AvatarImage
                        src={activity.user.avatarUrl ?? undefined}
                        alt={activity.user.name}
                      />
                      <AvatarFallback className="text-[8px]">
                        {initials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground truncate text-[11px]">
                      {activity.user.name}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
                    <Icon className="size-3" />
                    {timeAgo(activity.occurredAt)}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activity.reactions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleReact(activity.id, reaction.emoji)}
                        className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors ${
                          reaction.reactedByMe
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <span>{reaction.emoji}</span>
                        {reaction.count > 0 && (
                          <span className="text-muted-foreground">
                            {reaction.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
