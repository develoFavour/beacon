import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft, Calendar, Clock, ExternalLink, FileText, ImageIcon, MapPin, PlayCircle, ShieldAlert } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { CaseTimeline } from '@/components/dashboard/case-timeline';
import { EmptyState } from '@/components/dashboard/empty-state';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { CaseUpdate, CrimeReport, ReportEvidence } from '@/lib/types';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const [{ payload }, updatesResult] = await Promise.all([
    serverFetchAPI<CrimeReport>(`/reports/${id}`, token),
    serverFetchAPI<CaseUpdate[]>(`/reports/${id}/updates`, token),
  ]);
  const report = payload.data;
  const timeline = updatesResult.payload.data?.length ? updatesResult.payload.data : buildInitialTimeline(report);

  if (!payload.success || !report) {
    return (
      <>
        <Topbar title="Report Not Found" subtitle="We could not load this report." />
        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
          <div className="bg-card border border-border rounded-2xl">
            <EmptyState
              title="Unable to load report"
              description={payload.message || 'This report may not exist or you may not have access to it.'}
              action={
                <Link href={APP_ROUTES.STUDENT_REPORTS} className="text-xs font-bold text-primary hover:underline">
                  Return to reports
                </Link>
              }
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar
        title={`Report ${report.id}`}
        subtitle="Detailed view and investigation timeline."
      />

      <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
        <div className="flex-1 flex flex-col gap-6">
          <Link
            href={APP_ROUTES.STUDENT_REPORTS}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to All Reports
          </Link>

          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  Incident Type
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {report.crimeType}
                </h2>
              </div>
              <StatusBadge status={report.status} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border">
                <div className="h-10 w-10 rounded-full bg-accent/15 text-foreground flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                  <p className="text-sm font-extrabold text-foreground truncate">{report.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border">
                <div className="h-10 w-10 rounded-full bg-accent/15 text-foreground flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                    <p className="text-sm font-extrabold text-foreground">{report.dateOfIncident}</p>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time</p>
                    <p className="text-sm font-extrabold text-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {report.timeOfIncident}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                Detailed Description
              </h3>
              <p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            {(report.evidence?.length || report.evidenceUrl) && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                  Evidence
                </h3>
                <div className="flex flex-col gap-4">
                  {(report.evidence?.length ? report.evidence : legacyEvidence(report)).map((evidence) => (
                    <EvidencePreview key={evidence.id} evidence={evidence} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <h3 className="text-sm font-extrabold tracking-tight text-foreground bg-card border border-border rounded-2xl p-4 shadow-2xs">
            Investigation Timeline
          </h3>
          <div className="p-2">
            <CaseTimeline updates={timeline} />
          </div>
        </div>
      </div>
    </>
  );
}

function buildInitialTimeline(report?: CrimeReport): CaseUpdate[] {
  if (!report) return [];
  return [
    {
      id: `${report.id}-created`,
      reportId: report.id,
      updateDetails: 'Report submitted successfully and saved to the campus safety system.',
      newStatus: report.status,
      updatedBy: 'System',
      createdAt: report.createdAt,
    },
  ];
}

function legacyEvidence(report: CrimeReport): ReportEvidence[] {
  if (!report.evidenceUrl) return [];
  return [{
    id: `${report.id}-legacy-evidence`,
    reportId: report.id,
    fileUrl: report.evidenceUrl,
    resourceType: resourceTypeFromURL(report.evidenceUrl),
    bytes: 0,
    createdAt: report.createdAt,
  }];
}

function EvidencePreview({ evidence }: { evidence: ReportEvidence }) {
  const url = evidence.fileUrl;
  const resourceType = evidence.resourceType?.toLowerCase();
  const format = evidence.format?.toLowerCase();
  const isImage = resourceType === 'image';
  const isVideo = resourceType === 'video';
  const isPDF = format === 'pdf' || url.toLowerCase().includes('.pdf');

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Report evidence" className="w-full max-h-[420px] object-contain bg-black/5" />
      </a>
    );
  }

  if (isVideo) {
    return (
      <div className="flex flex-col gap-3">
        <video controls preload="metadata" className="w-full rounded-2xl border border-border bg-black max-h-[420px]">
          <source src={url} />
          Your browser cannot play this evidence video.
        </video>
        <EvidenceLink url={url} label="Open video evidence in a new tab" icon={PlayCircle} />
      </div>
    );
  }

  if (isPDF) {
    return <EvidenceLink url={url} label="Open PDF evidence" icon={FileText} />;
  }

  return <EvidenceLink url={url} label="Open evidence file" icon={ImageIcon} />;
}

function EvidenceLink({
  url,
  label,
  icon: Icon,
}: {
  url: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-sm font-bold text-foreground hover:bg-muted transition-colors"
    >
      <span className="flex items-center gap-3 min-w-0">
        <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
    </a>
  );
}

function resourceTypeFromURL(url: string) {
  const lowerURL = url.toLowerCase();
  if (lowerURL.includes('/video/upload/') || /\.(mp4|mov|webm)(\?|$)/.test(lowerURL)) return 'video';
  if (/\.pdf(\?|$)/.test(lowerURL)) return 'raw';
  return 'image';
}
