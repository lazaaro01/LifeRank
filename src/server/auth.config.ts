import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the Auth.js config (no Prisma/pg imports), used by
 * middleware. The full config in `auth.ts` adds the Credentials provider,
 * which needs Node.js APIs to hit the database.
 */
export default {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
} satisfies NextAuthConfig;
