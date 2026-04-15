import { ActivityType } from "@/lib/types";

export const STORAGE_KEY = "liferank.storage.v1";

export const activityCatalog: Record<
  ActivityType,
  { label: string; points: number; hasHours?: boolean; emoji: string }
> = {
  study: { label: "Estudo", points: 10, hasHours: true, emoji: "📘" },
  gym: { label: "Academia", points: 10, emoji: "🏋️" },
  bike: { label: "Bicicleta", points: 10, emoji: "🚴" },
  church: { label: "Igreja", points: 10, emoji: "⛪" },
  reading: { label: "Leitura", points: 10, emoji: "📚" },
  custom: { label: "Personalizada", points: 10, emoji: "✨" }
};

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/activities", label: "Atividade" },
  { href: "/calendar", label: "Calendario" },
  { href: "/ranking", label: "Ranking" },
  { href: "/group", label: "Grupo" },
  { href: "/profile", label: "Perfil" }
];