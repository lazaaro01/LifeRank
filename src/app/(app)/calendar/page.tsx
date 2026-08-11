import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { clubService } from "@/services/club.service";
import { CalendarContent } from "@/components/calendar/calendar-content";

export const metadata: Metadata = {
  title: "Calendário | LifeRank",
};

type CalendarPageProps = {
  searchParams: Promise<{ y?: string; m?: string }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { y, m } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const year = y ? Number(y) : now.getUTCFullYear();
  const month = m ? Number(m) - 1 : now.getUTCMonth(); // 0-indexed

  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  const myClubs = await clubService.listMyClubs(userId);
  const primaryClub = myClubs[0] ?? null;

  const activities = primaryClub
    ? await clubService.getClubCalendar(primaryClub.id, monthStart, monthEnd)
    : [];

  return (
    <CalendarContent
      clubName={primaryClub?.name ?? null}
      activities={activities}
      year={year}
      month={month}
    />
  );
}
