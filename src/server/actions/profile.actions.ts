"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { updateProfileSchema, updateAvatarSchema } from "@/utils/validators/auth.schema";
import { userService } from "@/services/user.service";

type ActionResult = { success: true } | { success: false; error: string };

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  await userService.updateProfile(session.user.id, parsed.data);
  revalidatePath("/profile");

  return { success: true };
}

export async function updateAvatarAction(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = updateAvatarSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  await userService.updateProfile(session.user.id, {
    name: session.user.name ?? session.user.username,
    avatarUrl: parsed.data.avatarUrl,
  });
  revalidatePath("/profile");

  return { success: true };
}
