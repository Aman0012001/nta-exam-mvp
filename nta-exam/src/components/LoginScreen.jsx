import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginScreen({ onLogin, onGuestMode, error }) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [examSet, setExamSet] = useState('SET-A');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) return;
    setSubmitting(true);
    await onLogin({ name: name.trim(), rollNumber: rollNumber.trim(), examSet });
    setSubmitting(false);
  };

  return (
    <div className="login-screen">
      {/* NTA Header */}
      <div className="login-header">
        <div className="login-logo-row">
          <div className="login-logo-circle">NTA</div>
          <div>
            <h1 className="login-title">National Testing Agency</h1>
            <p className="login-subtitle">Computer Based Test — Candidate Login</p>
          </div>
        </div>
      </div>

      <div className="login-body">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">🎓</div>
            <h2>Candidate Authentication</h2>
            <p>Enter your credentials to begin the examination</p>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
              <small> (Check if the backend server is running on port 3001)</small>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="candidateName">Candidate Name</label>
              <input
                id="candidateName"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number / Application No.</label>
              <input
                id="rollNumber"
                type="text"
                placeholder="e.g. JEE2024-123456"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="examSet">Exam Set</label>
              <select
                id="examSet"
                value={examSet}
                onChange={(e) => setExamSet(e.target.value)}
              >
                <option value="SET-A">SET-A</option>
                <option value="SET-B">SET-B</option>
                <option value="SET-C">SET-C</option>
                <option value="SET-D">SET-D</option>
              </select>
            </div>

            <button
              type="submit"
              className="login-btn-primary"
              disabled={submitting || !name.trim() || !rollNumber.trim()}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner" /> Setting up exam…
                </>
              ) : (
                '▶ Start Examination'
              )}
            </button>
          </form>



          <div className="login-info-box">
            <p>📋 <strong>Exam Details:</strong> Physics — 100 Questions — 120 Minutes</p>
            <p>📌 Marking: +4 for correct, −1 for wrong, 0 for unattempted</p>
          </div>
        </div>

        <div className="login-instructions">

        </div>
      </div>

      <footer className="login-footer">
        <p>© National Testing Agency — Secure Examination Platform</p>
        <div style={{ marginTop: '12px' }}>
          <Link to="/admin/login" className="admin-portal-link" style={{ color: '#0d9488', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            🔐 Admin Portal Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
