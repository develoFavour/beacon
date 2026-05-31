import React from 'react';
import { cookies } from 'next/headers';
import { Topbar } from '@/components/dashboard/topbar';
import { OfficerDashboardRoleSections } from '@/components/dashboard/officer-dashboard-role-sections';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { OfficerRoleConfig } from '@/lib/constants/officer-role.const';
import type { PaginatedHearings, PaginatedReports } from '@/lib/types';

export async function OfficerDashboardPage({ config }: { config: OfficerRoleConfig }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const [reportsResult, hearingsResult] = await Promise.all([
    serverFetchAPI<PaginatedReports>(`/reports?scope=${config.caseScope}&limit=50&sort=newest`, token),
    config.role === 'dean'
      ? serverFetchAPI<PaginatedHearings>('/hearings?limit=5&sort=upcoming', token)
      : Promise.resolve(null),
  ]);
  const reports = reportsResult.payload.data?.items ?? [];
  const hearings = hearingsResult?.payload.data?.items ?? [];

  return (
    <>
      <Topbar title={config.overviewTitle} subtitle={config.overviewSubtitle} />
      <OfficerDashboardRoleSections config={config} reports={reports} hearings={hearings} />
    </>
  );
}
