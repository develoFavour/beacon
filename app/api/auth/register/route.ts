import { type NextRequest } from 'next/server';
import { forwardJSON } from '@/lib/server/backend-api';

export async function POST(request: NextRequest) {
  return forwardJSON(request, '/auth/register');
}
