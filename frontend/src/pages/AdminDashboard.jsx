import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tests');
    const [selectedTest, setSelectedTest] = useState(null);
    const [results, setResults] = useState([]);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [emailModal, setEmailModal] = useState(null);
    const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
    const [emailSending, setEmailSending] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => { fetchTests(); }, []);

    const fetchTests = async () => {
        try {
            const res = await api.get('/admin/tests');
            setTests(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const deleteTest = async (id) => {
        if (!window.confirm('Delete this test? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/tests/${id}`);
            setTests(tests.filter(t => t.id !== id));
            showToast('Test deleted');
        } catch (err) { showToast('Failed to delete', 'error'); }
    };

    const toggleActive = async (test) => {
        try {
            await api.put(`/admin/tests/${test.id}`, { ...test, eligibility_rules: test.eligibility_rules ? JSON.parse(test.eligibility_rules) : {}, is_active: test.is_active ? 0 : 1 });
            fetchTests();
            showToast(test.is_active ? 'Test deactivated' : 'Test activated');
        } catch (err) { showToast('Failed to update', 'error'); }
    };

    const viewResults = async (test) => {
        setSelectedTest(test);
        setActiveTab('results');
        setResultsLoading(true);
        try {
            const res = await api.get(`/admin/tests/${test.id}/results`);
            setResults(res.data);
        } catch (err) { setResults([]); }
        setResultsLoading(false);
    };

    const exportExcel = (testId) => {
        const token = localStorage.getItem('token');
        window.open(`${api.defaults.baseURL}/admin/tests/${testId}/results/excel?token=${token}`, '_blank');
    };

    const exportPdf = (testId) => {
        const token = localStorage.getItem('token');
        window.open(`${api.defaults.baseURL}/admin/tests/${testId}/results/pdf?token=${token}`, '_blank');
    };

    const downloadExcel = async (testId) => {
        try {
            const res = await api.get(`/admin/tests/${testId}/results/excel`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.download = 'results.xlsx'; a.click();
        } catch (err) { showToast('Export failed', 'error'); }
    };

    const downloadPdf = async (testId) => {
        try {
            const res = await api.get(`/admin/tests/${testId}/results/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.download = 'results.pdf'; a.click();
        } catch (err) { showToast('Export failed', 'error'); }
    };

    const sendEmail = async () => {
        if (!emailForm.to.trim()) return showToast('Enter email addresses', 'error');
        setEmailSending(true);
        try {
            const res = await api.post('/admin/send-email', { ...emailForm, test_id: emailModal.id }, { timeout: 15000 });
            showToast(res.data.message || 'Email sent!');
            setEmailModal(null);
        } catch (err) {
            const msg = err.response?.data?.error || (err.code === 'ECONNABORTED' ? 'Email timed out. Check Gmail credentials on Render.' : err.message);
            showToast('Email failed: ' + msg, 'error');
        }
        setEmailSending(false);
    };

    const activeTests = tests.filter(t => t.is_active);
    const now = new Date();

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="admin-header animate-fadeInUp">
                    <h1>🎓 Admin Dashboard</h1>
                    <button className="btn btn-primary" onClick={() => navigate('/admin/schedule')}>+ Schedule New Test</button>
                </div>

                {/* Stats */}
                <div className="stats-row animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
                    <div className="stat-card"><div className="stat-value">{tests.length}</div><div className="stat-label">Total Tests</div></div>
                    <div className="stat-card"><div className="stat-value">{activeTests.length}</div><div className="stat-label">Active Tests</div></div>
                    <div className="stat-card"><div className="stat-value">{tests.filter(t => t.scheduled_date && new Date(`${t.scheduled_date}T${t.scheduled_time || '00:00'}`) > now).length}</div><div className="stat-label">Upcoming</div></div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <button className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>📋 All Tests</button>
                    <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>📊 Results</button>
                </div>

                {/* Tests Tab */}
                {activeTab === 'tests' && (
                    <div className="tests-table-wrapper animate-fadeIn">
                        {loading ? <div className="spinner" style={{ margin: '40px auto' }}></div> : tests.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">📝</div><h3>No tests yet</h3><p>Schedule your first mock test</p></div>
                        ) : (
                            <table className="tests-table">
                                <thead>
                                    <tr><th>Title</th><th>Duration</th><th>Scheduled</th><th>Status</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {tests.map(test => {
                                        const isUpcoming = test.scheduled_date && new Date(`${test.scheduled_date}T${test.scheduled_time || '00:00'}`) > now;
                                        return (
                                            <tr key={test.id}>
                                                <td><strong>{test.title}</strong><br /><small style={{ color: 'var(--gray-400)' }}>{test.description?.substring(0, 50)}</small></td>
                                                <td>{test.duration} min</td>
                                                <td>{test.scheduled_date ? `${test.scheduled_date} ${test.scheduled_time || ''}` : <span className="badge badge-warning">Anytime</span>}</td>
                                                <td>
                                                    {isUpcoming && <span className="badge badge-primary">Upcoming</span>}
                                                    {!isUpcoming && test.is_active ? <span className="badge badge-success">Active</span> : !test.is_active ? <span className="badge badge-danger">Inactive</span> : null}
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/admin/edit/${test.id}`)} title="Edit">✏️</button>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => viewResults(test)} title="Results">📊</button>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => {
                                                            setEmailModal(test);
                                                            setEmailForm({ to: '', subject: `Mock Test: ${test.title}`, body: `<h2>Mock Test Notification</h2><p>You have been invited to take: <b>${test.title}</b></p><p>Duration: ${test.duration} minutes</p>${test.scheduled_date ? `<p>Scheduled: ${test.scheduled_date} ${test.scheduled_time || ''}</p>` : ''}<p>Please login to the platform to take the test.</p>` });
                                                        }} title="Email">📧</button>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(test)} title={test.is_active ? 'Deactivate' : 'Activate'}>
                                                            {test.is_active ? '🔴' : '🟢'}
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => deleteTest(test.id)} title="Delete">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div className="results-section animate-fadeIn">
                        {!selectedTest ? (
                            <div className="empty-state">
                                <div className="empty-icon">📊</div>
                                <h3>Select a test to view results</h3>
                                <div className="results-test-list">
                                    {tests.map(t => (
                                        <button key={t.id} className="btn btn-outline btn-sm" style={{ margin: 4 }} onClick={() => viewResults(t)}>{t.title}</button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="results-header">
                                    <div>
                                        <h2>📊 Results: {selectedTest.title}</h2>
                                        <p style={{ color: 'var(--gray-400)' }}>{results.length} submissions</p>
                                    </div>
                                    <div className="results-actions">
                                        <button className="btn btn-outline btn-sm" onClick={() => downloadExcel(selectedTest.id)}>📥 Excel</button>
                                        <button className="btn btn-outline btn-sm" onClick={() => downloadPdf(selectedTest.id)}>📄 PDF</button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedTest(null); setResults([]); }}>← Back</button>
                                    </div>
                                </div>
                                {resultsLoading ? <div className="spinner" style={{ margin: '40px auto' }}></div> : results.length === 0 ? (
                                    <div className="empty-state"><div className="empty-icon">📭</div><h3>No submissions yet</h3></div>
                                ) : (
                                    <table className="tests-table">
                                        <thead>
                                            <tr><th>Sr No</th><th>Student Name</th><th>Email</th><th>Class</th><th>Branch</th><th>Score</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {results.map((r, i) => (
                                                <tr key={r.attempt_id}>
                                                    <td>{i + 1}</td>
                                                    <td><strong>{r.full_name}</strong></td>
                                                    <td>{r.email}</td>
                                                    <td>{r.class || '-'}</td>
                                                    <td>{r.branch || '-'}</td>
                                                    <td><span className="badge badge-primary">{r.score || 0}</span></td>
                                                    <td><span className={`badge ${r.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Email Modal */}
                {emailModal && (
                    <div className="modal-overlay" onClick={() => setEmailModal(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h2>📧 Send Test Notification</h2>
                            <p style={{ color: 'var(--gray-400)', marginBottom: 16 }}>Send test link to students via email</p>
                            <div className="form-group">
                                <label>To (comma-separated emails) *</label>
                                <textarea className="form-input" rows={3} placeholder="student1@email.com, student2@email.com"
                                    value={emailForm.to} onChange={e => setEmailForm({ ...emailForm, to: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input className="form-input" value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Message (HTML)</label>
                                <textarea className="form-input" rows={5} value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button className="btn btn-ghost" onClick={() => setEmailModal(null)}>Cancel</button>
                                <button className="btn btn-primary" onClick={sendEmail} disabled={emailSending}>
                                    {emailSending ? '⏳ Sending...' : '📧 Send Email'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
            </main>
        </div>
    );
}
