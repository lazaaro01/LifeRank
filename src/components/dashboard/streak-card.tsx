import { Flame } from "lucide-react";

type StreakCardProps = {
  currentStreak: number;
  bestStreak: number;
};

export function StreakCard({ currentStreak, bestStreak }: StreakCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border bg-white p-8 text-center">
      <Flame className="text-primary size-10" />
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Streak diária
      </p>
      <p className="text-primary text-6xl font-semibold">{currentStreak}</p>
      <p className="text-muted-foreground text-sm">
        Melhor streak: {bestStreak} dias
      </p>
    </div>
  );
}
