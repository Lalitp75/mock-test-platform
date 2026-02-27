import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Login.css';

const CLASSES = ['FE', 'SE', 'TE', 'BE', 'MBA'];
const BRANCHES = [
    { value: 'CS', label: 'Computer Science' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'AI&DS', label: 'AI & Data Science' },
    { value: 'E&TC', label: 'Electronics & Telecom' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'MBA', label: 'MBA' },
];

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({
        full_name: '', email: '', password: '', role: 'student',
        class: '', branch: '', admin_secret: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await api.post('/auth/register', form);
                setIsRegister(false);
                alert('Registered successfully! Please login.');
            } else {
                const res = await api.post('/auth/login', { email: form.email, password: form.password });
                login(res.data.user, res.data.token);
                navigate(res.data.user.role === 'admin' ? '/admin' : '/student');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally { setLoading(false); }
    };

    return (
        <div className="login-page">
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>
            <div className="bg-orb bg-orb-3"></div>

            <div className="login-container animate-fadeInUp">
                <div className="login-header">
                    <div className="college-branding">
                        <h1 className="college-name">
                            Pune Vidyarthi Griha's
                            <span className="college-name-highlight">College of Engineering</span>
                        </h1>
                        <p className="college-sub">& S. S. Dhamankar Institute of Management, Nashik</p>
                        <div className="naac-badge"><span>NAAC 'A' Grade</span></div>
                    </div>
                    <div className="platform-title">
                        <div className="platform-icon">📝</div>
                        <h2>Mock Test Platform</h2>
                        <p>Practice. Prepare. Perform.</p>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-toggle">
                        <button type="button" className={`toggle-btn ${!isRegister ? 'active' : ''}`} onClick={() => setIsRegister(false)}>Login</button>
                        <button type="button" className={`toggle-btn ${isRegister ? 'active' : ''}`} onClick={() => setIsRegister(true)}>Register</button>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    {isRegister && (
                        <div className="form-group animate-fadeIn">
                            <label>Full Name *</label>
                            <input className="form-input" type="text" placeholder="Enter your full name"
                                value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email *</label>
                        <input className="form-input" type="email" placeholder="Enter your email"
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Password *</label>
                        <input className="form-input" type="password" placeholder="Enter your password"
                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>

                    {isRegister && (
                        <>
                            <div className="form-group animate-fadeIn">
                                <label>Register As</label>
                                <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option value="student">Student</option>
                                    <option value="admin">Admin (requires secret key)</option>
                                </select>
                            </div>

                            {form.role === 'admin' && (
                                <div className="form-group animate-fadeIn">
                                    <label>Admin Secret Key *</label>
                                    <input className="form-input" type="password" placeholder="Enter admin secret key"
                                        value={form.admin_secret} onChange={e => setForm({ ...form, admin_secret: e.target.value })} required />
                                    <small style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>Contact administrator for the secret key</small>
                                </div>
                            )}

                            {form.role === 'student' && (
                                <>
                                    <div className="form-group animate-fadeIn">
                                        <label>Class *</label>
                                        <select className="form-input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required>
                                            <option value="">Select Class</option>
                                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group animate-fadeIn">
                                        <label>Branch *</label>
                                        <select className="form-input" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} required>
                                            <option value="">Select Branch</option>
                                            {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <button className="btn btn-primary btn-lg login-submit" type="submit" disabled={loading}>
                        {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : (isRegister ? 'Create Account' : 'Sign In')}
                    </button>
                </form>
            </div>
        </div>
    );
}
