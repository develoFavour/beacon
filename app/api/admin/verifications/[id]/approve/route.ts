import { type NextRequest } from 'next/server';
import { forwardJSON } from '@/lib/server/backend-api';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forwardJSON(request, `/admin/verifications/${id}/approve`);
}
