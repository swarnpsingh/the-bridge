import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, forgotPassword, resetPassword } from '../api';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  // login state
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [focused, setFocused] = useState({});

  // forgot-password state
  const [step, setStep]           = useState('login'); // 'login' | 'email' | 'otp'
  const [fpEmail, setFpEmail]     = useState('');
  const [otp, setOtp]             = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError]     = useState('');
  const [fpSuccess, setFpSuccess] = useState('');

  const field   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const onFocus = (k)    => setFocused(f => ({ ...f, [k]: true }));
  const onBlur  = (k)    => setFocused(f => ({ ...f, [k]: false }));

  const inputStyle = (k) => ({
    width: '100%', padding: '11px 14px',
    border: `1px solid ${focused[k] ? 'var(--brand)' : 'var(--border)'}`,
    borderRadius: 12, fontSize: 14, color: 'var(--text-strong)',
    outline: 'none', background: 'var(--surface-muted)',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  });

  const handleLogin = async (e) => {
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

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!fpEmail) { setFpError('Enter your email.'); return; }
    setFpLoading(true);
    setFpError('');
    try {
      await forgotPassword({ email: fpEmail });
      setStep('otp');
    } catch (err) {
      setFpError(err.response?.data?.error || 'Could not send OTP. Try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setFpError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFpError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setFpError('Password must be at least 6 characters.');
      return;
    }
    setFpLoading(true);
    setFpError('');
    try {
      await resetPassword({ email: fpEmail, otp, newPassword });
      setFpSuccess('Password updated! You can now sign in.');
      setTimeout(() => {
        setStep('login');
        setFpSuccess('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setFpEmail('');
      }, 2500);
    } catch (err) {
      setFpError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setFpLoading(false);
    }
  };

  const goBackToLogin = () => {
    setStep('login');
    setFpError('');
    setFpSuccess('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setFpEmail('');
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
          <img
            src="/bridgemakersLogo.png"
            alt="Bridgemakers"
            style={{ width: 56, height: 56, objectFit: 'contain', display: 'block', margin: '0 auto 16px' }}
          />
          {step === 'login' && (
            <>
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
            </>
          )}
          {step === 'email' && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-strong)',
                           letterSpacing: '-0.5px', marginBottom: 6 }}>
                Forgot password?
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Enter your email and we'll send you a 6-digit code.
              </p>
            </>
          )}
          {step === 'otp' && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-strong)',
                           letterSpacing: '-0.5px', marginBottom: 6 }}>
                Check your email
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                We sent a 6-digit code to <strong>{fpEmail}</strong>
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '32px',
          boxShadow: 'var(--shadow)',
        }}>

          {/* ── Login form ── */}
          {step === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                  <button type="button" onClick={() => { setStep('email'); setError(''); setFpEmail(form.email); }}
                    style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600,
                             background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Forgot password?
                  </button>
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
                  background: 'var(--danger-soft)',
                  border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
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
          )}

          {/* ── Step 1: Request OTP ── */}
          {step === 'email' && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: 'var(--text-muted)', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  style={inputStyle('fpEmail')}
                  type="email"
                  placeholder="alex@example.com"
                  value={fpEmail}
                  onChange={e => setFpEmail(e.target.value)}
                  onFocus={() => onFocus('fpEmail')}
                  onBlur={() => onBlur('fpEmail')}
                  autoFocus
                />
              </div>

              {fpError && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--danger-soft)',
                  border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
                  fontSize: 13, color: 'var(--danger)',
                }}>
                  {fpError}
                </div>
              )}

              <button type="submit" disabled={fpLoading} style={{
                width: '100%', padding: '13px',
                background: fpLoading ? 'var(--text-subtle)' : 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
                color: 'var(--brand-contrast)', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                cursor: fpLoading ? 'not-allowed' : 'pointer',
                boxShadow: fpLoading ? 'none' : 'var(--shadow)',
              }}>
                {fpLoading ? 'Sending...' : 'Send code →'}
              </button>

              <button type="button" onClick={goBackToLogin} style={{
                background: 'none', border: 'none', fontSize: 13,
                color: 'var(--text-muted)', cursor: 'pointer', textAlign: 'center',
              }}>
                ← Back to sign in
              </button>
            </form>
          )}

          {/* ── Step 2: Enter OTP + new password ── */}
          {step === 'otp' && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: 'var(--text-muted)', marginBottom: 6 }}>
                  6-digit code
                </label>
                <input
                  style={{ ...inputStyle('otp'), letterSpacing: '6px', fontSize: 20,
                           fontWeight: 700, textAlign: 'center' }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onFocus={() => onFocus('otp')}
                  onBlur={() => onBlur('otp')}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: 'var(--text-muted)', marginBottom: 6 }}>
                  New password
                </label>
                <input
                  style={inputStyle('newPw')}
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  onFocus={() => onFocus('newPw')}
                  onBlur={() => onBlur('newPw')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                                color: 'var(--text-muted)', marginBottom: 6 }}>
                  Confirm new password
                </label>
                <input
                  style={inputStyle('confirmPw')}
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onFocus={() => onFocus('confirmPw')}
                  onBlur={() => onBlur('confirmPw')}
                />
              </div>

              {fpError && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--danger-soft)',
                  border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
                  fontSize: 13, color: 'var(--danger)',
                }}>
                  {fpError}
                </div>
              )}

              {fpSuccess && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--success-soft)',
                  border: '1px solid color-mix(in srgb, var(--success) 24%, transparent)',
                  fontSize: 13, color: 'var(--success)', textAlign: 'center', fontWeight: 500,
                }}>
                  {fpSuccess}
                </div>
              )}

              <button type="submit" disabled={fpLoading || !!fpSuccess} style={{
                width: '100%', padding: '13px',
                background: (fpLoading || fpSuccess) ? 'var(--text-subtle)' : 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
                color: 'var(--brand-contrast)', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                cursor: (fpLoading || fpSuccess) ? 'not-allowed' : 'pointer',
                boxShadow: (fpLoading || fpSuccess) ? 'none' : 'var(--shadow)',
              }}>
                {fpLoading ? 'Updating...' : 'Reset password →'}
              </button>

              <button type="button" onClick={() => { setStep('email'); setFpError(''); setOtp(''); }}
                style={{
                  background: 'none', border: 'none', fontSize: 13,
                  color: 'var(--text-muted)', cursor: 'pointer', textAlign: 'center',
                }}>
                ← Resend code
              </button>
            </form>
          )}
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
