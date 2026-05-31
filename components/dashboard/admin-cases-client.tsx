'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, MapPin, Search, ShieldAlert, Users } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/empty-state';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { TablePaginationFooter } from '@/components/dashboard/table-pagination-footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { principalOwner } from '@/lib/utils/report-routing';
import type { PaginatedReports, UserRole } from '@/lib/types';

export type AdminCaseSearchParams = {
  page?: string;
  status?: string;
  q?: string;
  sort?: string;
};

export function AdminCasesClient({
  reports,
  params,
  errorMessage,
}: {
  reports?: PaginatedReports;
  params: AdminCaseSearchParams;
  errorMessage?: string;
}) {
  const items = reports?.items ?? [];

  return (
    <div className="flex flex-col gap-5">
      <CaseFilters params={params} />

      <div className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-foreground">Case Registry</h2>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {reports ? `${reports.total} ${reports.total === 1 ? 'case' : 'cases'} found.` : errorMessage || 'Unable to load cases.'}
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Case</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Reporter</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Owner</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Authorities</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Status</TableHead>
                <TableHead className="px-5 py-3 text-right text-[10px] font-black uppercase text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/30">
                  <TableCell className="px-5 py-4 min-w-[280px]">
                    <p className="text-sm font-extrabold text-foreground">{report.crimeType}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{report.id}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {report.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.dateOfIncident}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <p className="text-xs font-extrabold text-foreground">{report.reporterName || 'Unknown reporter'}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{report.reporterPhone || 'No phone'}</p>
                    {report.isAnonymous && <p className="text-[10px] font-black uppercase text-amber-700 mt-1">Anonymous to officers</p>}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-xs font-bold text-foreground">{principalOwner(report)}</TableCell>
                  <TableCell className="px-5 py-4">
                    <AuthorityChips roles={report.involvedRoles ?? []} />
                  </TableCell>
                  <TableCell className="px-5 py-4"><StatusBadge status={report.status} /></TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    <Link href={APP_ROUTES.ADMIN_CASE_DETAIL(report.id)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
                      Open
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title={reports ? 'No cases found' : 'Unable to load cases'} description={errorMessage || 'Try adjusting your filters or search.'} icon={ShieldAlert} />
        )}
      </div>

      {reports && (
        <TablePaginationFooter
          basePath={APP_ROUTES.ADMIN_CASES}
          params={params}
          page={reports.page}
          totalPages={reports.totalPages}
          total={reports.total}
          pageSize={reports.limit}
        />
      )}
    </div>
  );
}

function CaseFilters({ params }: { params: AdminCaseSearchParams }) {
  return (
    <form action={APP_ROUTES.ADMIN_CASES} className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto] gap-3 bg-card border border-border p-4 rounded-2xl shadow-2xs">
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input name="q" defaultValue={params.q || ''} placeholder="Search case ID, type, reporter, location..." className="w-full bg-background border border-border text-foreground py-2.5 pl-9 pr-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-foreground" />
      </div>
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

function AuthorityChips({ roles }: { roles: UserRole[] }) {
  if (roles.length === 0) {
    return <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Users className="w-3.5 h-3.5" /> None added</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <span key={role} className="rounded-full border border-border bg-background px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">
          {roleLabel(role)}
        </span>
      ))}
    </div>
  );
}

function roleLabel(role: UserRole) {
  if (role === 'cso') return 'CSO';
  return role;
}
