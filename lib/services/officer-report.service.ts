import { API_ENDPOINTS } from '../constants/endpoints.const';
import { http } from '../utils/methods';
import type { APIResponse, OfficerReport } from '../types';

export const OfficerReportService = {
  getMine: async (): Promise<APIResponse<OfficerReport[]>> => {
    return http.get<OfficerReport[]>(API_ENDPOINTS.OFFICER_REPORTS);
  },

  getById: async (id: string): Promise<APIResponse<OfficerReport>> => {
    return http.get<OfficerReport>(API_ENDPOINTS.OFFICER_REPORT_DETAILS(id));
  },

  getForCase: async (caseId: string): Promise<APIResponse<OfficerReport[]>> => {
    return http.get<OfficerReport[]>(API_ENDPOINTS.CASE_OFFICER_REPORTS(caseId));
  },

  createForCase: async (caseId: string, payload: Record<string, unknown>): Promise<APIResponse<OfficerReport>> => {
    return http.post<OfficerReport>(API_ENDPOINTS.CASE_OFFICER_REPORTS(caseId), payload);
  },
};
