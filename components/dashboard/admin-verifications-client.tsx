'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ExternalLink, Search, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/empty-state';
import { TablePaginationFooter } from '@/components/dashboard/table-pagination-footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminService } from '@/lib/services/admin.service';
import type { PaginatedUsers, User } from '@/lib/types';

export type AdminVerificationSearchParams = {
  page?: string;
  q?: string;
  sort?: string;
};

export function AdminVerificationsClient({ verifications, params }: { verifications?: PaginatedUsers; params: AdminVerificationSearchParams }) {
  const router = useRouter();
  const [rejectingID, setRejectingID] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [busyID, setBusyID] = useState<string | null>(null);
  const users = verifications?.items ?? [];

  const approve = async (user: User) => {
    setBusyID(user.id);
    const toastID = toast.loading('Approving student');
    try {
      await AdminService.approveUser(user.id);
      toast.success(`${user.fullName} has been approved`, { id: toastID });
      router.refresh();
    } catch (error: any) {
      toast.error('Approval failed', {
        id: toastID,
        description: error?.message || 'Please try again.',
      });
    } finally {
      setBusyID(null);
    }
  };

  const reject = async (user: User) => {
    if (!notes.trim()) {
      toast.error('Rejection note required');
      return;
    }
    setBusyID(user.id);
    const toastID = toast.loading('Rejecting student');
    try {
      await AdminService.rejectUser(user.id, notes.trim());
      toast.success(`${user.fullName} has been rejected`, { id: toastID });
      setRejectingID(null);
      setNotes('');
      router.refresh();
    } catch (error: any) {
      toast.error('Rejection failed', {
        id: toastID,
        description: error?.message || 'Please try again.',
      });
    } finally {
      setBusyID(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <VerificationFilters params={params} />
        <div className="bg-card border border-border rounded-2xl">
          <EmptyState
            title="No pending student verifications"
            description="Students awaiting ID-card review will appear here."
            icon={ShieldCheck}
          />
        </div>
        {verifications && (
          <TablePaginationFooter
            basePath="/admin/verifications"
            params={params}
            page={verifications.page}
            totalPages={verifications.totalPages}
            total={verifications.total}
            pageSize={verifications.limit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <VerificationFilters params={params} />
      <div className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Student</TableHead>
              <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Matric</TableHead>
              <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Contact</TableHead>
              <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">ID Card</TableHead>
              <TableHead className="px-5 py-3 text-right text-[10px] font-black uppercase text-muted-foreground">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="px-5 py-4 align-top">
                    <p className="text-sm font-extrabold text-foreground">{user.fullName}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                      Submitted {new Date(user.createdAt).toLocaleDateString('en-NG')}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-top text-xs font-bold text-foreground">{user.matricNumber || 'Not provided'}</TableCell>
                  <TableCell className="px-5 py-4 align-top">
                    <p className="text-xs font-semibold text-foreground">{user.email}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{user.phone}</p>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-top">
                    {user.idCardUrl ? (
                      <a
                        href={user.idCardUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                      >
                        View ID
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">Missing</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 align-top">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => approve(user)}
                        disabled={busyID === user.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-95 disabled:opacity-50"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-accent" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingID(rejectingID === user.id ? null : user.id);
                          setNotes('');
                        }}
                        disabled={busyID === user.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50"
                      >
                        <UserX className="w-3.5 h-3.5 text-muted-foreground" />
                        Reject
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                {rejectingID === user.id && (
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={5} className="px-5 py-4">
                      <div className="flex flex-col md:flex-row gap-3">
                        <textarea
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          rows={2}
                          placeholder="Reason for rejection..."
                          className="flex-1 bg-background border border-border text-foreground py-3 px-4 rounded-xl text-xs font-semibold resize-none placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => reject(user)}
                          disabled={busyID === user.id || !notes.trim()}
                          className="md:w-36 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-95 disabled:opacity-50"
                        >
                          Confirm Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {verifications && (
        <TablePaginationFooter
          basePath="/admin/verifications"
          params={params}
          page={verifications.page}
          totalPages={verifications.totalPages}
          total={verifications.total}
          pageSize={verifications.limit}
        />
      )}
    </div>
  );
}

function VerificationFilters({ params }: { params: AdminVerificationSearchParams }) {
  return (
    <form action="/admin/verifications" className="grid grid-cols-1 md:grid-cols-[1fr_160px_auto] gap-3 bg-card border border-border p-4 rounded-2xl shadow-2xs">
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input name="q" defaultValue={params.q || ''} placeholder="Search name, email, phone, matric..." className="w-full bg-background border border-border text-foreground py-2.5 pl-9 pr-3 rounded-xl text-xs font-semibold" />
      </div>
      <select name="sort" defaultValue={params.sort || 'oldest'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="oldest">Oldest first</option>
        <option value="newest">Newest first</option>
        <option value="name">Name</option>
      </select>
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Apply</button>
    </form>
  );
}
