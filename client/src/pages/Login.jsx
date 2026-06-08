import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [focused, setFocused] = useState({});

  const field  = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const onFocus = (k)   => setFocused(f => ({ ...f, [k]: true }));
  const onBlur  = (k)   => setFocused(f => ({ ...f, [k]: false }));

  const inputStyle = (k) => ({
    width: '100%', padding: '11px 14px',
    border: `1px solid ${focused[k] ? 'var(--brand)' : 'var(--border)'}`,
    borderRadius: 12, fontSize: 14, color: 'var(--text-strong)',
    outline: 'none', background: 'var(--surface-muted)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(form);
      login(res.data.token, res.data.member);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)', background: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '56px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, margin: '0 auto 16px',
            boxShadow: 'var(--shadow)',
          }}>🌉</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-strong)',
                       letterSpacing: '-0.5px', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Not a member yet?{' '}
            <Link to="/signup" style={{ color: 'var(--brand)', fontWeight: 600 }}>
              Join now
            </Link>
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '32px',
          boxShadow: 'var(--shadow)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                              color: 'var(--text-muted)', marginBottom: 6 }}>
                Email
              </label>
              <input style={inputStyle('email')} type="email"
                placeholder="alex@example.com"
                value={form.email}
                onChange={e => field('email', e.target.value)}
                onFocus={() => onFocus('email')} onBlur={() => onBlur('email')} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
                  Password
                </label>
              </div>
              <input style={inputStyle('password')} type="password"
                placeholder="Your password"
                value={form.password}
                onChange={e => field('password', e.target.value)}
                onFocus={() => onFocus('password')} onBlur={() => onBlur('password')} />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'var(--danger-soft)', border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
                fontSize: 13, color: 'var(--danger)',
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', marginTop: 4,
              background: loading ? 'var(--text-subtle)' : 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
              color: 'var(--brand-contrast)', border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: loading ? 'none' : 'var(--shadow)',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>

        {/* Admin link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-subtle)' }}>
          Bridgemakers staff?{' '}
          <Link to="/admin/login" style={{ color: 'var(--brand)' }}>
            Admin login →
          </Link>
        </p>
      </div>
    </div>
  );
}