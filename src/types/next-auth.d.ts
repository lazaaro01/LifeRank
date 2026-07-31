import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    avatarUrl: string | null;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      avatarUrl: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    username: string;
    avatarUrl: string | null;
  }
}
