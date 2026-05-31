import { notFound } from 'next/navigation';
import { OfficerReportDetailPage } from '@/components/dashboard/officer-report-detail-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleFormalReportDetailPage({
  params,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const { role, id } = await params;
  const config = getOfficerRoleConfig(role);
  if (!config) notFound();

  return <OfficerReportDetailPage id={id} backHref={config.reportsHref} />;
}
