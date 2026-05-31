import { notFound } from 'next/navigation';
import { OfficerReportNewPage } from '@/components/dashboard/officer-report-new-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleNewFormalReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams: Promise<{ caseId?: string }>;
}) {
  const [{ role }, { caseId }] = await Promise.all([params, searchParams]);
  const config = getOfficerRoleConfig(role);
  if (!config) notFound();

  return (
    <OfficerReportNewPage
      caseId={caseId}
      title="New Formal Report"
      reportsHref={config.reportsHref}
      casesHref={config.casesHref}
      role={config.role}
    />
  );
}
