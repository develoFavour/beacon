'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Plus,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ReportCard } from '@/components/dashboard/report-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import type { OfficerRoleConfig } from '@/lib/constants/officer-role.const';
import { buildOfficerCaseDetailHref } from '@/lib/constants/officer-role.const';
import type { CrimeReport, PanelHearing } from '@/lib/types';

interface OfficerDashboardRoleSectionsProps {
  config: OfficerRoleConfig;
  reports: CrimeReport[];
  hearings?: PanelHearing[];
}

export function OfficerDashboardRoleSections({ config, reports, hearings = [] }: OfficerDashboardRoleSectionsProps) {
  const pending = reports.filter((report) => report.status === 'pending');
  const active = reports.filter((report) => report.status === 'under-investigation');
  const resolved = reports.filter((report) => report.status === 'resolved');
  const closed = reports.filter((report) => report.status === 'closed');
  const priorityReports = [...pending, ...active].slice(0, 4);

  if (config.role === 'dean') {
    return (
      <DeanOverview
        config={config}
        reports={reports}
        pending={pending}
        active={active}
        resolved={resolved}
        closed={closed}
        priorityReports={priorityReports}
        hearings={hearings}
      />
    );
  }

  if (config.role === 'warden') {
    return (
      <WardenOverview
        config={config}
        reports={reports}
        pending={pending}
        active={active}
        resolved={resolved}
        closed={closed}
        priorityReports={priorityReports}
      />
    );
  }

  return (
    <CSOOverview
      config={config}
      reports={reports}
      pending={pending}
      active={active}
      resolved={resolved}
      closed={closed}
      priorityReports={priorityReports}
    />
  );
}

interface OverviewProps {
  config: OfficerRoleConfig;
  reports: CrimeReport[];
  pending: CrimeReport[];
  active: CrimeReport[];
  resolved: CrimeReport[];
  closed: CrimeReport[];
  priorityReports: CrimeReport[];
  hearings?: PanelHearing[];
}

function CSOOverview({ config, reports, pending, active, resolved, closed, priorityReports }: OverviewProps) {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <ActionBanner
        tone={pending.length > 0 ? 'danger' : 'neutral'}
        icon={AlertTriangle}
        label={pending.length > 0 ? `Active Security Alerts (${pending.length})` : 'Security Alerts'}
        title={pending.length > 0 ? 'There are security cases needing review.' : 'No active security alerts right now.'}
        description={
          pending.length > 0
            ? 'Review pending security cases, mark valid incidents active, and add findings to their timelines.'
            : 'New urgent security cases will appear here for quick CSO action.'
        }
        href={config.casesHref}
        action={pending.length > 0 ? 'Review Alerts' : 'View Security Cases'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard label="Total Campus Cases" value={reports.length} icon={ShieldAlert} variant="dark" trend="+ live queue" />
        <StatsCard label="High-Severity Alerts" value={pending.length} icon={AlertTriangle} variant="accent" />
        <StatsCard label="Active Investigations" value={active.length} icon={Activity} variant="default" />
        <StatsCard label="Closed / Resolved" value={closed.length + resolved.length} icon={CheckCircle2} variant="default" />
      </div>

      <PriorityQueue config={config} reports={priorityReports} title="Priority Incident Queue" description="Pending and active security cases requiring CSO attention." />
    </div>
  );
}

function DeanOverview({ config, reports, pending, active, resolved, closed, priorityReports, hearings = [] }: OverviewProps) {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <ActionBanner
        tone="warning"
        icon={AlertTriangle}
        label={`Pending conduct cases (${pending.length})`}
        title="New behavioral files require review."
        description="Review academic integrity, welfare, and misconduct cases to coordinate counseling or disciplinary panels."
        href={config.casesHref}
        action="Review Cases"
        secondaryAction={config.newHearingHref ? <Link href={config.newHearingHref} className="w-full sm:w-auto px-6 py-3.5 bg-primary text-primary-foreground font-extrabold rounded-full text-xs hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4 text-accent" /> Schedule Hearing</Link> : null}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard label="Total Conduct Cases" value={reports.length} icon={GraduationCap} variant="dark" trend="+ semester" />
        <StatsCard label="Pending Dean Review" value={pending.length} icon={AlertTriangle} variant="accent" />
        <StatsCard label="Active Panel Hearings" value={hearings.length + active.length} icon={Users} variant="default" />
        <StatsCard label="Resolved Conduct Cases" value={resolved.length + closed.length} icon={CheckCircle2} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <SectionHeader title="Disciplinary Panels & Hearings" description="Track scheduled academic integrity and behavioral meetings." action={config.newHearingHref ? <Link href={config.newHearingHref} className="text-xs font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Schedule New</Link> : null} />
          <div className="flex flex-col gap-3.5">
            {hearings.length > 0 ? (
              hearings.map((hearing) => <HearingCard key={hearing.id} hearing={hearing} />)
            ) : (
              <div className="bg-card border border-border rounded-2xl">
                <EmptyState title="No upcoming hearings" description="Scheduled panel meetings will appear here." icon={Calendar} />
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <PriorityQueue config={config} reports={priorityReports} title="Recent Conduct Cases" description="Assigned files under review." compact />
        </div>
      </div>
    </div>
  );
}

function WardenOverview({ config, reports, pending, active, resolved, closed, priorityReports }: OverviewProps) {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <ActionBanner
        tone="warning"
        icon={Building}
        label={`Pending hostel cases (${pending.length})`}
        title="Hostel incidents require residential follow-up."
        description="Review hostel complaints, safety issues, maintenance-linked incidents, and cases where Warden was added."
        href={config.casesHref}
        action="Review Hostel Cases"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard label="Hostel Cases" value={reports.length} icon={Building} variant="dark" />
        <StatsCard label="Pending Inspection" value={pending.length} icon={AlertTriangle} variant="accent" />
        <StatsCard label="Active Follow-ups" value={active.length} icon={Clock} variant="default" />
        <StatsCard label="Closed / Resolved" value={closed.length + resolved.length} icon={CheckCircle2} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <PriorityQueue config={config} reports={priorityReports} title="Hostel Case Queue" description="Pending and active residential cases." />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          <SectionHeader title="Residential Actions" description="Common follow-ups for hostel cases." />
          <div className="grid grid-cols-1 gap-3">
            <ActionTile href={`${config.casesHref}?status=pending`} icon={Building} title="Inspect Location" description="Open pending hostel cases that need room or block inspection." />
            <ActionTile href={`${config.casesHref}?status=under-investigation`} icon={Users} title="Contact Occupants" description="Continue active residential follow-ups and occupant checks." />
            <ActionTile href={`${config.casesHref}?status=closed`} icon={FileText} title="Prepare Closure Note" description="Open closed cases and write formal warden reports." />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBanner({
  tone,
  icon: Icon,
  label,
  title,
  description,
  href,
  action,
  secondaryAction,
}: {
  tone: 'danger' | 'warning' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  description: string;
  href: string;
  action: string;
  secondaryAction?: React.ReactNode;
}) {
  const toneClass =
    tone === 'danger'
      ? 'bg-destructive/10 border-destructive/20 text-destructive'
      : tone === 'warning'
        ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
        : 'bg-card border-border text-foreground';
  return (
    <div className={`${toneClass} rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-black uppercase text-xs mb-1">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <h2 className="text-xl font-black tracking-tight text-foreground">{title}</h2>
        <p className="text-sm font-semibold text-muted-foreground max-w-lg leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {secondaryAction}
        <Link href={href} className="w-full sm:w-auto px-6 py-3.5 bg-background border border-border text-foreground font-extrabold rounded-full text-xs hover:bg-muted text-center transition-all flex items-center justify-center gap-2">
          {action}
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}

function PriorityQueue({ config, reports, title, description, compact = false }: { config: OfficerRoleConfig; reports: CrimeReport[]; title: string; description: string; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title={title} description={description} action={<Link href={config.casesHref} className="text-xs font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-1">View Cases <ArrowRight className="w-3 h-3" /></Link>} />
      {reports.length > 0 ? (
        <div className={compact ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-5'}>
          {reports.map((report) => <ReportCard key={report.id} report={report} href={buildOfficerCaseDetailHref(config.role, report.id)} />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl">
          <EmptyState title="No active queue" description="Pending and active cases will appear here." icon={ShieldAlert} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
      <div>
        <h3 className="text-base font-extrabold tracking-tight text-foreground">{title}</h3>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">{description}</p>
      </div>
      {action}
    </div>
  );
}

function HearingCard({ hearing }: { hearing: PanelHearing }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between gap-4 hover:shadow-2xs transition-shadow">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-foreground">{hearing.studentName}</span>
            <span className="text-[10px] text-muted-foreground font-semibold">({hearing.studentIdentifier})</span>
          </div>
          <p className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-2">
            <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-foreground font-semibold">{hearing.charge}</span>
            <span>{hearing.location}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[10px] font-bold text-foreground bg-accent/15 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          {hearing.hearingDate}
        </span>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">{hearingStatusLabel(hearing.status)}</span>
      </div>
    </div>
  );
}

function hearingStatusLabel(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

function ActionTile({ icon: Icon, title, description, href }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; href?: string }) {
  const content = (
    <>
      <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <div>
        <h4 className="text-xs font-extrabold text-foreground">{title}</h4>
        <p className="text-xs font-semibold text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 hover:border-foreground/20 hover:bg-muted/30 transition-colors">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
      {content}
    </div>
  );
}
