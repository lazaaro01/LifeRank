import { z } from "zod";

export const createActivitySchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),
  title: z.string().trim().min(2, "Dê um título pra atividade").max(120),
  quantity: z.number().positive("Informe uma quantidade válida"),
  occurredAt: z.string().min(1, "Informe a data"),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
