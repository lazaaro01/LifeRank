"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/utils/validators/auth.schema";
import { loginAction } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await loginAction(data);
      if (!result.success) {
        setFormError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-muted-foreground text-xs uppercase">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="bg-muted h-auto border-transparent px-5 py-4 text-base"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-muted-foreground text-xs uppercase"
          >
            Senha
          </Label>
          <span className="text-primary text-xs uppercase">
            Esqueceu a senha?
          </span>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="bg-muted h-auto border-transparent px-5 py-4 text-base"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      {formError && <p className="text-destructive text-sm">{formError}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full text-lg uppercase"
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar no clube"}
        <LogIn className="size-4" />
      </Button>

      <p className="text-muted-foreground text-center text-sm uppercase">
        Ainda não tem conta?{" "}
        <Link href="/register" className="text-primary font-medium">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
