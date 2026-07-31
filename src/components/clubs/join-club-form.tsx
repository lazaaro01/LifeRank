"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  joinClubSchema,
  type JoinClubInput,
} from "@/utils/validators/club.schema";
import { joinClubAction } from "@/server/actions/club.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JoinClubForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<JoinClubInput>({
    resolver: zodResolver(joinClubSchema),
    defaultValues: { inviteCode: "" },
  });

  const onSubmit = (data: JoinClubInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await joinClubAction(data);
      if (!result.success) {
        if (result.field) {
          setError(result.field as keyof JoinClubInput, {
            message: result.error,
          });
        } else {
          setFormError(result.error);
        }
        return;
      }
      reset();
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
      noValidate
    >
      <div className="flex-1">
        <Input
          placeholder="Código de convite (ex: LR-99X-2024)"
          className="uppercase"
          {...register("inviteCode")}
        />
        {errors.inviteCode && (
          <p className="text-destructive mt-1 text-sm">
            {errors.inviteCode.message}
          </p>
        )}
        {formError && (
          <p className="text-destructive mt-1 text-sm">{formError}</p>
        )}
      </div>
      <Button type="submit" className="rounded-full" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar no clube"}
      </Button>
    </form>
  );
}
