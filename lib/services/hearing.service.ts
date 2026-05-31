import { API_ENDPOINTS } from '../constants/endpoints.const';
import { http } from '../utils/methods';
import type { APIResponse, PaginatedHearings, PanelHearing } from '../types';

export const HearingService = {
  list: async (query = ''): Promise<APIResponse<PaginatedHearings>> => {
    return http.get<PaginatedHearings>(`${API_ENDPOINTS.HEARINGS}${query}`);
  },

  create: async (payload: Record<string, unknown>): Promise<APIResponse<PanelHearing>> => {
    return http.post<PanelHearing>(API_ENDPOINTS.HEARINGS, payload);
  },

  details: async (id: string): Promise<APIResponse<PanelHearing>> => {
    return http.get<PanelHearing>(API_ENDPOINTS.HEARING_DETAILS(id));
  },

  update: async (id: string, payload: Record<string, unknown>): Promise<APIResponse<PanelHearing>> => {
    return http.put<PanelHearing>(API_ENDPOINTS.HEARING_DETAILS(id), payload);
  },
};
