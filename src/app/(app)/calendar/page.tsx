import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { clubService } from "@/services/club.service";
import { CalendarContent } from "@/components/calendar/calendar-content";

export const metadata: Metadata = {
  title: "Calendário | LifeRank",
};

type CalendarPageProps = {
  searchParams: Promise<{ y?: string; m?: string; club?: string }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { y, m, club: clubIdParam } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const year = y ? Number(y) : now.getUTCFullYear();
  const month = m ? Number(m) - 1 : now.getUTCMonth(); // 0-indexed

  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  const myClubs = await clubService.listMyClubs(userId);
  const selectedClub =
    myClubs.find((club) => club.id === clubIdParam) ?? myClubs[0] ?? null;

  const activities = selectedClub
    ? await clubService.getClubCalendar(selectedClub.id, monthStart, monthEnd)
    : [];

  return (
    <CalendarContent
      clubName={selectedClub?.name ?? null}
      activities={activities}
      year={year}
      month={month}
      myClubs={myClubs.map((club) => ({ id: club.id, name: club.name }))}
      selectedClubId={selectedClub?.id ?? null}
    />
  );
}
