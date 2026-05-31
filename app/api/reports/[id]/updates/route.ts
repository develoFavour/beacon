import { type NextRequest } from 'next/server';
import { forwardJSON } from '@/lib/server/backend-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardJSON(request, `/reports/${id}/updates`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardJSON(request, `/reports/${id}/updates`);
}
