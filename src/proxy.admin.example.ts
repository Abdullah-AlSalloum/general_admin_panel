import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Admin auth — reads admin-session-token, protects /admin/*
const adminAuth = NextAuth(authConfig).auth;

// Customer auth config (edge-compatible, no DB calls)
const customerNextAuth = NextAuth({
  basePath: '/api/customer-auth',
  cookies: {
    sessionToken: { name: 'customer-session-token', options: { httpOnly: true, sameSite: 'lax', path: '/' } },
    callbackUrl: { name: 'customer-callback-url', options: { sameSite: 'lax', path: '/' } },
    csrfToken: { name: 'customer-csrf-token', options: { httpOnly: true, sameSite: 'lax', path: '/' } },
  },
  callbacks: {
    jwt({ token }) { return token; },
    session({ session, token }) {
      if (session.user && token.role) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth: session }) {
      const role = (session?.user as { role?: string } | undefined)?.role;
      return role === 'customer';
    },
  },
  providers: [],
  pages: { signIn: '/login' },
});

const customerAuth = customerNextAuth.auth;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return adminAuth(request as any);
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/my-projects')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return customerAuth(request as any);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/my-projects/:path*"],
};
