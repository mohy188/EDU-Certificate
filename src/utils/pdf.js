import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generates a high-quality A4 PDF from a DOM element using a clean clone to prevent zoom artifacts.
 * @param {HTMLElement} element - The DOM element representing the certificate
 * @param {string} learnerName - The name of the learner, used for the filename
 * @returns {Promise<void>} - Resolves when PDF is generated and downloaded
 */
export async function downloadCertificatePdf(element, learnerName = 'Learner') {
  if (!element) {
    throw new Error('Certificate element not found');
  }

  // Create a clean clone of the certificate to avoid parent container scale, scrollbars, or flexbox restrictions
  const clone = element.cloneNode(true);
  
  // Style the clone to render offscreen at its true 1:1 dimensions
  clone.style.position = 'absolute';
  clone.style.top = '-10000px';
  clone.style.left = '-10000px';
  clone.style.width = '794px';
  clone.style.height = '1123px';
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.borderRadius = '0';
  clone.style.margin = '0';
  
  // Append to the body so the browser can lay it out in its true pixel grid
  document.body.appendChild(clone);
  
  try {
    // Wait for all images in the clone to load completely before capturing
    const images = clone.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if an image fails to load
      });
    });
    await Promise.all(imagePromises);

    // Capture the clone at 3x scale for crisp 300+ DPI print quality
    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#f4f6fc', // Explicit fallback matching the canvas base color
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Create A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add image to cover the entire page
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
    
    // Format filename
    const sanitizedName = learnerName
      .trim()
      .replace(/[^a-z0-9]/gi, '_')
      .toUpperCase();
    const filename = `EDU_First_Aid_Certificate_${sanitizedName || 'Learner'}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  } finally {
    // Clean up clone
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
