import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitEvent } from '../api';

const GOOGLE_FORM_URL = 'https://forms.gle/your-google-form-link-here';

export default function DashboardSubmit() {
  const { user } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [focused, setFocused]     = useState({});

  const [form, setForm] = useState({
    title: '', description: '', date: '',
    time: '', format: 'Online', location: '',
    host: '', submittedBy: {
      name: user?.name  || '',
      email: user?.email || '',
    },
  });

  const field    = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const onFocus  = (k)    => setFocused(f => ({ ...f, [k]: true }));
  const onBlur   = (k)    => setFocused(f => ({ ...f, [k]: false }));

  const inputStyle = (k) => ({
    width: '100%', padding: '10px 14px',
    border: `1px solid ${focused[k] ? 'var(--brand)' : 'var(--border)'}`,
    borderRadius: 8, fontSize: 14, color: 'var(--text-strong)',
    outline: 'none', background: 'var(--surface-muted)',
    transition: 'border-color 0.15s',
  });

  const labelStyle = {
    display: 'block', fontSize: 12,
    fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6,
  };

  const validate = () => {
    if (!form.title.trim())       return 'Please enter an event title.';
    if (!form.date)               return 'Please select a date.';
    if (!form.submittedBy.name)   return 'Please enter your name.';
    if (!form.submittedBy.email)  return 'Please enter your email.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await submitEvent(form);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ─────────────────────────────────────────
  if (submitted) return (
    <div style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '52px 40px',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-strong)',
                     letterSpacing: '-0.5px', marginBottom: 8 }}>
          Event submitted!
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
          Thanks for suggesting an event. The Bridgemakers team will
          review your submission and publish it once approved.
          You'll see it on the Events page after approval.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link to="/dashboard/events" style={{
            padding: '10px 22px', borderRadius: 8, fontSize: 13,
            background: 'var(--brand)', color: 'var(--brand-contrast)',
            fontWeight: 500, textDecoration: 'none',
          }}>
            View events
          </Link>
          <button onClick={() => {
            setSubmitted(false);
            setForm({
              title: '', description: '', date: '',
              time: '', format: 'Online', location: '', host: '',
              submittedBy: { name: user?.name || '', email: user?.email || '' },
            });
          }} style={{
            padding: '10px 22px', borderRadius: 8, fontSize: 13,
            border: '1px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500,
          }}>
            Submit another
          </button>
        </div>
      </div>
    </div>
  );

  // ── Form ──────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-strong)',
                     letterSpacing: '-0.5px', marginBottom: 4 }}>
          Suggest an event
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Submit your event for review. Once approved by Bridgemakers
          it will appear on the events bulletin.
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        background: 'var(--accent-wash)', border: '1px solid var(--border-strong)',
        borderRadius: 10, padding: '12px 16px',
        fontSize: 13, color: 'var(--brand)', marginBottom: 24,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ flexShrink: 0 }}>ℹ️</span>
        <span>
          All events are reviewed by the Bridgemakers team before
          going live. You'll be notified via email once your event is approved.
        </span>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Event details card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '24px 28px', marginBottom: 16,
          boxShadow: 'var(--shadow)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)',
                       marginBottom: 20, paddingBottom: 12,
                       borderBottom: '1px solid var(--border)' }}>
            Event details
          </h2>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Event title <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input style={inputStyle('title')}
              placeholder="e.g. Founder Fireside Chat, VC Office Hours"
              value={form.title}
              onChange={e => field('title', e.target.value)}
              onFocus={() => onFocus('title')}
              onBlur={() => onBlur('title')} />
          </div>

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>
                Date <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input type="date" style={inputStyle('date')}
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => field('date', e.target.value)}
                onFocus={() => onFocus('date')}
                onBlur={() => onBlur('date')} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" style={inputStyle('time')}
                value={form.time}
                onChange={e => field('time', e.target.value)}
                onFocus={() => onFocus('time')}
                onBlur={() => onBlur('time')} />
            </div>
          </div>

          {/* Format toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Format</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Online', 'In-person'].map(f => (
                <button key={f} type="button"
                  onClick={() => field('format', f)} style={{
                    flex: 1, padding: '10px', borderRadius: 8,
                    border: form.format === f
                      ? '2px solid var(--brand)' : '1px solid var(--border)',
                    background: form.format === f ? 'var(--brand)' : 'var(--surface-muted)',
                    color: form.format === f ? 'var(--brand-contrast)' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                  {f === 'Online' ? '💻 Online' : '📍 In-person'}
                </button>
              ))}
            </div>
          </div>

          {/* Location / Link */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              {form.format === 'Online' ? 'Meeting link' : 'Venue & address'}
            </label>
            <input style={inputStyle('location')}
              placeholder={form.format === 'Online'
                ? 'e.g. Zoom link, Google Meet URL'
                : 'e.g. WeWork Moorgate, London EC2'}
              value={form.location}
              onChange={e => field('location', e.target.value)}
              onFocus={() => onFocus('location')}
              onBlur={() => onBlur('location')} />
          </div>

          {/* Host */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Host / Organiser</label>
            <input style={inputStyle('host')}
              placeholder="e.g. Bridgemakers, your name or org"
              value={form.host}
              onChange={e => field('host', e.target.value)}
              onFocus={() => onFocus('host')}
              onBlur={() => onBlur('host')} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{
              ...inputStyle('desc'), height: 100, resize: 'vertical',
            }}
              placeholder="What is the event about? Who should attend?"
              value={form.description}
              onChange={e => field('description', e.target.value)}
              onFocus={() => onFocus('desc')}
              onBlur={() => onBlur('desc')} />
          </div>
        </div>

        {/* Submitter card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '24px 28px', marginBottom: 16,
          boxShadow: 'var(--shadow)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)',
                       marginBottom: 20, paddingBottom: 12,
                       borderBottom: '1px solid var(--border)' }}>
            Your details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>
                Your name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input style={inputStyle('sbname')}
                value={form.submittedBy.name}
                onChange={e => setForm(f => ({
                  ...f, submittedBy: { ...f.submittedBy, name: e.target.value }
                }))}
                onFocus={() => onFocus('sbname')}
                onBlur={() => onBlur('sbname')} />
            </div>
            <div>
              <label style={labelStyle}>
                Your email <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input type="email" style={inputStyle('sbemail')}
                value={form.submittedBy.email}
                onChange={e => setForm(f => ({
                  ...f, submittedBy: { ...f.submittedBy, email: e.target.value }
                }))}
                onFocus={() => onFocus('sbemail')}
                onBlur={() => onBlur('sbemail')} />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: 16,
            background: 'var(--danger-soft)',
            border: '1px solid color-mix(in srgb, var(--danger) 24%, transparent)',
            fontSize: 13, color: 'var(--danger)',
          }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 10,
          background: loading ? 'var(--text-subtle)' : 'var(--brand)',
          color: 'var(--brand-contrast)', border: 'none', fontSize: 15,
          fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.15s', marginBottom: 14,
          boxShadow: loading ? 'none' : 'var(--shadow)',
        }}>
          {loading ? 'Submitting...' : 'Submit for review →'}
        </button>

        {/* Google Form fallback */}
        <div style={{
          textAlign: 'center', padding: '14px',
          border: '1px dashed var(--border)', borderRadius: 10,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-subtle)', marginBottom: 6 }}>
            Prefer to use a form instead?
          </p>
          <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 500 }}>
            Fill out the Google Form →
          </a>
        </div>
      </form>
    </div>
  );
}
