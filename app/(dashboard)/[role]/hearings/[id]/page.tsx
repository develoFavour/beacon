import { notFound } from 'next/navigation';
import { HearingDetailPage } from '@/components/dashboard/hearing-detail-page';
import { getOfficerRoleConfig } from '@/lib/constants/officer-role.const';

export default async function RoleHearingDetailPage({
  params,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const { role, id } = await params;
  const config = getOfficerRoleConfig(role);
  if (!config || config.role !== 'dean') notFound();

  return <HearingDetailPage hearingId={id} />;
}
