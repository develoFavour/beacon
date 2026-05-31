import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowRight, CalendarDays, ExternalLink, FileText, MapPin, Paperclip, Send, UserRound } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import { buildOfficerReportDetailHref, type OfficerRole } from '@/lib/constants/officer-role.const';
import type { OfficerReport } from '@/lib/types';

interface OfficerReportListPageProps {
  title: string;
  subtitle: string;
  role: OfficerRole;
  casesHref: string;
}

export async function OfficerReportListPage({ title, subtitle, role, casesHref }: OfficerReportListPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const { payload } = await serverFetchAPI<OfficerReport[]>('/officer-reports', token);
  const reports = payload.data ?? [];
  const attachedReports = reports.filter((report) => report.attachmentUrl).length;
  const latestReport = reports[0];

  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
        {reports.length > 0 ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ReportMetric label="Formal Reports" value={reports.length} icon={FileText} tone="dark" />
              <ReportMetric label="With Attachments" value={attachedReports} icon={Paperclip} />
              <ReportMetric label="Latest Submission" value={latestReport ? formatDate(latestReport.createdAt) : 'None'} icon={CalendarDays} />
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Formal Reports Registry</h2>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">
                    {reports.length} {reports.length === 1 ? 'report' : 'reports'} written and attached to closed cases.
                  </p>
                </div>
                <Link href={casesHref} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 transition-opacity">
                  View Closed Cases
                  <ArrowRight className="w-4 h-4 text-accent" />
                </Link>
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Report</TableHead>
                      <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Case</TableHead>
                      <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Recipient</TableHead>
                      <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Attachment</TableHead>
                      <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Submitted</TableHead>
                      <TableHead className="px-5 py-3 text-right text-[10px] font-black uppercase text-muted-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <ReportTableRow key={report.id} report={report} href={buildOfficerReportDetailHref(role, report.id)} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden divide-y divide-border">
                {reports.map((report) => (
                  <ReportMobileItem key={report.id} report={report} href={buildOfficerReportDetailHref(role, report.id)} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl">
            <EmptyState
              title={payload.success ? 'No formal reports yet' : 'Unable to load formal reports'}
              description={payload.success ? 'After closing a case, write a formal report from the case detail page.' : payload.message}
              icon={FileText}
              action={
                <Link href={casesHref} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                  View Cases
                </Link>
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

function ReportTableRow({ report, href }: { report: OfficerReport; href: string }) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="px-5 py-4 align-top">
        <div className="max-w-[340px]">
          <Link href={href} className="text-sm font-extrabold text-foreground hover:underline underline-offset-4 line-clamp-1">
            {report.title}
          </Link>
          <p className="text-xs font-semibold text-muted-foreground mt-1 line-clamp-2 whitespace-normal">{report.summary}</p>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 align-top">
        <div className="flex items-start gap-2 max-w-[240px]">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{report.caseTitle || report.reportId}</p>
            {report.caseLocation && <p className="text-[11px] font-semibold text-muted-foreground mt-0.5 truncate">{report.caseLocation}</p>}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 align-top">
        <div className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-3 py-1.5">
          <Send className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground">{report.recipient}</span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 align-top">
        <span className={report.attachmentUrl ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-black uppercase' : 'inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground border border-border px-2.5 py-1 text-[10px] font-black uppercase'}>
          <Paperclip className="w-3 h-3" />
          {report.attachmentUrl ? 'Attached' : 'None'}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4 align-top">
        <p className="text-xs font-extrabold text-foreground">{formatDate(report.createdAt)}</p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{formatTime(report.createdAt)}</p>
      </TableCell>
      <TableCell className="px-5 py-4 align-top text-right">
        <Link href={href} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors" aria-label={`Open ${report.title}`}>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
}

function ReportMobileItem({ report, href }: { report: OfficerReport; href: string }) {
  return (
    <Link href={href} className="block p-5 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold text-foreground line-clamp-1">{report.title}</h3>
          <p className="text-xs font-semibold text-muted-foreground mt-1 line-clamp-2">{report.summary}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 text-[11px] font-bold text-muted-foreground">
        <span className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{report.caseTitle || report.reportId}</span>
        </span>
        <span className="flex items-center gap-2">
          <UserRound className="w-3.5 h-3.5 shrink-0" />
          {report.recipient}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          {formatDate(report.createdAt)}
        </span>
      </div>
    </Link>
  );
}

function ReportMetric({
  label,
  value,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: 'default' | 'dark';
}) {
  return (
    <div className={tone === 'dark' ? 'rounded-2xl p-5 bg-primary text-primary-foreground border border-primary shadow-2xs' : 'rounded-2xl p-5 bg-card border border-border shadow-2xs'}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={tone === 'dark' ? 'text-2xl font-black tracking-tight text-white' : 'text-2xl font-black tracking-tight text-foreground'}>{value}</p>
          <p className={tone === 'dark' ? 'text-[11px] font-bold text-zinc-400 mt-0.5' : 'text-[11px] font-bold text-muted-foreground mt-0.5'}>{label}</p>
        </div>
        <div className={tone === 'dark' ? 'h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center' : 'h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center'}>
          <Icon className={tone === 'dark' ? 'w-[18px] h-[18px] text-accent' : 'w-[18px] h-[18px] text-foreground'} />
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
