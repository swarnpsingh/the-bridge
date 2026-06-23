import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMember } from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

const MEMBER_TYPES = ['Founder','Entrepreneur','Software developer','Marketing','Content creator','Student','Artist','Musician','Creative','Organizer','Activist','Policy professional','AI','Other'];

const typeColors = {
  Founder:             { bg: '#fef3c7', color: '#92400e' },
  Entrepreneur:        { bg: '#ffedd5', color: '#9a3412' },
  'Software developer':{ bg: '#dbeafe', color: '#1e40af' },
  Marketing:           { bg: '#d1fae5', color: '#065f46' },
  'Content creator':   { bg: '#fef9c3', color: '#713f12' },
  Student:             { bg: '#e0f2fe', color: '#075985' },
  Artist:              { bg: '#fce7f3', color: '#9d174d' },
  Musician:            { bg: '#ccfbf1', color: '#0f766e' },
  Creative:            { bg: '#fff7ed', color: '#c2410c' },
  Organizer:           { bg: '#f1f5f9', color: '#334155' },
  Activist:            { bg: '#fee2e2', color: '#991b1b' },
  'Policy professional':{ bg: '#ede9fe', color: '#5b21b6' },
  AI:                  { bg: '#eef2ff', color: '#3730a3' },
  Other:               { bg: '#f3f4f6', color: '#374151' },
};

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const blankForm = (user) => ({
  name: user?.name || '', linkedin: user?.linkedin || '', location: user?.location || '',
  role: user?.role || '', company: user?.company || '', memberType: user?.memberType || [],
  bio: user?.bio || '',
});

export default function DashboardProfile() {
  const { user, updateUser } = useAuth();
  const { isMobile } = useBreakpoint();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState(() => blankForm(user));

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const startEdit = () => {
    setForm(blankForm(user));
    setError('');
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.memberType.length) {
      setError('Please fill in your name and at least one member tag.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await updateMember(user._id, form);
      updateUser(res.data);
      setEditing(false);
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

  if (!user) return null;

  if (editing) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-strong)',
                       letterSpacing: '-0.5px', marginBottom: 4 }}>
            Edit your profile
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Keep your info up to date so others can find and connect with you.
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
                <label style={labelStyle}>Full name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input style={inputStyle} placeholder="Alex Turner"
                  value={form.name} onChange={e => field('name', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                  value={user.email} disabled />
              </div>
              <div>
                <label style={labelStyle}>Current role</label>
                <input style={inputStyle} placeholder="CEO, Software Engineer..."
                  value={form.role} onChange={e => field('role', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} placeholder="Acme Inc."
                  value={form.company} onChange={e => field('company', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} placeholder="London, UK"
                  value={form.location} onChange={e => field('location', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={labelStyle}>LinkedIn URL</label>
                <input style={inputStyle} placeholder="https://linkedin.com/in/..."
                  value={form.linkedin} onChange={e => field('linkedin', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Short bio</label>
              <textarea style={{ ...inputStyle, height: 90, resize: 'vertical' }}
                placeholder="Tell the community a bit about yourself..."
                value={form.bio} onChange={e => field('bio', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

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
            <label style={labelStyle}>Member tag <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MEMBER_TYPES.map(t => {
                const active = form.memberType.includes(t);
                return (
                  <button key={t} type="button" onClick={() => field('memberType', active ? form.memberType.filter(x => x !== t) : [...form.memberType, t])} style={{
                    padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
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

            <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
              {error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setEditing(false)} style={{
                  padding: '10px 18px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface-solid)', color: 'var(--text-muted)'
                }}>Cancel</button>
                <button type="submit" disabled={loading} style={{
                  padding: '10px 18px', borderRadius: 999, background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', color: 'var(--brand-contrast)', fontWeight: 700, border: 'none', boxShadow: 'var(--shadow)'
                }}>{loading ? 'Saving...' : 'Save changes'}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: isMobile ? '24px 20px' : '36px 40px',
      }}>
        <div style={{ display: 'flex', gap: isMobile ? 16 : 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: isMobile ? 64 : 80, height: isMobile ? 64 : 80,
            borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
            color: 'var(--brand-contrast)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMobile ? 22 : 28, fontWeight: 800,
          }}>
            {initials(user.name)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: isMobile ? 20 : 26, fontWeight: 800, color: 'var(--text-strong)',
              letterSpacing: '-0.5px', marginBottom: 4,
            }}>
              {user.name}
            </h1>

            <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 4 }}>
              {user.email}
            </p>

            {(user.role || user.company) && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
                {user.role && user.company
                  ? `${user.role} @ ${user.company}`
                  : user.role || user.company}
              </p>
            )}

            {user.location && (
              <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 12 }}>
                📍 {user.location}
              </p>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: user.bio ? 14 : 0 }}>
              {user.memberType?.map(t => {
                const tc = typeColors[t] || typeColors.Other;
                return (
                  <span key={t} style={{
                    fontSize: 11, padding: '4px 12px', borderRadius: 20,
                    background: tc.bg, color: tc.color, fontWeight: 600,
                  }}>
                    {t}
                  </span>
                );
              })}
              {user.platformRole === 'Mentor' && (
                <span style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20,
                  background: '#ede9fe', color: '#5b21b6', fontWeight: 600,
                }}>
                  Mentor
                </span>
              )}
            </div>

            {user.bio && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 12 }}>
                {user.bio}
              </p>
            )}

            {user.linkedin && (
              <a
                href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                target="_blank" rel="noreferrer"
                style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600, display: 'inline-block', marginTop: 12 }}
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 10, marginTop: 24,
          borderTop: '1px solid var(--border)', paddingTop: 20,
        }}>
          <button onClick={startEdit} style={{
            padding: '10px 22px', borderRadius: 8, fontSize: 13,
            background: 'var(--brand)', color: 'var(--brand-contrast)',
            fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
}
