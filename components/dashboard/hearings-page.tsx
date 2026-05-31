import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { CalendarDays, CalendarPlus, ExternalLink, Search } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { EmptyState } from '@/components/dashboard/empty-state';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { HearingStatus, PaginatedHearings, PanelHearing } from '@/lib/types';

export type HearingSearchParams = {
  page?: string;
  status?: string;
  q?: string;
  sort?: string;
};

export async function HearingsPage({ params }: { params: HearingSearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildHearingQuery(params);
  const { payload } = await serverFetchAPI<PaginatedHearings>(`/hearings?${query}`, token);
  const paginated = payload.data;
  const hearings = paginated?.items ?? [];

  return (
    <>
      <Topbar title="Panel Hearings" subtitle="Manage scheduled disciplinary panel meetings." />

      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-5 min-w-0">
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <h2 className="text-sm font-extrabold text-foreground">Hearings Registry</h2>
              <p className="text-xs font-semibold text-muted-foreground mt-1">View upcoming panel meetings and filter by status, student, charge, or location.</p>
            </div>
            <Link href={APP_ROUTES.DEAN_NEW_HEARING} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 transition-opacity">
              <CalendarPlus className="w-4 h-4 text-accent" />
              New Hearing
            </Link>
          </div>

          <HearingFilters params={params} />

          <div className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold text-foreground">Upcoming Hearings</h2>
                <p className="text-xs font-semibold text-muted-foreground mt-1">
                  {paginated?.total ?? 0} {(paginated?.total ?? 0) === 1 ? 'meeting' : 'meetings'} found.
                </p>
              </div>
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
            </div>

            {hearings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr className="text-[10px] uppercase text-muted-foreground font-black">
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Charge</th>
                      <th className="px-5 py-3">Schedule</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {hearings.map((hearing) => <HearingRow key={hearing.id} hearing={hearing} />)}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title={payload.success ? 'No hearings found' : 'Unable to load hearings'}
                description={payload.success ? 'Scheduled panel meetings will appear here.' : payload.message}
                icon={CalendarDays}
              />
            )}
          </div>

          {payload.success && paginated && paginated.totalPages > 1 && (
            <PaginationControls params={params} page={paginated.page} totalPages={paginated.totalPages} />
          )}
        </div>
      </div>
    </>
  );
}

function HearingRow({ hearing }: { hearing: PanelHearing }) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-5 py-4">
        <p className="text-sm font-extrabold text-foreground">{hearing.studentName}</p>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">{hearing.studentIdentifier}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-xs font-bold text-foreground max-w-[220px]">{hearing.charge}</p>
        {hearing.notes && <p className="text-[11px] font-semibold text-muted-foreground mt-1 line-clamp-1">{hearing.notes}</p>}
      </td>
      <td className="px-5 py-4">
        <p className="text-xs font-extrabold text-foreground">{hearing.hearingDate}</p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{hearing.hearingTime}</p>
      </td>
      <td className="px-5 py-4 text-xs font-bold text-muted-foreground">{hearing.location}</td>
      <td className="px-5 py-4">
        <span className={statusClasses(hearing.status)}>{statusLabel(hearing.status)}</span>
      </td>
      <td className="px-5 py-4 text-right">
        <Link href={APP_ROUTES.DEAN_HEARING_DETAIL(hearing.id)} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors" aria-label={`Open hearing for ${hearing.studentName}`}>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
}

function HearingFilters({ params }: { params: HearingSearchParams }) {
  return (
    <form action="/dean/hearings" className="bg-card border border-border p-4 rounded-2xl grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto] gap-3 shadow-2xs">
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input name="q" defaultValue={params.q || ''} placeholder="Search student, charge, location..." className="w-full bg-background border border-border text-foreground py-2.5 pl-9 pr-3 rounded-xl text-xs font-semibold" />
      </div>
      <select name="status" defaultValue={params.status || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="pending_evidence">Pending Evidence</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select name="sort" defaultValue={params.sort || 'upcoming'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="upcoming">Upcoming first</option>
        <option value="newest">Newest created</option>
      </select>
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Apply</button>
    </form>
  );
}

function PaginationControls({ params, page, totalPages }: { params: HearingSearchParams; page: number; totalPages: number }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
      <Link href={hrefWithParams(params, { page: String(Math.max(1, page - 1)) })} className="text-xs font-bold text-foreground hover:underline">Previous</Link>
      <span className="text-xs font-bold text-muted-foreground">Page {page} of {totalPages}</span>
      <Link href={hrefWithParams(params, { page: String(Math.min(totalPages, page + 1)) })} className="text-xs font-bold text-foreground hover:underline">Next</Link>
    </div>
  );
}

function buildHearingQuery(params: HearingSearchParams) {
  const query = new URLSearchParams();
  query.set('page', params.page || '1');
  query.set('limit', '10');
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.q) query.set('q', params.q);
  query.set('sort', params.sort || 'upcoming');
  return query.toString();
}

function hrefWithParams(params: HearingSearchParams, next: Record<string, string>) {
  const query = new URLSearchParams();
  Object.entries({ ...params, ...next }).forEach(([key, value]) => {
    if (value && value !== 'all') query.set(key, value);
  });
  const queryString = query.toString();
  return queryString ? `/dean/hearings?${queryString}` : '/dean/hearings';
}

function statusLabel(status: HearingStatus) {
  return status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

function statusClasses(status: HearingStatus) {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase';
  if (status === 'scheduled') return `${base} bg-blue-100 text-blue-800 border-blue-200`;
  if (status === 'pending_evidence') return `${base} bg-amber-100 text-amber-800 border-amber-200`;
  if (status === 'completed') return `${base} bg-emerald-100 text-emerald-800 border-emerald-200`;
  return `${base} bg-zinc-100 text-zinc-800 border-zinc-200`;
}
