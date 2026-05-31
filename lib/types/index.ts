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
  userId: string;
  reporterName?: string;
  reporterPhone?: string;
  crimeType: string;
  description: string;
  location: string;
  isHostelIncident: boolean;
  isAnonymous?: boolean;
  dateOfIncident: string;
  timeOfIncident: string;
  evidenceUrl?: string;
  involvedRoles?: UserRole[];
  status: ReportStatus;
  createdAt: string;
}

export interface CaseUpdate {
  id: string;
  reportId: string;
  updateDetails: string;
  updatedBy: string;
  newStatus: string;
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

// Unified API response contract mapping exactly to internal/utils/response.go
export interface APIErrorDetails {
  code: string;
  details?: any;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: APIErrorDetails;
}
