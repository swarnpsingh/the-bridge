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
    border: `1px solid ${focused[k] ? '#1a1a1a' : '#e5e5e5'}`,
    borderRadius: 8, fontSize: 14, color: '#1a1a1a',
    outline: 'none', background: '#fafafa',
    transition: 'border-color 0.15s',
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
      minHeight: 'calc(100vh - 56px)', background: '#f9f8f6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, margin: '0 auto 16px',
          }}>🌉</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a',
                       letterSpacing: '-0.5px', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#888' }}>
            Not a member yet?{' '}
            <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 500 }}>
              Join now
            </Link>
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 16, padding: '32px',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                              color: '#555', marginBottom: 6 }}>
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
                <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>
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
                background: '#fff1f1', border: '1px solid #fecaca',
                fontSize: 13, color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', marginTop: 4,
              background: loading ? '#999' : '#1a1a1a',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>

        {/* Admin link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#ccc' }}>
          Bridgemakers staff?{' '}
          <Link to="/admin/login" style={{ color: '#aaa' }}>
            Admin login →
          </Link>
        </p>
      </div>
    </div>
  );
}