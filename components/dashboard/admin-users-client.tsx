'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Search, UserX } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/empty-state';
import { TablePaginationFooter } from '@/components/dashboard/table-pagination-footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminService } from '@/lib/services/admin.service';
import type { PaginatedUsers, User, UserRole, UserStatus } from '@/lib/types';

export type AdminUserSearchParams = {
  page?: string;
  role?: string;
  status?: string;
  q?: string;
  sort?: string;
};

export function AdminUsersClient({ users, params }: { users?: PaginatedUsers; params: AdminUserSearchParams }) {
  const router = useRouter();
  const [busyID, setBusyID] = useState<string | null>(null);
  const items = users?.items ?? [];

  const updateStatus = async (user: User, status: UserStatus) => {
    setBusyID(user.id);
    const toastID = toast.loading('Updating user');
    try {
      await AdminService.updateUserStatus(user.id, status);
      toast.success(`${user.fullName} updated`, { id: toastID });
      router.refresh();
    } catch (error: any) {
      toast.error('Update failed', {
        id: toastID,
        description: error?.message || 'Please try again.',
      });
    } finally {
      setBusyID(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <UserFilters params={params} />

      <div className="bg-card border border-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-foreground">User Directory</h2>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {users?.total ?? 0} {(users?.total ?? 0) === 1 ? 'user' : 'users'} found.
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">User</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Role</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Status</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Matric</TableHead>
                <TableHead className="px-5 py-3 text-[10px] font-black uppercase text-muted-foreground">Joined</TableHead>
                <TableHead className="px-5 py-3 text-right text-[10px] font-black uppercase text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell className="px-5 py-4">
                    <p className="text-sm font-extrabold text-foreground">{user.fullName}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{user.email}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{user.phone}</p>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-xs font-bold text-foreground capitalize">{roleLabel(user.role)}</TableCell>
                  <TableCell className="px-5 py-4"><StatusPill status={user.status} /></TableCell>
                  <TableCell className="px-5 py-4 text-xs font-semibold text-muted-foreground">{user.matricNumber || '-'}</TableCell>
                  <TableCell className="px-5 py-4 text-xs font-semibold text-muted-foreground">{new Date(user.createdAt).toLocaleDateString('en-NG')}</TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {user.status !== 'active' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(user, 'active')}
                          disabled={busyID === user.id}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-95 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                          Activate
                        </button>
                      )}
                      {user.status === 'active' && user.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(user, 'rejected')}
                          disabled={busyID === user.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50"
                        >
                          <UserX className="w-3.5 h-3.5 text-muted-foreground" />
                          Deactivate
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title="No users found" description="Try adjusting your filters or search." icon={Search} />
        )}
      </div>

      {users && (
        <TablePaginationFooter
          basePath="/admin/users"
          params={params}
          page={users.page}
          totalPages={users.totalPages}
          total={users.total}
          pageSize={users.limit}
        />
      )}
    </div>
  );
}

function UserFilters({ params }: { params: AdminUserSearchParams }) {
  return (
    <form action="/admin/users" className="grid grid-cols-1 md:grid-cols-[1fr_150px_180px_150px_auto] gap-3 bg-card border border-border p-4 rounded-2xl shadow-2xs">
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input name="q" defaultValue={params.q || ''} placeholder="Search name, email, phone, matric..." className="w-full bg-background border border-border text-foreground py-2.5 pl-9 pr-3 rounded-xl text-xs font-semibold" />
      </div>
      <select name="role" defaultValue={params.role || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All roles</option>
        <option value="student">Student</option>
        <option value="staff">Staff</option>
        <option value="cso">CSO</option>
        <option value="dean">Dean</option>
        <option value="warden">Warden</option>
        <option value="admin">Admin</option>
      </select>
      <select name="status" defaultValue={params.status || 'all'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="pending_verification">Pending Verification</option>
        <option value="rejected">Rejected</option>
      </select>
      <select name="sort" defaultValue={params.sort || 'newest'} className="bg-background border border-border text-foreground py-2.5 px-3 rounded-xl text-xs font-bold">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="name">Name</option>
      </select>
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Apply</button>
    </form>
  );
}

function StatusPill({ status }: { status: UserStatus }) {
  const tone = status === 'active'
    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    : status === 'pending_verification'
      ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
      : 'bg-zinc-100 text-zinc-700 border-zinc-200';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${tone}`}>{status.replace('_', ' ')}</span>;
}

function roleLabel(role: UserRole) {
  if (role === 'cso') return 'CSO';
  return role;
}
