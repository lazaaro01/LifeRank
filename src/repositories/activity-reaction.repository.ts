import { prisma } from "@/lib/prisma";

export const activityReactionRepository = {
  listForActivities(activityIds: string[]) {
    return prisma.activityReaction.findMany({
      where: { activityId: { in: activityIds } },
      select: { activityId: true, userId: true, emoji: true },
    });
  },

  findOne(activityId: string, userId: string, emoji: string) {
    return prisma.activityReaction.findUnique({
      where: { activityId_userId_emoji: { activityId, userId, emoji } },
    });
  },

  add(activityId: string, userId: string, emoji: string) {
    return prisma.activityReaction.create({ data: { activityId, userId, emoji } });
  },

  remove(activityId: string, userId: string, emoji: string) {
    return prisma.activityReaction.delete({
      where: { activityId_userId_emoji: { activityId, userId, emoji } },
    });
  },
};
