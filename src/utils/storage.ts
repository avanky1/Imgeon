import { ImageSettings } from '../types';

const STORAGE_KEY = 'image-converter-settings';

export const getStoredSettings = (): Partial<ImageSettings> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading stored settings:', error);
    return {};
  }
};

export const storeSettings = (settings: Partial<ImageSettings>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error storing settings:', error);
  }
};

export const getDefaultSettings = (): ImageSettings => ({
  format: 'png',
  quality: 0.9,
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  maintainAspectRatio: true,
  pdfPageSize: 'A4',
  pdfOrientation: 'portrait',
  pdfMargin: 20,
});