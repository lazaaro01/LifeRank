export type AchievementCode =
  | "first_activity"
  | "points_100"
  | "points_500"
  | "points_1000"
  | "streak_7"
  | "streak_30"
  | "activities_100";

export type AchievementContext = {
  totalPoints: number;
  currentStreak: number;
  activityCount: number;
};

const RULES: Record<AchievementCode, (ctx: AchievementContext) => boolean> = {
  first_activity: (ctx) => ctx.activityCount >= 1,
  points_100: (ctx) => ctx.totalPoints >= 100,
  points_500: (ctx) => ctx.totalPoints >= 500,
  points_1000: (ctx) => ctx.totalPoints >= 1000,
  streak_7: (ctx) => ctx.currentStreak >= 7,
  streak_30: (ctx) => ctx.currentStreak >= 30,
  activities_100: (ctx) => ctx.activityCount >= 100,
};

export function evaluateAchievements(ctx: AchievementContext): AchievementCode[] {
  return (Object.keys(RULES) as AchievementCode[]).filter((code) =>
    RULES[code](ctx)
  );
}
