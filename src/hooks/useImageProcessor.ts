import { useState, useCallback } from 'react';
import { ImageSettings, ProcessedImage, UploadedFile } from '../types';
import { processImage } from '../utils/imageProcessor';

export const useImageProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImageFile = useCallback(
    async (
      uploadedFile: UploadedFile,
      settings: ImageSettings
    ): Promise<ProcessedImage | null> => {
      setIsProcessing(true);
      setProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const result = await processImage(uploadedFile.file, settings);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Small delay to show completion
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 500);

        return result;
      } catch (error) {
        console.error('Image processing failed:', error);
        setIsProcessing(false);
        setProgress(0);
        return null;
      }
    },
    []
  );

  const processMultipleImages = useCallback(
    async (
      uploadedFiles: UploadedFile[],
      settings: ImageSettings
    ): Promise<UploadedFile[]> => {
      setIsProcessing(true);
      setProgress(0);

      try {
        const processedFiles: UploadedFile[] = [];
        const total = uploadedFiles.length;

        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
          const processedImage = await processImage(file.file, settings);
          
          processedFiles.push({
            ...file,
            processedImage,
          });

          setProgress(((i + 1) / total) * 100);
        }

        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 500);

        return processedFiles;
      } catch (error) {
        console.error('Batch processing failed:', error);
        setIsProcessing(false);
        setProgress(0);
        return uploadedFiles;
      }
    },
    []
  );

  return {
    processImageFile,
    processMultipleImages,
    isProcessing,
    progress,
  };
};