import { api } from './api';

export class UploadService {
  static async uploadFile(file: File, type: 'resume' | 'avatar' | 'company-logo' = 'resume'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }

  static validateFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    // Check file size (default 5MB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload PDF, DOC, DOCX, or TXT files only.'
      };
    }

    return { valid: true };
  }
}

export default UploadService;
