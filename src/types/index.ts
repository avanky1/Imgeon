export interface ImageSettings {
  format: 'png' | 'jpeg' | 'webp' | 'pdf';
  quality: number;
  width?: number;
  height?: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  maintainAspectRatio: boolean;
  pdfPageSize: 'A4' | 'A3' | 'Letter' | 'Legal';
  pdfOrientation: 'portrait' | 'landscape';
  pdfMargin: number;
}

export interface ProcessedImage {
  dataUrl: string;
  blob: Blob;
  size: number;
  width: number;
  height: number;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  processedImage?: ProcessedImage;
}

export interface PDFSettings {
  pageSize: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margin: number;
  imagesPerPage: number;
  fitToPage: boolean;
}