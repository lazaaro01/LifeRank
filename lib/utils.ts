import { activityCatalog } from "@/lib/constants";
import { Achievement, Activity, GroupData, RankingEntry, UserProfile } from "@/lib/types";

export function createId(prefix?: string) {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${prefix ? prefix + "_" : ""}${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(new Date(date));
}

export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(date);
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayKey() {
  return toDateKey(new Date());
}

export function getMonthKey(date: string) {
  return date.slice(0, 7);
}

export function getActivityPoints(type: keyof typeof activityCatalog, hours?: number) {
  if (type === "study") {
    return Math.max(1, Number(hours ?? 1)) * activityCatalog.study.points;
  }

  return activityCatalog[type].points;
}

export function getRanking(
  group: GroupData | null,
  profile: UserProfile | null,
  activities: Activity[],
  monthKey: string
): RankingEntry[] {
  if (!group) return [];

  return group.members
    .map((member) => {
      const memberActivities = activities.filter(
        (activity) =>
          activity.userId === member.id &&
          activity.groupId === group.id &&
          getMonthKey(activity.date) === monthKey
      );

      return {
        userId: member.id,
        name: member.name,
        avatar: member.avatar,
        points: memberActivities.reduce((total, activity) => total + activity.points, 0),
        activitiesCount: memberActivities.length,
        streak: getStreak(member.id, activities),
        isCurrentUser: profile?.id === member.id
      };
    })
    .sort((left, right) => right.points - left.points || right.activitiesCount - left.activitiesCount)
    .map(({ isCurrentUser, ...entry }) => ({
      ...entry,
      name: isCurrentUser ? `${entry.name} (voce)` : entry.name
    }));
}

export function getDailyPoints(activities: Activity[], date: string) {
  return activities
    .filter((activity) => activity.date === date)
    .reduce((total, activity) => total + activity.points, 0);
}

export function getStreak(userId: string, activities: Activity[]) {
  const activityDays = Array.from(
    new Set(activities.filter((activity) => activity.userId === userId).map((activity) => activity.date))
  ).sort((left, right) => (left < right ? 1 : -1));

  if (!activityDays.length) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let index = 0; index < activityDays.length; index += 1) {
    const day = new Date(activityDays[index]);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((cursor.getTime() - day.getTime()) / 86400000);

    if ((index === 0 && diff <= 1) || diff === index) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}

export function getAchievements(profile: UserProfile | null, activities: Activity[]): Achievement[] {
  if (!profile) return [];

  const mine = activities.filter((activity) => activity.userId === profile.id);
  const studyHours = mine
    .filter((activity) => activity.type === "study")
    .reduce((total, activity) => total + Number(activity.hours ?? 0), 0);
  const totalPoints = mine.reduce((total, activity) => total + activity.points, 0);
  const streak = getStreak(profile.id, activities);

  return [
    {
      id: "first-step",
      title: "Primeiro passo",
      description: "Registre sua primeira atividade.",
      unlocked: mine.length > 0
    },
    {
      id: "focus-mode",
      title: "Modo foco",
      description: "Acumule 5 horas de estudo.",
      unlocked: studyHours >= 5
    },
    {
      id: "consistency",
      title: "Consistencia",
      description: "Alcance 3 dias de streak.",
      unlocked: streak >= 3
    },
    {
      id: "points-100",
      title: "Nivel 100",
      description: "Some 100 pontos no total.",
      unlocked: totalPoints >= 100
    }
  ];
}

export function getDemoMembers(currentUser: UserProfile) {
  return [
    {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      isCurrentUser: true
    },
    {
      id: "member_sofia",
      name: "Sofia",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "member_caio",
      name: "Caio",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ];
}