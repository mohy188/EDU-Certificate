import React from 'react';
import { Award, Calendar, FileDown, Printer, RotateCcw, CheckCircle, Shield } from 'lucide-react';
import SignatureUploader from './SignatureUploader';

export default function ControlPanel({
  learnerName,
  setLearnerName,
  courseDate,
  setCourseDate,
  signature,
  originalSignature,
  setSignature,
  setOriginalSignature,
  onGenerate,
  onDownloadPdf,
  onPrint,
  onReset
}) {
  return (
    <aside className="control-panel" id="sidebar-controls">
      <div className="panel-header" id="panel-head-box">
        <h1>
          <Award className="dropzone-icon" size={24} style={{ color: 'var(--brand-blue)' }} />
          Certificate Manager
        </h1>
        <p>EDU Training Centre Ltd • UK Training Provider</p>
      </div>

      {/* Section 1: Certificate Details */}
      <div className="form-section" id="sec-cert-details">
        <h2 className="section-title" id="title-cert-details">
          <Award size={16} style={{ color: 'var(--brand-blue)' }} />
          Certificate Details
        </h2>

        {/* Learner Name Field */}
        <div className="form-group" id="grp-learner-name">
          <label htmlFor="input-learner-name">Learner Name</label>
          <input
            type="text"
            id="input-learner-name"
            className="form-input"
            placeholder="e.g. JOHN SMITH"
            value={learnerName}
            onChange={(e) => setLearnerName(e.target.value)}
          />
        </div>

        {/* Course Date Field */}
        <div className="form-group" id="grp-course-date">
          <label htmlFor="input-course-date">Course Date</label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              id="input-course-date"
              className="form-input"
              style={{ width: '100%' }}
              value={courseDate}
              onChange={(e) => setCourseDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Signature Section */}
      <div className="form-section" id="sec-signature">
        <h2 className="section-title" id="title-signature">
          <Shield size={16} style={{ color: 'var(--brand-blue)' }} />
          Signature Settings
        </h2>
        <SignatureUploader
          signature={signature}
          originalSignature={originalSignature}
          setSignature={setSignature}
          setOriginalSignature={setOriginalSignature}
        />
      </div>

      {/* Section 3: Actions */}
      <div className="form-section" style={{ borderBottom: 'none' }} id="sec-actions">
        <h2 className="section-title" id="title-actions">Actions</h2>
        
        <div className="action-group" id="actions-button-grid">
          {/* Generate Certificate Button */}
          <button 
            type="button" 
            className="btn-action generate"
            onClick={onGenerate}
            id="btn-generate-cert"
          >
            <CheckCircle size={18} />
            Generate Certificate
          </button>

          {/* Download PDF Button */}
          <button 
            type="button" 
            className="btn-action pdf"
            onClick={onDownloadPdf}
            id="btn-download-pdf"
          >
            <FileDown size={18} />
            Download A4 PDF
          </button>

          {/* Print Certificate Button */}
          <button 
            type="button" 
            className="btn-action print"
            onClick={onPrint}
            id="btn-print-cert"
          >
            <Printer size={18} />
            Print Certificate
          </button>

          {/* Reset Form Button */}
          <button 
            type="button" 
            className="btn-action reset"
            onClick={onReset}
            id="btn-reset-form"
          >
            <RotateCcw size={18} />
            Reset Form
          </button>
        </div>
      </div>
    </aside>
  );
}
