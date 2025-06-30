import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { UploadedFile } from '../types';

interface ImageUploaderProps {
  onFileUpload: (files: UploadedFile[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  hasImages?: boolean;
}

const ACCEPTED_FORMATS = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileUpload,
  disabled = false,
  multiple = false,
  hasImages = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelection = useCallback((files: FileList) => {
    const validFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        alert(`${file.name} is not a supported format. Please select JPG, PNG, GIF, WebP, BMP, or TIFF files.`);
        return;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        originalSize: file.size,
      });
    });

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files);
    }
  }, [handleFileSelection, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  }, [handleFileSelection]);

  if (hasImages && multiple) {
    return (
      <button
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
        disabled={disabled}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add More Images
        <input
          id="file-input"
          type="file"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
          multiple={multiple}
        />
      </button>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
        ${isDragOver 
          ? 'border-blue-400 bg-blue-900/20 scale-105' 
          : 'border-gray-600 hover:border-gray-500'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-800/50'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
        multiple={multiple}
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
          ${isDragOver ? 'bg-blue-900/40' : 'bg-gray-700'}
        `}>
          {isDragOver ? (
            <Upload className="w-8 h-8 text-blue-400" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-300" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-medium text-white mb-2">
            {isDragOver 
              ? `Drop your image${multiple ? 's' : ''} here` 
              : `Upload image${multiple ? 's' : ''}`
            }
          </p>
          <p className="text-sm text-gray-300">
            Drag & drop or click to select
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports JPG, PNG, GIF, WebP, BMP, TIFF
            {multiple && ' • Multiple files supported'}
          </p>
        </div>
      </div>
    </div>
  );
};