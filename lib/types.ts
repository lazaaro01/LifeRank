export type ActivityType =
  | "study"
  | "gym"
  | "bike"
  | "church"
  | "reading"
  | "custom";

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  createdAt: string;
};

export type GroupMember = {
  id: string;
  name: string;
  avatar: string;
  isCurrentUser?: boolean;
};

export type Activity = {
  id: string;
  userId: string;
  userName: string;
  groupId: string;
  type: ActivityType;
  label: string;
  date: string;
  createdAt: string;
  points: number;
  hours?: number;
};

export type GroupData = {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  members: GroupMember[];
};

export type StorageShape = {
  profile: UserProfile | null;
  group: GroupData | null;
  activities: Activity[];
  monthlyResetAt: string | null;
};

export type RankingEntry = {
  userId: string;
  name: string;
  avatar: string;
  points: number;
  activitiesCount: number;
  streak: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};