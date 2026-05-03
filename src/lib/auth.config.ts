// Edge-compatible auth config — no Prisma imports
import type { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
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
  callbacks: {
    // Persist role from authorize() into the JWT token
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    // Expose role + id on the session object
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role;
        if (token.sub) session.user.id = token.sub;
      }
      return session;
    },
    // Guard /admin/* routes — only admins may pass
    authorized({ auth, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        const role = (auth?.user as { role?: string } | undefined)?.role;
        if (role !== "admin") {
          return Response.redirect(new URL("/admin/login", nextUrl));
        }
      }

      return true;
    },
  },
  providers: [], // providers defined in auth.ts (uses Prisma, Node.js only)
};
export default authConfig;