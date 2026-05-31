import { AdminVerificationsPage } from '@/components/dashboard/admin-pages';
import type { AdminVerificationSearchParams } from '@/components/dashboard/admin-verifications-client';

export default async function AdminVerificationsRoute({
  searchParams,
}: {
  searchParams: Promise<AdminVerificationSearchParams>;
}) {
  return <AdminVerificationsPage params={await searchParams} />;
}
