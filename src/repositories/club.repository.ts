import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ClubModel } from "@/generated/prisma/models";

export type CreateClubData = Pick<
  ClubModel,
  "name" | "description" | "category" | "isPrivate" | "inviteCode" | "ownerId"
>;

export const clubRepository = {
  create(data: CreateClubData, tx: Prisma.TransactionClient = prisma) {
    return tx.club.create({ data });
  },

  findByInviteCode(inviteCode: string) {
    return prisma.club.findUnique({ where: { inviteCode } });
  },

  findByIdWithMemberCount(id: string) {
    return prisma.club.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
  },

  listForUser(userId: string) {
    return prisma.club.findMany({
      where: { members: { some: { userId } } },
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  inviteCodeExists(inviteCode: string) {
    return prisma.club
      .findUnique({ where: { inviteCode }, select: { id: true } })
      .then((club) => club !== null);
  },

  delete(id: string) {
    return prisma.club.delete({ where: { id } });
  },
};

export const clubMembershipRepository = {
  addOwner(clubId: string, userId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.clubMembership.create({
      data: { clubId, userId, role: "OWNER" },
    });
  },

  addMember(clubId: string, userId: string, tx: Prisma.TransactionClient = prisma) {
    return tx.clubMembership.create({
      data: { clubId, userId, role: "MEMBER" },
    });
  },

  findMembership(clubId: string, userId: string) {
    return prisma.clubMembership.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });
  },

  listMembersRankedByXp(clubId: string) {
    return prisma.clubMembership.findMany({
      where: { clubId },
      include: { user: true },
      orderBy: { user: { xp: "desc" } },
    });
  },

  listMemberIds(clubId: string) {
    return prisma.clubMembership
      .findMany({ where: { clubId }, select: { userId: true } })
      .then((rows) => rows.map((row) => row.userId));
  },

  remove(clubId: string, userId: string) {
    return prisma.clubMembership.delete({
      where: { clubId_userId: { clubId, userId } },
    });
  },
};
