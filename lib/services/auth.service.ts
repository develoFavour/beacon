import { API_ENDPOINTS } from '../constants/endpoints.const';
import { APIResponse, User } from '../types';
import { http } from '../utils/methods';

export const AuthService = {
  // Registers new users and provides Cloudinary OCR details to the Go backend
  register: async (payload: any): Promise<APIResponse<User>> => {
    return http.post<User>(API_ENDPOINTS.REGISTER, payload);
  },

  // Log in registered users and fetch authentication credentials
  login: async (payload: any): Promise<APIResponse<{ token: string; user: User }>> => {
    return http.post<{ token: string; user: User }>(API_ENDPOINTS.LOGIN, payload);
  },

  forgotPassword: async (payload: { email: string }): Promise<APIResponse<null>> => {
    return http.post<null>(API_ENDPOINTS.FORGOT_PASSWORD, payload);
  },

  resetPassword: async (payload: { token: string; newPassword: string }): Promise<APIResponse<null>> => {
    return http.post<null>(API_ENDPOINTS.RESET_PASSWORD, payload);
  },

  // Fetches current user session profile matching stored JWT credentials
  me: async (): Promise<APIResponse<User>> => {
    return http.get<User>(API_ENDPOINTS.ME);
  },
};
