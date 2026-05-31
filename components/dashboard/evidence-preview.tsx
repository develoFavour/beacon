import React from 'react';
import { ExternalLink, FileText, ImageIcon, PlayCircle } from 'lucide-react';
import type { CrimeReport, ReportEvidence } from '@/lib/types';

export function reportEvidenceItems(report: CrimeReport): ReportEvidence[] {
  if (report.evidence?.length) return report.evidence;
  if (!report.evidenceUrl) return [];

  return [
    {
      id: `${report.id}-legacy-evidence`,
      reportId: report.id,
      fileUrl: report.evidenceUrl,
      resourceType: resourceTypeFromURL(report.evidenceUrl),
      bytes: 0,
      createdAt: report.createdAt,
    },
  ];
}

export function EvidencePreview({ evidence }: { evidence: ReportEvidence }) {
  const url = evidence.fileUrl;
  const resourceType = evidence.resourceType?.toLowerCase();
  const format = evidence.format?.toLowerCase();

  if (isPDFEvidence(format, url)) {
    return <EvidenceLink url={url} label="Open PDF evidence" icon={FileText} />;
  }

  if (resourceType === 'image') {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Report evidence" className="w-full max-h-[420px] object-contain bg-black/5" />
      </a>
    );
  }

  if (resourceType === 'video') {
    return (
      <div className="flex flex-col gap-3">
        <video controls preload="metadata" className="w-full rounded-2xl border border-border bg-black max-h-[420px]">
          <source src={url} />
          Your browser cannot play this evidence video.
        </video>
        <EvidenceLink url={url} label="Open video evidence" icon={PlayCircle} />
      </div>
    );
  }

  return <EvidenceLink url={url} label={format === 'pdf' ? 'Open PDF evidence' : 'Open evidence file'} icon={format === 'pdf' ? FileText : ImageIcon} />;
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
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-sm font-bold text-foreground hover:bg-muted transition-colors">
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

function isPDFEvidence(format: string | undefined, url: string) {
  return format === 'pdf' || /\.pdf($|\?)/i.test(url);
}
