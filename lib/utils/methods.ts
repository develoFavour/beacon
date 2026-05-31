import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { APIResponse } from '../types';

// Browser calls stay same-origin so Next route handlers can attach HttpOnly auth cookies.
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // 15 seconds request timeout
});

// Response Interceptor helper to format errors into our standard APIResponse shape
const handleRequestError = (error: any): never => {
  const customErrorResponse: APIResponse<any> = {
    success: false,
    message: 'A network communication error occurred.',
    error: {
      code: 'NETWORK_ERROR',
      details: error.message,
    },
  };

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<APIResponse<any>>;
    if (axiosError.response && axiosError.response.data) {
      // Re-route the structured JSON response returned from the Go backend
      throw axiosError.response.data;
    } else {
      // Capture HTTP failures that don't have custom response bodies (e.g. 502, 504 gateway failures)
      customErrorResponse.message = axiosError.message;
      customErrorResponse.error = {
        code: `HTTP_${axiosError.response?.status || 'ERROR'}`,
        details: axiosError.response?.statusText || 'Unable to contact Go backend server.',
      };
      throw customErrorResponse;
    }
  }

  throw customErrorResponse;
};

// Reusable Exported DRY HTTP Methods returning structured APIResponse<T> directly
export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
    try {
      const response = await apiClient.get<APIResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return handleRequestError(error);
    }
  },

  post: async <T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
    try {
      const response = await apiClient.post<APIResponse<T>>(url, payload, config);
      return response.data;
    } catch (error: any) {
      return handleRequestError(error);
    }
  },

  put: async <T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
    try {
      const response = await apiClient.put<APIResponse<T>>(url, payload, config);
      return response.data;
    } catch (error: any) {
      return handleRequestError(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
    try {
      const response = await apiClient.delete<APIResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return handleRequestError(error);
    }
  },
};
