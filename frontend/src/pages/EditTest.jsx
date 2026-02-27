import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import './ScheduleTest.css';

export default function EditTest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [testForm, setTestForm] = useState({
        title: '', description: '', duration: 60, result_display: 'immediate',
        scheduled_date: '', scheduled_time: '', is_active: 1,
    });
    const [questions, setQuestions] = useState([]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        loadTest();
    }, [id]);

    const loadTest = async () => {
        try {
            const res = await api.get(`/admin/tests/${id}`);
            const test = res.data;
            setTestForm({
                title: test.title || '', description: test.description || '',
                duration: test.duration || 60, result_display: test.result_display || 'immediate',
                scheduled_date: test.scheduled_date || '', scheduled_time: test.scheduled_time || '',
                is_active: test.is_active,
            });
            setQuestions((test.questions || []).map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            })));
        } catch (err) { showToast('Failed to load test', 'error'); }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            await api.put(`/admin/tests/${id}`, {
                ...testForm,
                eligibility_rules: {},
            });
            showToast('Test updated successfully!');
            setTimeout(() => navigate('/admin'), 1000);
        } catch (err) { showToast('Failed to update', 'error'); }
    };

    const deleteQuestion = async (qId) => {
        try {
            await api.delete(`/admin/questions/${qId}`);
            setQuestions(questions.filter(q => q.id !== qId));
            showToast('Question deleted');
        } catch (err) { showToast('Failed to delete question', 'error'); }
    };

    if (loading) return <div className="dashboard-layout"><Navbar /><main className="dashboard-main"><div className="spinner" style={{ margin: '80px auto' }}></div></main></div>;

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="schedule-header animate-fadeInUp">
                    <h1>✏️ Edit Test</h1>
                    <p>Modify test details, schedule, and questions</p>
                </div>

                <div className="schedule-content animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="schedule-step">
                        <h2>Test Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Test Title *</label>
                                <input className="form-input" type="text" value={testForm.title}
                                    onChange={e => setTestForm({ ...testForm, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input className="form-input" type="number" value={testForm.duration}
                                    onChange={e => setTestForm({ ...testForm, duration: parseInt(e.target.value) || 60 })} />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea className="form-input" value={testForm.description}
                                    onChange={e => setTestForm({ ...testForm, description: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Scheduled Date</label>
                                <input className="form-input" type="date" value={testForm.scheduled_date}
                                    onChange={e => setTestForm({ ...testForm, scheduled_date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Scheduled Time</label>
                                <input className="form-input" type="time" value={testForm.scheduled_time}
                                    onChange={e => setTestForm({ ...testForm, scheduled_time: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Result Display</label>
                                <select className="form-input" value={testForm.result_display}
                                    onChange={e => setTestForm({ ...testForm, result_display: e.target.value })}>
                                    <option value="immediate">Immediate</option>
                                    <option value="later">Later</option>
                                </select>
                            </div>
                        </div>

                        <h2 style={{ marginTop: 32 }}>Questions ({questions.length})</h2>
                        <div className="questions-list">
                            {questions.length === 0 ? (
                                <p style={{ color: 'var(--gray-400)' }}>No questions in this test</p>
                            ) : questions.map((q, i) => (
                                <div key={q.id} className="question-card">
                                    <div className="question-card-header">
                                        <span className="question-num">Q{i + 1}</span>
                                        <span className="badge badge-primary">{q.type}</span>
                                        <span className="badge badge-success">{q.marks} mark(s)</span>
                                        <button className="btn btn-ghost btn-sm" onClick={() => deleteQuestion(q.id)} style={{ marginLeft: 'auto' }}>🗑️</button>
                                    </div>
                                    <p className="question-text">{q.question_text}</p>
                                    {q.type === 'mcq' && q.options && (
                                        <div className="question-options">
                                            {(Array.isArray(q.options) ? q.options : []).map((opt, j) => (
                                                <span key={j} className={`option-badge ${opt === q.correct_answer ? 'correct' : ''}`}>
                                                    {String.fromCharCode(65 + j)}. {opt}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="step-actions" style={{ marginTop: 24 }}>
                            <button className="btn btn-ghost" onClick={() => navigate('/admin')}>← Back</button>
                            <button className="btn btn-primary" onClick={handleSave}>💾 Save Changes</button>
                        </div>
                    </div>
                </div>

                {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
            </main>
        </div>
    );
}
