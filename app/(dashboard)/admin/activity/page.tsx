import { AdminActivityPage } from '@/components/dashboard/admin-pages';
import type { AdminActivitySearchParams } from '@/components/dashboard/admin-activity-client';

export default async function AdminActivityRoute({
  searchParams,
}: {
  searchParams: Promise<AdminActivitySearchParams>;
}) {
  return <AdminActivityPage params={await searchParams} />;
}
