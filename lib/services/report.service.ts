import { API_ENDPOINTS } from '../constants/endpoints.const';
import { APIResponse, CaseUpdate, CrimeReport, PaginatedReports } from '../types';
import { http } from '../utils/methods';

export const ReportService = {
  // Submits a new crime report incident
  createReport: async (payload: any): Promise<APIResponse<CrimeReport>> => {
    return http.post<CrimeReport>(API_ENDPOINTS.REPORTS, payload);
  },

  // Fetches crime reports according to user role permissions
  getReports: async (query = ''): Promise<APIResponse<PaginatedReports>> => {
    return http.get<PaginatedReports>(`${API_ENDPOINTS.REPORTS}${query}`);
  },

  getSecurityReports: async (query = ''): Promise<APIResponse<PaginatedReports>> => {
    const suffix = query ? `&${query.replace(/^\?/, '')}` : '';
    return http.get<PaginatedReports>(`${API_ENDPOINTS.REPORTS}?scope=security${suffix}`);
  },

  getMyReports: async (query = ''): Promise<APIResponse<PaginatedReports>> => {
    const suffix = query ? `&${query.replace(/^\?/, '')}` : '';
    return http.get<PaginatedReports>(`${API_ENDPOINTS.REPORTS}?scope=mine${suffix}`);
  },

  // Retrieves high-fidelity details of a single report matching an ID
  getReportDetails: async (id: string): Promise<APIResponse<CrimeReport>> => {
    return http.get<CrimeReport>(API_ENDPOINTS.REPORT_DETAILS(id));
  },

  // Appends security logs or status audits (CSO, Warden, Dean)
  addCaseUpdate: async (id: string, payload: any): Promise<APIResponse<CaseUpdate>> => {
    return http.post<CaseUpdate>(API_ENDPOINTS.CASE_UPDATES(id), payload);
  },

  // Fetches the entire chronological audit trail history of a case
  getCaseUpdates: async (id: string): Promise<APIResponse<CaseUpdate[]>> => {
    return http.get<CaseUpdate[]>(API_ENDPOINTS.CASE_UPDATES(id));
  },

  addCaseInvolvement: async (id: string, role: string): Promise<APIResponse<unknown>> => {
    return http.post<unknown>(API_ENDPOINTS.CASE_INVOLVEMENTS(id), { role });
  },
};
