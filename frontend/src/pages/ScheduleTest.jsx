import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { generateQuestions, AVAILABLE_TOPICS } from '../utils/questionBank';
import './ScheduleTest.css';

const SECTION_TYPES = ['Aptitude', 'Maths', 'Reasoning', 'English', 'Pseudocode', 'Puzzles', 'Image Puzzles', 'Essay'];
const BRANCHES = ['CS', 'IT', 'AI&DS', 'E&TC', 'Mechanical', 'MBA'];

export default function ScheduleTest() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState(null);
    const [testForm, setTestForm] = useState({
        title: '', description: '', duration: 60,
        result_display: 'immediate',
        eligibility_type: 'all',
        branches: [], groups: '', studentEmails: '',
        sections: [{ title: 'Aptitude', duration_limit: null }],
        scheduled_date: '', scheduled_time: '',
    });
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState({
        section: 'Aptitude', type: 'mcq', question_text: '', image_url: '',
        options: ['', '', '', ''], correct_answer: '', explanation: '', marks: 1
    });
    const [aiTopic, setAiTopic] = useState('');
    const [aiCount, setAiCount] = useState(10);
    const [aiSection, setAiSection] = useState('Aptitude');
    const [aiLoading, setAiLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addSection = () => {
        setTestForm(f => ({ ...f, sections: [...f.sections, { title: 'Maths', duration_limit: null }] }));
    };

    const removeSection = (i) => {
        setTestForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
    };

    const addQuestion = () => {
        if (!currentQ.question_text.trim()) return showToast('Question text is required', 'error');
        if (currentQ.type === 'mcq' && !currentQ.correct_answer.trim()) return showToast('Correct answer required', 'error');
        setQuestions(q => [...q, { ...currentQ, id: Date.now() }]);
        setCurrentQ({ section: currentQ.section, type: 'mcq', question_text: '', image_url: '', options: ['', '', '', ''], correct_answer: '', explanation: '', marks: 1 });
        showToast('Question added!');
    };

    const removeQuestion = (id) => {
        setQuestions(q => q.filter(item => item.id !== id));
    };

    const handleGenerate = () => {
        if (!aiTopic.trim()) return showToast('Please select or type a topic', 'error');
        const numQ = parseInt(aiCount) || 10;
        if (numQ < 1 || numQ > 200) return showToast('Enter 1-200 questions', 'error');
        setAiLoading(true);

        setTimeout(() => {
            const generated = generateQuestions(aiTopic, numQ, aiSection);
            if (generated.length === 0) {
                showToast('No questions found for this topic. Try another topic.', 'error');
            } else {
                setQuestions(q => [...q, ...generated]);
                showToast(`✅ ${generated.length} questions generated for "${aiTopic}"!`);
            }
            setAiLoading(false);
        }, 800);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        if (!testForm.title.trim()) return showToast('Test title is required', 'error');
        if (questions.length === 0) return showToast('Add at least one question', 'error');
        setSubmitting(true);

        try {
            const eligibility_rules = {};
            if (testForm.eligibility_type === 'branch') eligibility_rules.branches = testForm.branches;
            if (testForm.eligibility_type === 'group') eligibility_rules.groups = testForm.groups.split(',').map(g => g.trim());

            const res = await api.post('/admin/tests', {
                title: testForm.title, description: testForm.description,
                duration: testForm.duration, eligibility_rules,
                result_display: testForm.result_display,
                scheduled_date: testForm.scheduled_date || null,
                scheduled_time: testForm.scheduled_time || null
            });

            const testId = res.data.testId;

            // Create sections
            for (const sec of testForm.sections) {
                await api.post('/admin/sections', { test_id: testId, title: sec.title, duration_limit: sec.duration_limit });
            }

            // Add questions
            for (const q of questions) {
                await api.post('/admin/questions', {
                    test_id: testId, section_id: null, type: q.type,
                    question_text: q.question_text, image_url: q.image_url,
                    options: q.options, correct_answer: q.correct_answer,
                    explanation: q.explanation, marks: q.marks
                });
            }

            showToast('Test scheduled successfully!');
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to schedule test', 'error');
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="schedule-header animate-fadeInUp">
                    <h1>📅 Schedule Mock Test</h1>
                    <p>Create and configure a new mock test for your students</p>
                </div>

                {/* Step Indicator */}
                <div className="step-indicator animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    {['Test Details', 'Sections & Eligibility', 'Add Questions', 'Review & Publish'].map((label, i) => (
                        <div key={i} className={`step-item ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''}`} onClick={() => setStep(i + 1)}>
                            <div className="step-number">{step > i + 1 ? '✓' : i + 1}</div>
                            <span className="step-label">{label}</span>
                        </div>
                    ))}
                </div>

                <div className="schedule-content animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                    {/* Step 1: Test Details */}
                    {step === 1 && (
                        <div className="schedule-step">
                            <h2>Test Information</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Test Title *</label>
                                    <input className="form-input" type="text" placeholder="e.g., TCS Aptitude Mock Test - Batch 2026"
                                        value={testForm.title} onChange={e => setTestForm({ ...testForm, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Duration (minutes) *</label>
                                    <input className="form-input" type="number" min="5" value={testForm.duration}
                                        onChange={e => setTestForm({ ...testForm, duration: parseInt(e.target.value) || 60 })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea className="form-input" placeholder="Brief description of the test..."
                                        value={testForm.description} onChange={e => setTestForm({ ...testForm, description: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Result Display</label>
                                    <select className="form-input" value={testForm.result_display}
                                        onChange={e => setTestForm({ ...testForm, result_display: e.target.value })}>
                                        <option value="immediate">Immediate (after submission)</option>
                                        <option value="later">Later (admin releases)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Scheduled Date (optional)</label>
                                    <input className="form-input" type="date" value={testForm.scheduled_date}
                                        onChange={e => setTestForm({ ...testForm, scheduled_date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Scheduled Time (optional)</label>
                                    <input className="form-input" type="time" value={testForm.scheduled_time}
                                        onChange={e => setTestForm({ ...testForm, scheduled_time: e.target.value })} />
                                </div>
                            </div>
                            <div className="step-actions">
                                <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Sections & Eligibility →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Sections & Eligibility */}
                    {step === 2 && (
                        <div className="schedule-step">
                            <h2>Sections</h2>
                            <div className="sections-list">
                                {testForm.sections.map((sec, i) => (
                                    <div key={i} className="section-item">
                                        <select className="form-input" value={sec.title}
                                            onChange={e => {
                                                const sections = [...testForm.sections];
                                                sections[i].title = e.target.value;
                                                setTestForm({ ...testForm, sections });
                                            }}>
                                            {SECTION_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <input className="form-input" type="number" placeholder="Time limit (min)" value={sec.duration_limit || ''}
                                            onChange={e => {
                                                const sections = [...testForm.sections];
                                                sections[i].duration_limit = parseInt(e.target.value) || null;
                                                setTestForm({ ...testForm, sections });
                                            }} style={{ width: 140 }} />
                                        <button className="btn btn-ghost btn-sm" onClick={() => removeSection(i)}>✕</button>
                                    </div>
                                ))}
                                <button className="btn btn-outline btn-sm" onClick={addSection}>+ Add Section</button>
                            </div>

                            <h2 style={{ marginTop: 32 }}>Eligibility</h2>
                            <div className="eligibility-options">
                                {['all', 'branch', 'group', 'specific'].map(type => (
                                    <label key={type} className={`eligibility-option ${testForm.eligibility_type === type ? 'active' : ''}`}>
                                        <input type="radio" name="elig" value={type} checked={testForm.eligibility_type === type}
                                            onChange={() => setTestForm({ ...testForm, eligibility_type: type })} />
                                        <span className="elig-label">
                                            {type === 'all' && '🌐 All Students'}
                                            {type === 'branch' && '🏫 Branch-Specific'}
                                            {type === 'group' && '👥 Target Group'}
                                            {type === 'specific' && '🎯 Specific Students'}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {testForm.eligibility_type === 'branch' && (
                                <div className="branch-select animate-fadeIn">
                                    <label>Select Branches:</label>
                                    <div className="branch-chips">
                                        {BRANCHES.map(b => (
                                            <button key={b}
                                                className={`branch-chip ${testForm.branches.includes(b) ? 'active' : ''}`}
                                                onClick={() => {
                                                    const branches = testForm.branches.includes(b)
                                                        ? testForm.branches.filter(x => x !== b)
                                                        : [...testForm.branches, b];
                                                    setTestForm({ ...testForm, branches });
                                                }}>{b}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {testForm.eligibility_type === 'group' && (
                                <div className="form-group animate-fadeIn" style={{ marginTop: 16 }}>
                                    <label>Group Names (comma-separated)</label>
                                    <input className="form-input" placeholder="e.g., TCS_Drive, Infosys_Batch" value={testForm.groups}
                                        onChange={e => setTestForm({ ...testForm, groups: e.target.value })} />
                                </div>
                            )}

                            {testForm.eligibility_type === 'specific' && (
                                <div className="form-group animate-fadeIn" style={{ marginTop: 16 }}>
                                    <label>Student Emails (comma-separated)</label>
                                    <textarea className="form-input" placeholder="student1@pvg.edu, student2@pvg.edu..." value={testForm.studentEmails}
                                        onChange={e => setTestForm({ ...testForm, studentEmails: e.target.value })} />
                                </div>
                            )}

                            <div className="step-actions">
                                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                                <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Add Questions →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Add Questions */}
                    {step === 3 && (
                        <div className="schedule-step">
                            <h2>Add Questions</h2>

                            {/* AI Generator */}
                            <div className="ai-generator card">
                                <h3>🤖 Question Generator</h3>
                                <p>Select a topic and number of questions to instantly generate real MCQ questions with answers and explanations</p>

                                <div className="ai-topics-label">Quick Select Topic:</div>
                                <div className="ai-topic-chips">
                                    {AVAILABLE_TOPICS.map(t => (
                                        <button key={t} className={`topic-chip ${aiTopic === t ? 'active' : ''}`}
                                            onClick={() => setAiTopic(t)}>{t}</button>
                                    ))}
                                </div>

                                <div className="ai-form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label>Topic *</label>
                                        <input className="form-input" type="text"
                                            placeholder="Type a topic, e.g., Profit and Loss, Percentage..."
                                            value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ flex: 0.7 }}>
                                        <label>No. of Questions</label>
                                        <input className="form-input" type="number" min="1" max="200"
                                            value={aiCount} onChange={e => setAiCount(e.target.value === '' ? '' : parseInt(e.target.value))} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Section</label>
                                        <select className="form-input" value={aiSection}
                                            onChange={e => setAiSection(e.target.value)}>
                                            {testForm.sections.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button className="btn btn-accent btn-lg" onClick={handleGenerate} disabled={aiLoading} style={{ marginTop: 8 }}>
                                    {aiLoading ? '⏳ Generating...' : `✨ Generate ${aiCount} Questions`}
                                </button>
                            </div>
                            {/* Manual Question Form */}
                            <div className="question-form card" style={{ marginTop: 20 }}>
                                <h3>✏️ Manual Question</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Section</label>
                                        <select className="form-input" value={currentQ.section} onChange={e => setCurrentQ({ ...currentQ, section: e.target.value })}>
                                            {testForm.sections.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select className="form-input" value={currentQ.type} onChange={e => setCurrentQ({ ...currentQ, type: e.target.value })}>
                                            <option value="mcq">MCQ</option>
                                            <option value="essay">Essay</option>
                                            <option value="pseudocode">Pseudocode</option>
                                            <option value="image">Image-Based</option>
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Question Text *</label>
                                        <textarea className="form-input" value={currentQ.question_text}
                                            onChange={e => setCurrentQ({ ...currentQ, question_text: e.target.value })} placeholder="Enter your question..." />
                                    </div>

                                    {currentQ.type === 'image' && (
                                        <div className="form-group full-width">
                                            <label>Image URL</label>
                                            <input className="form-input" type="text" value={currentQ.image_url}
                                                onChange={e => setCurrentQ({ ...currentQ, image_url: e.target.value })} placeholder="https://..." />
                                        </div>
                                    )}

                                    {currentQ.type === 'mcq' && (
                                        <>
                                            {currentQ.options.map((opt, i) => (
                                                <div className="form-group" key={i}>
                                                    <label>Option {String.fromCharCode(65 + i)}</label>
                                                    <input className="form-input" value={opt}
                                                        onChange={e => {
                                                            const options = [...currentQ.options];
                                                            options[i] = e.target.value;
                                                            setCurrentQ({ ...currentQ, options });
                                                        }} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                                                </div>
                                            ))}
                                            <div className="form-group">
                                                <label>Correct Answer</label>
                                                <select className="form-input" value={currentQ.correct_answer}
                                                    onChange={e => setCurrentQ({ ...currentQ, correct_answer: e.target.value })}>
                                                    <option value="">Select...</option>
                                                    {currentQ.options.filter(o => o).map((opt, i) => (
                                                        <option key={i} value={opt}>{String.fromCharCode(65 + i)}: {opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group full-width">
                                        <label>Explanation</label>
                                        <textarea className="form-input" value={currentQ.explanation}
                                            onChange={e => setCurrentQ({ ...currentQ, explanation: e.target.value })} placeholder="Explain the correct answer..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Marks</label>
                                        <input className="form-input" type="number" min="1" value={currentQ.marks}
                                            onChange={e => setCurrentQ({ ...currentQ, marks: parseInt(e.target.value) || 1 })} />
                                    </div>
                                </div>
                                <button className="btn btn-success" onClick={addQuestion}>+ Add Question</button>
                            </div>

                            {/* Questions List */}
                            {questions.length > 0 && (
                                <div className="questions-preview" style={{ marginTop: 20 }}>
                                    <h3>📋 Questions Added ({questions.length})</h3>
                                    {questions.map((q, i) => (
                                        <div key={q.id} className="q-preview-item animate-fadeIn">
                                            <div className="q-preview-num">Q{i + 1}</div>
                                            <div className="q-preview-content">
                                                <span className="badge badge-primary" style={{ marginBottom: 4 }}>{q.section}</span>
                                                <span className="badge badge-warning" style={{ marginLeft: 6 }}>{q.type}</span>
                                                <p>{q.question_text.substring(0, 100)}{q.question_text.length > 100 ? '...' : ''}</p>
                                            </div>
                                            <button className="btn btn-ghost btn-sm" onClick={() => removeQuestion(q.id)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="step-actions">
                                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                                <button className="btn btn-primary" onClick={() => setStep(4)}>Next: Review →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Preview & Publish */}
                    {step === 4 && (
                        <div className="schedule-step">
                            <h2>📋 Test Preview</h2>
                            <p style={{ color: 'var(--gray-400)', marginBottom: 16 }}>Review all questions and answers before publishing</p>

                            <div className="review-summary">
                                <div className="review-item">
                                    <span className="review-label">Title</span>
                                    <span className="review-value">{testForm.title || 'Untitled'}</span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">Duration</span>
                                    <span className="review-value">{testForm.duration} minutes</span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">Questions</span>
                                    <span className="review-value">{questions.length} questions</span>
                                </div>
                                <div className="review-item">
                                    <span className="review-label">Total Marks</span>
                                    <span className="review-value">{questions.reduce((sum, q) => sum + (q.marks || 1), 0)}</span>
                                </div>
                                {testForm.scheduled_date && (
                                    <div className="review-item">
                                        <span className="review-label">Scheduled</span>
                                        <span className="review-value">{testForm.scheduled_date} at {testForm.scheduled_time || 'Any time'}</span>
                                    </div>
                                )}
                                <div className="review-item">
                                    <span className="review-label">Eligibility</span>
                                    <span className="review-value">{testForm.eligibility_type === 'all' ? 'All Students' :
                                        testForm.eligibility_type === 'branch' ? `Branches: ${testForm.branches.join(', ')}` :
                                            testForm.eligibility_type === 'group' ? `Groups: ${testForm.groups}` : 'Specific Students'}</span>
                                </div>
                            </div>

                            <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: '1.1rem' }}>📝 Questions Preview</h3>
                            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                                {questions.map((q, i) => (
                                    <div key={q.id} className="question-card" style={{ marginBottom: 12 }}>
                                        <div className="question-card-header">
                                            <span className="question-num">Q{i + 1}</span>
                                            <span className="badge badge-primary">{q.type.toUpperCase()}</span>
                                            <span className="badge badge-success">{q.marks || 1} mark(s)</span>
                                        </div>
                                        <p className="question-text" style={{ margin: '8px 0', fontWeight: 500 }}>{q.question_text}</p>
                                        {q.type === 'mcq' && q.options && (
                                            <div className="question-options" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                                                {q.options.map((opt, j) => (
                                                    <div key={j} style={{
                                                        padding: '8px 12px', borderRadius: 6, fontSize: '0.88rem',
                                                        background: opt === q.correct_answer ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                                                        border: opt === q.correct_answer ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--border-color)',
                                                        color: opt === q.correct_answer ? '#22c55e' : 'var(--gray-300)',
                                                        fontWeight: opt === q.correct_answer ? 600 : 400,
                                                    }}>
                                                        {String.fromCharCode(65 + j)}) {opt} {opt === q.correct_answer && ' ✅'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {q.type === 'coding' && (
                                            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', marginTop: 8, fontSize: '0.85rem', color: 'var(--primary-400)' }}>
                                                💻 Coding Question
                                            </div>
                                        )}
                                        {q.explanation && (
                                            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginTop: 8, fontSize: '0.83rem', color: '#f59e0b' }}>
                                                💡 Explanation: {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="step-actions" style={{ marginTop: 20 }}>
                                <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back to Edit</button>
                                <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? '⏳ Publishing...' : '🚀 Publish Test'}</button>
                            </div>
                        </div>
                    )}
                </div>

                {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
            </main>
        </div>
    );
}
