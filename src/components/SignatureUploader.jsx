import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2, Wand2, RefreshCw, Eye } from 'lucide-react';
import { fileToBase64 } from '../utils/helpers';
import { removeBackgroundAI, makeWhiteTransparent } from '../utils/backgroundRemoval';

export default function SignatureUploader({ 
  signature, 
  originalSignature,
  setSignature, 
  setOriginalSignature 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setProcessingError('');
      try {
        const file = acceptedFiles[0];
        const base64Data = await fileToBase64(file);
        setOriginalSignature(base64Data); // Keep a copy of original
        
        // Auto-run AI Background removal on upload for maximum usability!
        setIsProcessing(true);
        try {
          const processed = await removeBackgroundAI(base64Data, 185);
          setSignature(processed);
        } catch (autoErr) {
          console.error('Auto background removal failed, using original:', autoErr);
          setSignature(base64Data);
        } finally {
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setProcessingError('Failed to read file. Please try another image.');
      }
    }
  }, [setSignature, setOriginalSignature]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    multiple: false
  });

  const handleRemoveBackgroundAI = async () => {
    if (!originalSignature) return;
    setIsProcessing(true);
    setProcessingError('');
    try {
      const processed = await removeBackgroundAI(originalSignature, 185);
      setSignature(processed);
    } catch (err) {
      console.error('Error in AI background removal:', err);
      setProcessingError('AI removal failed. Try making white transparent instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMakeWhiteTransparent = async () => {
    if (!originalSignature) return;
    setIsProcessing(true);
    setProcessingError('');
    try {
      const processed = await makeWhiteTransparent(originalSignature, 175);
      setSignature(processed);
    } catch (err) {
      console.error('Error in transparency calculation:', err);
      setProcessingError('Transparency process failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetOriginal = () => {
    if (originalSignature) {
      setSignature(originalSignature);
      setProcessingError('');
    }
  };

  const handleRemoveSignature = () => {
    setSignature(null);
    setOriginalSignature(null);
    setProcessingError('');
  };

  return (
    <div className="form-group">
      <label id="lbl-signature-upload">Trainer Signature (Fahad Mahmand)</label>
      
      {!signature ? (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          id="dropzone-signature"
        >
          <input {...getInputProps()} />
          <Upload className="dropzone-icon" size={24} />
          <p>Drag & drop signature image, or click to browse</p>
          <span className="dropzone-sub">Supports PNG, JPG, JPEG, SVG</span>
        </div>
      ) : (
        <div className="signature-preview-container" id="sig-preview-panel">
          <img 
            src={signature} 
            alt="Signature preview" 
            className="signature-thumbnail"
            referrerPolicy="no-referrer"
          />
          
          <div className="signature-tools">
            <div className="tool-row">
              <button 
                type="button" 
                className="tool-btn primary"
                onClick={handleRemoveBackgroundAI}
                disabled={isProcessing}
                title="AI algorithm to isolate signature ink lines"
                id="btn-remove-bg-ai"
              >
                <Wand2 size={13} />
                {isProcessing ? 'Processing...' : 'Remove BG (AI)'}
              </button>
              
              <button 
                type="button" 
                className="tool-btn"
                onClick={handleMakeWhiteTransparent}
                disabled={isProcessing}
                title="Clears pure white paper background pixels"
                id="btn-white-transparent"
              >
                <Eye size={13} />
                Make White Trans.
              </button>
            </div>
            
            <div className="tool-row">
              <button 
                type="button" 
                className="tool-btn"
                onClick={handleResetOriginal}
                disabled={isProcessing}
                id="btn-reset-sig"
              >
                <RefreshCw size={13} />
                Reset Original
              </button>
              
              <button 
                type="button" 
                className="tool-btn danger"
                onClick={handleRemoveSignature}
                disabled={isProcessing}
                id="btn-delete-sig"
              >
                <Trash2 size={13} />
                Remove File
              </button>
            </div>
          </div>
          
          {processingError && (
            <span style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>
              {processingError}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
