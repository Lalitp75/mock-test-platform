import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './TestTaking.css';

export default function TestTaking() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [attemptId, setAttemptId] = useState(null);
    const [status, setStatus] = useState('loading'); // loading, active, submitted
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState({});
    const timerRef = useRef(null);
    const autoSaveRef = useRef(null);

    useEffect(() => {
        startTest();
        return () => {
            clearInterval(timerRef.current);
            clearInterval(autoSaveRef.current);
        };
    }, []);

    const startTest = async () => {
        try {
            const testRes = await api.get(`/student/tests`);
            const testData = testRes.data.find(t => t.id === parseInt(testId));
            if (!testData) { navigate('/student'); return; }
            setTest(testData);

            const questionsRes = await api.get(`/student/tests/${testId}/questions`);
            setQuestions(questionsRes.data || []);

            const attemptRes = await api.post(`/student/attempts/${testId}/start`);
            setAttemptId(attemptRes.data.attemptId || attemptRes.data.attempt?.id);
            setTimeRemaining(attemptRes.data.timeRemaining || attemptRes.data.attempt?.time_remaining || testData.duration * 60);

            // Load saved answers if resuming
            if (attemptRes.data.attempt) {
                try {
                    const savedRes = await api.get(`/student/attempts/${attemptRes.data.attempt.id}/answers`);
                    if (savedRes.data) {
                        const savedAnswers = {};
                        savedRes.data.forEach(a => { savedAnswers[a.question_id] = a.submitted_answer; });
                        setAnswers(savedAnswers);
                    }
                } catch (e) { /* no saved answers */ }
            }

            setStatus('active');
        } catch (err) {
            if (err.response?.data?.error === 'Test already completed') {
                setStatus('submitted');
            } else {
                alert('Failed to start test: ' + (err.response?.data?.error || err.message));
                navigate('/student');
            }
        }
    };

    // Timer
    useEffect(() => {
        if (status !== 'active') return;
        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) { handleSubmit(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [status]);

    // Auto-save every 15 seconds
    useEffect(() => {
        if (status !== 'active' || !attemptId) return;
        autoSaveRef.current = setInterval(() => {
            saveProgress();
        }, 15000);
        return () => clearInterval(autoSaveRef.current);
    }, [status, attemptId, answers]);

    const saveProgress = useCallback(async () => {
        if (!attemptId) return;
        try {
            const answersArray = Object.entries(answers).map(([qid, ans]) => ({
                question_id: parseInt(qid), submitted_answer: ans
            }));
            await api.post(`/student/attempts/${attemptId}/save`, {
                answers: answersArray, time_remaining: timeRemaining
            });
        } catch (e) { /* silent fail for auto-save */ }
    }, [attemptId, answers, timeRemaining]);

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        clearInterval(autoSaveRef.current);

        try {
            const answersArray = Object.entries(answers).map(([qid, ans]) => ({
                question_id: parseInt(qid), submitted_answer: ans
            }));
            const res = await api.post(`/student/attempts/${attemptId}/submit`, {
                answers: answersArray
            });
            setResult(res.data);
            setStatus('submitted');
        } catch (err) {
            // If submit fails, just mark as submitted locally
            setStatus('submitted');
            // Calculate result locally
            let score = 0;
            questions.forEach(q => {
                if (q.type === 'mcq' && answers[q.id] === q.correct_answer) {
                    score += q.marks || 1;
                }
            });
            setResult({ score, total: questions.reduce((s, q) => s + (q.marks || 1), 0) });
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    if (status === 'loading') {
        return (
            <div className="test-loading">
                <div className="spinner"></div>
                <p>Loading test...</p>
            </div>
        );
    }

    if (status === 'submitted') {
        return (
            <div className="test-result-page">
                <div className="result-container animate-fadeInUp">
                    <div className="result-header">
                        <div className="result-icon">🎉</div>
                        <h1>Test Completed!</h1>
                        <p>{test?.title}</p>
                    </div>

                    {result && (
                        <div className="result-score-card">
                            <div className="score-circle">
                                <span className="score-value">{result.score}</span>
                                <span className="score-total">/ {result.total}</span>
                            </div>
                            <p className="score-percent">{((result.score / result.total) * 100).toFixed(1)}%</p>
                        </div>
                    )}

                    {/* Show correct answers with explanations */}
                    <div className="result-details">
                        <h2>📖 Answers & Explanations</h2>
                        {questions.map((q, i) => {
                            const userAns = answers[q.id];
                            const isCorrect = q.type === 'mcq' ? userAns === q.correct_answer : null;

                            return (
                                <div key={q.id} className={`result-q-card ${isCorrect === true ? 'correct' : isCorrect === false ? 'wrong' : ''}`}>
                                    <div className="result-q-header">
                                        <span className="result-q-num">Q{i + 1}</span>
                                        {isCorrect !== null && (
                                            <span className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}>
                                                {isCorrect ? '✓ Correct' : '✗ Wrong'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="result-q-text">{q.question_text}</p>

                                    {q.type === 'mcq' && q.options && (
                                        <div className="result-options">
                                            {(typeof q.options === 'string' ? JSON.parse(q.options) : q.options).map((opt, oi) => (
                                                <div key={oi} className={`result-option 
                          ${opt === q.correct_answer ? 'correct-opt' : ''} 
                          ${opt === userAns && opt !== q.correct_answer ? 'wrong-opt' : ''}`}>
                                                    <span className="opt-letter">{String.fromCharCode(65 + oi)}</span>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'essay' && userAns && (
                                        <div className="result-essay-answer">
                                            <strong>Your Essay:</strong>
                                            <p>{userAns}</p>
                                        </div>
                                    )}

                                    {q.explanation && (
                                        <div className="result-explanation">
                                            <strong>💡 Explanation:</strong>
                                            <p>{q.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="result-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/student')}>← Back to Dashboard</button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const isLowTime = timeRemaining < 300; // less than 5 min

    return (
        <div className="test-page">
            {/* Top Bar */}
            <div className="test-topbar">
                <div className="test-topbar-left">
                    <h2>{test?.title}</h2>
                    <span className="test-progress">{answeredCount}/{questions.length} answered</span>
                </div>
                <div className={`test-timer ${isLowTime ? 'timer-low' : ''}`}>
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-value">{formatTime(timeRemaining)}</span>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => {
                    if (window.confirm('Are you sure you want to submit? You cannot change your answers after submission.')) handleSubmit();
                }}>Submit Test</button>
            </div>

            <div className="test-body">
                {/* Question Navigation Sidebar */}
                <div className="test-sidebar">
                    <h3>Questions</h3>
                    <div className="q-nav-grid">
                        {questions.map((q, i) => (
                            <button
                                key={q.id}
                                className={`q-nav-btn ${i === currentIndex ? 'current' : ''} ${answers[q.id] ? 'answered' : ''}`}
                                onClick={() => setCurrentIndex(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <div className="q-nav-legend">
                        <div className="legend-item"><span className="legend-dot current"></span> Current</div>
                        <div className="legend-item"><span className="legend-dot answered"></span> Answered</div>
                        <div className="legend-item"><span className="legend-dot"></span> Not Answered</div>
                    </div>
                </div>

                {/* Question Content */}
                <div className="test-content">
                    {currentQuestion ? (
                        <div className="question-card animate-fadeIn" key={currentQuestion.id}>
                            <div className="question-header">
                                <span className="q-number">Question {currentIndex + 1} of {questions.length}</span>
                                <span className="badge badge-primary">{currentQuestion.type?.toUpperCase()}</span>
                                <span className="badge badge-warning">{currentQuestion.marks || 1} mark{(currentQuestion.marks || 1) > 1 ? 's' : ''}</span>
                            </div>

                            <div className="question-text">
                                <p>{currentQuestion.question_text}</p>
                            </div>

                            {currentQuestion.image_url && (
                                <div className="question-image">
                                    <img src={currentQuestion.image_url} alt="Question" />
                                </div>
                            )}

                            {/* MCQ Options */}
                            {currentQuestion.type === 'mcq' && currentQuestion.options && (
                                <div className="options-list">
                                    {(typeof currentQuestion.options === 'string' ? JSON.parse(currentQuestion.options) : currentQuestion.options).map((opt, i) => (
                                        <label
                                            key={i}
                                            className={`option-item ${answers[currentQuestion.id] === opt ? 'selected' : ''}`}
                                            onClick={() => handleAnswer(currentQuestion.id, opt)}
                                        >
                                            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                            <span className="option-text">{opt}</span>
                                            <span className="option-radio"></span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Essay */}
                            {(currentQuestion.type === 'essay' || currentQuestion.type === 'pseudocode') && (
                                <div className="essay-area">
                                    <textarea
                                        className="form-input essay-input"
                                        placeholder={currentQuestion.type === 'essay' ? 'Write your essay here...' : 'Write your pseudocode here...'}
                                        value={answers[currentQuestion.id] || ''}
                                        onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                                    />
                                    <div className="essay-count">
                                        {(answers[currentQuestion.id] || '').split(/\s+/).filter(Boolean).length} words
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="question-nav">
                                <button className="btn btn-ghost" disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}>
                                    ← Previous
                                </button>
                                {currentIndex < questions.length - 1 ? (
                                    <button className="btn btn-primary" onClick={() => setCurrentIndex(currentIndex + 1)}>
                                        Next →
                                    </button>
                                ) : (
                                    <button className="btn btn-success" onClick={() => {
                                        if (window.confirm('Submit test?')) handleSubmit();
                                    }}>
                                        ✓ Submit Test
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No questions found</h3>
                            <p>This test doesn't have any questions yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
