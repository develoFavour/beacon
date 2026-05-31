import { ReportDetailSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Topbar } from '@/components/dashboard/topbar';

export default function StudentReportDetailLoading() {
  return (
    <>
      <Topbar title="Loading report" subtitle="Preparing report details and timeline." />
      <ReportDetailSkeleton />
    </>
  );
}
