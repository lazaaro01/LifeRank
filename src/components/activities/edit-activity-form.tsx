"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createActivitySchema,
  type CreateActivityInput,
} from "@/utils/validators/activity.schema";
import { updateActivityAction } from "@/server/actions/activity.actions";
import { getIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActivityModel, CategoryModel } from "@/generated/prisma/models";

type EditActivityFormProps = {
  activity: ActivityModel;
  categories: CategoryModel[];
};

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function EditActivityForm({ activity, categories }: EditActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: activity.title,
      categoryId: activity.categoryId,
      quantity: activity.quantity,
      occurredAt: dateInputValue(activity.occurredAt),
    },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const onSubmit = (data: CreateActivityInput) => {
    setFormError(null);

    startTransition(async () => {
      const result = await updateActivityAction(activity.id, data);
      if (!result.success) {
        if (result.field) {
          setError(result.field as keyof CreateActivityInput, {
            message: result.error,
          });
        } else {
          setFormError(result.error);
        }
        return;
      }

      const parts: string[] = ["Atividade atualizada!"];
      if (result.leveledUp) parts.push("Você subiu de nível!");
      if (result.newAchievements.length > 0) {
        parts.push(
          `Conquista desbloqueada: ${result.newAchievements
            .map((a) => a.title)
            .join(", ")}`
        );
      }
      setFeedback(parts.join(" "));

      setTimeout(() => router.push("/activities"), 1200);
    });
  };

  if (feedback) {
    return (
      <p className="text-primary py-12 text-center text-lg font-medium">
        {feedback}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-muted-foreground text-xs uppercase">
          Nome da atividade
        </Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-muted-foreground text-xs uppercase">
          Escolha a categoria
        </Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = getIcon(category.icon);
                const isSelected = field.value === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => field.onChange(category.id)}
                    className={`flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-medium uppercase transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:border-foreground/30 border-border"
                    }`}
                  >
                    <Icon className="size-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.categoryId && (
          <p className="text-destructive text-sm">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="quantity"
            className="text-muted-foreground text-xs uppercase"
          >
            Quantidade{selectedCategory ? ` (${selectedCategory.unit})` : ""}
          </Label>
          <Input
            id="quantity"
            type="number"
            step="0.5"
            min="0"
            {...register("quantity", { valueAsNumber: true })}
          />
          {errors.quantity && (
            <p className="text-destructive text-sm">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="occurredAt"
            className="text-muted-foreground text-xs uppercase"
          >
            Data
          </Label>
          <Input id="occurredAt" type="date" {...register("occurredAt")} />
          {errors.occurredAt && (
            <p className="text-destructive text-sm">
              {errors.occurredAt.message}
            </p>
          )}
        </div>
      </div>

      {formError && <p className="text-destructive text-sm">{formError}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-full uppercase"
          onClick={() => router.push("/activities")}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1 rounded-full text-base uppercase"
          disabled={isPending}
        >
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
