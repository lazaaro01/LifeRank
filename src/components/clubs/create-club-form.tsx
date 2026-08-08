"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Copy, Dumbbell, Briefcase, BookOpen } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createClubSchema,
  clubCategories,
  type CreateClubInput,
} from "@/utils/validators/club.schema";
import { createClubAction } from "@/server/actions/club.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categoryMeta: Record<
  (typeof clubCategories)[number],
  { label: string; icon: typeof Dumbbell }
> = {
  SPORTS: { label: "Esportes", icon: Dumbbell },
  STUDY: { label: "Estudos", icon: BookOpen },
  WORK: { label: "Trabalho", icon: Briefcase },
};

export function CreateClubForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ name: string; inviteCode: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateClubInput>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "SPORTS",
      isPrivate: false,
    },
  });

  const onSubmit = (data: CreateClubInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = await createClubAction(data);
      if (!result.success) {
        if (result.field) {
          setError(result.field as keyof CreateClubInput, {
            message: result.error,
          });
        } else {
          setFormError(result.error);
        }
        return;
      }
      setCreated({ name: data.name, inviteCode: result.inviteCode });
    });
  };

  const copyCode = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(created.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (created) {
    return (
      <div className="bg-muted border-primary/30 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-8 text-center">
        <p className="text-primary text-xs font-medium tracking-wide uppercase">
          Clube criado com sucesso
        </p>
        <p className="font-heading text-2xl uppercase">{created.name}</p>
        <div className="flex items-center gap-3">
          <span className="font-heading text-3xl tracking-[0.3em] sm:text-4xl">
            {created.inviteCode}
          </span>
          <button
            type="button"
            onClick={copyCode}
            aria-label="Copiar código de convite"
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
          </button>
        </div>
        <p className="text-muted-foreground text-sm">
          Compartilhe esse código com seu esquadrão para começar a dominar o
          ranking.
        </p>
        <Button render={<Link href="/clubs" />} className="mt-2 rounded-full px-8">
          Ver meus clubes
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-muted-foreground text-xs uppercase">
          Nome do clube
        </Label>
        <Input id="name" placeholder="Digite o nome do clube..." {...register("name")} />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-muted-foreground text-xs uppercase"
        >
          Descrição
        </Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="Descreva a missão do seu clube..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-muted-foreground text-xs uppercase">
          Categoria do clube
        </Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {clubCategories.map((value) => {
                const meta = categoryMeta[value];
                const Icon = meta.icon;
                const isSelected = field.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(value)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-6 py-4 text-sm font-medium uppercase transition-colors ${
                      isSelected
                        ? "border-primary text-primary"
                        : "text-muted-foreground border-border"
                    }`}
                  >
                    <Icon className="size-4" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="isPrivate"
        render={({ field }) => (
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className="bg-muted flex w-full items-center justify-between rounded-lg p-4 text-left"
          >
            <span>
              <span className="block text-sm font-medium uppercase">
                Clube privado
              </span>
              <span className="text-muted-foreground text-xs uppercase">
                Apenas membros convidados podem entrar
              </span>
            </span>
            <span
              className={`flex h-8 w-16 items-center rounded-full p-1 transition-colors ${
                field.value ? "bg-primary justify-end" : "bg-border justify-start"
              }`}
            >
              <span className="size-6 rounded-full bg-white" />
            </span>
          </button>
        )}
      />

      {formError && <p className="text-destructive text-sm">{formError}</p>}

      <div className="space-y-2">
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full text-base uppercase"
          disabled={isPending}
        >
          {isPending ? "Criando clube..." : "Criar e gerar código de convite"}
        </Button>
        <p className="text-muted-foreground text-center text-xs uppercase">
          Ao criar um clube você concorda com as regras do LifeRank.
        </p>
      </div>
    </form>
  );
}
