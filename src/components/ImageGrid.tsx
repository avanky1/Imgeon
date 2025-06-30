import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { UploadedFile } from '../types';
import { formatFileSize } from '../utils/imageProcessor';

interface ImageGridProps {
  images: UploadedFile[];
  onRemoveImage: (id: string) => void;
  onReorderImages: (oldIndex: number, newIndex: number) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onRemoveImage,
  onReorderImages,
}) => {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorderImages(dragIndex, dropIndex);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Images ({images.length})
        </h3>
        <p className="text-sm text-gray-400">
          Drag to reorder
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="relative group bg-gray-700 rounded-lg overflow-hidden aspect-square cursor-move hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 border border-gray-600"
          >
            <img
              src={image.preview}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Drag handle */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-70 rounded p-1">
                <GripVertical className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Remove button */}
            <button
              onClick={() => onRemoveImage(image.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs truncate">{image.file.name}</p>
              <p className="text-xs text-gray-300">{formatFileSize(image.originalSize)}</p>
            </div>
            
            {/* Order number */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium shadow-lg">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};