// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/lib/routes';

const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
const privateRoutes = [ROUTES.PROFILE];
const adminRoutes = [ROUTES.ADMIN];
const homeRoute = ROUTES.HOME;

const isMatch = (route: string, pathname: string) => {
  const normalizedRoute = route.endsWith('/') ? route.slice(0, -1) : route;
  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return normalizedPath === normalizedRoute || normalizedPath.startsWith(normalizedRoute + '/');
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('accessToken')?.value;

  // ĐỌC USER TỪ COOKIE
  const userData = req.cookies.get('userData')?.value;
  let userRole: 'admin' | 'user' | undefined;

  if (userData) {
    try {
      const user = JSON.parse(userData) as { role: 'admin' | 'user' };
      userRole = user.role;
    } catch {
      userRole = undefined;
    }
  }

  // Admin routes
  if (adminRoutes.some((r) => isMatch(r, pathname))) {
    if (!accessToken) {
      const url = new URL(ROUTES.LOGIN, req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL(homeRoute, req.url));
    }
    return NextResponse.next();
  }

  // Public routes
  if (publicRoutes.some((r) => isMatch(r, pathname))) {
    if (accessToken) {
      return NextResponse.redirect(new URL(homeRoute, req.url));
    }
    return NextResponse.next();
  }

  // Private routes
  if (privateRoutes.some((r) => isMatch(r, pathname))) {
    if (!accessToken) {
      const url = new URL(ROUTES.LOGIN, req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };