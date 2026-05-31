import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building,
  CheckCircle2,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { serverFetchAPI } from '@/lib/server/backend-api';
import { AdminVerificationsClient, type AdminVerificationSearchParams } from '@/components/dashboard/admin-verifications-client';
import { AdminUsersClient, type AdminUserSearchParams } from '@/components/dashboard/admin-users-client';
import { AdminCasesClient, type AdminCaseSearchParams } from '@/components/dashboard/admin-cases-client';
import { AdminActivityClient, type AdminActivitySearchParams } from '@/components/dashboard/admin-activity-client';
import { principalOwner } from '@/lib/utils/report-routing';
import type { AdminOverview, CrimeReport, PaginatedAuditEvents, PaginatedReports, PaginatedUsers, User, UserRole } from '@/lib/types';

export async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const { payload } = await serverFetchAPI<AdminOverview>('/admin/overview', token);
  const overview = payload.data ?? emptyAdminOverview();
  const csoWorkload = workloadFor(overview, 'cso');
  const deanWorkload = workloadFor(overview, 'dean');
  const wardenWorkload = workloadFor(overview, 'warden');

  return (
    <>
      <Topbar title="Admin Overview" subtitle="System-wide operations, routing health, and account governance." />
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatsCard label="Pending Verifications" value={overview.stats.pendingVerifications} icon={ShieldCheck} variant="dark" />
          <StatsCard label="Active Authorities" value={overview.stats.activeAuthorities} icon={Users} variant="default" />
          <StatsCard label="Open Cases" value={overview.stats.openCases} icon={ShieldAlert} variant={overview.stats.securityAlerts > 0 ? 'accent' : 'default'} />
          <StatsCard label="Closed Cases" value={overview.stats.closedCases} icon={CheckCircle2} variant="default" />
        </div>

        {!payload.success && (
          <SystemAlert tone="warning" title="Overview data could not be fully loaded" detail={payload.message || 'Refresh the page after confirming the backend is running.'} />
        )}

        <SystemAlert
          tone={overview.stats.securityAlerts > 0 ? 'danger' : 'quiet'}
          title={overview.stats.securityAlerts > 0 ? `${overview.stats.securityAlerts} security ${overview.stats.securityAlerts === 1 ? 'case needs' : 'cases need'} attention` : 'No active security alerts right now'}
          detail={overview.stats.securityAlerts > 0 ? 'Pending or active security cases are in the system and should be reviewed from the case registry.' : 'Security-routed cases will surface here as soon as they become pending or active.'}
          href={APP_ROUTES.ADMIN_CASES}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-8 bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
            <SectionTitle title="Student Verification Queue" caption="Review uploaded ID cards, matric numbers, and OCR confidence." href={APP_ROUTES.ADMIN_VERIFICATIONS} />
            <VerificationTable rows={overview.verificationQueue} />
          </section>

          <section className="xl:col-span-4 bg-card border border-border rounded-3xl shadow-2xs p-5 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-foreground">Authority Workload</h2>
            <WorkloadRow icon={ShieldAlert} label="CSO" value={csoWorkload.openCases} caption={`${csoWorkload.totalCases} total`} tone="bg-red-500/10 text-red-700 border-red-500/20" />
            <WorkloadRow icon={GraduationCap} label="Dean" value={deanWorkload.openCases} caption={`${deanWorkload.totalCases} total`} tone="bg-amber-500/10 text-amber-700 border-amber-500/20" />
            <WorkloadRow icon={Building} label="Warden" value={wardenWorkload.openCases} caption={`${wardenWorkload.totalCases} total`} tone="bg-emerald-500/10 text-emerald-700 border-emerald-500/20" />
            <div className="mt-2 rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-extrabold text-foreground">Routing Health</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-1 leading-relaxed">{overview.stats.totalCases} total cases routed by residential, conduct, and security ownership rules.</p>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
            <SectionTitle title="Case Routing Snapshot" caption="Recent cases grouped by principal owner." href={APP_ROUTES.ADMIN_CASES} />
            <CasesTable rows={overview.recentCases} compact />
          </section>
          <section className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
            <SectionTitle title="Recent Case Activity" caption="Latest case submissions and routing signals." href={APP_ROUTES.ADMIN_ACTIVITY} />
            <ActivityList cases={overview.recentCases} />
          </section>
        </div>
      </div>
    </>
  );
}

export async function AdminVerificationsPage({ params }: { params: AdminVerificationSearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildVerificationQuery(params);
  const { payload } = await serverFetchAPI<PaginatedUsers>(`/admin/verifications?${query}`, token);
  const verifications = payload.data;
  const total = verifications?.total ?? 0;

  return (
    <>
      <Topbar title="Student Verifications" subtitle="Approve or reject student accounts after reviewing matric number and ID evidence." />
      <AdminPageFrame>
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <h2 className="text-sm font-extrabold text-foreground">Verification Registry</h2>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {payload.success ? `${total} pending ${total === 1 ? 'student' : 'students'}` : payload.message}
            </p>
          </div>
        </div>
        <AdminVerificationsClient verifications={verifications} params={params} />
      </AdminPageFrame>
    </>
  );
}

export async function AdminUsersPage({ params }: { params: AdminUserSearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildUserQuery(params);
  const { payload } = await serverFetchAPI<PaginatedUsers>(`/admin/users?${query}`, token);

  return (
    <>
      <Topbar title="Users" subtitle="Manage students, officers, and administrative access." />
      <AdminPageFrame>
        <AdminUsersClient users={payload.data} params={params} />
      </AdminPageFrame>
    </>
  );
}

export async function AdminCasesPage({ params }: { params: AdminCaseSearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildCaseQuery(params);
  const { payload } = await serverFetchAPI<PaginatedReports>(`/reports?${query}`, token);

  return (
    <>
      <Topbar title="Cases" subtitle="Monitor case ownership, routing, and lifecycle state." />
      <AdminPageFrame>
        <AdminCasesClient reports={payload.data} params={params} errorMessage={payload.success ? undefined : payload.message} />
      </AdminPageFrame>
    </>
  );
}

export async function AdminActivityPage({ params }: { params: AdminActivitySearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const query = buildActivityQuery(params);
  const { payload } = await serverFetchAPI<PaginatedAuditEvents>(`/admin/activity?${query}`, token);

  return (
    <>
      <Topbar title="System Activity" subtitle="Audit account, routing, case, hearing, and officer-report actions." />
      <AdminPageFrame>
        <AdminActivityClient events={payload.data} params={params} errorMessage={payload.success ? undefined : payload.message} />
      </AdminPageFrame>
    </>
  );
}

function emptyAdminOverview(): AdminOverview {
  return {
    stats: {
      pendingVerifications: 0,
      activeAuthorities: 0,
      openCases: 0,
      closedCases: 0,
      securityAlerts: 0,
      totalCases: 0,
    },
    authorityWorkload: [
      { role: 'cso', label: 'CSO', openCases: 0, totalCases: 0 },
      { role: 'dean', label: 'Dean', openCases: 0, totalCases: 0 },
      { role: 'warden', label: 'Warden', openCases: 0, totalCases: 0 },
    ],
    verificationQueue: [],
    recentCases: [],
  };
}

function workloadFor(overview: AdminOverview, role: UserRole) {
  return overview.authorityWorkload.find((item) => item.role === role) ?? { role, label: role, openCases: 0, totalCases: 0 };
}

function SystemAlert({
  tone,
  title,
  detail,
  href,
}: {
  tone: 'danger' | 'warning' | 'quiet';
  title: string;
  detail: string;
  href?: string;
}) {
  const toneClass = tone === 'danger'
    ? 'bg-red-500/10 border-red-500/20 text-red-700'
    : tone === 'warning'
      ? 'bg-amber-500/10 border-amber-500/20 text-amber-700'
      : 'bg-card border-border text-foreground';

  return (
    <section className={`rounded-3xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs ${toneClass}`}>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-background/80 border border-current/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold">{title}</h2>
          <p className="text-xs font-semibold opacity-80 mt-1 leading-relaxed">{detail}</p>
        </div>
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold hover:opacity-95 transition-opacity">
          View Cases
        </Link>
      )}
    </section>
  );
}

function AdminPageFrame({ children }: { children: React.ReactNode }) {
  return <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-5">{children}</div>;
}

function buildUserQuery(params: AdminUserSearchParams) {
  const query = new URLSearchParams();
  query.set('page', params.page || '1');
  query.set('limit', '10');
  if (params.role && params.role !== 'all') query.set('role', params.role);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.q) query.set('q', params.q);
  query.set('sort', params.sort || 'newest');
  return query.toString();
}

function buildVerificationQuery(params: AdminVerificationSearchParams) {
  const query = new URLSearchParams();
  query.set('page', params.page || '1');
  query.set('limit', '10');
  if (params.q) query.set('q', params.q);
  query.set('sort', params.sort || 'oldest');
  return query.toString();
}

function buildCaseQuery(params: AdminCaseSearchParams) {
  const query = new URLSearchParams();
  query.set('page', params.page || '1');
  query.set('limit', '10');
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.q) query.set('q', params.q);
  query.set('sort', params.sort || 'newest');
  return query.toString();
}

function buildActivityQuery(params: AdminActivitySearchParams) {
  const query = new URLSearchParams();
  query.set('page', params.page || '1');
  query.set('limit', '10');
  if (params.action && params.action !== 'all') query.set('action', params.action);
  if (params.actorRole && params.actorRole !== 'all') query.set('actorRole', params.actorRole);
  if (params.entityType && params.entityType !== 'all') query.set('entityType', params.entityType);
  if (params.q) query.set('q', params.q);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  query.set('sort', params.sort || 'newest');
  return query.toString();
}

function SectionTitle({ title, caption, href }: { title: string; caption: string; href: string }) {
  return (
    <div className="p-5 border-b border-border flex items-center justify-between gap-4">
      <div>
        <h2 className="text-sm font-extrabold text-foreground">{title}</h2>
        <p className="text-xs font-semibold text-muted-foreground mt-1">{caption}</p>
      </div>
      <Link href={href} className="h-9 w-9 rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors inline-flex items-center justify-center" aria-label={`Open ${title}`}>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function VerificationTable({ rows }: { rows: User[] }) {
  if (rows.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-extrabold text-foreground">No pending verifications</p>
        <p className="text-xs font-semibold text-muted-foreground mt-1">Students awaiting admin review will appear here.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Student</TableHead>
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Matric</TableHead>
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Contact</TableHead>
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Status</TableHead>
          <TableHead className="px-5 py-3 text-right text-[10px] font-black uppercase text-muted-foreground">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className="hover:bg-muted/30">
            <TableCell className="px-5 py-4">
              <p className="text-sm font-extrabold text-foreground">{row.fullName}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">Submitted {new Date(row.createdAt).toLocaleDateString('en-NG')}</p>
            </TableCell>
            <TableCell className="px-5 py-4 text-xs font-bold text-foreground">{row.matricNumber || 'Not provided'}</TableCell>
            <TableCell className="px-5 py-4">
              <p className="text-xs font-semibold text-foreground">{row.email}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{row.phone}</p>
            </TableCell>
            <TableCell className="px-5 py-4"><StatusPill label={row.status.replace('_', ' ')} /></TableCell>
            <TableCell className="px-5 py-4 text-right"><RowButton label="Review" href={APP_ROUTES.ADMIN_VERIFICATIONS} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CasesTable({ rows, compact = false }: { rows: CrimeReport[]; compact?: boolean }) {
  if (rows.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-extrabold text-foreground">No cases yet</p>
        <p className="text-xs font-semibold text-muted-foreground mt-1">Submitted cases will appear here once students start reporting incidents.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Case</TableHead>
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Owner</TableHead>
          <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Status</TableHead>
          {!compact && <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Location</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className="hover:bg-muted/30">
            <TableCell className="px-5 py-4">
              <p className="text-sm font-extrabold text-foreground">{row.crimeType}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{row.id}</p>
            </TableCell>
            <TableCell className="px-5 py-4 text-xs font-bold text-foreground">{principalOwner(row)}</TableCell>
            <TableCell className="px-5 py-4"><StatusBadge status={row.status} /></TableCell>
            {!compact && <TableCell className="px-5 py-4 text-xs font-semibold text-muted-foreground">{row.location}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ActivityList({ cases }: { cases: CrimeReport[] }) {
  if (cases.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-extrabold text-foreground">No recent activity</p>
        <p className="text-xs font-semibold text-muted-foreground mt-1">Case and routing activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {cases.map((row) => (
        <div key={row.id} className="p-5 flex items-start gap-3 hover:bg-muted/30 transition-colors">
          <div className="h-9 w-9 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold text-foreground truncate">System</p>
              <span className="text-[10px] font-bold text-muted-foreground shrink-0">{new Date(row.createdAt).toLocaleDateString('en-NG')}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">{row.crimeType} case routed to {principalOwner(row)}.</p>
            <span className="mt-2 inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[9px] font-black uppercase text-muted-foreground">{row.status.replace('-', ' ')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkloadRow({ icon: Icon, label, value, caption, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; caption: string; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <span className={`h-10 w-10 rounded-xl border flex items-center justify-center ${tone}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span>
          <span className="block text-sm font-extrabold text-foreground">{label}</span>
          <span className="block text-[10px] font-bold uppercase text-muted-foreground">{caption}</span>
        </span>
      </div>
      <span className="text-lg font-black text-foreground">{value}</span>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  const lower = label.toLowerCase();
  const tone = lower.includes('active') || lower.includes('matched')
    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    : lower.includes('pending') || lower.includes('review')
      ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
      : 'bg-muted text-muted-foreground border-border';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${tone}`}>{label}</span>;
}

function RowButton({ label, href }: { label: string; href?: string }) {
  if (href) {
    return (
      <Link href={href} className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
        {label}
      </Link>
    );
  }

  return (
    <button className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
      {label}
    </button>
  );
}
