import React, { useState, useEffect } from 'react';
import Header from './Header';
import CandidateInfo from './CandidateInfo';
import QuestionArea from './QuestionArea';
import Sidebar from './Sidebar';
import SubmitModal from './SubmitModal';
import LoginScreen from './LoginScreen';
import { questions as localQuestions } from '../questions';
import '../App.css';

export default function ExamPortal() {
  // ── App phase ──────────────────────────────────────────────────────────────
  // 'login' → 'loading' → 'exam' → 'finished'
  const [phase, setPhase] = useState('login');

  // ── Candidate & attempt state ──────────────────────────────────────────────
  const [candidate, setCandidate] = useState(null);   // { id, name, rollNumber, examSet }
  const [attemptId, setAttemptId] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // ── Questions state ────────────────────────────────────────────────────────
  const [questionsState, setQuestionsState] = useState([]);

  // ── Exam UI state ──────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // ── Load questions from API (called after login) ───────────────────────────
  const loadQuestionsFromAPI = async () => {
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('API unavailable, falling back to local questions:', err.message);
      return localQuestions; // graceful fallback
    }
  };

  // ── Handle login form submission ───────────────────────────────────────────
  const handleLogin = async ({ name, rollNumber, examSet }) => {
    setPhase('loading');
    setLoadError(null);

    try {
      // 1) Register candidate
      const candidateRes = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rollNumber, examSet }),
      });

      let candidateData;
      if (!candidateRes.ok) {
        throw new Error('Failed to register candidate');
      }
      candidateData = await candidateRes.json();
      setCandidate(candidateData);

      // 2) Create exam attempt
      const attemptRes = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidateData.id }),
      });

      let attemptData;
      if (!attemptRes.ok) {
        throw new Error('Failed to create exam attempt');
      }
      attemptData = await attemptRes.json();
      setAttemptId(attemptData.id);

      // 3) Load questions
      const qs = await loadQuestionsFromAPI();
      setQuestionsState(
        qs.map((q, idx) => ({
          ...q,
          selectedOption: null,
          status: idx === 0 ? 'not-answered' : 'not-visited',
        }))
      );

      setCurrentIdx(0);
      setTimeRemaining(120 * 60);
      setPhase('exam');
    } catch (err) {
      console.error('Login/setup error:', err);
      setLoadError(err.message);
      setPhase('login');
    }
  };

  // ── Offline / guest mode (no backend needed) ───────────────────────────────
  const handleGuestMode = () => {
    setCandidate({ id: null, name: 'Guest', rollNumber: 'GUEST-001', examSet: 'SET-A' });
    setAttemptId(null);
    setQuestionsState(
      localQuestions.map((q, idx) => ({
        ...q,
        selectedOption: null,
        status: idx === 0 ? 'not-answered' : 'not-visited',
      }))
    );
    setCurrentIdx(0);
    setTimeRemaining(120 * 60);
    setPhase('exam');
  };

  // ── Question helpers ───────────────────────────────────────────────────────
  const currentQuestion = questionsState[currentIdx];

  const visitQuestion = (idx) => {
    setQuestionsState((prev) =>
      prev.map((q, i) => {
        if (i === idx && q.status === 'not-visited') {
          return { ...q, status: 'not-answered' };
        }
        return q;
      })
    );
  };

  const handleSelectOption = (optionNum) => {
    setQuestionsState((prev) =>
      prev.map((q, i) => (i === currentIdx ? { ...q, selectedOption: optionNum } : q))
    );
  };

  const handleNavigateQuestion = (idx) => {
    visitQuestion(idx);
    setCurrentIdx(idx);
  };

  const handleNext = () => {
    if (currentIdx < questionsState.length - 1) {
      const nextIdx = currentIdx + 1;
      visitQuestion(nextIdx);
      setCurrentIdx(nextIdx);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      visitQuestion(prevIdx);
      setCurrentIdx(prevIdx);
    }
  };

  const handleSaveAndNext = () => {
    if (currentQuestion.selectedOption === null) {
      alert('Please select an option before saving.');
      return;
    }
    setQuestionsState((prev) =>
      prev.map((q, i) => (i === currentIdx ? { ...q, status: 'answered' } : q))
    );
    handleNext();
  };

  const handleClear = () => {
    setQuestionsState((prev) =>
      prev.map((q, i) =>
        i === currentIdx ? { ...q, selectedOption: null, status: 'not-answered' } : q
      )
    );
  };

  const handleSaveAndMarkForReview = () => {
    if (currentQuestion.selectedOption === null) {
      alert('Please select an option before saving for review.');
      return;
    }
    setQuestionsState((prev) =>
      prev.map((q, i) => (i === currentIdx ? { ...q, status: 'answered-marked' } : q))
    );
    handleNext();
  };

  const handleMarkForReviewAndNext = () => {
    setQuestionsState((prev) =>
      prev.map((q, i) => (i === currentIdx ? { ...q, status: 'marked' } : q))
    );
    handleNext();
  };

  // ── Submit exam ────────────────────────────────────────────────────────────
  const handleConfirmFinish = async () => {
    setIsSubmitOpen(false);

    // If we have a real attempt ID, persist responses to the backend
    if (attemptId) {
      try {
        const timeTakenSecs = 120 * 60 - timeRemaining;
        const responses = questionsState.map((q) => ({
          questionId: q.id,
          selectedOption: q.selectedOption,
          status: q.status,
        }));

        await fetch(`/api/attempts/${attemptId}/submit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeTakenSecs, responses }),
        });
        console.log('✅ Attempt submitted to backend.');
      } catch (err) {
        console.warn('Could not submit to backend (offline mode):', err.message);
      }
    }

    setPhase('finished');
  };

  const handleRestart = () => {
    setCandidate(null);
    setAttemptId(null);
    setQuestionsState([]);
    setCurrentIdx(0);
    setTimeRemaining(120 * 60);
    setPhase('login');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onGuestMode={handleGuestMode}
        error={loadError}
      />
    );
  }

  if (phase === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Setting up your exam session…</p>
      </div>
    );
  }

  return (
    <div className="nta-app-container">
      <Header />

      {phase === 'finished' ? (
        <div className="finished-container">
          <div className="finished-card">
            <h2>🎉 Test Completed Successfully!</h2>
            <p>Your responses have been saved and submitted to the National Testing Agency server.</p>
            {candidate && (
              <p className="candidate-name-result">
                Candidate: <strong>{candidate.name}</strong> ({candidate.rollNumber})
              </p>
            )}

            <div className="summary-stats-box">
              <h3>Final Status Summary</h3>
              <div className="stats-row">
                <span>Total Answered (Evaluated):</span>
                <strong>
                  {questionsState.filter((q) => q.status === 'answered' || q.status === 'answered-marked').length}
                </strong>
              </div>
              <div className="stats-row">
                <span>Marked for Review (Not Evaluated):</span>
                <strong>{questionsState.filter((q) => q.status === 'marked').length}</strong>
              </div>
              <div className="stats-row">
                <span>Unanswered / Not Visited:</span>
                <strong>
                  {questionsState.filter((q) => q.status === 'not-answered' || q.status === 'not-visited').length}
                </strong>
              </div>
            </div>

            <button className="restart-btn" onClick={handleRestart}>
              Start New Test / Practice Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <CandidateInfo
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            candidate={candidate}
          />

          <main className="exam-main-layout">
            <div className="exam-left-column">
              <QuestionArea
                currentQuestion={currentQuestion}
                questionNumber={currentIdx + 1}
                selectedOption={currentQuestion ? currentQuestion.selectedOption : null}
                onSelectOption={handleSelectOption}
                onSaveAndNext={handleSaveAndNext}
                onClear={handleClear}
                onSaveAndMarkForReview={handleSaveAndMarkForReview}
                onMarkForReviewAndNext={handleMarkForReviewAndNext}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={() => setIsSubmitOpen(true)}
              />
            </div>

            <div className="exam-right-column">
              <Sidebar
                questionsState={questionsState}
                currentQuestionIndex={currentIdx}
                onNavigateQuestion={handleNavigateQuestion}
              />
            </div>
          </main>
        </>
      )}

      <footer className="nta-footer">
        <p>&copy; All Rights Reserved - National Testing Agency</p>
      </footer>

      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        questionsState={questionsState}
        onConfirmFinish={handleConfirmFinish}
      />
    </div>
  );
}
