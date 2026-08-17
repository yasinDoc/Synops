import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('tutul@student.univ.edu');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectByRole = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }

    if (role === 'student') {
      navigate('/student/dashboard', { replace: true });
    } else if (role === 'faculty') {
      navigate('/faculty/dashboard', { replace: true });
    } else if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/student/dashboard', { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login({ email, password, role: selectedRole });
      if (res.success) {
        redirectByRole(res.user.role);
      } else {
        setErrorMessage(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (role, demoEmail) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #312e81 0%, #0f172a 100%)',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        padding: '2.5rem 2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)'
          }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            AcademicFlow Portal
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Sign in to access your thesis & defense dashboard
          </p>
        </div>

        {/* Quick Role Selector Presets */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Select Demo Persona:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setDemoRole('student', 'tutul@student.univ.edu')}
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${selectedRole === 'student' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: selectedRole === 'student' ? 'var(--primary-light)' : 'white',
                color: selectedRole === 'student' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              🎓 Student (Tutul)
            </button>

            <button
              type="button"
              onClick={() => setDemoRole('faculty', 'supervisor@univ.edu')}
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${selectedRole === 'faculty' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: selectedRole === 'faculty' ? 'var(--primary-light)' : 'white',
                color: selectedRole === 'faculty' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              👨‍🏫 Faculty
            </button>

            <button
              type="button"
              onClick={() => setDemoRole('admin', 'admin@univ.edu')}
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${selectedRole === 'admin' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: selectedRole === 'admin' ? 'var(--primary-light)' : 'white',
                color: selectedRole === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: 'var(--status-danger-bg)',
            border: '1px solid var(--status-danger-border)',
            color: 'var(--status-danger-text)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@univ.edu"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Use any demo password (e.g. password123)"); }} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.775rem',
          color: 'var(--text-muted)'
        }}>
          <span>Role-based routing auto-directs to assigned workspace</span>
        </div>
      </div>
    </div>
  );
};
