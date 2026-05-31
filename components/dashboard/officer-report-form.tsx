'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowRight, FileText, Upload } from 'lucide-react';
import { ReportService } from '@/lib/services/report.service';
import { OfficerReportService } from '@/lib/services/officer-report.service';
import { UploadService } from '@/lib/services/upload.service';
import { buildOfficerReportDetailHref, type OfficerRole } from '@/lib/constants/officer-role.const';
import type { CrimeReport } from '@/lib/types';

interface OfficerReportFormProps {
  caseId: string;
  role: OfficerRole;
  reportsHref: string;
}

const RECIPIENTS = ['Vice Chancellor', 'Student Affairs Officer', 'Dean', 'Chief Security Officer', 'Hostel Warden', 'Registry'];

export function OfficerReportForm({ caseId, role, reportsHref }: OfficerReportFormProps) {
  const router = useRouter();
  const [caseRecord, setCaseRecord] = useState<CrimeReport | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recipient: RECIPIENTS[0],
    title: '',
    summary: '',
    findings: '',
    recommendations: '',
  });

  React.useEffect(() => {
    let mounted = true;
    async function loadCase() {
      try {
        const response = await ReportService.getReportDetails(caseId);
        if (mounted) setCaseRecord(response.data ?? null);
      } catch (error: any) {
        toast.error('Unable to load case', { description: error?.message || 'Please try again.' });
      }
    }
    loadCase();
    return () => {
      mounted = false;
    };
  }, [caseId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!caseRecord) return;
    if (caseRecord.status !== 'closed') {
      toast.error('Case must be closed first', {
        description: 'Formal officer reports can only be submitted after case closure.',
      });
      return;
    }

    setIsSubmitting(true);
    const toastID = toast.loading('Submitting formal report');
    try {
      let attachmentUrl = '';
      if (attachment) {
        const upload = await UploadService.uploadFile(attachment, 'officer-reports');
        attachmentUrl = upload.data?.secureUrl || '';
      }
      const response = await OfficerReportService.createForCase(caseRecord.id, {
        ...formData,
        attachmentUrl,
      });
      toast.success(response.message || 'Formal report submitted', { id: toastID });
      const reportID = response.data?.id;
      router.push(reportID ? buildOfficerReportDetailHref(role, reportID) : reportsHref);
      router.refresh();
    } catch (error: any) {
      toast.error('Report submission failed', {
        id: toastID,
        description: error?.message || 'Please check the form and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xs flex flex-col gap-6">
      {caseRecord && (
        <div className="bg-background border border-border rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Attached Case</p>
          <p className="text-sm font-extrabold text-foreground mt-1">{caseRecord.crimeType}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{caseRecord.location}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Recipient</span>
          <select value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold">
            {RECIPIENTS.map((recipient) => <option key={recipient} value={recipient}>{recipient}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Title</span>
          <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold" />
        </label>
      </div>

      <TextArea label="Summary" value={formData.summary} onChange={(value) => setFormData({ ...formData, summary: value })} />
      <TextArea label="Findings" value={formData.findings} onChange={(value) => setFormData({ ...formData, findings: value })} />
      <TextArea label="Recommendations" value={formData.recommendations} onChange={(value) => setFormData({ ...formData, recommendations: value })} />

      <label className="border-2 border-dashed border-border rounded-xl p-5 flex items-center gap-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer relative">
        <input type="file" accept="image/*,.pdf" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} className="absolute inset-0 opacity-0 cursor-pointer" />
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{attachment ? attachment.name : 'Attach supporting document'}</p>
          <p className="text-[10px] font-semibold text-muted-foreground">Optional image or PDF</p>
        </div>
      </label>

      <button type="submit" disabled={isSubmitting || !caseRecord} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
        <FileText className="w-4 h-4 text-accent" />
        Submit Formal Report
        <ArrowRight className="w-4 h-4 text-accent" />
      </button>
    </form>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} required rows={4} className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold resize-none" />
    </label>
  );
}
