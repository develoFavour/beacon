import { AdminUsersPage } from '@/components/dashboard/admin-pages';
import type { AdminUserSearchParams } from '@/components/dashboard/admin-users-client';

export default async function AdminUsersRoute({
  searchParams,
}: {
  searchParams: Promise<AdminUserSearchParams>;
}) {
  return <AdminUsersPage params={await searchParams} />;
}
