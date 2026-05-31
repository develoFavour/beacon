export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/users/me',

  // Incident Reports
  REPORTS: '/reports',
  REPORT_DETAILS: (id: string) => `/reports/${id}`,
  
  // Case Updates
  CASE_UPDATES: (id: string) => `/reports/${id}/updates`,
  CASE_INVOLVEMENTS: (id: string) => `/reports/${id}/involvements`,
  CASE_OFFICER_REPORTS: (id: string) => `/reports/${id}/officer-reports`,
  OFFICER_REPORTS: '/officer-reports',
  OFFICER_REPORT_DETAILS: (id: string) => `/officer-reports/${id}`,
  HEARINGS: '/hearings',
  HEARING_DETAILS: (id: string) => `/hearings/${id}`,

  // Admin Verifications
  ADMIN_OVERVIEW: '/admin/overview',
  ADMIN_ACTIVITY: '/admin/activity',
  VERIFICATIONS: '/admin/verifications',
  APPROVE_USER: (id: string) => `/admin/verifications/${id}/approve`,
  REJECT_USER: (id: string) => `/admin/verifications/${id}/reject`,
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_STATUS: (id: string) => `/admin/users/${id}/status`,
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS] | string;
