import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('adminToken')) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 600, color: '#7c3aed',
            background: '#ede9fe', padding: '4px 12px',
            borderRadius: 20, letterSpacing: '.06em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            Admin Panel
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.5px', marginBottom: 6 }}>
            Sign in to The Bridge
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Restricted to administrators only.
          </p>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 32,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
                Username
              </label>
              <input
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid var(--border)', borderRadius: 8,
                  fontSize: 14, background: 'var(--surface-muted)',
                  color: 'var(--text-strong)', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid var(--border)', borderRadius: 8,
                  fontSize: 14, background: 'var(--surface-muted)',
                  color: 'var(--text-strong)', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'var(--danger-soft)',
                border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
                fontSize: 13, color: 'var(--danger)', marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              background: loading ? 'var(--text-subtle)' : 'var(--brand)',
              color: 'var(--brand-contrast)',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>
        {/* Member link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-subtle)' }}>
          Bridgemakers member?{' '}
          <Link to="/login" style={{ color: 'var(--brand)' }}>
            Member login →
          </Link>
        </p>
      </div>
      
    </div>
    
  );
}
