import { type NextRequest } from 'next/server';
import { backendApiUrl, jsonResponse } from '@/lib/server/backend-api';

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonResponse({
      success: false,
      message: 'Upload requests must use multipart/form-data.',
      error: { code: 'INVALID_UPLOAD_CONTENT_TYPE' },
    }, 400);
  }

  const formData = await request.formData();

  const response = await fetch(backendApiUrl('/uploads'), {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Backend returned a non-JSON response.',
    error: { code: 'NON_JSON_BACKEND_RESPONSE' },
  }));

  return jsonResponse(payload, response.status);
}
