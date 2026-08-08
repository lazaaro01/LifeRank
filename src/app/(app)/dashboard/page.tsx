import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { dashboardService } from "@/services/dashboard.service";
import { clubService } from "@/services/club.service";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | LifeRank",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [data, myClubs] = await Promise.all([
    dashboardService.getDashboardData(userId),
    clubService.listMyClubs(userId),
  ]);

  const primaryClub = myClubs[0] ?? null;
  const [clubRanking, clubFeed] = primaryClub
    ? await Promise.all([
        clubService.getClubRanking(primaryClub.id),
        clubService.getClubFeed(primaryClub.id),
      ])
    : [[], []];

  return (
    <DashboardContent
      data={data}
      club={
        primaryClub
          ? { name: primaryClub.name, ranking: clubRanking, feed: clubFeed }
          : null
      }
    />
  );
}
