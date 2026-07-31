import { prisma } from "@/lib/prisma";
import type { UserModel } from "@/generated/prisma/models";
import type { Prisma } from "@/generated/prisma/client";

export type CreateUserData = Pick<
  UserModel,
  "name" | "username" | "email" | "passwordHash"
> &
  Partial<Pick<UserModel, "phone" | "bio" | "avatarUrl">>;

export type UpdateUserData = Partial<
  Pick<UserModel, "name" | "avatarUrl" | "phone" | "bio">
>;

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  findById(id: string, tx: Prisma.TransactionClient = prisma) {
    return tx.user.findUnique({ where: { id } });
  },

  create(data: CreateUserData) {
    return prisma.user.create({ data });
  },

  update(id: string, data: UpdateUserData) {
    return prisma.user.update({ where: { id }, data });
  },

  updateGamificationStats(
    id: string,
    data: Pick<UserModel, "points" | "xp" | "level" | "currentStreak" | "bestStreak">,
    tx: Prisma.TransactionClient = prisma
  ) {
    return tx.user.update({ where: { id }, data });
  },

  listTopByXp(limit = 50) {
    return prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: limit,
    });
  },

  countWithHigherXp(xp: number) {
    return prisma.user.count({ where: { xp: { gt: xp } } });
  },
};
