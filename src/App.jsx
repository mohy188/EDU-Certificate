import React, { useState, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import Certificate from './components/Certificate';
import Toolbar from './components/Toolbar';
import PdfGenerator from './components/PdfGenerator';
import { downloadCertificatePdf } from './utils/pdf';

export default function App() {
  // State variables matching objective
  const [learnerName, setLearnerName] = useState('JOHN SMITH');
  const [courseDate, setCourseDate] = useState('2023-05-24'); // Match sample date
  const [signature, setSignature] = useState(null);
  const [originalSignature, setOriginalSignature] = useState(null);
  
  // Custom interactive helper states
  const [scale, setScale] = useState(0.75); // Fits well in default UI
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Ref to target the physical certificate DOM element
  const certificateRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleGenerate = () => {
    if (!learnerName.trim()) {
      triggerToast('Error: Please enter a valid Learner Name.');
      return;
    }
    if (!courseDate) {
      triggerToast('Error: Please enter a Course Date.');
      return;
    }
    triggerToast('Success: Certificate generated and refreshed!');
  };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    triggerToast('Generating PDF... Please wait.');
    
    try {
      await downloadCertificatePdf(certificateRef.current, learnerName);
      triggerToast('Success: PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Error: Failed to download PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // Triggers standard window print which isolates the certificate through CSS3 media queries
    window.print();
  };

  const handleReset = () => {
    setLearnerName('JOHN SMITH');
    setCourseDate('2023-05-24');
    setSignature(null);
    setOriginalSignature(null);
    setScale(0.75);
    triggerToast('Form has been reset to defaults.');
  };

  return (
    <div className="app-container" id="app-root-layout">
      {/* Control Panel Sidebar */}
      <ControlPanel
        learnerName={learnerName}
        setLearnerName={setLearnerName}
        courseDate={courseDate}
        setCourseDate={setCourseDate}
        signature={signature}
        originalSignature={originalSignature}
        setSignature={setSignature}
        setOriginalSignature={setOriginalSignature}
        onGenerate={handleGenerate}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
        onReset={handleReset}
      />

      {/* Main Certificate Preview Pane */}
      <main className="certificate-view-area" id="main-preview-pane">
        {/* Dynamic Zoom & Tip Toolbar */}
        <Toolbar scale={scale} setScale={setScale} />
        
        {/* Certificate Display Canvas */}
        <div 
          className="zoom-container" 
          style={{ transform: `scale(${scale})` }}
          id="zoom-wrapper"
        >
          <Certificate
            ref={certificateRef}
            learnerName={learnerName}
            courseDate={courseDate}
            signature={signature}
          />
        </div>

        {/* High-Resolution PDF Compilation Spinner Overlay */}
        <PdfGenerator isGenerating={isGenerating} />

        {/* Interactive feedback toast banner */}
        {toastMessage && (
          <div 
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: toastMessage.startsWith('Error') ? '#ef4444' : '#1e293b',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              transition: 'all 0.3s'
            }}
            id="toast-notification"
          >
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
}
