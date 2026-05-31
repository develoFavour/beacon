import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIES } from './lib/constants/auth.const';
import {
  allowedRolesForPath,
  APP_ROUTES,
  isAuthRoute,
  isProtectedRoute,
  ROLE_HOME_ROUTES,
  type RouteRole,
} from './lib/constants/routes.const';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
  const role = request.cookies.get(AUTH_COOKIES.USER_ROLE)?.value as RouteRole | undefined;

  if (isAuthRoute(pathname) && token && role) {
    return NextResponse.redirect(new URL(ROLE_HOME_ROUTES[role] || APP_ROUTES.STUDENT_DASHBOARD, request.url));
  }

  if (isProtectedRoute(pathname)) {
    if (!token) {
      const loginUrl = new URL(APP_ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const allowedRoles = allowedRolesForPath(pathname);
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      return NextResponse.redirect(new URL(ROLE_HOME_ROUTES[role || 'student'], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
