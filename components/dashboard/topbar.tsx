'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useDashboardNav } from '@/components/dashboard/dashboard-shell';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { openMobileNav } = useDashboardNav();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={openMobileNav}
          className="lg:hidden p-2 rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer shrink-0"
          aria-label="Open dashboard navigation"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base md:text-xl font-extrabold tracking-tight text-foreground leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-[10px] md:text-[11px] font-semibold text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button className="relative p-2.5 rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent"></span>
        </button>
      </div>
    </header>
  );
}
