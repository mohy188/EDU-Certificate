import React from 'react';

export default function PdfGenerator({ isGenerating }) {
  if (!isGenerating) return null;

  return (
    <div className="pdf-loading-overlay" id="pdf-processing-overlay">
      <div className="spinner" id="spinner-element"></div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Compiling High-Resolution PDF</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-light)', fontWeight: 400 }}>
          Rendering vector fonts and signature strokes into A4 dimensions...
        </p>
      </div>
    </div>
  );
}
