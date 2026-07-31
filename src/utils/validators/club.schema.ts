import { z } from "zod";

export const clubCategories = ["SPORTS", "STUDY", "WORK"] as const;

export const createClubSchema = z.object({
  name: z.string().trim().min(3, "Dê um nome ao clube").max(60),
  description: z.string().trim().max(280, "Descrição muito longa").optional().or(z.literal("")),
  category: z.enum(clubCategories, "Selecione uma categoria"),
  isPrivate: z.boolean(),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;

export const joinClubSchema = z.object({
  inviteCode: z.string().trim().min(1, "Informe o código de convite"),
});

export type JoinClubInput = z.infer<typeof joinClubSchema>;
