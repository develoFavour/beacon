'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileText,
  MapPin,
  Paperclip,
  PlayCircle,
  Save,
  Upload,
  UserRound,
} from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { EmptyState } from '@/components/dashboard/empty-state';
import { HearingDetailSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { HearingService } from '@/lib/services/hearing.service';
import { EVIDENCE_UPLOAD_MAX_BYTES, UploadService } from '@/lib/services/upload.service';
import type { HearingStatus, PanelHearing } from '@/lib/types';

export function HearingDetailPage({ hearingId }: { hearingId: string }) {
  const [hearing, setHearing] = useState<PanelHearing | null>(null);
  const [nextStatus, setNextStatus] = useState<HearingStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadHearing() {
      try {
        const response = await HearingService.details(hearingId);
        if (!mounted) return;
        const record = response.data ?? null;
        setHearing(record);
        setNextStatus('');
        setNotes(record?.notes ?? '');
        setMeetingSummary(record?.meetingSummary ?? '');
      } catch (error: any) {
        toast.error('Unable to load hearing', {
          description: error?.message || 'Please try again.',
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadHearing();
    return () => {
      mounted = false;
    };
  }, [hearingId]);

  useEffect(() => {
    if (!hearing || !nextStatus) return;
    const validStatus = getNextStatusOptions(hearing.status, Boolean(hearing.evidenceUrl || evidence)).some((option) => option.value === nextStatus);
    if (!validStatus) setNextStatus('');
  }, [evidence, hearing, nextStatus]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!hearing) return;
    if (nextStatus === 'completed' && !meetingSummary.trim()) {
      toast.error('Panel minutes are required', {
        description: 'Close a hearing only after recording how the panel meeting went.',
      });
      return;
    }
    if (nextStatus === 'pending_evidence' && (hearing.evidenceUrl || evidence)) {
      toast.error('Evidence already exists', {
        description: 'A hearing with uploaded evidence cannot be marked pending evidence.',
      });
      return;
    }

    setIsSubmitting(true);
    const toastID = toast.loading(evidence ? 'Uploading panel evidence' : 'Saving hearing record');
    try {
      let evidencePayload = {
        evidenceUrl: hearing.evidenceUrl || '',
        evidencePublicId: hearing.evidencePublicId || '',
        evidenceType: hearing.evidenceType || '',
        evidenceFormat: hearing.evidenceFormat || '',
        evidenceBytes: hearing.evidenceBytes || 0,
      };

      if (evidence) {
        const upload = await UploadService.uploadFile(evidence, 'panel-hearings');
        evidencePayload = {
          evidenceUrl: upload.data?.secureUrl || '',
          evidencePublicId: upload.data?.publicId || '',
          evidenceType: upload.data?.resourceType || '',
          evidenceFormat: upload.data?.format || '',
          evidenceBytes: upload.data?.bytes || 0,
        };
      }

      const response = await HearingService.update(hearing.id, {
        ...(nextStatus ? { status: nextStatus } : {}),
        notes,
        meetingSummary: shouldShowMinutes(hearing.status, nextStatus) ? meetingSummary : '',
        ...evidencePayload,
      });
      setHearing(response.data ?? hearing);
      setEvidence(null);
      setNextStatus('');
      toast.success(response.message || 'Hearing record updated', { id: toastID });
    } catch (error: any) {
      toast.error('Could not update hearing', {
        id: toastID,
        description: error?.message || 'Please check the details and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Topbar title="Panel Hearing" subtitle="Loading hearing details." />
        <HearingDetailSkeleton />
      </>
    );
  }

  if (!hearing) {
    return (
      <>
        <Topbar title="Panel Hearing" subtitle="Unable to load hearing details." />
        <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
          <div className="bg-card border border-border rounded-2xl">
            <EmptyState title="Hearing not found" description="This hearing may not exist or you may not have access." icon={CalendarDays} />
          </div>
        </div>
      </>
    );
  }

  const hasEvidenceForSave = Boolean(hearing.evidenceUrl || evidence);
  const statusOptions = getNextStatusOptions(hearing.status, hasEvidenceForSave);
  const showMinutes = shouldShowMinutes(hearing.status, nextStatus);
  const statusLocked = statusOptions.length === 0;
  const canUploadEvidence = hearing.status !== 'cancelled';
  const hasChanges =
    Boolean(nextStatus) ||
    Boolean(evidence) ||
    notes !== (hearing.notes ?? '') ||
    (showMinutes && meetingSummary !== (hearing.meetingSummary ?? ''));
  const saveDisabled =
    isSubmitting ||
    !hasChanges ||
    (nextStatus === 'completed' && !meetingSummary.trim()) ||
    (nextStatus === 'pending_evidence' && hasEvidenceForSave);

  return (
    <>
      <Topbar title="Panel Hearing Details" subtitle="Record evidence, outcome notes, and panel meeting minutes." />

      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
        <Link href={APP_ROUTES.DEAN_HEARINGS} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Hearings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xs flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                    <UserRound className="w-4 h-4 text-accent" />
                    Student
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-foreground mt-2">{hearing.studentName}</h2>
                  <p className="text-xs font-bold text-muted-foreground mt-1">{hearing.studentIdentifier}</p>
                </div>
                <span className={statusClasses(hearing.status)}>{statusLabel(hearing.status)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoPill icon={CalendarDays} label="Date / Time" value={`${hearing.hearingDate} at ${hearing.hearingTime}`} />
                <InfoPill icon={MapPin} label="Location" value={hearing.location} />
              </div>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">Charge</h3>
                <p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">{hearing.charge}</p>
              </section>

              {hearing.notes && (
                <section className="flex flex-col gap-3">
                  <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">Pre-hearing Notes</h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">{hearing.notes}</p>
                </section>
              )}

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">Panel Evidence</h3>
                {hearing.evidenceUrl ? (
                  <EvidencePreview hearing={hearing} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-background p-5 flex items-center gap-3">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-extrabold text-foreground">No evidence uploaded</p>
                      <p className="text-xs font-semibold text-muted-foreground mt-1">Upload panel documents, images, or a short video from the update panel.</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <form onSubmit={handleSave} className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-2xs flex flex-col gap-5 sticky top-6">
              <div>
                <h3 className="text-sm font-extrabold text-foreground">Hearing Workflow</h3>
                <p className="text-xs font-semibold text-muted-foreground mt-1">Move the hearing through the next realistic step, record evidence, and close it with minutes.</p>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Next status</span>
                <Select value={nextStatus} onValueChange={(value) => setNextStatus(value as HearingStatus)} disabled={isSubmitting || statusLocked}>
                  <SelectTrigger className="w-full rounded-xl bg-background border-border text-xs font-bold">
                    <SelectValue placeholder={statusLocked ? 'No status changes available' : 'Choose next action'} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              {showMinutes ? (
                <TextArea label="Panel minutes / meeting summary" value={meetingSummary} rows={6} onChange={setMeetingSummary} placeholder="Document attendance, student response, panel findings, decisions, and follow-up actions." />
              ) : null}
              <TextArea label="Internal notes" value={notes} rows={4} onChange={setNotes} placeholder="Add or update pre/post-hearing notes." />

              <label className={`border-2 border-dashed border-border rounded-2xl p-5 flex items-center gap-3 bg-background transition-colors relative ${canUploadEvidence ? 'hover:bg-muted/50 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime,.pdf"
                  onChange={(event) => setEvidence(event.target.files?.[0] ?? null)}
                  disabled={!canUploadEvidence}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{evidence ? evidence.name : hearing.evidenceUrl ? 'Replace panel evidence' : 'Upload panel evidence'}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground">Images, PDF, or video up to {Math.floor(EVIDENCE_UPLOAD_MAX_BYTES / (1024 * 1024))}MB</p>
                </div>
              </label>

              <button type="submit" disabled={saveDisabled} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                <Save className="w-4 h-4 text-accent" />
                Save Hearing Record
              </button>
            </form>
          </aside>
        </div>
      </div>
    </>
  );
}

function InfoPill({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
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

function TextArea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold resize-none placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
      />
    </label>
  );
}

function EvidencePreview({ hearing }: { hearing: PanelHearing }) {
  const url = hearing.evidenceUrl || '';
  const type = hearing.evidenceType?.toLowerCase();
  const format = hearing.evidenceFormat?.toLowerCase();

  if (isPDFEvidence(format, url)) {
    return <EvidenceLink url={url} label="Open PDF evidence" icon={FileText} />;
  }

  if (type === 'image') {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Panel evidence" className="w-full max-h-[420px] object-contain bg-black/5" />
      </a>
    );
  }

  if (type === 'video') {
    return (
      <div className="flex flex-col gap-3">
        <video controls preload="metadata" className="w-full rounded-2xl border border-border bg-black max-h-[420px]">
          <source src={url} />
          Your browser cannot play this evidence video.
        </video>
        <EvidenceLink url={url} label="Open video evidence" icon={PlayCircle} />
      </div>
    );
  }

  return <EvidenceLink url={url} label={format === 'pdf' ? 'Open PDF evidence' : 'Open panel evidence'} icon={format === 'pdf' ? FileText : Paperclip} />;
}

function EvidenceLink({ url, label, icon: Icon }: { url: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-sm font-bold text-foreground hover:bg-muted transition-colors">
      <span className="flex items-center gap-3 min-w-0">
        <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
    </a>
  );
}

function statusLabel(status: HearingStatus) {
  return status.replace('_', ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

function statusClasses(status: HearingStatus) {
  const base = 'inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase w-fit';
  if (status === 'scheduled') return `${base} bg-blue-100 text-blue-800 border-blue-200`;
  if (status === 'pending_evidence') return `${base} bg-amber-100 text-amber-800 border-amber-200`;
  if (status === 'completed') return `${base} bg-emerald-100 text-emerald-800 border-emerald-200`;
  return `${base} bg-zinc-100 text-zinc-800 border-zinc-200`;
}

function shouldShowMinutes(currentStatus: HearingStatus, nextStatus: HearingStatus | '') {
  return currentStatus === 'completed' || nextStatus === 'completed';
}

function getNextStatusOptions(currentStatus: HearingStatus, hasEvidence: boolean): Array<{ label: string; value: HearingStatus }> {
  if (currentStatus === 'scheduled') {
    return [
      ...(hasEvidence ? [] : [{ label: 'Pending Evidence', value: 'pending_evidence' as const }]),
      { label: 'Complete Hearing', value: 'completed' },
      { label: 'Cancel Hearing', value: 'cancelled' },
    ];
  }
  if (currentStatus === 'pending_evidence') {
    return [
      ...(hasEvidence ? [{ label: 'Return to Scheduled', value: 'scheduled' as const }] : []),
      { label: 'Complete Hearing', value: 'completed' },
      { label: 'Cancel Hearing', value: 'cancelled' },
    ];
  }
  return [];
}

function isPDFEvidence(format: string | undefined, url: string) {
  return format === 'pdf' || /\.pdf($|\?)/i.test(url);
}
