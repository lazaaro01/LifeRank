"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteActivityAction } from "@/server/actions/activity.actions";
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

type ActivityRowActionsProps = {
  activityId: string;
  activityTitle: string;
};

export function ActivityRowActions({
  activityId,
  activityTitle,
}: ActivityRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteActivityAction(activityId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Editar atividade"
        onClick={() => router.push(`/activities/${activityId}/edit`)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Excluir atividade"
              className="text-destructive hover:text-destructive"
            />
          }
        >
          <Trash2 className="size-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir &quot;{activityTitle}&quot;?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Os pontos, XP e streak dessa atividade serão removidos do seu
            perfil. Essa ação não pode ser desfeita.
          </p>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancelar</Button>} />
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
