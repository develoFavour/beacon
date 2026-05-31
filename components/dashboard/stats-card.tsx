import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;          // e.g. "+12% this month"
  variant?: 'default' | 'accent' | 'dark';
}

export function StatsCard({ label, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 flex flex-col gap-4 border shadow-2xs transition-colors',
        variant === 'default' && 'bg-card border-border',
        variant === 'accent' && 'bg-accent/10 border-accent/20',
        variant === 'dark' && 'bg-primary text-primary-foreground border-primary',
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center',
            variant === 'dark' ? 'bg-zinc-800 border border-zinc-700' : 'bg-accent/15',
          )}
        >
          <Icon className={cn('w-[18px] h-[18px]', variant === 'dark' ? 'text-accent' : 'text-foreground')} />
        </div>
        {trend && (
          <span className={cn(
            'text-[10px] font-bold px-2.5 py-1 rounded-full',
            variant === 'dark' ? 'bg-zinc-800 text-accent' : 'bg-accent/15 text-foreground',
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className={cn(
          'text-2xl font-black tracking-tight',
          variant === 'dark' ? 'text-white' : 'text-foreground',
        )}>
          {value}
        </p>
        <p className={cn(
          'text-[11px] font-bold mt-0.5',
          variant === 'dark' ? 'text-zinc-400' : 'text-muted-foreground',
        )}>
          {label}
        </p>
      </div>
    </div>
  );
}
