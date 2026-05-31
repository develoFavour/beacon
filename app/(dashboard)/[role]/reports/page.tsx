import { notFound } from 'next/navigation';
import { OfficerReportListPage } from '@/components/dashboard/officer-report-list-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleFormalReportsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const config = getOfficerRoleConfig(role);
  if (!config) notFound();

  return (
    <OfficerReportListPage
      title="My Reports"
      subtitle={`Formal ${config.label}-written reports attached to closed cases.`}
      role={config.role}
      casesHref={config.casesHref}
    />
  );
}
