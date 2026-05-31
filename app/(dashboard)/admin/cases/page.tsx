import { AdminCasesPage } from '@/components/dashboard/admin-pages';
import type { AdminCaseSearchParams } from '@/components/dashboard/admin-cases-client';

export default async function AdminCasesRoute({
  searchParams,
}: {
  searchParams: Promise<AdminCaseSearchParams>;
}) {
  return <AdminCasesPage params={await searchParams} />;
}
