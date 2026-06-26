import React, { useState, useEffect } from 'react';

export default function CandidateInfo({ timeRemaining, setTimeRemaining, candidate }) {
  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, setTimeRemaining]);

  return (
    <div className="exam-main-layout exam-main-layout-info-bar">
      <div className="candidate-details-wrapper">
        {/* Avatar Box */}
        <div className="candidate-avatar-box">
          <svg viewBox="0 0 100 100" className="avatar-svg">
            <circle cx="50" cy="35" r="20" fill="#555" />
            <path d="M15 85 C15 60, 85 60, 85 85" fill="#555" />
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="#ccc" strokeWidth="2" />
          </svg>
        </div>

        {/* Text details */}
        <div className="candidate-meta-grid">
          <div className="meta-row">
            <span className="meta-label">Candidate Name</span>
            <span className="meta-colon">:</span>
            <span className="meta-val highlight-orange">{candidate?.name || 'Guest'}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Roll Number</span>
            <span className="meta-colon">:</span>
            <span className="meta-val highlight-orange">{candidate?.rollNumber || '—'}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Exam Name</span>
            <span className="meta-colon">:</span>
            <span className="meta-val highlight-orange">UGC-NET</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Subject Name</span>
            <span className="meta-colon">:</span>
            <span className="meta-val highlight-orange">Physics-Paper 2-Jun-2019</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Remaining Time</span>
            <span className="meta-colon">:</span>
            <div className="timer-badge">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Right side Language Selector */}
      <div className="info-right-lang">
        <select className="candidate-lang-select" defaultValue="English">
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>
    </div>
  );
}
