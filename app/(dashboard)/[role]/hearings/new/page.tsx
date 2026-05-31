import { notFound } from 'next/navigation';
import { HearingNewPage } from '@/components/dashboard/hearing-new-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleNewHearingPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const config = getOfficerRoleConfig(role);
  if (!config || config.role !== 'dean') notFound();

  return <HearingNewPage />;
}
