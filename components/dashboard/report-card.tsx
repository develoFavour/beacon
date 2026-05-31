import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { StatusBadge } from './status-badge';
import type { CrimeReport } from '@/lib/types';

interface ReportCardProps {
  report: CrimeReport;
  href: string;
}

export function ReportCard({ report, href }: ReportCardProps) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-foreground/20 transition-colors group shadow-2xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-foreground truncate group-hover:underline decoration-accent">
            {report.crimeType}
          </h3>
          <p className="text-xs font-semibold text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {report.description}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground min-w-0">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            {report.location}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            {report.dateOfIncident}
          </span>
        </div>
        <StatusBadge status={report.status} />
      </div>
    </Link>
  );
}
