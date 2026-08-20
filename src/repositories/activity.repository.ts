import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ActivityModel } from "@/generated/prisma/models";

export type CreateActivityData = Pick<
  ActivityModel,
  | "title"
  | "quantity"
  | "points"
  | "xpEarned"
  | "occurredAt"
  | "userId"
  | "categoryId"
  | "photoUrl"
>;

export type UpdateActivityData = Partial<
  Pick<
    ActivityModel,
    "title" | "quantity" | "points" | "xpEarned" | "occurredAt" | "categoryId" | "photoUrl"
  >
>;

export const activityRepository = {
  create(data: CreateActivityData, tx: Prisma.TransactionClient = prisma) {
    return tx.activity.create({ data });
  },

  findById(id: string, tx: Prisma.TransactionClient = prisma) {
    return tx.activity.findUnique({ where: { id } });
  },

  update(
    id: string,
    data: UpdateActivityData,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.activity.update({ where: { id }, data });
  },

  delete(id: string, tx: Prisma.TransactionClient = prisma) {
    return tx.activity.delete({ where: { id } });
  },

  findRecentByUser(userId: string, limit = 8) {
    return prisma.activity.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { occurredAt: "desc" },
      take: limit,
    });
  },

  listStatsByUser(userId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.activity.findMany({
      where: { userId },
      select: { points: true, xpEarned: true, occurredAt: true },
    });
  },

  findSinceByUser(userId: string, since: Date) {
    return prisma.activity.findMany({
      where: { userId, occurredAt: { gte: since } },
      select: { occurredAt: true, points: true },
      orderBy: { occurredAt: "asc" },
    });
  },

  countByUser(userId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.activity.count({ where: { userId } });
  },

  listByUser(userId: string, options: { categoryId?: string; take?: number } = {}) {
    return prisma.activity.findMany({
      where: { userId, categoryId: options.categoryId },
      include: { category: true },
      orderBy: { occurredAt: "desc" },
      take: options.take ?? 100,
    });
  },

  listRecentByUsers(userIds: string[], limit = 12) {
    return prisma.activity.findMany({
      where: { userId: { in: userIds }, photoUrl: { not: null } },
      include: { category: true, user: true },
      orderBy: { occurredAt: "desc" },
      take: limit,
    });
  },

  listByUsersInRange(userIds: string[], start: Date, end: Date) {
    return prisma.activity.findMany({
      where: { userId: { in: userIds }, occurredAt: { gte: start, lte: end } },
      include: { user: true },
      orderBy: { occurredAt: "asc" },
    });
  },
};
