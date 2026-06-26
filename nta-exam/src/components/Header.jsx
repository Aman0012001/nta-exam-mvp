import React from 'react';

export default function Header() {
  return (
    <header className="nta-header">
      {/* Top utility row */}
      <div className="header-top-row">
        <div className="home-btn-container">
          <button className="home-btn">
            <span className="home-icon">👤</span> Home
          </button>
        </div>
        <div className="utility-controls">
          <div className="language-selector-wrapper">
            <span className="globe-icon">🌐</span>
            <select className="header-lang-select" defaultValue="English">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <button className="info-btn">🛈</button>
        </div>
      </div>

      {/* Main logos row */}
      <div className="header-logos-row">
        {/* Gandhi 150 Logo */}
        <div className="logo-container gandhi-logo">
          {/* <svg viewBox="0 0 100 80" className="svg-logo">
            <circle cx="50" cy="40" r="35" fill="none" stroke="#b87333" strokeWidth="1.5" />
            <path d="M40,30 Q50,45 60,30 M45,35 Q50,55 55,35 M35,42 C35,55 65,55 65,42" fill="none" stroke="#5c2e0b" strokeWidth="1.5" />
            <circle cx="43" cy="35" r="5" fill="none" stroke="#5c2e0b" strokeWidth="1" />
            <circle cx="57" cy="35" r="5" fill="none" stroke="#5c2e0b" strokeWidth="1" />
            <path d="M48,35 L52,35" stroke="#5c2e0b" strokeWidth="1" />
            <text x="50" y="78" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#5c2e0b" fontFamily="sans-serif">150 YEARS OF</text>
            <text x="50" y="84" textAnchor="middle" fontSize="5.5" fill="#5c2e0b" fontFamily="sans-serif">CELEBRATING THE MAHATMA</text>
          </svg> */}
          <img src="/mylogo.png" alt="Logo" />
        </div>

        {/* National Testing Agency Logo */}
        <div className="logo-container nta-main-logo">
          <div className="nta-tick-circle">
            <img src="/moe1.png" alt="Ministry Logo" />
          </div>

        </div>

        {/* Ministry of Education Logo */}
        <div className="logo-container ministry-logo">
          <div className="emblem-svg">
            <img src="/NTA_logo.png" alt="NTA Logo" />
          </div>
          <div className="ministry-text">
            <span className="min-govt">Ministry of Education</span>
            <span className="min-sub">Government of India</span>
          </div>
        </div>

        {/* Azadi Ka Amrit Mahotsav Logo */}
        <div className="logo-container azadi-logo">

        </div>
      </div>
    </header>
  );
}
