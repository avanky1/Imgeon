import jsPDF from 'jspdf';
import { UploadedFile, PDFSettings } from '../types';

export const createPDF = async (
  images: UploadedFile[],
  settings: PDFSettings
): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: settings.orientation,
    unit: 'mm',
    format: settings.pageSize.toLowerCase() as any,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = settings.margin;
  const availableWidth = pageWidth - (margin * 2);
  const availableHeight = pageHeight - (margin * 2);

  let currentPage = 1;
  let imagesOnCurrentPage = 0;
  let yPosition = margin;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    // Load image to get dimensions
    const img = await loadImage(image.preview);
    const aspectRatio = img.width / img.height;

    let imgWidth = availableWidth;
    let imgHeight = imgWidth / aspectRatio;

    // If image is too tall, scale by height instead
    if (imgHeight > availableHeight / settings.imagesPerPage) {
      imgHeight = availableHeight / settings.imagesPerPage;
      imgWidth = imgHeight * aspectRatio;
    }

    // If we need a new page
    if (imagesOnCurrentPage >= settings.imagesPerPage || 
        (yPosition + imgHeight > pageHeight - margin && imagesOnCurrentPage > 0)) {
      pdf.addPage();
      currentPage++;
      imagesOnCurrentPage = 0;
      yPosition = margin;
    }

    // Center image horizontally
    const xPosition = margin + (availableWidth - imgWidth) / 2;

    // Add image to PDF
    pdf.addImage(
      image.preview,
      'JPEG',
      xPosition,
      yPosition,
      imgWidth,
      imgHeight
    );

    yPosition += imgHeight + 10; // Add some spacing between images
    imagesOnCurrentPage++;
  }

  return pdf.output('blob');
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const getPageDimensions = (pageSize: string, orientation: string) => {
  const dimensions = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    Letter: { width: 216, height: 279 },
    Legal: { width: 216, height: 356 },
  };

  const size = dimensions[pageSize as keyof typeof dimensions];
  return orientation === 'landscape' 
    ? { width: size.height, height: size.width }
    : size;
};