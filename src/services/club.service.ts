import { prisma } from "@/lib/prisma";
import { clubRepository, clubMembershipRepository } from "@/repositories/club.repository";
import { ServiceError } from "@/services/errors";
import type { CreateClubInput, JoinClubInput } from "@/utils/validators/club.schema";
import type { ClubModel } from "@/generated/prisma/models";

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
};
