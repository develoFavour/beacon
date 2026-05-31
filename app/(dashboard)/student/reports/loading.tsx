import { ReportsPageSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Topbar } from '@/components/dashboard/topbar';

export default function StudentReportsLoading() {
  return (
    <>
      <Topbar title="My Reports" subtitle="Loading your submitted cases." />
      <ReportsPageSkeleton />
    </>
  );
}
