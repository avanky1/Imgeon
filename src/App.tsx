import React, { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Image as ImageIcon, FileText } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ImageGrid } from './components/ImageGrid';
import { OperationControls } from './components/OperationControls';
import { PDFControls } from './components/PDFControls';
import { ProcessingStatus } from './components/ProcessingStatus';
import { useImageProcessor } from './hooks/useImageProcessor';
import { ImageSettings, UploadedFile, PDFSettings } from './types';
import { getDefaultSettings, getStoredSettings, storeSettings } from './utils/storage';
import { downloadFile, formatFileSize } from './utils/imageProcessor';
import { createPDF } from './utils/pdfProcessor';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [settings, setSettings] = useState<ImageSettings>(getDefaultSettings);
  const [pdfSettings, setPdfSettings] = useState<PDFSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    imagesPerPage: 1,
    fitToPage: true,
  });
  const { processMultipleImages, isProcessing, progress } = useImageProcessor();

  // Load stored settings on mount
  useEffect(() => {
    const storedSettings = getStoredSettings();
    setSettings(prev => ({ ...prev, ...storedSettings }));
  }, []);

  const handleFileUpload = useCallback((files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const handleReorderImages = useCallback((oldIndex: number, newIndex: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, removed);
      return newFiles;
    });
  }, []);

  const handleSettingsChange = useCallback((newSettings: Partial<ImageSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      storeSettings(updated);
      return updated;
    });
  }, []);

  const handlePDFSettingsChange = useCallback((newSettings: Partial<PDFSettings>) => {
    setPdfSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (uploadedFiles.length === 0) return;

    if (settings.format === 'pdf') {
      // Create PDF from multiple images
      try {
        const pdfBlob = await createPDF(uploadedFiles, pdfSettings);
        const fileName = `converted_images_${new Date().toISOString().split('T')[0]}.pdf`;
        downloadFile(pdfBlob, fileName);
      } catch (error) {
        console.error('PDF creation failed:', error);
        alert('Failed to create PDF. Please try again.');
      }
    } else {
      // Process and download individual images
      const processedFiles = await processMultipleImages(uploadedFiles, settings);
      
      processedFiles.forEach((file, index) => {
        if (file.processedImage) {
          const fileName = `${file.file.name.split('.')[0]}_converted.${settings.format}`;
          setTimeout(() => {
            downloadFile(file.processedImage!.blob, fileName);
          }, index * 100); // Stagger downloads
        }
      });
    }
  }, [uploadedFiles, settings, pdfSettings, processMultipleImages]);

  const handleReset = useCallback(() => {
    setUploadedFiles([]);
    setSettings(getDefaultSettings());
    setPdfSettings({
      pageSize: 'A4',
      orientation: 'portrait',
      margin: 20,
      imagesPerPage: 1,
      fitToPage: true,
    });
  }, []);

  const getTotalSize = () => {
    return uploadedFiles.reduce((total, file) => total + file.originalSize, 0);
  };

  const getProcessingMessage = () => {
    if (settings.format === 'pdf') {
      return 'Creating PDF...';
    }
    return `Processing ${uploadedFiles.length} image${uploadedFiles.length > 1 ? 's' : ''}...`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Multi-Image Converter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Convert multiple images to different formats or combine them into a PDF. 
            All processing happens locally in your browser - no uploads required.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {uploadedFiles.length === 0 ? (
            /* Upload Area */
            <div className="max-w-2xl mx-auto">
              <ImageUploader 
                onFileUpload={handleFileUpload}
                disabled={isProcessing}
                multiple={true}
              />
            </div>
          ) : (
            /* Processing Interface */
            <div className="space-y-8">
              {/* Image Grid */}
              <ImageGrid
                images={uploadedFiles}
                onRemoveImage={handleRemoveImage}
                onReorderImages={handleReorderImages}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                  <OperationControls
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    disabled={isProcessing}
                  />
                  
                  {settings.format === 'pdf' && (
                    <PDFControls
                      settings={pdfSettings}
                      onSettingsChange={handlePDFSettingsChange}
                      disabled={isProcessing}
                    />
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={isProcessing || uploadedFiles.length === 0}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {settings.format === 'pdf' ? (
                        <FileText className="w-5 h-5 mr-2" />
                      ) : (
                        <Download className="w-5 h-5 mr-2" />
                      )}
                      {settings.format === 'pdf' 
                        ? 'Create PDF' 
                        : `Download ${uploadedFiles.length} Image${uploadedFiles.length > 1 ? 's' : ''}`
                      }
                    </button>
                    
                    <ImageUploader 
                      onFileUpload={handleFileUpload}
                      disabled={isProcessing}
                      multiple={true}
                      hasImages={true}
                    />
                    
                    <button
                      onClick={handleReset}
                      disabled={isProcessing}
                      className="flex items-center justify-center px-6 py-3 bg-gray-700 text-gray-200 font-medium rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Start Over
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{uploadedFiles.length}</div>
                        <div className="text-sm text-gray-400">Images</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{formatFileSize(getTotalSize())}</div>
                        <div className="text-sm text-gray-400">Total Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{settings.format.toUpperCase()}</div>
                        <div className="text-sm text-gray-400">Output Format</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {settings.format === 'pdf' ? '1' : uploadedFiles.length}
                        </div>
                        <div className="text-sm text-gray-400">
                          {settings.format === 'pdf' ? 'PDF File' : 'Output Files'}
                        </div>
                      </div>
                    </div>
                    
                    {settings.format === 'pdf' && (
                      <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                        <h4 className="font-medium text-blue-300 mb-2">PDF Settings</h4>
                        <div className="text-sm text-blue-200 space-y-1">
                          <p>Page Size: {pdfSettings.pageSize} ({pdfSettings.orientation})</p>
                          <p>Images per page: {pdfSettings.imagesPerPage}</p>
                          <p>Margin: {pdfSettings.margin}mm</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>All processing happens in your browser. Your images never leave your device.</p>
        </div>
      </div>

      {/* Processing Overlay */}
      <ProcessingStatus 
        isProcessing={isProcessing} 
        progress={progress}
        message={getProcessingMessage()}
      />
    </div>
  );
}

export default App;