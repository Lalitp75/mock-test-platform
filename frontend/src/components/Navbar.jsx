import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';
    const navItems = isAdmin
        ? [
            { path: '/admin', label: 'Dashboard', icon: '📊' },
            { path: '/admin/schedule', label: 'Schedule Test', icon: '📅' },
        ]
        : [
            { path: '/student', label: 'Dashboard', icon: '🏠' },
            { path: '/student/practice', label: 'Essay Practice', icon: '✍️' },
        ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand" onClick={() => navigate(isAdmin ? '/admin' : '/student')}>
                    <span className="brand-icon">📝</span>
                    <div className="brand-text">
                        <span className="brand-name">PVG MockTest</span>
                        <span className="brand-role">{isAdmin ? 'Admin Panel' : 'Student Portal'}</span>
                    </div>
                </div>

                <div className="navbar-links">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="navbar-user">
                    <div className="user-avatar">{(user.full_name || user.email || '?').charAt(0).toUpperCase()}</div>
                    <div className="user-info">
                        <span className="user-name">{user.full_name || user.email}</span>
                        <span className="user-branch">{user.branch || user.role}</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
}
