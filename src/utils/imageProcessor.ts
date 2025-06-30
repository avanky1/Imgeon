import { ImageSettings, ProcessedImage } from '../types';

export const processImage = async (
  file: File,
  settings: ImageSettings
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate dimensions
        let { width, height } = calculateDimensions(
          img.width,
          img.height,
          settings.width,
          settings.height,
          settings.maintainAspectRatio
        );

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Apply transformations
        ctx.save();

        // Center the image for transformations
        ctx.translate(width / 2, height / 2);

        // Apply rotation
        if (settings.rotation !== 0) {
          ctx.rotate((settings.rotation * Math.PI) / 180);
        }

        // Apply flips
        const scaleX = settings.flipHorizontal ? -1 : 1;
        const scaleY = settings.flipVertical ? -1 : 1;
        ctx.scale(scaleX, scaleY);

        // Draw the image centered
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();

        // Convert to desired format
        const mimeType = `image/${settings.format === 'pdf' ? 'jpeg' : settings.format}`;
        const quality = settings.format === 'jpeg' || settings.format === 'pdf' ? settings.quality : undefined;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to process image'));
              return;
            }

            const dataUrl = canvas.toDataURL(mimeType, quality);
            resolve({
              dataUrl,
              blob,
              size: blob.size,
              width,
              height,
            });
          },
          mimeType,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number,
  maintainAspectRatio = true
): { width: number; height: number } => {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  if (!maintainAspectRatio) {
    return {
      width: targetWidth || originalWidth,
      height: targetHeight || originalHeight,
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth && targetHeight) {
    const targetAspectRatio = targetWidth / targetHeight;
    if (aspectRatio > targetAspectRatio) {
      return { width: targetWidth, height: targetWidth / aspectRatio };
    } else {
      return { width: targetHeight * aspectRatio, height: targetHeight };
    }
  }

  if (targetWidth) {
    return { width: targetWidth, height: targetWidth / aspectRatio };
  }

  if (targetHeight) {
    return { width: targetHeight * aspectRatio, height: targetHeight };
  }

  return { width: originalWidth, height: originalHeight };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};