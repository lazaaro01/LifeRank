"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AvatarUploadForm } from "@/components/auth/avatar-upload-form";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import type { UpdateProfileInput } from "@/utils/validators/auth.schema";

type ProfileHeaderProps = {
  name: string;
  email: string;
  avatarUrl: string | null;
  editDefaultValues: UpdateProfileInput;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileHeader({
  name,
  email,
  avatarUrl,
  editDefaultValues,
}: ProfileHeaderProps) {
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 pb-8 text-center">
      <div className="relative mb-4">
        <Avatar className="border-primary size-56 border-4">
          <AvatarImage src={avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-5xl">
            {initials(name)}
          </AvatarFallback>
        </Avatar>

        <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                aria-label="Alterar foto"
                className="bg-primary text-primary-foreground ring-background absolute right-4 bottom-4 flex size-12 items-center justify-center rounded-full ring-4"
              >
                <Pencil className="size-4" />
              </button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar foto de perfil</DialogTitle>
            </DialogHeader>
            <AvatarUploadForm
              name={name}
              currentAvatarUrl={avatarUrl}
              showSkip={false}
              onSuccess={() => setAvatarOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <h1 className="font-heading text-5xl uppercase sm:text-7xl">{name}</h1>
      <p className="text-primary text-xl font-medium sm:text-2xl">{email}</p>

      <Dialog>
        <DialogTrigger
          render={
            <Button variant="outline" className="mt-4 rounded-full uppercase">
              Editar perfil
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <EditProfileForm defaultValues={editDefaultValues} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
