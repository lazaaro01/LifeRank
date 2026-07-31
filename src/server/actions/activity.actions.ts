"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { createActivitySchema } from "@/utils/validators/activity.schema";
import { activityService } from "@/services/activity.service";
import { ServiceError } from "@/services/errors";

type ActionResult =
  | {
      success: true;
      leveledUp: boolean;
      newAchievements: { title: string }[];
    }
  | { success: false; error: string; field?: string };

export async function createActivityAction(
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
    const result = await activityService.createActivity(
      session.user.id,
      parsed.data
    );
    revalidatePath("/dashboard");
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
