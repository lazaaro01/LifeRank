import { Trophy, Medal, Award } from "lucide-react";
import clsx from "clsx";

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  if (rank > 3) return null;

  const config = {
    1: {
      icon: Trophy,
      color: "bg-amber-400 text-white shadow-amber-400/30",
      label: "Ouro"
    },
    2: {
      icon: Award,
      color: "bg-slate-300 text-white shadow-slate-300/30",
      label: "Prata"
    },
    3: {
      icon: Medal,
      color: "bg-orange-300 text-white shadow-orange-300/30",
      label: "Bronze"
    }
  }[rank as 1 | 2 | 3];

  const Icon = config.icon;

  return (
    <div 
      className={clsx(
        "flex h-8 w-8 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-110",
        config.color,
        className
      )}
      title={`Posição #${rank}: ${config.label}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}