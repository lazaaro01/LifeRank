import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "O username deve ter pelo menos 3 caracteres")
  .max(20, "O username deve ter no máximo 20 caracteres")
  .regex(
    /^[a-z0-9_]+$/,
    "Use apenas letras minúsculas, números e underscore"
  );

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo"),
    username: usernameSchema,
    email: z.email("Email inválido"),
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: z.string().trim().optional().or(z.literal("")),
    bio: z.string().trim().max(280, "Bio muito longa").optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  avatarUrl: z.url("URL inválida").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().max(280, "Bio muito longa").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateAvatarSchema = z.object({
  avatarUrl: z
    .string()
    .max(2_000_000, "Imagem muito grande")
    .optional()
    .or(z.literal("")),
});

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
