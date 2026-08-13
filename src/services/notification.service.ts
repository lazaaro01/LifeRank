import webpush from "web-push";
import { pushSubscriptionRepository } from "@/repositories/push-subscription.repository";
import { clubRepository, clubMembershipRepository } from "@/repositories/club.repository";

const vapidSubject = process.env.VAPID_SUBJECT;
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidSubject && vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

type SendResult = { sent: number; removed: number };

async function sendToUsers(
  userIds: string[],
  payload: { title: string; body: string; url: string }
): Promise<SendResult> {
  if (userIds.length === 0 || !vapidPublicKey) {
    return { sent: 0, removed: 0 };
  }

  const subscriptions = await pushSubscriptionRepository.listByUsers(userIds);
  if (subscriptions.length === 0) {
    return { sent: 0, removed: 0 };
  }

  const body = JSON.stringify(payload);
  let sent = 0;
  let removed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          body
        );
        sent++;
      } catch (error) {
        const statusCode =
          error && typeof error === "object" && "statusCode" in error
            ? (error as { statusCode: number }).statusCode
            : null;

        if (statusCode === 404 || statusCode === 410) {
          await pushSubscriptionRepository.removeByEndpoint(subscription.endpoint);
          removed++;
        } else {
          console.error("[notificationService] Falha ao enviar push:", error);
        }
      }
    })
  );

  return { sent, removed };
}

export const notificationService = {
  async notifyClubmatesOfActivity(
    actorId: string,
    actorName: string,
    xpEarned: number
  ): Promise<SendResult> {
    const myClubs = await clubRepository.listForUser(actorId);
    if (myClubs.length === 0) {
      return { sent: 0, removed: 0 };
    }

    const memberIdLists = await Promise.all(
      myClubs.map((club) => clubMembershipRepository.listMemberIds(club.id))
    );

    const recipientIds = new Set<string>();
    for (const ids of memberIdLists) {
      for (const id of ids) {
        if (id !== actorId) recipientIds.add(id);
      }
    }

    return sendToUsers(Array.from(recipientIds), {
      title: "LifeRank",
      body: `${actorName} registrou uma atividade: +${xpEarned} XP`,
      url: "/dashboard",
    });
  },
};
