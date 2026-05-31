import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { EmptyState } from '@/components/dashboard/empty-state';
import { OfficerReportForm } from '@/components/dashboard/officer-report-form';
import type { OfficerRole } from '@/lib/constants/officer-role.const';

interface OfficerReportNewPageProps {
  caseId?: string;
  title: string;
  reportsHref: string;
  casesHref: string;
  role: OfficerRole;
}

export function OfficerReportNewPage({ caseId, title, reportsHref, casesHref, role }: OfficerReportNewPageProps) {
  if (!caseId) {
    return (
      <>
        <Topbar title={title} subtitle="Choose a closed case before writing a formal report." />
        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
          <div className="bg-card border border-border rounded-2xl">
            <EmptyState
              title="No case selected"
              description="Open a closed case and use the formal report action from there."
              action={<Link href={casesHref} className="text-xs font-bold text-primary hover:underline">View cases</Link>}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title={title} subtitle="Write a formal report attached to a closed case." />
      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
        <Link href={reportsHref} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to My Reports
        </Link>
        <OfficerReportForm caseId={caseId} role={role} reportsHref={reportsHref} />
      </div>
    </>
  );
}
