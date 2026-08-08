import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { AvatarUploadForm } from "@/components/auth/avatar-upload-form";

export const metadata: Metadata = {
  title: "Foto de perfil | LifeRank",
};

export default async function RegisterPhotoPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const name = session.user.name ?? session.user.username;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader variant="minimal" />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-20">
        <div className="border-border/60 flex w-full max-w-sm flex-col items-center gap-2 rounded-xl border bg-white p-6 text-center shadow-sm sm:p-10">
          <h1 className="font-heading text-3xl uppercase">
            Adicione uma foto
          </h1>
          <p className="text-muted-foreground mb-4 text-sm text-balance">
            Deixe seu perfil com a sua cara antes de entrar no ranking.
          </p>
          <AvatarUploadForm name={name} />
        </div>
      </main>
    </div>
  );
}
