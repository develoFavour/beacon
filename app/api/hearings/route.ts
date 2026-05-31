import { type NextRequest } from 'next/server';
import { forwardJSON } from '@/lib/server/backend-api';

export async function GET(request: NextRequest) {
  return forwardJSON(request, '/hearings');
}

export async function POST(request: NextRequest) {
  return forwardJSON(request, '/hearings');
}
