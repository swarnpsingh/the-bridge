import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api';

const MEMBER_TYPES = ['Founder','Entrepreneur','Software developer','Marketing','Content creator','Student','Artist','Musician','Creative','Organizer','Activist','Policy professional','AI','Other'];

export default function Signup() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    memberType: [], platformRole: 'Member',
    role: '', company: '', location: '', linkedin: '', bio: '',
  });

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const inputStyle = (focused) => ({
    width: '100%', padding: '11px 14px',
    border: `1px solid ${focused ? 'var(--brand)' : 'var(--border)'}`,
    borderRadius: 12, fontSize: 14, color: 'var(--text-strong)',
    outline: 'none', background: 'var(--surface-muted)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  });

  const [focused, setFocused] = useState({});
  const onFocus = (k) => setFocused(f => ({ ...f, [k]: true }));
  const onBlur  = (k) => setFocused(f => ({ ...f, [k]: false }));

  const labelStyle = {
    display: 'block', fontSize: 12,
    fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6,
  };

  const validateStep1 = () => {
    if (!form.name.trim())     return 'Please enter your name.';
    if (!form.email.trim())    return 'Please enter your email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!form.memberType.length) return 'Please select at least one member tag.';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const res = await register({
        name: form.name, email: form.email, password: form.password,
        memberType: form.memberType, platformRole: form.platformRole,
        role: form.role, company: form.company,
        location: form.location, linkedin: form.linkedin, bio: form.bio,
      });
      login(res.data.token, res.data.member);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
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
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src="/bridgemakersLogo.png"
            alt="Bridgemakers"
            style={{ width: 56, height: 56, objectFit: 'contain', display: 'block', margin: '0 auto 16px' }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-strong)',
                       letterSpacing: '-0.5px', marginBottom: 6 }}>
            Join The Bridge
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step >= s ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))' : 'var(--surface-muted)',
                color: step >= s ? 'var(--brand-contrast)' : 'var(--text-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
              }}>
                {step > s ? '✓' : s}
              </div>
              <span style={{ fontSize: 12, color: step >= s ? 'var(--text-strong)' : 'var(--text-subtle)', fontWeight: 600 }}>
                {s === 1 ? 'Account' : 'Your profile'}
              </span>
              {s < 2 && (
                <div style={{ width: 32, height: 1,
                              background: step > s ? 'var(--brand)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '32px 32px',
          boxShadow: 'var(--shadow)',
        }}>

          {/* ── Step 1: Account details ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 20 }}>
                Create your account
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Full name <span style={{color:'var(--danger)'}}>*</span></label>
                  <input style={inputStyle(focused.name)}
                    placeholder="Alex Turner"
                    value={form.name}
                    onChange={e => field('name', e.target.value)}
                    onFocus={() => onFocus('name')} onBlur={() => onBlur('name')} />
                </div>

                <div>
                  <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Email <span style={{color:'var(--danger)'}}>*</span></label>
                  <input style={inputStyle(focused.email)} type="email"
                    placeholder="alex@example.com"
                    value={form.email}
                    onChange={e => field('email', e.target.value)}
                    onFocus={() => onFocus('email')} onBlur={() => onBlur('email')} />
                </div>

                <div>
                  <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Password <span style={{color:'var(--danger)'}}>*</span></label>
                  <input style={inputStyle(focused.password)} type="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={e => field('password', e.target.value)}
                    onFocus={() => onFocus('password')} onBlur={() => onBlur('password')} />
                </div>

                <div>
                  <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Confirm password <span style={{color:'var(--danger)'}}>*</span></label>
                  <input style={inputStyle(focused.confirm)} type="password"
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={e => field('confirmPassword', e.target.value)}
                    onFocus={() => onFocus('confirm')} onBlur={() => onBlur('confirm')} />
                </div>
              </div>

              {error && (
                <div style={{
                  marginTop: 16, padding: '10px 14px', borderRadius: 8,
                  background: 'var(--danger-soft)', border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
                  fontSize: 13, color: 'var(--danger)',
                }}>
                  {error}
                </div>
              )}

              <button onClick={handleNext} style={{
                width: '100%', marginTop: 24, padding: '13px',
                background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', color: 'var(--brand-contrast)', border: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: 'var(--shadow)',
              }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Profile details ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 20 }}>
                Tell us about yourself
              </h2>

              {/* Member tag */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>I am a... <span style={{color:'var(--danger)'}}>*</span></label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MEMBER_TYPES.map(t => {
                    const active = form.memberType.includes(t);
                    return (
                      <button key={t} type="button" onClick={() => field('memberType', active ? form.memberType.filter(x => x !== t) : [...form.memberType, t])} style={{
                        padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        border: active ? '2px solid var(--brand)' : '1px solid var(--border)',
                        background: active ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))' : 'var(--surface-solid)',
                        color: active ? 'var(--brand-contrast)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Optional fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Current role</label>
                  <input style={inputStyle(focused.role)}
                    placeholder="e.g. CEO, Engineer"
                    value={form.role}
                    onChange={e => field('role', e.target.value)}
                    onFocus={() => onFocus('role')} onBlur={() => onBlur('role')} />
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input style={inputStyle(focused.company)}
                    placeholder="e.g. Acme Inc."
                    value={form.company}
                    onChange={e => field('company', e.target.value)}
                    onFocus={() => onFocus('company')} onBlur={() => onBlur('company')} />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle(focused.location)}
                    placeholder="e.g. London, UK"
                    value={form.location}
                    onChange={e => field('location', e.target.value)}
                    onFocus={() => onFocus('location')} onBlur={() => onBlur('location')} />
                </div>
                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input style={inputStyle(focused.linkedin)}
                    placeholder="linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={e => field('linkedin', e.target.value)}
                    onFocus={() => onFocus('linkedin')} onBlur={() => onBlur('linkedin')} />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Short bio</label>
                <textarea style={{
                  ...inputStyle(focused.bio), height: 80, resize: 'vertical',
                }}
                  placeholder="Tell the community about yourself..."
                  value={form.bio}
                  onChange={e => field('bio', e.target.value)}
                  onFocus={() => onFocus('bio')} onBlur={() => onBlur('bio')} />
              </div>

              {error && (
                <div style={{
                  marginTop: 16, padding: '10px 14px', borderRadius: 8,
                  background: 'var(--danger-soft)', border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
                  fontSize: 13, color: 'var(--danger)',
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => { setStep(1); setError(''); }} style={{
                  padding: '13px 20px', borderRadius: 10, fontSize: 14,
                  border: '1px solid var(--border)', background: 'var(--surface)',
                  color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500,
                }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading} style={{
                  flex: 1, padding: '13px', borderRadius: 10, fontSize: 14,
                  fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? 'var(--text-subtle)' : 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
                  color: 'var(--brand-contrast)',
                  boxShadow: loading ? 'none' : 'var(--shadow)',
                }}>
                  {loading ? 'Creating account...' : 'Create account →'}
                </button>
              </div>
            </form>
          )}
        </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-subtle)', marginTop: 16 }}>
          By joining you agree to keep your info accurate and up to date.
        </p>
      </div>
    </div>
  );
}