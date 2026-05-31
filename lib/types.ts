export type UserRole = 'student' | 'staff' | 'cso' | 'warden' | 'dean' | 'admin';
export type UserStatus = 'active' | 'pending_verification' | 'rejected';
export type ReportStatus = 'pending' | 'under-investigation' | 'resolved' | 'closed';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  matricNumber?: string;
  idCardUrl?: string;
  status: UserStatus;
  registrationNotes?: string;
  createdAt: string;
}

export interface CrimeReport {
  id: string;
  userId?: string;
  studentId?: string;
  reporterName?: string;
  reporterPhone?: string;
  crimeType: string;
  description: string;
  location: string;
  isHostelIncident?: boolean;
  isAnonymous?: boolean;
  dateOfIncident: string;
  timeOfIncident: string;
  status: ReportStatus;
  evidenceUrl?: string;
  evidence?: ReportEvidence[];
  evidenceUrls?: string[];
  involvedRoles?: UserRole[];
  createdAt: string;
  updatedAt?: string;
}

export interface ReportEvidence {
  id: string;
  reportId: string;
  fileUrl: string;
  publicId?: string;
  resourceType: 'image' | 'video' | 'raw' | string;
  format?: string;
  bytes: number;
  createdAt: string;
}

export interface CaseUpdate {
  id: string;
  reportId: string;
  updateDetails: string;
  newStatus: string;
  updatedBy: string; // e.g., "CSO", "Dean"
  createdAt: string;
}

export interface PaginatedReports {
  items: CrimeReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OfficerReport {
  id: string;
  reportId: string;
  caseTitle?: string;
  caseLocation?: string;
  authorId: string;
  authorName?: string;
  authorRole: UserRole;
  recipient: string;
  title: string;
  summary: string;
  findings: string;
  recommendations: string;
  attachmentUrl?: string;
  createdAt: string;
}

export type HearingStatus = 'scheduled' | 'pending_evidence' | 'completed' | 'cancelled';

export interface PanelHearing {
  id: string;
  createdBy: string;
  createdByName?: string;
  studentName: string;
  studentIdentifier: string;
  charge: string;
  hearingDate: string;
  hearingTime: string;
  location: string;
  status: HearingStatus;
  notes?: string;
  meetingSummary?: string;
  evidenceUrl?: string;
  evidencePublicId?: string;
  evidenceType?: string;
  evidenceFormat?: string;
  evidenceBytes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedHearings {
  items: PanelHearing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditEvent {
  id: string;
  actorId?: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PaginatedAuditEvents {
  items: AuditEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminOverview {
  stats: {
    pendingVerifications: number;
    activeAuthorities: number;
    openCases: number;
    closedCases: number;
    securityAlerts: number;
    totalCases: number;
  };
  authorityWorkload: Array<{
    role: UserRole;
    label: string;
    openCases: number;
    totalCases: number;
  }>;
  verificationQueue: User[];
  recentCases: CrimeReport[];
}

export interface APIErrorDetails {
  code: string;
  details?: unknown;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: APIErrorDetails;
}
