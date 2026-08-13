import { prisma } from "@/lib/prisma";

export type SubscriptionData = {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export const pushSubscriptionRepository = {
  upsert(data: SubscriptionData) {
    return prisma.pushSubscription.upsert({
      where: { endpoint: data.endpoint },
      update: { userId: data.userId, p256dh: data.p256dh, auth: data.auth },
      create: data,
    });
  },

  removeByEndpoint(endpoint: string) {
    return prisma.pushSubscription.deleteMany({ where: { endpoint } });
  },

  listByUsers(userIds: string[]) {
    return prisma.pushSubscription.findMany({
      where: { userId: { in: userIds } },
    });
  },

  findByUserAndEndpoint(userId: string, endpoint: string) {
    return prisma.pushSubscription.findFirst({ where: { userId, endpoint } });
  },
};
