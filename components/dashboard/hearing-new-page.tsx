import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { HearingScheduleForm } from '@/components/dashboard/hearing-schedule-form';
import { APP_ROUTES } from '@/lib/constants/routes.const';

export function HearingNewPage() {
  return (
    <>
      <Topbar title="New Panel Hearing" subtitle="Schedule a disciplinary panel meeting." />

      <div className="p-6 md:p-8 max-w-3xl mx-auto w-full flex flex-col gap-6">
        <Link href={APP_ROUTES.DEAN_HEARINGS} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Hearings
        </Link>

        <HearingScheduleForm />
      </div>
    </>
  );
}
