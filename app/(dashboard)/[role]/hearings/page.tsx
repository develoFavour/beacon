import { notFound } from 'next/navigation';
import { HearingsPage, type HearingSearchParams } from '@/components/dashboard/hearings-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleHearingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams: Promise<HearingSearchParams>;
}) {
  const [{ role }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const config = getOfficerRoleConfig(role);
  if (!config || config.role !== 'dean') notFound();

  return <HearingsPage params={resolvedSearchParams} />;
}
