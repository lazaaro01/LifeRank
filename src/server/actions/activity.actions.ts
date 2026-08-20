"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { createActivitySchema } from "@/utils/validators/activity.schema";
import { activityService } from "@/services/activity.service";
import { uploadActivityPhoto } from "@/lib/supabase-storage";
import { ServiceError } from "@/services/errors";

const MAX_PHOTO_BYTES = 8_000_000;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ActionResult =
  | {
      success: true;
      leveledUp: boolean;
      newAchievements: { title: string }[];
    }
  | { success: false; error: string; field?: string };

export async function createActivityAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return {
      success: false,
      error: "Tire uma foto para comprovar a atividade",
      field: "photo",
    };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
    return {
      success: false,
      error: "Formato de imagem inválido (use JPG, PNG ou WEBP)",
      field: "photo",
    };
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return {
      success: false,
      error: "A foto deve ter no máximo 8 MB",
      field: "photo",
    };
  }

  const parsed = createActivitySchema.safeParse({
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    quantity: Number(formData.get("quantity")),
    occurredAt: formData.get("occurredAt"),
  });
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    const photoUrl = await uploadActivityPhoto(session.user.id, photo);

    const result = await activityService.createActivity(
      session.user.id,
      parsed.data,
      photoUrl
    );
    revalidatePath("/dashboard");
    revalidatePath("/activities");
    return {
      success: true,
      leveledUp: result.leveledUp,
      newAchievements: result.newAchievements.map((achievement) => ({
        title: achievement.title,
      })),
    };
  } catch (error) {
    if (error instanceof ServiceError) {
      return { success: false, error: error.message, field: error.field };
    }
    return { success: false, error: "Não foi possível registrar a atividade" };
  }
}

export async function updateActivityAction(
  activityId: string,
  input: unknown
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = createActivitySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    const result = await activityService.updateActivity(
      session.user.id,
      activityId,
      parsed.data
    );
    revalidatePath("/dashboard");
    revalidatePath("/activities");
    return {
      success: true,
      leveledUp: result.leveledUp,
      newAchievements: result.newAchievements.map((achievement) => ({
        title: achievement.title,
      })),
    };
  } catch (error) {
    if (error instanceof ServiceError) {
      return { success: false, error: error.message, field: error.field };
    }
    return { success: false, error: "Não foi possível atualizar a atividade" };
  }
}

type SimpleActionResult = { success: true } | { success: false; error: string };

export async function deleteActivityAction(
  activityId: string
): Promise<SimpleActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  try {
    await activityService.deleteActivity(session.user.id, activityId);
    revalidatePath("/dashboard");
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Não foi possível excluir a atividade" };
  }
}
