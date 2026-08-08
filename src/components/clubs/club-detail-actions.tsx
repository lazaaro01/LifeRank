"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { leaveClubAction, deleteClubAction } from "@/server/actions/club.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

type ClubDetailActionsProps = {
  clubId: string;
  clubName: string;
  isOwner: boolean;
};

export function ClubDetailActions({
  clubId,
  clubName,
  isOwner,
}: ClubDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = isOwner
        ? await deleteClubAction(clubId)
        : await leaveClubAction(clubId);

      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/clubs");
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="destructive" className="rounded-full uppercase">
            {isOwner ? "Excluir clube" : "Sair do clube"}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isOwner ? `Excluir "${clubName}"?` : `Sair de "${clubName}"?`}
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {isOwner
            ? "Essa ação apaga o clube permanentemente para todos os membros e não pode ser desfeita."
            : "Você pode entrar de novo depois usando o código de convite."}
        </p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Aguarde..." : isOwner ? "Excluir clube" : "Sair do clube"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
