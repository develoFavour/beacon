import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Plus } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { ReportCard } from '@/components/dashboard/report-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { PaginatedReports } from '@/lib/types';

export default async function StudentReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildReportQuery(params);
  const { payload } = await serverFetchAPI<PaginatedReports>(`/reports?${query}`, token);
  const paginated = payload.data;
  const reports = payload.success ? paginated?.items || [] : [];

  return (
    <>
      <Topbar
        title="My Reports"
        subtitle="A complete history of all incident reports you have filed."
      />

      <div className="p-6 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border p-4 rounded-2xl shadow-2xs">
          <div>
            <h2 className="text-sm font-extrabold text-foreground">Submitted Reports</h2>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {paginated?.total ?? 0} {(paginated?.total ?? 0) === 1 ? 'case' : 'cases'} found for your account.
            </p>
          </div>
          <Link
            href={APP_ROUTES.STUDENT_NEW_REPORT}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 text-accent" />
            New Report
          </Link>
        </div>

        <ReportFilters basePath={APP_ROUTES.STUDENT_REPORTS} params={params} />

        {payload.success ? (
          reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  href={APP_ROUTES.STUDENT_REPORT_DETAIL(report.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl mt-4">
              <EmptyState
                title="No reports yet"
                description="You have not filed any incident reports yet."
                action={
                  <Link
                    href={APP_ROUTES.STUDENT_NEW_REPORT}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4 text-accent" />
                    File First Report
                  </Link>
                }
              />
            </div>
          )
        ) : (
          <div className="bg-card border border-border rounded-2xl mt-4">
            <EmptyState
              title="Unable to load reports"
              description={payload.message || 'Please refresh the page or try again later.'}
            />
          </div>
        )}

        {payload.success && paginated && paginated.totalPages > 1 && (
          <PaginationControls basePath={APP_ROUTES.STUDENT_REPORTS} params={params} page={paginated.page} totalPages={paginated.totalPages} />
        )}
      </div>
    </>
  );
}

function buildReportQuery(params: { page?: string; status?: string; q?: string; sort?: string }) {
  const query = new URLSearchParams();
  query.set('page', params.page || '1');
  query.set('limit', '12');
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.q) query.set('q', params.q);
  query.set('sort', params.sort || 'newest');
  return query.toString();
}

function hrefWithParams(basePath: string, params: Record<string, string | undefined>, next: Record<string, string>) {
  const query = new URLSearchParams();
  Object.entries({ ...params, ...next }).forEach(([key, value]) => {
    if (value && value !== 'all') query.set(key, value);
  });
  const queryString = query.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

function ReportFilters({ basePath, params }: { basePath: string; params: { status?: string; q?: string; sort?: string } }) {
  return (
    <form action={basePath} className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto] gap-3 bg-card border border-border p-4 rounded-2xl shadow-2xs">
      <input name="q" defaultValue={params.q || ''} placeholder="Search reports..." className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-foreground" />
      <select name="status" defaultValue={params.status || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="under-investigation">Under Investigation</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <select name="sort" defaultValue={params.sort || 'newest'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="status">Status</option>
      </select>
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Apply</button>
    </form>
  );
}

function PaginationControls({ basePath, params, page, totalPages }: { basePath: string; params: Record<string, string | undefined>; page: number; totalPages: number }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
      <Link href={hrefWithParams(basePath, params, { page: String(Math.max(1, page - 1)) })} className="text-xs font-bold text-foreground hover:underline">Previous</Link>
      <span className="text-xs font-bold text-muted-foreground">Page {page} of {totalPages}</span>
      <Link href={hrefWithParams(basePath, params, { page: String(Math.min(totalPages, page + 1)) })} className="text-xs font-bold text-foreground hover:underline">Next</Link>
    </div>
  );
}
