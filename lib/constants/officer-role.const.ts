import { APP_ROUTES } from './routes.const';
import type { UserRole } from '@/lib/types';

export type OfficerRole = 'cso' | 'dean' | 'warden';

export interface OfficerRoleConfig {
  role: OfficerRole;
  label: string;
  overviewTitle: string;
  overviewSubtitle: string;
  casesTitle: string;
  casesSubtitle: string;
  queueLabel: string;
  caseScope: string;
  casesHref: string;
  reportsHref: string;
  hearingsHref?: string;
  newHearingHref?: string;
  addableRoles: UserRole[];
}

export const OFFICER_ROLE_CONFIG: Record<OfficerRole, OfficerRoleConfig> = {
  cso: {
    role: 'cso',
    label: 'CSO',
    overviewTitle: 'Overview',
    overviewSubtitle: 'Chief Security Officer campus security summary.',
    casesTitle: 'Security Cases',
    casesSubtitle: 'Security queue and cases where CSO has been manually added.',
    queueLabel: 'Security Queue',
    caseScope: 'security',
    casesHref: APP_ROUTES.CSO_CASES,
    reportsHref: APP_ROUTES.CSO_REPORTS,
    addableRoles: ['dean', 'warden'],
  },
  dean: {
    role: 'dean',
    label: 'Dean',
    overviewTitle: 'Overview',
    overviewSubtitle: 'Dean student conduct and disciplinary case summary.',
    casesTitle: 'Conduct Cases',
    casesSubtitle: 'Student conduct cases and cases where Dean has been manually added.',
    queueLabel: 'Conduct Queue',
    caseScope: 'conduct',
    casesHref: APP_ROUTES.DEAN_CASES,
    reportsHref: APP_ROUTES.DEAN_REPORTS,
    hearingsHref: APP_ROUTES.DEAN_HEARINGS,
    newHearingHref: APP_ROUTES.DEAN_NEW_HEARING,
    addableRoles: ['cso', 'warden'],
  },
  warden: {
    role: 'warden',
    label: 'Warden',
    overviewTitle: 'Overview',
    overviewSubtitle: 'Hostel and residential case summary.',
    casesTitle: 'Hostel Cases',
    casesSubtitle: 'Hostel cases and cases where Warden has been manually added.',
    queueLabel: 'Hostel Queue',
    caseScope: 'hostel',
    casesHref: APP_ROUTES.WARDEN_CASES,
    reportsHref: APP_ROUTES.WARDEN_REPORTS,
    addableRoles: ['cso', 'dean'],
  },
};

export function getOfficerRoleConfig(role: string) {
  return OFFICER_ROLE_CONFIG[role as OfficerRole] ?? null;
}

export function buildOfficerCaseDetailHref(role: OfficerRole, id: string) {
  return `/${role}/cases/${id}`;
}

export function buildOfficerReportDetailHref(role: OfficerRole, id: string) {
  return `/${role}/reports/${id}`;
}

export function buildOfficerNewReportHref(role: OfficerRole, caseId: string) {
  return `/${role}/reports/new?caseId=${caseId}`;
}
