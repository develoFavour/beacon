import { API_ENDPOINTS } from '../constants/endpoints.const';
import { APIResponse, PaginatedUsers, User, UserStatus } from '../types';
import { http } from '../utils/methods';

export const AdminService = {
  // Retrieves the complete list of pending student onboarding requests
  getPendingVerifications: async (query = ''): Promise<APIResponse<PaginatedUsers>> => {
    return http.get<PaginatedUsers>(`${API_ENDPOINTS.VERIFICATIONS}${query}`);
  },

  // Activates a student user profile, bypassing automated checks
  approveUser: async (id: string, notes?: string): Promise<APIResponse<User>> => {
    return http.post<User>(API_ENDPOINTS.APPROVE_USER(id), { notes });
  },

  // Denies a student registration and files auditing rejection feedback
  rejectUser: async (id: string, notes: string): Promise<APIResponse<User>> => {
    return http.post<User>(API_ENDPOINTS.REJECT_USER(id), { notes });
  },

  getUsers: async (query = ''): Promise<APIResponse<PaginatedUsers>> => {
    return http.get<PaginatedUsers>(`${API_ENDPOINTS.ADMIN_USERS}${query}`);
  },

  updateUserStatus: async (id: string, status: UserStatus, notes?: string): Promise<APIResponse<User>> => {
    return http.post<User>(API_ENDPOINTS.ADMIN_USER_STATUS(id), { status, notes });
  },
};
