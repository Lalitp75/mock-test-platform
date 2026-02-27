import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import './StudentDashboard.css';

export default function StudentDashboard() {
    const [tests, setTests] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tests');
    const navigate = useNavigate();

    useEffect(() => { loadTests(); loadResults(); }, []);

    const loadTests = async () => {
        try {
            const res = await api.get('/student/tests');
            setTests(res.data || []);
        } catch (err) { setTests([]); }
        setLoading(false);
    };

    const loadResults = async () => {
        try {
            const res = await api.get('/student/results');
            setResults(res.data || []);
        } catch (err) { setResults([]); }
    };

    const downloadResult = async (attemptId) => {
        try {
            const res = await api.get(`/student/results/${attemptId}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.download = `result_${attemptId}.pdf`; a.click();
        } catch (err) { alert('Failed to download result'); }
    };

    const availableTests = tests.filter(t => !t.is_upcoming);
    const upcomingTests = tests.filter(t => t.is_upcoming);

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                <div className="dashboard-header animate-fadeInUp">
                    <div>
                        <h1>🎓 Student Dashboard</h1>
                        <p>View available tests, track your progress, and practice</p>
                    </div>
                    <button className="btn btn-accent btn-lg" onClick={() => navigate('/student/practice')}>✍️ Practice Essay</button>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="action-card" onClick={() => navigate('/student/practice')}>
                        <div className="action-icon">✍️</div>
                        <h3>Essay Practice</h3>
                        <p>Practice writing essays with timer</p>
                    </div>
                    <div className="action-card" onClick={() => setActiveTab('results')}>
                        <div className="action-icon">📊</div>
                        <h3>My Results</h3>
                        <p>View your past test results</p>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">📚</div>
                        <h3>Study Material</h3>
                        <p>Access study guides and question banks</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                    <button className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>📝 Available Tests</button>
                    <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>📊 My Results</button>
                </div>

                {/* Tests Tab */}
                {activeTab === 'tests' && (
                    <div className="section animate-fadeIn">
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner"></div></div>
                        ) : tests.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">📋</div><h3>No tests available</h3><p>Check back later for upcoming mock tests</p></div>
                        ) : (
                            <>
                                {/* Upcoming Tests (Disabled) */}
                                {upcomingTests.length > 0 && (
                                    <>
                                        <h3 style={{ color: 'var(--gray-300)', marginBottom: 12 }}>🕐 Upcoming Tests</h3>
                                        <div className="tests-grid">
                                            {upcomingTests.map((test, i) => (
                                                <div key={test.id} className="test-card test-card-disabled animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s` }}>
                                                    <div className="test-card-top">
                                                        <span className="badge badge-primary">{test.duration} min</span>
                                                        <span className="badge badge-warning">Upcoming</span>
                                                    </div>
                                                    <h3 className="test-card-title">{test.title}</h3>
                                                    <p className="test-card-desc">{test.description || 'No description'}</p>
                                                    {test.scheduled_date && (
                                                        <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', marginTop: 8 }}>
                                                            📅 {test.scheduled_date} {test.scheduled_time || ''}
                                                        </p>
                                                    )}
                                                    <div className="test-card-footer">
                                                        <button className="btn btn-ghost" disabled>🔒 Not Yet Available</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Available Tests */}
                                {availableTests.length > 0 && (
                                    <>
                                        <h3 style={{ color: 'var(--gray-300)', margin: '20px 0 12px' }}>✅ Available Now</h3>
                                        <div className="tests-grid">
                                            {availableTests.map((test, i) => (
                                                <div key={test.id} className="test-card animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s` }}>
                                                    <div className="test-card-top">
                                                        <span className="badge badge-primary">{test.duration} min</span>
                                                        <span className={`badge ${test.result_display === 'immediate' ? 'badge-success' : 'badge-warning'}`}>
                                                            {test.result_display === 'immediate' ? 'Instant Result' : 'Result Later'}
                                                        </span>
                                                    </div>
                                                    <h3 className="test-card-title">{test.title}</h3>
                                                    <p className="test-card-desc">{test.description || 'No description'}</p>
                                                    <div className="test-card-footer">
                                                        <button className="btn btn-primary" onClick={() => navigate(`/student/test/${test.id}`)}>Start Test →</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div className="section animate-fadeIn">
                        {results.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">📊</div><h3>No results yet</h3><p>Take a test to see your results here</p></div>
                        ) : (
                            <div className="results-list">
                                {results.map(r => (
                                    <div key={r.id} className="result-card">
                                        <div>
                                            <h3>{r.title}</h3>
                                            <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                                                Completed: {new Date(r.end_time || r.start_time).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '6px 16px' }}>Score: {r.score || 0}</span>
                                            <button className="btn btn-outline btn-sm" onClick={() => downloadResult(r.id)}>📄 PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
