import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = [
  { name: "Estudo", icon: "BookOpen", pointsPerUnit: 10, unit: "hora" },
  { name: "Academia", icon: "Dumbbell", pointsPerUnit: 10, unit: "atividade" },
  { name: "Bicicleta", icon: "Bike", pointsPerUnit: 10, unit: "atividade" },
  { name: "Leitura", icon: "Book", pointsPerUnit: 10, unit: "atividade" },
  { name: "Igreja", icon: "Church", pointsPerUnit: 10, unit: "atividade" },
  { name: "Trabalho", icon: "Briefcase", pointsPerUnit: 10, unit: "atividade" },
  { name: "Projeto pessoal", icon: "Rocket", pointsPerUnit: 10, unit: "atividade" },
  { name: "Corrida", icon: "Footprints", pointsPerUnit: 10, unit: "km" },
  { name: "Jiu-Jitsu", icon: "Swords", pointsPerUnit: 10, unit: "atividade" },
] as const;

const ACHIEVEMENTS = [
  {
    code: "first_activity",
    title: "Primeira atividade",
    description: "Registre sua primeira atividade",
    icon: "Sparkles",
  },
  {
    code: "points_100",
    title: "100 pontos",
    description: "Acumule 100 pontos",
    icon: "Star",
  },
  {
    code: "points_500",
    title: "500 pontos",
    description: "Acumule 500 pontos",
    icon: "Award",
  },
  {
    code: "points_1000",
    title: "1000 pontos",
    description: "Acumule 1000 pontos",
    icon: "Trophy",
  },
  {
    code: "streak_7",
    title: "7 dias seguidos",
    description: "Mantenha uma streak de 7 dias",
    icon: "Flame",
  },
  {
    code: "streak_30",
    title: "30 dias seguidos",
    description: "Mantenha uma streak de 30 dias",
    icon: "Flame",
  },
  {
    code: "activities_100",
    title: "100 atividades registradas",
    description: "Registre 100 atividades",
    icon: "ListChecks",
  },
] as const;

async function main() {
  for (const category of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name, ownerId: null },
    });

    if (existing) {
      await prisma.category.update({ where: { id: existing.id }, data: category });
    } else {
      await prisma.category.create({ data: category });
    }
  }

  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
