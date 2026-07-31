"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { updateAvatarAction } from "@/server/actions/profile.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_FILE_BYTES = 1_500_000;

type AvatarUploadFormProps = {
  name: string;
  currentAvatarUrl?: string | null;
  showSkip?: boolean;
  onSuccess?: () => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AvatarUploadForm({
  name,
  currentAvatarUrl,
  showSkip = true,
  onSuccess,
}: AvatarUploadFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setError("A imagem deve ter no máximo 1.5 MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const finish = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/dashboard");
    }
  };

  const handleContinue = () => {
    startTransition(async () => {
      const result = await updateAvatarAction({ avatarUrl: preview ?? "" });
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
      finish();
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative"
        aria-label="Escolher foto de perfil"
      >
        <Avatar size="lg" className="size-28">
          <AvatarImage src={preview ?? currentAvatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-2xl">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <span className="bg-primary text-primary-foreground absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full ring-2 ring-background">
          <Camera className="size-4" />
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex w-full flex-col gap-2">
        <Button
          type="button"
          className="w-full"
          disabled={isPending || !preview}
          onClick={handleContinue}
        >
          {isPending ? "Salvando..." : "Salvar foto"}
        </Button>
        {showSkip && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={isPending}
            onClick={finish}
          >
            Pular por agora
          </Button>
        )}
      </div>
    </div>
  );
}
