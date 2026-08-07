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
        <Avatar className="border-primary size-32 border-4 sm:size-44 lg:size-56">
          <AvatarImage src={avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-3xl sm:text-5xl">
            {initials(name)}
          </AvatarFallback>
        </Avatar>

        <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                aria-label="Alterar foto"
                className="bg-primary text-primary-foreground ring-background absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full ring-4 sm:right-4 sm:bottom-4 sm:size-12"
              >
                <Pencil className="size-3 sm:size-4" />
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

      <h1 className="font-heading text-3xl uppercase sm:text-5xl lg:text-7xl">
        {name}
      </h1>
      <p className="text-primary text-base font-medium break-all sm:text-xl lg:text-2xl">
        {email}
      </p>

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
