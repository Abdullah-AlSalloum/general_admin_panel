import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { verifyAdminCredentials } from "@/lib/mock-data";

// ── Augment NextAuth types to include `role` ──────────────────────────────
declare module "next-auth" {
  interface User { role?: string }
  interface Session { user: { role?: string; id: string; name?: string | null; email?: string | null; image?: string | null } }
}
declare module "next-auth/jwt" {
  interface JWT { role?: string }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'dev-admin-panel-secret-change-in-production-2026',
  cookies: {
    sessionToken: {
      name: 'admin-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: { name: 'admin-callback-url', options: { sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' } },
    csrfToken: { name: 'admin-csrf-token', options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' } },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        return verifyAdminCredentials(String(credentials.email), String(credentials.password));
      },
    }),
  ],
  session: { strategy: "jwt" },
});

