import React, { forwardRef, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { formatUKDate } from '../utils/helpers';
import { makeWhiteTransparent } from '../utils/backgroundRemoval';

const Certificate = forwardRef(({ learnerName, courseDate, signature }, ref) => {
  // Signature interactive state (width, height, relative coordinates)
  // Perfectly centered inside the signature-drag-area track
  const [sigState, setSigState] = useState({
    width: 200,
    height: 75,
    x: 232, // (664px track width - 200px sig width) / 2 = 232px to center
    y: 0    // (75px track height - 75px sig height) / 2 = 0px to center
  });

  // Dynamic processed transparent logos state
  const [processedLogo, setProcessedLogo] = useState('/logo.png');
  const [processedFaib, setProcessedFaib] = useState('/faib.png');

  useEffect(() => {
    let active = true;

    // Process top logo to remove white background cleanly
    makeWhiteTransparent('/logo.png', 240)
      .then(url => {
        if (active) setProcessedLogo(url);
      })
      .catch(err => console.error("Error pre-processing top logo:", err));

    // Process bottom logo to remove white background cleanly
    makeWhiteTransparent('/faib.png', 240)
      .then(url => {
        if (active) setProcessedFaib(url);
      })
      .catch(err => console.error("Error pre-processing FAIB logo:", err));

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

      {/* Signature & Line Section - Track bounded to prevent overlapping */}
      <div className="signature-section" id="signature-block">
        <div className="signature-label" id="signature-heading">Signed By :</div>
        
        {/* Track container to restrict dragging vertically, preventing labels overlap */}
        <div className="signature-drag-area" id="signature-drag-area">
          {signature ? (
            <Rnd
              size={{ width: sigState.width, height: sigState.height }}
              position={{ x: sigState.x, y: sigState.y }}
              onDragStop={(e, d) => {
                setSigState(prev => ({ ...prev, x: d.x, y: d.y }));
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                setSigState({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position
                });
              }}
              bounds="parent"
              lockAspectRatio={true}
              className="interactive-sig-wrapper"
              id="rnd-signature-container"
            >
              <img 
                src={signature} 
                alt="Director Signature" 
                className="interactive-sig-img"
                referrerPolicy="no-referrer"
                id="sig-img-on-cert"
              />
            </Rnd>
          ) : null}
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
        <img 
          src={processedFaib} 
          alt="FAIB Regulatory Body Logo" 
          className="faib-logo-img"
          referrerPolicy="no-referrer"
          id="faib-logo"
        />
      </div>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;
