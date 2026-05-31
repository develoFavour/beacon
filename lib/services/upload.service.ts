import { APIResponse } from '../types';

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes: number;
  ocrText?: string;
}
export const EVIDENCE_UPLOAD_MAX_BYTES = 25 * 1024 * 1024;
export const ID_CARD_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

export const UploadService = {
  uploadFile: async (file: File, folder = 'general'): Promise<APIResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const payload = (await response.json()) as APIResponse<UploadResult>;
    if (!response.ok || !payload.success) {
      throw payload;
    }

    return payload;
  },

  uploadIDCard: async (file: File): Promise<APIResponse<UploadResult>> => {
    return UploadService.uploadFile(file, 'student-id-cards');
  },
};
