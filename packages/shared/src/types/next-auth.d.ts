import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the session and user types to include id, role, and organizationId

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      organizationId?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
    role?: string;
    organizationId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    organizationId?: string;
  }
}
