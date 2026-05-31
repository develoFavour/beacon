import { type NextRequest } from 'next/server';
import { backendApiUrl, loginResponse } from '@/lib/server/backend-api';
import type { APIResponse, User } from '@/lib/types';

export async function POST(request: NextRequest) {
  const response = await fetch(backendApiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: await request.text(),
    cache: 'no-store',
  });

  const payload = (await response.json()) as APIResponse<{ token: string; user: User }>;
  return loginResponse(payload, response.status);
}
