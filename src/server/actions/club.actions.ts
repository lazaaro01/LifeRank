"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { createClubSchema, joinClubSchema } from "@/utils/validators/club.schema";
import { clubService } from "@/services/club.service";
import { ServiceError } from "@/services/errors";

type CreateClubActionResult =
  | { success: true; clubId: string; inviteCode: string }
  | { success: false; error: string; field?: string };

export async function createClubAction(
  input: unknown
): Promise<CreateClubActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = createClubSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    const { club } = await clubService.createClub(session.user.id, parsed.data);
    revalidatePath("/clubs");
    return { success: true, clubId: club.id, inviteCode: club.inviteCode };
  } catch (error) {
    if (error instanceof ServiceError) {
      return { success: false, error: error.message, field: error.field };
    }
    return { success: false, error: "Não foi possível criar o clube" };
  }
}

type JoinClubActionResult =
  | { success: true; clubId: string; clubName: string }
  | { success: false; error: string; field?: string };

export async function joinClubAction(
  input: unknown
): Promise<JoinClubActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = joinClubSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    const { club } = await clubService.joinClub(session.user.id, parsed.data);
    revalidatePath("/clubs");
    return { success: true, clubId: club.id, clubName: club.name };
  } catch (error) {
    if (error instanceof ServiceError) {
      return { success: false, error: error.message, field: error.field };
    }
    return { success: false, error: "Não foi possível entrar no clube" };
  }
}
