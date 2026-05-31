'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, Search } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/empty-state';
import { TablePaginationFooter } from '@/components/dashboard/table-pagination-footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import type { AuditEvent, PaginatedAuditEvents, UserRole } from '@/lib/types';

export type AdminActivitySearchParams = {
  page?: string;
  action?: string;
  actorRole?: string;
  entityType?: string;
  q?: string;
  from?: string;
  to?: string;
  sort?: string;
};

const ACTION_LABELS: Record<string, string> = {
  student_registered: 'Student Registered',
  verification_approved: 'Verification Approved',
  verification_rejected: 'Verification Rejected',
  user_status_changed: 'User Status Changed',
  report_created: 'Report Created',
  case_update_added: 'Case Update Added',
  case_status_changed: 'Case Status Changed',
  authority_added: 'Authority Added',
  hearing_created: 'Hearing Created',
  hearing_updated: 'Hearing Updated',
  officer_report_submitted: 'Officer Report Submitted',
};

export function AdminActivityClient({
  events,
  params,
  errorMessage,
}: {
  events?: PaginatedAuditEvents;
  params: AdminActivitySearchParams;
  errorMessage?: string;
}) {
  const items = events?.items ?? [];

  return (
    <div className="flex flex-col gap-5">
      <ActivityFilters params={params} />

      <div className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-foreground">Audit Trail</h2>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {events ? `${events.total} ${events.total === 1 ? 'event' : 'events'} found.` : errorMessage || 'Unable to load activity.'}
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Activity</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Actor</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Entity</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Date</TableHead>
                <TableHead className="px-5 py-3 text-right text-[10px] font-black uppercase text-muted-foreground">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((event) => (
                <TableRow key={event.id} className="hover:bg-muted/30">
                  <TableCell className="px-5 py-4 min-w-[320px]">
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-foreground" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-extrabold text-foreground">{ACTION_LABELS[event.action] || titleize(event.action)}</span>
                        <span className="block text-xs font-semibold text-muted-foreground mt-1 whitespace-normal leading-relaxed">{event.summary}</span>
                        <span className="mt-2 inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[9px] font-black uppercase text-muted-foreground">{event.action.replaceAll('_', ' ')}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <p className="text-xs font-extrabold text-foreground">{event.actorName}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5 uppercase">{roleLabel(event.actorRole)}</p>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <p className="text-xs font-bold text-foreground capitalize">{event.entityType.replace('_', ' ')}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{event.entityId}</p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-xs font-semibold text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    {entityHref(event) ? (
                      <Link href={entityHref(event) as string} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
                        Open
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title={events ? 'No activity found' : 'Unable to load activity'} description={errorMessage || 'Try adjusting your filters or date range.'} icon={Activity} />
        )}
      </div>

      {events && (
        <TablePaginationFooter
          basePath={APP_ROUTES.ADMIN_ACTIVITY}
          params={params}
          page={events.page}
          totalPages={events.totalPages}
          total={events.total}
          pageSize={events.limit}
        />
      )}
    </div>
  );
}

function ActivityFilters({ params }: { params: AdminActivitySearchParams }) {
  return (
    <form action={APP_ROUTES.ADMIN_ACTIVITY} className="grid grid-cols-1 xl:grid-cols-[1fr_190px_150px_160px_140px_140px_140px_auto] gap-3 bg-card border border-border p-4 rounded-2xl shadow-2xs">
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input name="q" defaultValue={params.q || ''} placeholder="Search actor, action, entity, summary..." className="w-full bg-background border border-border text-foreground py-2.5 pl-9 pr-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-foreground" />
      </div>
      <select name="action" defaultValue={params.action || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All actions</option>
        {Object.entries(ACTION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <select name="actorRole" defaultValue={params.actorRole || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All roles</option>
        <option value="student">Student</option>
        <option value="staff">Staff</option>
        <option value="cso">CSO</option>
        <option value="dean">Dean</option>
        <option value="warden">Warden</option>
        <option value="admin">Admin</option>
      </select>
      <select name="entityType" defaultValue={params.entityType || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All entities</option>
        <option value="user">User</option>
        <option value="report">Report</option>
        <option value="case">Case</option>
        <option value="hearing">Hearing</option>
        <option value="officer_report">Officer Report</option>
      </select>
      <input type="date" name="from" defaultValue={params.from || ''} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold" />
      <input type="date" name="to" defaultValue={params.to || ''} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold" />
      <select name="sort" defaultValue={params.sort || 'newest'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Apply</button>
    </form>
  );
}

function entityHref(event: AuditEvent) {
  if (event.entityType === 'case' || event.entityType === 'report') return APP_ROUTES.ADMIN_CASE_DETAIL(event.entityId);
  if (event.entityType === 'user') return APP_ROUTES.ADMIN_USERS;
  return null;
}

function titleize(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function roleLabel(role: UserRole) {
  if (role === 'cso') return 'CSO';
  return role;
}
