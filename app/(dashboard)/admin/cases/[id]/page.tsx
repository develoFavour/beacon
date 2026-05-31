import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { AdminCaseDetailPage } from '@/components/dashboard/admin-case-detail-page';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { CaseUpdate, CrimeReport } from '@/lib/types';

export default async function AdminCaseDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const [reportResult, timelineResult] = await Promise.all([
    serverFetchAPI<CrimeReport>(`/reports/${id}`, token),
    serverFetchAPI<CaseUpdate[]>(`/reports/${id}/updates`, token),
  ]);

  if (!reportResult.payload.success || !reportResult.payload.data) {
    notFound();
  }

  return <AdminCaseDetailPage report={reportResult.payload.data} timeline={timelineResult.payload.data ?? []} />;
}
