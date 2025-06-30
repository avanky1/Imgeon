import React from 'react';
import { RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { ImageSettings } from '../types';

interface OperationControlsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  disabled?: boolean;
}

export const OperationControls: React.FC<OperationControlsProps> = ({
  settings,
  onSettingsChange,
  disabled = false,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Image Settings</h3>
      
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Output Format
          </label>
          <select
            value={settings.format}
            onChange={(e) => onSettingsChange({ format: e.target.value as any })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
            <option value="pdf">PDF (Multiple Images)</option>
          </select>
        </div>

        {/* Quality Slider (for JPEG/WebP) */}
        {(settings.format === 'jpeg' || settings.format === 'webp') && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quality: {Math.round(settings.quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.quality}
              onChange={(e) => onSettingsChange({ quality: parseFloat(e.target.value) })}
              disabled={disabled}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 slider-thumb"
            />
          </div>
        )}

        {/* Resize Controls - Hide for PDF */}
        {settings.format !== 'pdf' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resize
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Width (px)"
                  value={settings.width || ''}
                  onChange={(e) => onSettingsChange({ 
                    width: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  disabled={disabled}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder-gray-400"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Height (px)"
                  value={settings.height || ''}
                  onChange={(e) => onSettingsChange({ 
                    height: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  disabled={disabled}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder-gray-400"
                />
              </div>
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={settings.maintainAspectRatio}
                onChange={(e) => onSettingsChange({ maintainAspectRatio: e.target.checked })}
                disabled={disabled}
                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-300">Maintain aspect ratio</span>
            </label>
          </div>
        )}

        {/* Transform Controls - Hide for PDF */}
        {settings.format !== 'pdf' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Transform
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onSettingsChange({ rotation: (settings.rotation + 90) % 360 })}
                disabled={disabled}
                className="flex items-center justify-center p-3 border border-gray-600 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSettingsChange({ flipHorizontal: !settings.flipHorizontal })}
                disabled={disabled}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors disabled:opacity-50 ${
                  settings.flipHorizontal 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSettingsChange({ flipVertical: !settings.flipVertical })}
                disabled={disabled}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors disabled:opacity-50 ${
                  settings.flipVertical 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FlipVertical className="w-5 h-5" />
              </button>
            </div>
            {settings.rotation !== 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Rotation: {settings.rotation}°
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};