import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ActivityModel } from "@/generated/prisma/models";

export type CreateActivityData = Pick<
  ActivityModel,
  "title" | "quantity" | "points" | "xpEarned" | "occurredAt" | "userId" | "categoryId"
>;

export const activityRepository = {
  create(data: CreateActivityData, tx: Prisma.TransactionClient = prisma) {
    return tx.activity.create({ data });
  },

  findRecentByUser(userId: string, limit = 8) {
    return prisma.activity.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { occurredAt: "desc" },
      take: limit,
    });
  },

  findOccurredDatesByUser(userId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.activity
      .findMany({
        where: { userId },
        select: { occurredAt: true },
      })
      .then((rows) => rows.map((row) => row.occurredAt));
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
};
