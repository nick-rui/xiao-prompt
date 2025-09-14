import { IncomingForm } from 'formidable';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  publicUrl: string;
}

export class FileUploadHandler {
  private uploadDir: string;

  constructor() {
    // Use public/uploads directory for serving images
    this.uploadDir = path.join(process.cwd(), 'public/uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async parseFormData(request: NextRequest): Promise<{
    fields: Record<string, string>;
    files: Record<string, UploadedFile>;
  }> {
    return new Promise((resolve, reject) => {
      const form = new IncomingForm({
        uploadDir: this.uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
        filter: ({ mimetype }) => {
          // Only allow image files
          return mimetype?.startsWith('image/') || false;
        }
      });

      form.parse(request as any, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        const processedFields: Record<string, string> = {};
        const processedFiles: Record<string, UploadedFile> = {};

        // Process fields
        Object.entries(fields).forEach(([key, value]) => {
          processedFields[key] = Array.isArray(value) ? value[0] : value || '';
        });

        // Process files
        Object.entries(files).forEach(([key, file]) => {
          const fileObj = Array.isArray(file) ? file[0] : file;
          if (fileObj) {
            const filename = path.basename(fileObj.filepath);
            processedFiles[key] = {
              filepath: fileObj.filepath,
              originalFilename: fileObj.originalFilename || filename,
              mimetype: fileObj.mimetype || 'application/octet-stream',
              size: fileObj.size,
              publicUrl: `/uploads/${filename}`
            };
          }
        });

        resolve({
          fields: processedFields,
          files: processedFiles
        });
      });
    });
  }

  async saveUploadedFile(file: File): Promise<UploadedFile> {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const ext = path.extname(file.name);
    const filename = `${timestamp}_${randomId}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    return {
      filepath,
      originalFilename: file.name,
      mimetype: file.type,
      size: file.size,
      publicUrl: `/uploads/${filename}`
    };
  }

  async cleanupFile(filepath: string): Promise<void> {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.error('Failed to cleanup file:', error);
    }
  }

  // Convert uploaded file to base64 for API consumption
  async fileToBase64(filepath: string): Promise<string> {
    const buffer = fs.readFileSync(filepath);
    return buffer.toString('base64');
  }

  // Get full URL for uploaded file
  getFullUrl(publicUrl: string, baseUrl?: string): string {
    const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${base}${publicUrl}`;
  }
}

export const fileUploadHandler = new FileUploadHandler();
