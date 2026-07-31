"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { User, AtSign, Mail, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterInput,
} from "@/utils/validators/auth.schema";
import { registerAction } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FieldIcon({ icon: Icon }: { icon: typeof User }) {
  return (
    <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
  );
}

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await registerAction(data);
      if (!result.success) {
        if (result.field) {
          setError(result.field as keyof RegisterInput, {
            message: result.error,
          });
        } else {
          setFormError(result.error);
        }
      }
    });
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground text-xs uppercase">
            Nome completo
          </Label>
          <div className="relative">
            <FieldIcon icon={User} />
            <Input
              id="name"
              autoComplete="name"
              placeholder="João Silva"
              className="bg-muted h-auto border-transparent py-4 pr-4 pl-11 text-base"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-muted-foreground text-xs uppercase"
          >
            Username
          </Label>
          <div className="relative">
            <FieldIcon icon={AtSign} />
            <Input
              id="username"
              autoComplete="username"
              placeholder="joao_elite"
              className="bg-muted h-auto border-transparent py-4 pr-4 pl-11 text-base"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="text-destructive text-sm">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground text-xs uppercase">
            Email
          </Label>
          <div className="relative">
            <FieldIcon icon={Mail} />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="campeao@liferank.com"
              className="bg-muted h-auto border-transparent py-4 pr-4 pl-11 text-base"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-muted-foreground text-xs uppercase"
          >
            Senha
          </Label>
          <div className="relative">
            <FieldIcon icon={Lock} />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="bg-muted h-auto border-transparent py-4 pr-4 pl-11 text-base"
              {...register("password")}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Deve ter pelo menos 8 caracteres.
          </p>
          {errors.password && (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-muted-foreground text-xs uppercase"
          >
            Confirmar senha
          </Label>
          <div className="relative">
            <FieldIcon icon={Lock} />
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="bg-muted h-auto border-transparent py-4 pr-4 pl-11 text-base"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {formError && <p className="text-destructive text-sm">{formError}</p>}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full uppercase shadow-lg"
          disabled={isPending}
        >
          {isPending ? "Criando perfil..." : "Criar meu perfil"}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-medium">
            Entrar
          </Link>
        </p>
      </form>

      <div className="flex items-center justify-center gap-2 opacity-60">
        <ShieldCheck className="size-4" />
        <span className="text-xs tracking-wide">
          Criptografia de ponta a ponta
        </span>
      </div>
    </div>
  );
}
