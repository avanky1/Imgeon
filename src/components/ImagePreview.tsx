import React from 'react';
import { UploadedFile, ProcessedImage } from '../types';
import { formatFileSize } from '../utils/imageProcessor';

interface ImagePreviewProps {
  originalFile: UploadedFile;
  processedImage?: ProcessedImage;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalFile,
  processedImage,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Original</h4>
            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center border border-gray-600">
              <img
                src={originalFile.preview}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Size: {formatFileSize(originalFile.originalSize)}</p>
              <p>Format: {originalFile.file.type.split('/')[1].toUpperCase()}</p>
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Processed</h4>
            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center border border-gray-600">
              {processedImage ? (
                <img
                  src={processedImage.dataUrl}
                  alt="Processed"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <p className="text-sm">Processed image will appear here</p>
                </div>
              )}
            </div>
            {processedImage && (
              <div className="text-xs text-gray-400 space-y-1">
                <p>Size: {formatFileSize(processedImage.size)}</p>
                <p>Dimensions: {processedImage.width} × {processedImage.height}</p>
                <div className={`text-xs px-2 py-1 rounded ${
                  processedImage.size < originalFile.originalSize 
                    ? 'bg-green-900/50 text-green-300 border border-green-700' 
                    : 'bg-red-900/50 text-red-300 border border-red-700'
                }`}>
                  {processedImage.size < originalFile.originalSize ? '↓' : '↑'} 
                  {Math.abs(((processedImage.size - originalFile.originalSize) / originalFile.originalSize) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};