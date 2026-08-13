"use client";

import { useEffect, useState } from "react";
import { X, Share } from "lucide-react";
import { isIOS, isStandalone } from "@/lib/push-notifications";

const DISMISS_KEY = "liferank_ios_install_banner_dismissed";

export function IosInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isIOS() && !isStandalone() && !localStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="bg-primary/5 border-primary/20 relative flex items-start gap-3 rounded-xl border p-4 text-sm">
      <Share className="text-primary mt-0.5 size-4 shrink-0" />
      <div className="pr-6">
        <p className="font-medium">Instale o LifeRank no seu iPhone</p>
        <p className="text-muted-foreground mt-1">
          Toque em Compartilhar e depois em &quot;Adicionar à Tela de
          Início&quot; pra receber notificações quando o pessoal do seu clube
          registrar atividades.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar aviso"
        className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
