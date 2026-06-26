import React from 'react';

export default function Sidebar({
  questionsState,
  currentQuestionIndex,
  onNavigateQuestion
}) {
  // Compute counts
  const total = questionsState.length;
  const counts = questionsState.reduce(
    (acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    },
    {
      'not-visited': 0,
      'not-answered': 0,
      'answered': 0,
      'marked': 0,
      'answered-marked': 0
    }
  );

  // Helper to format number to 2 digits (e.g. 01, 02)
  const formatNum = (num) => String(num).padStart(2, '0');

  // Helper to get status class name
  const getStatusClass = (status) => {
    switch (status) {
      case 'not-visited':
        return 'status-not-visited';
      case 'not-answered':
        return 'status-not-answered';
      case 'answered':
        return 'status-answered';
      case 'marked':
        return 'status-marked';
      case 'answered-marked':
        return 'status-answered-marked';
      default:
        return '';
    }
  };

  return (
    <aside className="exam-sidebar">
      {/* Legend / Status Panel */}
      <div className="status-legend-panel">
        <div className="legend-grid">
          {/* Not Visited */}
          <div className="legend-item">
            <div className="legend-badge status-not-visited">{counts['not-visited']}</div>
            <span className="legend-label">Not Visited</span>
          </div>

          {/* Not Answered */}
          <div className="legend-item">
            <div className="legend-badge status-not-answered">{counts['not-answered']}</div>
            <span className="legend-label">Not Answered</span>
          </div>

          {/* Answered */}
          <div className="legend-item">
            <div className="legend-badge status-answered">{counts['answered']}</div>
            <span className="legend-label">Answered</span>
          </div>

          {/* Marked for Review */}
          <div className="legend-item">
            <div className="legend-badge status-marked">{counts['marked']}</div>
            <span className="legend-label">Marked for Review</span>
          </div>

          {/* Answered & Marked for Review */}
          <div className="legend-item span-full">
            <div className="legend-badge status-answered-marked">
              {counts['answered-marked']}
              <span className="tiny-check">✓</span>
            </div>
            <span className="legend-label label-subtext">
              Answered & Marked for Review (will be considered for evaluation)
            </span>
          </div>
        </div>
      </div>

      {/* Palette Title */}
      <div className="palette-header">
        <h4>Choose a Question</h4>
      </div>

      {/* Question Palette Grid */}
      <div className="question-palette-container">
        <div className="palette-grid">
          {questionsState.map((q, idx) => {
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => onNavigateQuestion(idx)}
                className={`palette-btn ${getStatusClass(q.status)} ${isCurrent ? 'active-question' : ''}`}
                title={`Question ${q.id} - ${q.status}`}
              >
                {formatNum(q.id)}
                {q.status === 'answered-marked' && <span className="btn-tiny-check">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
