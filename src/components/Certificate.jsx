import React, { forwardRef, useState, useEffect } from 'react';
import { formatUKDate } from '../utils/helpers';
import { makeWhiteTransparent } from '../utils/backgroundRemoval';

const Certificate = forwardRef(({ learnerName, courseDate }, ref) => {
  // Dynamic processed transparent logo state
  const [processedLogo, setProcessedLogo] = useState('/logo.png');

  useEffect(() => {
    let active = true;

    // Process top logo to remove white background cleanly
    makeWhiteTransparent('/logo.png', 240)
      .then(url => {
        if (active) setProcessedLogo(url);
      })
      .catch(err => console.error("Error pre-processing top logo:", err));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div 
      className="certificate-canvas" 
      ref={ref} 
      id="certificate-print-sheet"
    >
      {/* Target PDF Corner Geometric Decorations */}
      <div className="decor-top-blue" id="decor-top-blue"></div>
      <div className="decor-left-teal" id="decor-left-teal"></div>
      <div className="decor-bottom-teal" id="decor-bottom-teal"></div>
      <div className="decor-right-blue" id="decor-right-blue"></div>

      {/* Certificate Header */}
      <div className="certificate-header" id="cert-header">
        <img 
          src={processedLogo} 
          alt="EDU Training Centre Ltd Logo" 
          className="edu-logo-img"
          referrerPolicy="no-referrer"
          id="edu-logo"
        />
        <div className="provider-name" id="provider-name-txt">
          EDU TRAINING CENTRE LTD
        </div>
      </div>

      {/* This Is To Certify That Bar */}
      <div className="certify-bar-container" id="certify-bar-box">
        <div className="certify-bar" id="certify-bar-txt">
          THIS IS TO CERTIFY THAT
        </div>
      </div>

      {/* Learner Name Section */}
      <div className="learner-section" id="learner-box">
        <div className="learner-name" id="learner-name-display">
          {learnerName ? learnerName.trim().toUpperCase() : 'JOHN SMITH'}
        </div>
        <div className="learner-divider-line" id="learner-divider"></div>
      </div>

      {/* Certificate Core Text */}
      <div className="certificate-body-text" id="cert-body-paragraphs">
        <div className="body-lead-text" id="body-lead">
          has successfully completed training and assessment for the purposes of the
        </div>
        
        <div className="regulations-bold" id="regs-para-1">
          THE HEALTH & SAFETY (FIRST AID) REGULATIONS 1981 &
        </div>
        <div className="regulations-bold" id="regs-para-2">
          THE HEALTH & SAFETY (FIRST AID) REGULATIONS (NORTHERN IRELAND) 1982
        </div>
        
        <div className="body-middle-text" id="body-middle">
          and has passed the assessment for the qualification of
        </div>
        
        <div className="course-title-highlight" id="course-title-main">
          EMERGENCY FIRST AID AT WORK (6 HOURS)
        </div>
        
        <div className="guidelines-italic" id="resuscitation-guidelines-txt">
          (In accordance with current Resuscitation Council UK Guidelines and First Aid practice)
        </div>
      </div>

      {/* Course Date */}
      <div className="date-section" id="date-box">
        <span className="date-text" id="date-label">
          On : <span className="date-value" id="date-val-display">{formatUKDate(courseDate) || '24/05/2023'}</span>
        </span>
      </div>

      {/* Validity Section */}
      <div className="validity-section" id="validity-box">
        <div className="validity-title" id="validity-title-txt">
          Valid for 3 years from date shown
        </div>
        <div className="validity-recommendation" id="validity-recommendation-txt">
          The First Aid Industry Body strongly recommend Annual Refresher Training
        </div>
      </div>

      {/* Signature & Line Section - Statically centered */}
      <div className="signature-section" id="signature-block">
        <div className="signature-label" id="signature-heading">Signed By :</div>
        
        <div className="signature-drag-area" id="signature-drag-area">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="80 290 360 330" 
            width="147"
            height="135"
            className="static-signature-svg"
            id="sig-svg-on-cert"
          >
            <g id="user-signature">
              {/* Main Left-hand bubble/loop */}
              <path d="M 180,435 C 100,405 90,465 105,490 C 125,525 210,515 235,475 C 255,440 215,410 180,435 Z" 
                    fill="none" stroke="#111111" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Center vertical slash */}
              <path d="M 185,370 Q 188,485 195,600" 
                    fill="none" stroke="#111111" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Upward cursive flow connecting to middle letters */}
              <path d="M 195,600 C 205,530 250,445 268,360 C 275,325 285,325 282,365 C 275,460 282,490 295,480 C 310,470 325,410 338,365 C 345,340 355,340 353,380 C 350,450 340,490 355,480" 
                    fill="none" stroke="#111111" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

              {/* Right-hand tall vertical loop */}
              <path d="M 355,480 C 365,470 385,350 395,330 C 405,310 420,310 415,340 C 405,405 385,475 375,490" 
                    fill="none" stroke="#111111" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

              {/* Sharp horizontal accent line/dash under the tall loop */}
              <path d="M 380,500 L 420,495" 
                    fill="none" stroke="#111111" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>

        <div className="signature-line-group" id="signature-line-box">
          <div className="signer-name" id="signer-name-txt">Fahad Mahmand</div>
          <div className="signer-title" id="signer-title-txt">Director</div>
        </div>
      </div>

      {/* Approval Footer Section */}
      <div className="approval-section" id="approval-footer">
        <div className="approval-title" id="approval-title-txt">
          APPROVED BY THE FIRST AID INDUSTRY BODY (FAIB)
        </div>
        <div className="licence-box" id="licence-box">
          Licence no: <span className="licence-number" id="licence-num-txt">04/21 (830)</span>
        </div>
        <div className="approval-system-text" id="approval-legal-txt">
          "The Quality Management system at FAIB holds 3rd Party Certification via a United Kingdom Accreditation Service (UKAS) Accredited Certification Body".
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;
