import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/server/auth";
import { activityRepository } from "@/repositories/activity.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { EditActivityForm } from "@/components/activities/edit-activity-form";

export const metadata: Metadata = {
  title: "Editar atividade | LifeRank",
};

type EditActivityPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditActivityPage({ params }: EditActivityPageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const activity = await activityRepository.findById(id);
  if (!activity || activity.userId !== userId) {
    notFound();
  }

  const categories = await categoryRepository.listAvailableForUser(userId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl uppercase sm:text-4xl">
          Editar atividade
        </h1>
        <p className="text-muted-foreground text-sm">
          Ajuste os detalhes do registro. A foto de comprovação não muda.
        </p>
      </div>
      <EditActivityForm activity={activity} categories={categories} />
    </div>
  );
}
