import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMember } from '../api';

const MEMBER_TYPES = ['Founder','VC','Developer','Designer','Marketer','Lawyer','Other'];

export default function CreateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', linkedin: '', location: '',
    role: '', company: '', memberType: '', platformRole: 'Member', bio: '',
  });

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.memberType) {
      setError('Please fill in name, email and member type.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createMember(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: 12,
    fontSize: 14, color: 'var(--text-strong)', outline: 'none',
    background: 'var(--surface-muted)', transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: 'var(--text-muted)', marginBottom: 6,
  };

  if (submitted) return (
    <div style={{
      maxWidth: 480, margin: '60px auto', background: 'var(--surface)',
      border: '1px solid var(--border)', borderRadius: 24, padding: '48px 36px',
      boxShadow: 'var(--shadow)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-strong)', marginBottom: 8 }}>
        You're on The Bridge!
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
        Your profile has been created. Start exploring the community.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link to="/members" style={{
          padding: '10px 22px', borderRadius: 999, background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
          color: 'var(--brand-contrast)', fontSize: 13, fontWeight: 700,
        }}>
          Browse members
        </Link>
        <Link to="/" style={{
          padding: '10px 22px', borderRadius: 999,
          border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
        }}>
          Go home
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/members" style={{ fontSize: 13, color: 'var(--text-muted)', display: 'inline-flex',
                                     alignItems: 'center', gap: 4, marginBottom: 12 }}>
          ← Back to members
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-strong)',
                     letterSpacing: '-0.5px', marginBottom: 4 }}>
          Create your profile
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Join The Bridge and connect with young leaders.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '28px 32px', marginBottom: 16,
          boxShadow: 'var(--shadow)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)',
                       marginBottom: 20, paddingBottom: 12,
                       borderBottom: '1px solid var(--border)' }}>
            Basic info
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Full name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input style={inputStyle} placeholder="Alex Turner"
                value={form.name} onChange={e => field('name', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Email <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input style={inputStyle} type="email" placeholder="alex@example.com"
                value={form.email} onChange={e => field('email', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Current role</label>
              <input style={inputStyle} placeholder="CEO, Software Engineer..."
                value={form.role} onChange={e => field('role', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Company</label>
              <input style={inputStyle} placeholder="Acme Inc."
                value={form.company} onChange={e => field('company', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Location</label>
              <input style={inputStyle} placeholder="London, UK"
                value={form.location} onChange={e => field('location', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>LinkedIn URL</label>
              <input style={inputStyle} placeholder="https://linkedin.com/in/..."
                value={form.linkedin} onChange={e => field('linkedin', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Short bio</label>
            <textarea style={{ ...inputStyle, height: 90, resize: 'vertical' }}
              placeholder="Tell the community a bit about yourself..."
              value={form.bio} onChange={e => field('bio', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#1a1a1a'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
          </div>
        </div>

        {/* Member type */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '28px 32px', marginBottom: 16,
          boxShadow: 'var(--shadow)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)',
                       marginBottom: 20, paddingBottom: 12,
                       borderBottom: '1px solid var(--border)' }}>
            Your role on The Bridge
          </h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>Member type <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MEMBER_TYPES.map(t => (
                <button key={t} type="button" onClick={() => field('memberType', t)} style={{
                  padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                  border: form.memberType === t ? '2px solid var(--brand)' : '1px solid var(--border)',
                  background: form.memberType === t ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))' : 'var(--surface-solid)',
                  color: form.memberType === t ? 'var(--brand-contrast)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ ...labelStyle, color: 'var(--text-muted)' }}>I want to be a...</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select style={{ ...inputStyle, width: 220 }} value={form.platformRole}
                onChange={e => field('platformRole', e.target.value)}>
                <option value="Member">Member</option>
                <option value="Organizer">Organizer</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
            {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => navigate('/members')} style={{
                padding: '10px 18px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface-solid)', color: 'var(--text-muted)'
              }}>Cancel</button>
              <button type="submit" disabled={loading} style={{
                padding: '10px 18px', borderRadius: 999, background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', color: 'var(--brand-contrast)', fontWeight: 700, border: 'none', boxShadow: 'var(--shadow)'
              }}>{loading ? 'Submitting...' : 'Create profile'}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
        