import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { EmptyState } from '@/components/dashboard/empty-state';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { OfficerReport } from '@/lib/types';

interface OfficerReportDetailPageProps {
  id: string;
  backHref: string;
}

export async function OfficerReportDetailPage({ id, backHref }: OfficerReportDetailPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const { payload } = await serverFetchAPI<OfficerReport>(`/officer-reports/${id}`, token);
  const report = payload.data;

  if (!payload.success || !report) {
    return (
      <>
        <Topbar title="Report Not Found" subtitle="We could not load this formal report." />
        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
          <div className="bg-card border border-border rounded-2xl">
            <EmptyState title="Unable to load formal report" description={payload.message || 'This report may not exist or you may not have access.'} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title={report.title} subtitle={`Prepared for ${report.recipient}.`} />
      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
        <Link href={backHref} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to My Reports
        </Link>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xs flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <Info label="Case" value={report.caseTitle || report.reportId} />
            <Info label="Recipient" value={report.recipient} />
            <Info label="Author" value={report.authorName || report.authorRole.toUpperCase()} />
            <Info label="Created" value={new Date(report.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })} />
          </div>

          <ReportSection title="Summary" value={report.summary} />
          <ReportSection title="Findings" value={report.findings} />
          <ReportSection title="Recommendations" value={report.recommendations} />

          {report.attachmentUrl && (
            <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-sm font-bold text-foreground hover:bg-muted transition-colors">
              <span className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Open attachment
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}

function ReportSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-extrabold text-foreground border-b border-border pb-2">{title}</h2>
      <p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
    </section>
  );
}
