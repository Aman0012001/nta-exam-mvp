import React from 'react';

export default function QuestionArea({
  currentQuestion,
  questionNumber,
  selectedOption,
  onSelectOption,
  onSaveAndNext,
  onClear,
  onSaveAndMarkForReview,
  onMarkForReviewAndNext,
  onBack,
  onNext,
  onSubmit
}) {
  if (!currentQuestion) return null;

  return (
    <div className="question-area-container">
      {/* Question Header */}
      <div className="question-header">
        <h3 className="question-title-text">Question {questionNumber}:</h3>
        <button className="expand-btn">
          <svg viewBox="0 0 24 24" className="arrow-down-svg">
            <circle cx="12" cy="12" r="10" fill="#0b5ed7" />
            <path d="M8 10 L12 14 L16 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Question Body */}
      <div className="question-body">
        <p className="question-text">{currentQuestion.question}</p>

        {/* Options List - Static Text */}
        <div className="options-static-list">
          {currentQuestion.options.map((option, index) => {
            const optionNum = index + 1;
            return (
              <div key={index} className="option-static-row">
                <span className="option-num-prefix">{optionNum}.</span>
                <span className="option-text-span">{option}</span>
              </div>
            );
          })}
        </div>

        {/* Horizontal Radio Selector */}
        <div className="horizontal-radio-panel">
          {currentQuestion.options.map((_, index) => {
            const optionNum = index + 1;
            const isSelected = selectedOption === optionNum;
            return (
              <label key={index} className="radio-select-label" htmlFor={`radio-sel-${optionNum}`}>
                <input
                  type="radio"
                  id={`radio-sel-${optionNum}`}
                  name={`question-${currentQuestion.id}-radio-select`}
                  value={optionNum}
                  checked={isSelected}
                  onChange={() => onSelectOption(optionNum)}
                  className="radio-select-input"
                />
                <span className="radio-select-text">{optionNum})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Buttons Panel */}
      <div className="action-buttons-panel">
        <div className="action-top-row">
          <button className="btn btn-save-next" onClick={onSaveAndNext}>
            SAVE & NEXT
          </button>
          <button className="btn btn-clear" onClick={onClear}>
            CLEAR
          </button>
          <button className="btn btn-save-mark" onClick={onSaveAndMarkForReview}>
            SAVE & MARK FOR REVIEW
          </button>
          <button className="btn btn-mark-next" onClick={onMarkForReviewAndNext}>
            MARK FOR REVIEW & NEXT
          </button>
        </div>

        <div className="action-bottom-row">
          <div className="nav-navigation-btns">
            <button className="btn btn-nav" onClick={onBack}>
              &lt;&lt; BACK
            </button>
            <button className="btn btn-nav" onClick={onNext}>
              NEXT &gt;&gt;
            </button>
          </div>
          <button className="btn btn-submit" onClick={onSubmit}>
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
