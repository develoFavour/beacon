import React from 'react';
import { cn } from '@/lib/utils';
import type { ReportStatus } from '@/lib/types';

const STATUS_CONFIG: Record<ReportStatus, { label: string; classes: string }> = {
  'pending': {
    label: 'Pending',
    classes: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  'under-investigation': {
    label: 'Under Investigation',
    classes: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'resolved': {
    label: 'Resolved',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  'closed': {
    label: 'Closed',
    classes: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  },
};

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['pending'];

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-full border whitespace-nowrap',
        config.classes,
        size === 'sm' && 'text-[10px] px-2.5 py-0.5',
        size === 'md' && 'text-xs px-3 py-1',
      )}
    >
      {config.label}
    </span>
  );
}
