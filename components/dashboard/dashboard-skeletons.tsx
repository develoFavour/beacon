import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardOverviewSkeleton() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-7 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="hidden sm:block h-4 w-32" />
        </div>
        <ReportListSkeleton count={4} />
      </div>
    </div>
  );
}

export function ReportsPageSkeleton() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center rounded-2xl border border-border bg-card p-4">
        <Skeleton className="h-10 w-full sm:max-w-md rounded-xl" />
        <div className="flex gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 flex-1 sm:w-36 rounded-xl" />
          <Skeleton className="h-10 flex-1 sm:w-28 rounded-xl" />
        </div>
      </div>
      <ReportListSkeleton count={6} />
    </div>
  );
}

export function ReportDetailSkeleton() {
  return (
    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
      <div className="flex-1 flex flex-col gap-6">
        <Skeleton className="h-4 w-40" />
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-full max-w-md" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-7 w-36 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>

      <aside className="w-full lg:w-[430px] flex flex-col gap-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </aside>
    </div>
  );
}

export function HearingDetailSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <Skeleton className="h-4 w-36" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex flex-col gap-3 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full max-w-sm" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-7 w-32 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </section>
        <aside className="lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-5 md:p-6 flex flex-col gap-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReportListSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
