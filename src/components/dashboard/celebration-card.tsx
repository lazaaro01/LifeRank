import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LevelUpMascot } from "@/components/landing/level-up-mascot";

type CelebrationCardProps = {
  currentStreak: number;
};

export function CelebrationCard({ currentStreak }: CelebrationCardProps) {
  return (
    <div className="border-primary/20 mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl border-2 border-dashed bg-white p-6 text-center sm:p-10">
      <LevelUpMascot className="text-primary size-24 sm:size-32" />
      <h2 className="font-heading text-primary text-3xl uppercase sm:text-4xl">
        Você está arrasando!
      </h2>
      <p className="text-muted-foreground max-w-md text-sm">
        Você chegou a uma streak de {currentStreak}{" "}
        {currentStreak === 1 ? "dia" : "dias"} seguidos. O clube está de
        olho em você.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          render={<Link href="/activities/new" />}
          size="lg"
          className="rounded-full uppercase"
        >
          Registrar atividade
        </Button>
        <Button
          render={<Link href="/profile" />}
          size="lg"
          variant="outline"
          className="rounded-full uppercase"
        >
          Ver perfil
        </Button>
      </div>
    </div>
  );
}
