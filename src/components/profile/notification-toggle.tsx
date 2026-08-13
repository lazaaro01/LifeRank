"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  subscribeToPushAction,
  unsubscribeFromPushAction,
} from "@/server/actions/push.actions";
import {
  subscribeToPush,
  getExistingSubscription,
  isIOS,
  isStandalone,
  isPushSupported,
} from "@/lib/push-notifications";

type Status = "checking" | "unsupported" | "needs-install" | "ready";

export function NotificationToggle() {
  const [status, setStatus] = useState<Status>("checking");
  const [subscribed, setSubscribed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) {
      if (isIOS() && !isStandalone()) {
        setStatus("needs-install");
      } else {
        setStatus("unsupported");
      }
      return;
    }

    getExistingSubscription().then((subscription) => {
      setSubscribed(!!subscription);
      setStatus("ready");
    });
  }, []);

  const handleEnable = () => {
    setError(null);
    startTransition(async () => {
      try {
        const subscription = await subscribeToPush();
        const json = subscription.toJSON();
        const result = await subscribeToPushAction({
          endpoint: json.endpoint,
          keys: json.keys,
        });
        if (!result.success) {
          setError(result.error);
          return;
        }
        setSubscribed(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível ativar as notificações"
        );
      }
    });
  };

  const handleDisable = () => {
    setError(null);
    startTransition(async () => {
      const existing = await getExistingSubscription();
      if (existing) {
        await unsubscribeFromPushAction(existing.endpoint);
        await existing.unsubscribe();
      }
      setSubscribed(false);
    });
  };

  if (status === "checking") {
    return null;
  }

  if (status === "unsupported") {
    return (
      <p className="text-muted-foreground text-sm">
        Seu navegador não suporta notificações push.
      </p>
    );
  }

  if (status === "needs-install") {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">Notificações no iPhone</p>
        <p className="text-muted-foreground text-sm">
          Pra ativar, primeiro adicione o LifeRank à Tela de Início: toque em
          Compartilhar e depois em &quot;Adicionar à Tela de Início&quot;.
          Depois disso, abra o app pelo ícone que aparecer lá e volte nessa
          página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
        <div className="flex items-center gap-3">
          {subscribed ? (
            <Bell className="text-primary size-5" />
          ) : (
            <BellOff className="text-muted-foreground size-5" />
          )}
          <div>
            <p className="text-sm font-medium">Notificações push</p>
            <p className="text-muted-foreground text-xs">
              {subscribed
                ? "Ativadas neste dispositivo"
                : "Receba um aviso quando alguém do seu clube registrar uma atividade"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant={subscribed ? "outline" : "default"}
          size="sm"
          disabled={isPending}
          onClick={subscribed ? handleDisable : handleEnable}
        >
          {isPending ? "Aguarde..." : subscribed ? "Desativar" : "Ativar"}
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
