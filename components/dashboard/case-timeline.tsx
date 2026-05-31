import React from 'react';
import type { CaseUpdate } from '@/lib/types';
import { StatusBadge } from './status-badge';
import type { ReportStatus } from '@/lib/types';

interface CaseTimelineProps {
  updates: CaseUpdate[];
}

export function CaseTimeline({ updates }: CaseTimelineProps) {
  if (updates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs font-bold text-muted-foreground">No investigation updates yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative">
      {/* Vertical connector line */}
      <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border"></div>
      
      {updates.map((update, index) => (
        <div key={update.id} className="relative pl-10 pb-6 last:pb-0">
          {/* Timeline dot */}
          <div className="absolute left-[10px] top-1 h-3 w-3 rounded-full border-2 border-background bg-accent z-10"></div>
          
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-extrabold text-foreground">{update.updatedBy}</span>
              <StatusBadge status={update.newStatus as ReportStatus} size="sm" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              {update.updateDetails}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground/60">
              {new Date(update.createdAt).toLocaleString('en-NG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
