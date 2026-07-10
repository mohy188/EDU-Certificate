import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

export default function Toolbar({ scale, setScale }) {
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.4));
  };

  const handleResetZoom = () => {
    setScale(0.8); // Default visual scale
  };

  return (
    <div className="zoom-controls" style={{ width: '100%', marginBottom: '16px' }} id="preview-toolbar">
      <div className="drag-helper-banner" id="sig-drag-tip">
        <Move size={14} style={{ flexShrink: 0 }} />
        <span>Tip: You can drag and resize the signature directly on the certificate.</span>
      </div>
      
      <div className="zoom-btn-group">
        <button 
          onClick={handleZoomOut} 
          className="zoom-btn" 
          title="Zoom Out"
          id="btn-zoom-out"
        >
          <ZoomOut size={14} />
        </button>
        <span style={{ minWidth: '45px', textAlign: 'center', fontWeight: 500 }} id="zoom-percent-text">
          {Math.round(scale * 100)}%
        </span>
        <button 
          onClick={handleZoomIn} 
          className="zoom-btn" 
          title="Zoom In"
          id="btn-zoom-in"
        >
          <ZoomIn size={14} />
        </button>
        <button 
          onClick={handleResetZoom} 
          className="zoom-btn" 
          title="Reset View"
          id="btn-zoom-reset"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
