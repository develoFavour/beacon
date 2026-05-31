import { DashboardOverviewSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Topbar } from '@/components/dashboard/topbar';

export default function DashboardLoading() {
  return (
    <>
      <Topbar title="Loading dashboard" subtitle="Preparing your workspace." />
      <DashboardOverviewSkeleton />
    </>
  );
}
