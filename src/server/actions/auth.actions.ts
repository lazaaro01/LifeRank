"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/server/auth";
import { registerSchema, loginSchema } from "@/utils/validators/auth.schema";
import { userService } from "@/services/user.service";
import { ServiceError } from "@/services/errors";

type ActionResult =
  | { success: true }
  | { success: false; error: string; field?: string };

export async function registerAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    await userService.register(parsed.data);
  } catch (error) {
    if (error instanceof ServiceError) {
      return { success: false, error: error.message, field: error.field };
    }
    return { success: false, error: "Não foi possível criar a conta" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Account was created but auto sign-in failed; ask the user to log in manually.
      return { success: true };
    }
    throw error;
  }

  redirect("/register/photo");
}

export async function loginAction(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Email ou senha incorretos" };
    }
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("[loginAction] Falha inesperada ao entrar:", error);
    return {
      success: false,
      error: "Erro inesperado ao entrar. Tente novamente em instantes.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
