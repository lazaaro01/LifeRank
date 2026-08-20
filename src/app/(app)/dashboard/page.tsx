import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { dashboardService } from "@/services/dashboard.service";
import { clubService } from "@/services/club.service";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | LifeRank",
};

type DashboardPageProps = {
  searchParams: Promise<{ club?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { club: clubIdParam } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const [data, myClubs] = await Promise.all([
    dashboardService.getDashboardData(userId),
    clubService.listMyClubs(userId),
  ]);

  const selectedClub =
    myClubs.find((club) => club.id === clubIdParam) ?? myClubs[0] ?? null;

  const [clubRanking, clubFeed] = selectedClub
    ? await Promise.all([
        clubService.getClubRanking(selectedClub.id),
        clubService.getClubFeed(selectedClub.id, userId),
      ])
    : [[], []];

  return (
    <DashboardContent
      data={data}
      myClubs={myClubs.map((club) => ({ id: club.id, name: club.name }))}
      selectedClubId={selectedClub?.id ?? null}
      club={
        selectedClub
          ? {
              id: selectedClub.id,
              name: selectedClub.name,
              ranking: clubRanking,
              feed: clubFeed,
            }
          : null
      }
    />
  );
}
