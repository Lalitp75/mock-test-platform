import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ScheduleTest from './pages/ScheduleTest';
import EditTest from './pages/EditTest';
import StudentDashboard from './pages/StudentDashboard';
import TestTaking from './pages/TestTaking';
import EssayPractice from './pages/EssayPractice';
import './App.css';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ margin: '100px auto' }}></div>;
  if (!user) return <Navigate to="/" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/schedule" element={<ProtectedRoute allowedRole="admin"><ScheduleTest /></ProtectedRoute>} />
      <Route path="/admin/edit/:id" element={<ProtectedRoute allowedRole="admin"><EditTest /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/test/:testId" element={<ProtectedRoute allowedRole="student"><TestTaking /></ProtectedRoute>} />
      <Route path="/student/practice" element={<ProtectedRoute allowedRole="student"><EssayPractice /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
