import { notFound } from 'next/navigation';
import { OfficerCaseDetailPage } from '@/components/dashboard/officer-case-detail-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleCaseDetailPage({
  params,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const { role, id } = await params;
  const config = getOfficerRoleConfig(role);
  if (!config) notFound();

  return <OfficerCaseDetailPage caseId={id} config={config} />;
}
