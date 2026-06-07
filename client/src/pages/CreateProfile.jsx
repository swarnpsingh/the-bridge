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
    border: '1px solid #e5e5e5', borderRadius: 8,
    fontSize: 14, color: '#1a1a1a', outline: 'none',
    background: '#fafafa', transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: '#555', marginBottom: 6,
  };

  if (submitted) return (
    <div style={{
      maxWidth: 480, margin: '60px auto', background: '#fff',
      border: '1px solid #ebebeb', borderRadius: 16, padding: '48px 36px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
        You're on The Bridge!
      </h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 28, lineHeight: 1.6 }}>
        Your profile has been created. Start exploring the community.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link to="/members" style={{
          padding: '10px 22px', borderRadius: 8, background: '#1a1a1a',
          color: '#fff', fontSize: 13, fontWeight: 500,
        }}>
          Browse members
        </Link>
        <Link to="/" style={{
          padding: '10px 22px', borderRadius: 8,
          border: '1px solid #e5e5e5', color: '#555', fontSize: 13, fontWeight: 500,
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
        <Link to="/members" style={{ fontSize: 13, color: '#888', display: 'inline-flex',
                                     alignItems: 'center', gap: 4, marginBottom: 12 }}>
          ← Back to members
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a',
                     letterSpacing: '-0.5px', marginBottom: 4 }}>
          Create your profile
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>
          Join The Bridge and connect with young leaders.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 16, padding: '28px 32px', marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a',
                       marginBottom: 20, paddingBottom: 12,
                       borderBottom: '1px solid #f3f3f3' }}>
            Basic info
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Full name <span style={{ color: '#e55' }}>*</span></label>
              <input style={inputStyle} placeholder="Alex Turner"
                value={form.name} onChange={e => field('name', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
            <div>
              <label style={labelStyle}>Email <span style={{ color: '#e55' }}>*</span></label>
              <input style={inputStyle} type="email" placeholder="alex@example.com"
                value={form.email} onChange={e => field('email', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
            <div>
              <label style={labelStyle}>Current role</label>
              <input style={inputStyle} placeholder="CEO, Software Engineer..."
                value={form.role} onChange={e => field('role', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input style={inputStyle} placeholder="Acme Inc."
                value={form.company} onChange={e => field('company', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} placeholder="London, UK"
                value={form.location} onChange={e => field('location', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input style={inputStyle} placeholder="https://linkedin.com/in/..."
                value={form.linkedin} onChange={e => field('linkedin', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Short bio</label>
            <textarea style={{ ...inputStyle, height: 90, resize: 'vertical' }}
              placeholder="Tell the community a bit about yourself..."
              value={form.bio} onChange={e => field('bio', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#1a1a1a'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
          </div>
        </div>

        {/* Member type */}
        <div style={{
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 16, padding: '28px 32px', marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a',
                       marginBottom: 20, paddingBottom: 12,
                       borderBottom: '1px solid #f3f3f3' }}>
            Your role on The Bridge
          </h2>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Member type <span style={{ color: '#e55' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MEMBER_TYPES.map(t => (
                <button key={t} type="button" onClick={() => field('memberType', t)} style={{
                  padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                  border: form.memberType === t ? '2px solid #1a1a1a' : '1px solid #e5e5e5',
                  background: form.memberType === t ? '#1a1a1a' : '#fff',
                  color: form.memberType === t ? '#fff' : '#555',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>I want to be a...</label>
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
            {error && <div style={{ color: '#c00', fontSize: 13 }}>{error}</div>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => navigate('/members')} style={{
                padding: '10px 18px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', color: '#555'
              }}>Cancel</button>
              <button type="submit" disabled={loading} style={{
                padding: '10px 18px', borderRadius: 8, background: '#1a1a1a', color: '#fff', fontWeight: 600
              }}>{loading ? 'Submitting...' : 'Create profile'}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
        