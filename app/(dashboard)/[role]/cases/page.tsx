import { notFound } from 'next/navigation';
import { OfficerCasesPage, type CaseSearchParams } from '@/components/dashboard/officer-cases-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleCasesPage({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams: Promise<CaseSearchParams>;
}) {
  const [{ role }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const config = getOfficerRoleConfig(role);
  if (!config) notFound();

  return <OfficerCasesPage config={config} params={resolvedSearchParams} />;
}
