import { prisma } from "@/lib/prisma";
import type { CategoryModel } from "@/generated/prisma/models";

export type CreateCustomCategoryData = Pick<
  CategoryModel,
  "name" | "icon" | "pointsPerUnit" | "unit"
> & {
  ownerId: string;
};

export const categoryRepository = {
  listAvailableForUser(userId: string) {
    return prisma.category.findMany({
      where: { OR: [{ ownerId: null }, { ownerId: userId }] },
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  createCustom(data: CreateCustomCategoryData) {
    return prisma.category.create({ data: { ...data, isCustom: true } });
  },
};
