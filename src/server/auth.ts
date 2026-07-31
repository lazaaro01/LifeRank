import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/server/auth.config";
import { loginSchema } from "@/utils/validators/auth.schema";
import { userService } from "@/services/user.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await userService.verifyCredentials(
          parsed.data.email,
          parsed.data.password
        );

        return user;
      },
    }),
  ],
});
