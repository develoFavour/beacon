import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIES } from '@/lib/constants/auth.const';
import type { APIResponse, User } from '@/lib/types';

const DEFAULT_BACKEND_API_URL = 'http://localhost:8080/api';

export function backendApiUrl(path: string) {
  const baseURL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_API_URL).replace(/\/+$/, '');
  return `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status });
}

export async function forwardJSON(request: NextRequest, backendPath: string) {
  const headers = new Headers({
    accept: 'application/json',
    'content-type': 'application/json',
  });

  const token = request.cookies.get(AUTH_COOKIES.TOKEN)?.value;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const queryString = request.nextUrl.search;
  const response = await fetch(backendApiUrl(`${backendPath}${queryString}`), {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Backend returned a non-JSON response.',
    error: { code: 'NON_JSON_BACKEND_RESPONSE' },
  }));

  return jsonResponse(payload, response.status);
}

export async function serverFetchAPI<T>(path: string, token?: string) {
  const headers = new Headers({
    accept: 'application/json',
  });
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(backendApiUrl(path), {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => ({
    success: false,
    message: 'Backend returned a non-JSON response.',
    error: { code: 'NON_JSON_BACKEND_RESPONSE' },
  }))) as APIResponse<T>;

  return { response, payload };
}

export function setAuthCookies(response: NextResponse, token: string, user: User) {
  const secure = process.env.NODE_ENV === 'production';
  const commonOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  };

  response.cookies.set(AUTH_COOKIES.TOKEN, token, commonOptions);
  response.cookies.set(AUTH_COOKIES.USER_ID, user.id, commonOptions);
  response.cookies.set(AUTH_COOKIES.USER_NAME, user.fullName, commonOptions);
  response.cookies.set(AUTH_COOKIES.USER_ROLE, user.role, commonOptions);
}

export function clearAuthCookies(response: NextResponse) {
  Object.values(AUTH_COOKIES).forEach((cookieName) => {
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
  });
}

export function loginResponse(payload: APIResponse<{ token: string; user: User }>, status: number) {
  const response = jsonResponse(payload, status);
  if (payload.success && payload.data?.token && payload.data.user) {
    setAuthCookies(response, payload.data.token, payload.data.user);
  }
  return response;
}
