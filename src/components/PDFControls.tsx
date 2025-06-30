import React from 'react';
import { FileText } from 'lucide-react';
import { PDFSettings } from '../types';

interface PDFControlsProps {
  settings: PDFSettings;
  onSettingsChange: (settings: Partial<PDFSettings>) => void;
  disabled?: boolean;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  settings,
  onSettingsChange,
  disabled = false,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <FileText className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">PDF Settings</h3>
      </div>
      
      <div className="space-y-6">
        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Page Size
          </label>
          <select
            value={settings.pageSize}
            onChange={(e) => onSettingsChange({ pageSize: e.target.value as any })}
            disabled={disabled}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="A3">A3 (297 × 420 mm)</option>
            <option value="Letter">Letter (8.5 × 11 in)</option>
            <option value="Legal">Legal (8.5 × 14 in)</option>
          </select>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Orientation
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSettingsChange({ orientation: 'portrait' })}
              disabled={disabled}
              className={`p-3 border rounded-lg transition-colors disabled:opacity-50 ${
                settings.orientation === 'portrait'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Portrait
            </button>
            <button
              onClick={() => onSettingsChange({ orientation: 'landscape' })}
              disabled={disabled}
              className={`p-3 border rounded-lg transition-colors disabled:opacity-50 ${
                settings.orientation === 'landscape'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Landscape
            </button>
          </div>
        </div>

        {/* Images per page */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Images per page: {settings.imagesPerPage}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={settings.imagesPerPage}
            onChange={(e) => onSettingsChange({ imagesPerPage: parseInt(e.target.value) })}
            disabled={disabled}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>

        {/* Margin */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Margin: {settings.margin}mm
          </label>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={settings.margin}
            onChange={(e) => onSettingsChange({ margin: parseInt(e.target.value) })}
            disabled={disabled}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 slider-thumb"
          />
        </div>

        {/* Fit to page */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.fitToPage}
              onChange={(e) => onSettingsChange({ fitToPage: e.target.checked })}
              disabled={disabled}
              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="ml-2 text-sm text-gray-300">Fit images to page</span>
          </label>
        </div>
      </div>
    </div>
  );
};