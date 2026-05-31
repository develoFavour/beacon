import { notFound } from 'next/navigation';
import { OfficerDashboardPage } from '@/components/dashboard/officer-dashboard-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const config = getOfficerRoleConfig(role);
  if (!config) notFound();

  return <OfficerDashboardPage config={config} />;
}
