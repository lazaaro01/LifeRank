"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/utils/validators/auth.schema";
import { updateProfileAction } from "@/server/actions/profile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EditProfileFormProps = {
  defaultValues: UpdateProfileInput;
};

export function EditProfileForm({ defaultValues }: EditProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  const onSubmit = (data: UpdateProfileInput) => {
    setStatus("idle");
    setFormError(null);
    startTransition(async () => {
      const result = await updateProfileAction(data);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setFormError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (opcional)</Label>
        <Textarea id="bio" rows={3} {...register("bio")} />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}
      {status === "success" && (
        <p className="text-sm text-emerald-600">Perfil atualizado.</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
