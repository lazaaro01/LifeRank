import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { rankingService } from "@/services/ranking.service";
import { RankingContent } from "@/components/ranking/ranking-content";

export const metadata: Metadata = {
  title: "Ranking Geral | LifeRank",
};

export default async function RankingPage() {
  const session = await auth();
  const userId = session!.user.id;

  const { ranked, currentUserEntry } = await rankingService.getGlobalRanking(
    userId,
    50
  );

  return (
    <RankingContent
      ranked={ranked}
      currentUserId={userId}
      currentUserEntry={currentUserEntry}
    />
  );
}
