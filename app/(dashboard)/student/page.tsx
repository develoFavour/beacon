'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Topbar } from '@/components/dashboard/topbar';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ReportCard } from '@/components/dashboard/report-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import type { CrimeReport } from '@/lib/types';

// Mock data for the dashboard
const MOCK_STATS = {
  total: 3,
  pending: 1,
  resolved: 2,
};

const RECENT_REPORTS: CrimeReport[] = [
  {
    id: 'REP-2023-001',
    studentId: 'STD-001',
    crimeType: 'Theft - Laptop',
    description: 'My laptop was stolen from the library reading room while I stepped out for 5 minutes.',
    location: 'Main University Library, 2nd Floor',
    dateOfIncident: '2023-10-24',
    timeOfIncident: '14:30',
    status: 'under-investigation',
    evidenceUrls: [],
    createdAt: '2023-10-24T15:00:00Z',
    updatedAt: '2023-10-25T09:00:00Z',
  },
  {
    id: 'REP-2023-002',
    studentId: 'STD-001',
    crimeType: 'Vandalism',
    description: 'Someone scratched my car parked near the engineering block.',
    location: 'Engineering Block Parking Lot',
    dateOfIncident: '2023-09-15',
    timeOfIncident: '18:00',
    status: 'resolved',
    evidenceUrls: [],
    createdAt: '2023-09-16T08:00:00Z',
    updatedAt: '2023-09-20T10:00:00Z',
  }
];

export default function StudentDashboardPage() {
  return (
    <>
      <Topbar 
        title="Student Dashboard" 
        subtitle="Overview of your safety reports and campus alerts." 
      />
      
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        
        {/* Welcome Banner */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col gap-2 relative z-10">
            <h2 className="text-2xl font-black tracking-tight">Welcome back, Favour.</h2>
            <p className="text-sm font-semibold text-primary-foreground/80 max-w-md leading-relaxed">
              Your campus safety portal. You can file new incident reports or track the status of your existing cases here.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href={APP_ROUTES.STUDENT_NEW_REPORT}
              className="px-6 py-3.5 bg-accent text-accent-foreground font-extrabold rounded-full text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              File New Report
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard 
            label="Total Reports Filed" 
            value={MOCK_STATS.total} 
            icon={FileText} 
            variant="dark"
          />
          <StatsCard 
            label="Pending / Investigating" 
            value={MOCK_STATS.pending} 
            icon={Clock} 
            variant="accent"
          />
          <StatsCard 
            label="Successfully Resolved" 
            value={MOCK_STATS.resolved} 
            icon={CheckCircle2} 
            variant="default"
          />
        </div>

        {/* Recent Reports Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">Recent Reports</h3>
            <Link 
              href={APP_ROUTES.STUDENT_REPORTS}
              className="text-xs font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {RECENT_REPORTS.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {RECENT_REPORTS.map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  href={APP_ROUTES.STUDENT_REPORT_DETAIL(report.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl">
              <EmptyState 
                title="No reports filed yet" 
                description="You haven't filed any safety reports on the portal. If you witness or experience an incident, you can report it here."
                action={
                  <Link
                    href={APP_ROUTES.STUDENT_NEW_REPORT}
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-full text-xs hover:opacity-90 transition-opacity mt-2 inline-block"
                  >
                    File First Report
                  </Link>
                }
              />
            </div>
          )}
        </div>

      </div>
    </>
  );
}
