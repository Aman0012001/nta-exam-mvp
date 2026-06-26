import React, { useState } from 'react';

export default function SubmitModal({ isOpen, onClose, questionsState, onConfirmFinish }) {
  if (!isOpen) return null;

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

  return (
    <div className="modal-backdrop-overlay">
      <div className="summary-modal-card">
        <div className="modal-header">
          <h3>Exam Summary</h3>
        </div>
        
        <div className="modal-body">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Questions</td>
                <td><strong>{total}</strong></td>
              </tr>
              <tr className="row-answered">
                <td>Answered</td>
                <td><span className="badge-s green">{counts['answered']}</span></td>
              </tr>
              <tr className="row-not-answered">
                <td>Not Answered</td>
                <td><span className="badge-s orange">{counts['not-answered']}</span></td>
              </tr>
              <tr className="row-marked">
                <td>Marked for Review</td>
                <td><span className="badge-s purple">{counts['marked']}</span></td>
              </tr>
              <tr className="row-answered-marked">
                <td>Answered & Marked for Review</td>
                <td><span className="badge-s purple-check">{counts['answered-marked']}</span></td>
              </tr>
              <tr className="row-not-visited">
                <td>Not Visited</td>
                <td><span className="badge-s grey">{counts['not-visited']}</span></td>
              </tr>
            </tbody>
          </table>

          <p className="confirm-prompt-text">
            Are you sure you want to submit the exam? Once submitted, you cannot make changes.
          </p>
        </div>

        <div className="modal-footer">
          <button className="modal-btn btn-confirm-yes" onClick={onConfirmFinish}>
            Yes, Submit
          </button>
          <button className="modal-btn btn-confirm-no" onClick={onClose}>
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
