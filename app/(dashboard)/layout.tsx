import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AUTH_COOKIES } from '@/lib/constants/auth.const';
import { APP_ROUTES } from '@/lib/constants/routes.const';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.TOKEN)?.value;
  const userName = cookieStore.get(AUTH_COOKIES.USER_NAME)?.value;
  const role = cookieStore.get(AUTH_COOKIES.USER_ROLE)?.value;

  if (!token || !userName || !role) {
    redirect(APP_ROUTES.LOGIN);
  }

  return <DashboardShell role={role} userName={userName}>{children}</DashboardShell>;
}
