"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createActivitySchema,
  type CreateActivityInput,
} from "@/utils/validators/activity.schema";
import { createActivityAction } from "@/server/actions/activity.actions";
import { getIcon } from "@/lib/icon-map";
import { CameraCapture } from "@/components/activities/camera-capture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryModel } from "@/generated/prisma/models";

type LogActivityFormProps = {
  categories: CategoryModel[];
};

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function LogActivityForm({ categories }: LogActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

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
      title: "",
      categoryId: categories[0]?.id ?? "",
      occurredAt: todayInputValue(),
    },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleCapture = (file: File) => {
    setPhotoError(null);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const onSubmit = (data: CreateActivityInput) => {
    setFormError(null);

    if (!photo) {
      setPhotoError("Tire uma foto para comprovar a atividade");
      return;
    }
    setPhotoError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("categoryId", data.categoryId);
      formData.set("title", data.title);
      formData.set("quantity", String(data.quantity));
      formData.set("occurredAt", data.occurredAt);
      formData.set("photo", photo);

      const result = await createActivityAction(formData);
      if (!result.success) {
        if (result.field === "photo") {
          setPhotoError(result.error);
        } else if (result.field) {
          setError(result.field as keyof CreateActivityInput, {
            message: result.error,
          });
        } else {
          setFormError(result.error);
        }
        return;
      }

      const parts: string[] = ["Atividade registrada!"];
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
        <Label className="text-muted-foreground text-xs uppercase">
          Foto de comprovação
        </Label>
        {photoPreview ? (
          <div className="relative overflow-hidden rounded-xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview}
              alt="Prévia da foto da atividade"
              className="h-56 w-full object-cover"
            />
            <button
              type="button"
              onClick={clearPhoto}
              aria-label="Remover foto"
              className="bg-foreground/70 text-background absolute top-3 right-3 flex size-8 items-center justify-center rounded-full"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <CameraCapture onCapture={handleCapture} />
        )}
        {photoError && <p className="text-destructive text-sm">{photoError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-muted-foreground text-xs uppercase">
          Nome da atividade
        </Label>
        <Input
          id="title"
          placeholder="Ex: treino pesado de manhã"
          {...register("title")}
        />
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

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full text-base uppercase"
        disabled={isPending}
      >
        {isPending ? "Registrando..." : "Registrar atividade"}
      </Button>
    </form>
  );
}
