import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, rsvpEvent } from '../api';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['All', 'Online', 'In-person'];

export default function DashboardEvents() {
  const { user } = useAuth();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');
  const [rsvping, setRsvping]   = useState(null); // event being RSVPd
  const [rsvpDone, setRsvpDone] = useState([]);   // ids already RSVPd this session
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '' });
  const [rsvpError, setRsvpError] = useState('');

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then(r => setEvents(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Pre-fill RSVP form with logged-in user's details
  const openRsvp = (event) => {
    setRsvpForm({ name: user?.name || '', email: user?.email || '' });
    setRsvpError('');
    setRsvping(event);
  };

  const handleRsvp = async () => {
    if (!rsvpForm.name || !rsvpForm.email) {
      setRsvpError('Please fill in your name and email.');
      return;
    }
    setRsvpLoading(true);
    try {
      await rsvpEvent(rsvping._id, rsvpForm);
      setRsvpDone(d => [...d, rsvping._id]);
      setRsvping(null);
    } catch {
      setRsvpError('Something went wrong. Please try again.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const safeEvents = Array.isArray(events) ? events : [];

  const filtered = safeEvents.filter(e =>
    filter === 'All' ? true : e.format === filter
  );

  const now      = new Date();
  const upcoming = filtered.filter(e => new Date(e.date) >= now);
  const past     = filtered.filter(e => new Date(e.date) <  now);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric',
      month: 'long', year: 'numeric',
    });
  };

  const EventCard = ({ event, isPast }) => {
    const d      = new Date(event.date);
    const month  = d.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day    = d.getDate();
    const done   = rsvpDone.includes(event._id);
    const alreadyRsvpd = event.rsvps?.some(r => r.email === user?.email) || done;

    return (
      <div style={{
        background: '#fff',
        border: '1px solid #ebebeb',
        borderRadius: 14,
        padding: '20px 24px',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        opacity: isPast ? 0.6 : 1,
        transition: 'transform 0.15s, border-color 0.15s',
      }}
        onMouseEnter={e => {
          if (!isPast) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#d0d0d0';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#ebebeb';
        }}
      >
        {/* Date block */}
        <div style={{
          width: 52, flexShrink: 0, textAlign: 'center',
          background: isPast ? '#f5f5f5' : '#1a1a1a',
          borderRadius: 10, padding: '8px 0',
        }}>
          <div style={{
            fontSize: 9, letterSpacing: '.06em',
            color: isPast ? '#bbb' : '#aaa',
          }}>
            {month}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 800, lineHeight: 1.1,
            color: isPast ? '#bbb' : '#fff',
          }}>
            {day}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', gap: 12,
                        flexWrap: 'wrap', marginBottom: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a',
                         letterSpacing: '-0.2px' }}>
              {event.title}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                background: event.format === 'Online' ? '#dbeafe' : '#d1fae5',
                color: event.format === 'Online' ? '#1e40af' : '#065f46',
              }}>
                {event.format}
              </span>
              {isPast && (
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: '#f3f4f6', color: '#6b7280', fontWeight: 500,
                }}>
                  Past
                </span>
              )}
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#888', marginBottom: 8,
                        display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span>📅 {formatDate(event.date)}</span>
            {event.time && <span>🕐 {event.time}</span>}
            {event.host && <span>🎙 {event.host}</span>}
            {event.location && <span>📍 {event.location}</span>}
          </div>

          {event.description && (
            <p style={{
              fontSize: 13, color: '#666', lineHeight: 1.6,
              marginBottom: 14,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {event.description}
            </p>
          )}

          {/* Footer row */}
          <div style={{ display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#aaa' }}>
              {event.rsvps?.length > 0
                ? `${event.rsvps.length} RSVP${event.rsvps.length !== 1 ? 's' : ''}`
                : 'No RSVPs yet'}
            </div>

            {!isPast && (
              alreadyRsvpd ? (
                <span style={{
                  fontSize: 12, padding: '8px 18px', borderRadius: 8,
                  background: '#f0fdf4', color: '#16a34a',
                  border: '1px solid #bbf7d0', fontWeight: 500,
                }}>
                  ✓ You're going
                </span>
              ) : (
                <button onClick={() => openRsvp(event)} style={{
                  fontSize: 13, padding: '8px 20px', borderRadius: 8,
                  background: '#1a1a1a', color: '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.target.style.background = '#333'}
                  onMouseLeave={e => e.target.style.background = '#1a1a1a'}
                >
                  RSVP →
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 20,
                    flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a',
                       letterSpacing: '-0.5px', marginBottom: 4 }}>
            Events bulletin
          </h1>
          <p style={{ fontSize: 14, color: '#888' }}>
            Curated events from Bridgemakers and the community.
          </p>
        </div>
        <Link to="/dashboard/submit" style={{
          padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          border: '1px solid #e5e5e5', color: '#555', textDecoration: 'none',
          background: '#fff',
        }}>
          + Suggest an event
        </Link>
      </div>

      {/* Format filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            border: filter === f ? '1.5px solid #1a1a1a' : '1px solid #e5e5e5',
            background: filter === f ? '#1a1a1a' : '#fff',
            color: filter === f ? '#fff' : '#555',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Events list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0',
                      color: '#aaa', fontSize: 14 }}>
          Loading events...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 14, padding: '60px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
          <p style={{ fontSize: 15, fontWeight: 600,
                      color: '#1a1a1a', marginBottom: 6 }}>
            No events yet
          </p>
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>
            Be the first to suggest one for the community.
          </p>
          <Link to="/dashboard/submit" style={{
            padding: '10px 22px', borderRadius: 8,
            background: '#1a1a1a', color: '#fff',
            fontSize: 13, fontWeight: 500, textDecoration: 'none',
          }}>
            Suggest an event
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#aaa',
                            textTransform: 'uppercase', letterSpacing: '.06em',
                            marginBottom: 4 }}>
                Upcoming — {upcoming.length} event{upcoming.length !== 1 ? 's' : ''}
              </div>
              {upcoming.map(e => <EventCard key={e._id} event={e} isPast={false} />)}
            </>
          )}

          {/* Past */}
          {past.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#aaa',
                            textTransform: 'uppercase', letterSpacing: '.06em',
                            marginTop: 12, marginBottom: 4 }}>
                Past events
              </div>
              {past.map(e => <EventCard key={e._id} event={e} isPast={true} />)}
            </>
          )}
        </div>
      )}

      {/* RSVP Modal */}
      {rsvping && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 200,
          padding: 24,
        }}
          onClick={e => { if (e.target === e.currentTarget) setRsvping(null); }}
        >
          <div style={{
            background: '#fff', borderRadius: 16,
            padding: '32px', width: '100%', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {/* Modal header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                            alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a',
                             letterSpacing: '-0.3px' }}>
                  RSVP to event
                </h2>
                <button onClick={() => setRsvping(null)} style={{
                  background: 'none', border: 'none', fontSize: 20,
                  cursor: 'pointer', color: '#aaa', lineHeight: 1,
                }}>
                  ×
                </button>
              </div>
              <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                {rsvping.title}
              </p>
              <p style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>
                {formatDate(rsvping.date)}
                {rsvping.time ? ` · ${rsvping.time}` : ''}
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12,
                                fontWeight: 500, color: '#555', marginBottom: 6 }}>
                  Your name
                </label>
                <input
                  value={rsvpForm.name}
                  onChange={e => setRsvpForm(f => ({ ...f, name: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #e5e5e5', borderRadius: 8,
                    fontSize: 14, outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                  onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12,
                                fontWeight: 500, color: '#555', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={rsvpForm.email}
                  onChange={e => setRsvpForm(f => ({ ...f, email: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #e5e5e5', borderRadius: 8,
                    fontSize: 14, outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                  onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                />
              </div>

              {rsvpError && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: '#fff1f1', border: '1px solid #fecaca',
                  fontSize: 13, color: '#dc2626',
                }}>
                  {rsvpError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setRsvping(null)} style={{
                  padding: '11px 18px', borderRadius: 8, fontSize: 13,
                  border: '1px solid #e5e5e5', background: '#fff',
                  color: '#555', cursor: 'pointer', fontWeight: 500,
                }}>
                  Cancel
                </button>
                <button onClick={handleRsvp} disabled={rsvpLoading} style={{
                  flex: 1, padding: '11px', borderRadius: 8, fontSize: 13,
                  background: rsvpLoading ? '#999' : '#1a1a1a',
                  color: '#fff', border: 'none', fontWeight: 600,
                  cursor: rsvpLoading ? 'not-allowed' : 'pointer',
                }}>
                  {rsvpLoading ? 'Confirming...' : 'Confirm RSVP →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}