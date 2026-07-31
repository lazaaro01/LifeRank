const DAY_MS = 24 * 60 * 60 * 1000;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export type StreakResult = {
  current: number;
  best: number;
};

export function computeStreak(activityDates: Date[]): StreakResult {
  if (activityDates.length === 0) {
    return { current: 0, best: 0 };
  }

  const uniqueDays = Array.from(new Set(activityDates.map(toDateKey))).sort();

  let best = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / DAY_MS);

    run = diffDays === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const lastDay = uniqueDays[uniqueDays.length - 1];
  const todayKey = toDateKey(new Date());
  const yesterdayKey = toDateKey(new Date(Date.now() - DAY_MS));

  const current = lastDay === todayKey || lastDay === yesterdayKey ? run : 0;

  return { current, best };
}
