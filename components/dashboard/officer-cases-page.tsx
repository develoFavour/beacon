import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ShieldAlert } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { ReportCard } from '@/components/dashboard/report-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import type { OfficerRoleConfig } from '@/lib/constants/officer-role.const';
import { buildOfficerCaseDetailHref } from '@/lib/constants/officer-role.const';
import type { PaginatedReports } from '@/lib/types';

export type CaseSearchParams = {
  tab?: string;
  page?: string;
  status?: string;
  q?: string;
  sort?: string;
};

export async function OfficerCasesPage({ config, params }: { config: OfficerRoleConfig; params: CaseSearchParams }) {
  const activeTab = params.tab === 'involved' ? 'involved' : 'queue';
  const scope = activeTab === 'involved' ? 'mine' : config.caseScope;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildReportQuery({ ...params, scope });
  const { payload } = await serverFetchAPI<PaginatedReports>(`/reports?${query}`, token);
  const paginated = payload.data;
  const reports = paginated?.items ?? [];

  return (
    <>
      <Topbar title={config.casesTitle} subtitle={config.casesSubtitle} />

      <div className="p-6 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <Tabs value={activeTab} className="gap-5">
          <TabsList>
            <TabsTrigger value="queue" asChild>
              <Link href={hrefWithParams(config.casesHref, params, { tab: 'queue', page: '1' })}>{config.queueLabel}</Link>
            </TabsTrigger>
            <TabsTrigger value="involved" asChild>
              <Link href={hrefWithParams(config.casesHref, params, { tab: 'involved', page: '1' })}>Involved Cases</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="flex flex-col gap-6">
            <CaseFilters basePath={config.casesHref} params={{ ...params, tab: activeTab }} />

            <div className="bg-card border border-border p-4 rounded-2xl shadow-2xs">
              <p className="text-xs font-semibold text-muted-foreground">
                {paginated?.total ?? 0} {(paginated?.total ?? 0) === 1 ? 'case' : 'cases'} found.
              </p>
            </div>

            {reports.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} href={buildOfficerCaseDetailHref(config.role, report.id)} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl">
                <EmptyState title={payload.success ? 'No cases found' : 'Unable to load cases'} description={emptyDescription(activeTab, config, payload.message)} icon={ShieldAlert} />
              </div>
            )}

            {payload.success && paginated && paginated.totalPages > 1 && (
              <PaginationControls basePath={config.casesHref} params={{ ...params, tab: activeTab }} page={paginated.page} totalPages={paginated.totalPages} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function buildReportQuery(params: CaseSearchParams & { scope: string }) {
  const query = new URLSearchParams();
  query.set('scope', params.scope);
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

function CaseFilters({ basePath, params }: { basePath: string; params: CaseSearchParams }) {
  return (
    <form action={basePath} className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto] gap-3 bg-card border border-border p-4 rounded-2xl shadow-2xs">
      <input type="hidden" name="tab" value={params.tab || 'queue'} />
      <input name="q" defaultValue={params.q || ''} placeholder="Search case ID, type, location..." className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-foreground" />
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

function emptyDescription(tab: string, config: OfficerRoleConfig, fallback?: string) {
  if (fallback) return fallback;
  if (tab === 'involved') return `Cases where another authority adds ${config.label} will appear here.`;
  return `${config.queueLabel} cases will appear here.`;
}
