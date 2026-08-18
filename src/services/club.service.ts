import { prisma } from "@/lib/prisma";
import { clubRepository, clubMembershipRepository } from "@/repositories/club.repository";
import { activityRepository } from "@/repositories/activity.repository";
import { activityViewRepository } from "@/repositories/activity-view.repository";
import { ServiceError } from "@/services/errors";
import type { CreateClubInput, JoinClubInput } from "@/utils/validators/club.schema";
import type { ClubModel } from "@/generated/prisma/models";

// Each member has their own 3-minute window that starts the first time THEY
// see a given photo — not a single deadline shared by the whole club.
const FEED_VISIBILITY_MS = 4 * 60 * 1000;

const INVITE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number) {
  let segment = "";
  for (let i = 0; i < length; i++) {
    segment += INVITE_CODE_CHARS[Math.floor(Math.random() * INVITE_CODE_CHARS.length)];
  }
  return segment;
}

async function generateUniqueInviteCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const year = new Date().getFullYear();
    const code = `LR-${randomSegment(3)}-${year}`;
    const exists = await clubRepository.inviteCodeExists(code);
    if (!exists) return code;
  }
  throw new ServiceError("Não foi possível gerar um código de convite, tente novamente");
}

export type CreateClubResult = {
  club: ClubModel;
};

export const clubService = {
  async createClub(userId: string, input: CreateClubInput): Promise<CreateClubResult> {
    const inviteCode = await generateUniqueInviteCode();

    const club = await prisma.$transaction(async (tx) => {
      const created = await clubRepository.create(
        {
          name: input.name,
          description: input.description || null,
          category: input.category,
          isPrivate: input.isPrivate,
          inviteCode,
          ownerId: userId,
        },
        tx
      );
      await clubMembershipRepository.addOwner(created.id, userId, tx);
      return created;
    });

    return { club };
  },

  async joinClub(userId: string, input: JoinClubInput) {
    const club = await clubRepository.findByInviteCode(
      input.inviteCode.trim().toUpperCase()
    );
    if (!club) {
      throw new ServiceError("Código de convite inválido", "inviteCode");
    }

    const existingMembership = await clubMembershipRepository.findMembership(
      club.id,
      userId
    );
    if (existingMembership) {
      throw new ServiceError("Você já faz parte deste clube", "inviteCode");
    }

    await clubMembershipRepository.addMember(club.id, userId);
    return { club };
  },

  listMyClubs(userId: string) {
    return clubRepository.listForUser(userId);
  },

  async getClubRanking(clubId: string) {
    const members = await clubMembershipRepository.listMembersRankedByXp(clubId);
    return members.map((membership, index) => ({
      rank: index + 1,
      user: membership.user,
      role: membership.role,
    }));
  },

  async getClubFeed(clubId: string, viewerId: string, limit = 5) {
    const memberIds = await clubMembershipRepository.listMemberIds(clubId);
    if (memberIds.length === 0) return [];

    const activities = await activityRepository.listRecentByUsers(memberIds, limit);
    if (activities.length === 0) return [];

    const activityIds = activities.map((activity) => activity.id);
    const views = await activityViewRepository.listByUserForActivities(
      viewerId,
      activityIds
    );
    const viewedAt = new Map(
      views.map((view) => [view.activityId, view.firstViewedAt])
    );

    const now = Date.now();
    const visible = activities.filter((activity) => {
      const firstViewedAt = viewedAt.get(activity.id);
      if (!firstViewedAt) return true; // never seen by this viewer yet — their clock hasn't started
      return now - firstViewedAt.getTime() < FEED_VISIBILITY_MS;
    });

    const newlySeenIds = activities
      .filter((activity) => !viewedAt.has(activity.id))
      .map((activity) => activity.id);
    await activityViewRepository.recordFirstViews(viewerId, newlySeenIds);

    return visible;
  },

  getClubDetails(clubId: string) {
    return clubRepository.findByIdWithMemberCount(clubId);
  },

  async leaveClub(userId: string, clubId: string) {
    const membership = await clubMembershipRepository.findMembership(clubId, userId);
    if (!membership) {
      throw new ServiceError("Você não faz parte deste clube");
    }
    if (membership.role === "OWNER") {
      throw new ServiceError(
        "O dono não pode sair do clube. Exclua o clube se quiser encerrá-lo."
      );
    }
    await clubMembershipRepository.remove(clubId, userId);
  },

  async deleteClub(userId: string, clubId: string) {
    const club = await clubRepository.findByIdWithMemberCount(clubId);
    if (!club) {
      throw new ServiceError("Clube não encontrado");
    }
    if (club.ownerId !== userId) {
      throw new ServiceError("Só o dono pode excluir o clube");
    }
    await clubRepository.delete(clubId);
  },

  async getClubCalendar(clubId: string, start: Date, end: Date) {
    const memberIds = await clubMembershipRepository.listMemberIds(clubId);
    if (memberIds.length === 0) return [];
    return activityRepository.listByUsersInRange(memberIds, start, end);
  },
};
