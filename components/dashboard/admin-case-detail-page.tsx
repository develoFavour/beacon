import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Phone, Shield, User, Users } from 'lucide-react';
import { CaseTimeline } from '@/components/dashboard/case-timeline';
import { EvidencePreview, reportEvidenceItems } from '@/components/dashboard/evidence-preview';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Topbar } from '@/components/dashboard/topbar';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { principalOwner } from '@/lib/utils/report-routing';
import type { CaseUpdate, CrimeReport, UserRole } from '@/lib/types';

export function AdminCaseDetailPage({
  report,
  timeline,
}: {
  report: CrimeReport;
  timeline: CaseUpdate[];
}) {
  const evidence = reportEvidenceItems(report);

  return (
    <>
      <Topbar title={`Case ${report.id}`} subtitle="Full case record, evidence, routing, authorities, and investigation timeline." />

      <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col gap-6">
          <Link href={APP_ROUTES.ADMIN_CASES} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Cases
          </Link>

          <section className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
                  <Shield className="w-4 h-4 text-accent" />
                  Incident Type
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">{report.crimeType}</h2>
                <p className="text-xs font-bold text-muted-foreground">
                  Reported by {report.reporterName || 'Unknown reporter'}{report.isAnonymous ? ' - anonymous to officers' : ''}
                </p>
              </div>
              <StatusBadge status={report.status} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoPill icon={MapPin} label="Location" value={report.location} />
              <InfoPill icon={Calendar} label="Date / Time" value={`${report.dateOfIncident} at ${report.timeOfIncident}`} />
            </div>

            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">Detailed Description</h3>
              <p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">{report.description}</p>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">Evidence</h3>
              {evidence.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {evidence.map((item) => (
                    <EvidencePreview key={item.id} evidence={item} />
                  ))}
                </div>
              ) : (
                <p className="text-xs font-semibold text-muted-foreground">No evidence was attached to this case.</p>
              )}
            </section>
          </section>
        </div>

        <aside className="w-full lg:w-[430px] flex flex-col gap-6">
          <section className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Reporter
            </h3>
            <DetailRow label="Name" value={report.reporterName || 'Unknown reporter'} />
            <DetailRow label="Phone" value={report.reporterPhone || 'Not provided'} icon={Phone} />
            <DetailRow label="Anonymous to officers" value={report.isAnonymous ? 'Yes' : 'No'} />
            <DetailRow label="Hostel incident" value={report.isHostelIncident ? 'Yes' : 'No'} />
          </section>

          <section className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              Routing & Authorities
            </h3>
            <DetailRow label="Principal owner" value={principalOwner(report)} />
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Added authorities</p>
              <AuthorityChips roles={report.involvedRoles ?? []} />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-tight text-foreground bg-card border border-border rounded-2xl p-4 shadow-2xs">Case Timeline</h3>
            <div className="p-2">
              <CaseTimeline updates={timeline} />
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border">
      <div className="h-10 w-10 rounded-full bg-accent/15 text-foreground flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase">{label}</p>
        <p className="text-sm font-extrabold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-background p-4">
      <span className="text-[10px] font-black uppercase text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-right text-xs font-extrabold text-foreground">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
        {value}
      </span>
    </div>
  );
}

function AuthorityChips({ roles }: { roles: UserRole[] }) {
  if (roles.length === 0) {
    return <p className="text-xs font-semibold text-muted-foreground">No manual authorities have been added.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <span key={role} className="rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-black uppercase text-muted-foreground">
          {role === 'cso' ? 'CSO' : role}
        </span>
      ))}
    </div>
  );
}
