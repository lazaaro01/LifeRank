"use server";

import { auth } from "@/server/auth";
import { pushSubscriptionRepository } from "@/repositories/push-subscription.repository";
import { pushSubscriptionSchema } from "@/utils/validators/push-subscription.schema";

type ActionResult = { success: true } | { success: false; error: string };

export async function subscribeToPushAction(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = pushSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados de inscrição inválidos" };
  }

  await pushSubscriptionRepository.upsert({
    userId: session.user.id,
    endpoint: parsed.data.endpoint,
    p256dh: parsed.data.keys.p256dh,
    auth: parsed.data.keys.auth,
  });

  return { success: true };
}

export async function unsubscribeFromPushAction(
  endpoint: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  await pushSubscriptionRepository.removeByEndpoint(endpoint);
  return { success: true };
}
