import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api';

const FILTERS = ['All', 'Online', 'In-person'];

export default function DashboardEvents() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');

  const fetchEvents = () => {
    setLoading(true);
    getEvents()
      .then(r => setEvents(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    window.addEventListener('focus', fetchEvents);
    return () => window.removeEventListener('focus', fetchEvents);
  }, []);

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
    const d     = new Date(event.date);
    const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day   = d.getDate();

    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
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
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Date block */}
        <div style={{
          width: 52, flexShrink: 0, textAlign: 'center',
          background: isPast ? 'var(--surface-muted)' : 'var(--brand)',
          borderRadius: 10, padding: '8px 0',
        }}>
          <div style={{
            fontSize: 9, letterSpacing: '.06em',
            color: isPast ? 'var(--text-subtle)' : 'var(--brand-contrast)',
            opacity: isPast ? 1 : 0.75,
          }}>
            {month}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 800, lineHeight: 1.1,
            color: isPast ? 'var(--text-subtle)' : 'var(--brand-contrast)',
          }}>
            {day}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', gap: 12,
                        flexWrap: 'wrap', marginBottom: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-strong)',
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
                  background: 'var(--surface-muted)', color: 'var(--text-subtle)', fontWeight: 500,
                }}>
                  Past
                </span>
              )}
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8,
                        display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span>📅 {formatDate(event.date)}</span>
            {event.time && <span>🕐 {event.time}</span>}
            {event.host && <span>🎙 {event.host}</span>}
            {event.location && <span>📍 {event.location}</span>}
          </div>

          {event.description && (
            <p style={{
              fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            {event.rsvpLink ? (
              <a href={event.rsvpLink} target="_blank" rel="noreferrer" style={{
                fontSize: 13, padding: '8px 20px', borderRadius: 8,
                background: 'var(--brand)', color: 'var(--brand-contrast)',
                fontWeight: 500, textDecoration: 'none', display: 'inline-block',
              }}>
                RSVP →
              </a>
            ) : (
              <span style={{
                fontSize: 13, padding: '8px 20px', borderRadius: 8,
                background: 'var(--surface-muted)', color: 'var(--text-subtle)',
                fontWeight: 500, display: 'inline-block',
                border: '1px solid var(--border)',
              }}>
                RSVP
              </span>
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
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-strong)',
                       letterSpacing: '-0.5px', marginBottom: 4 }}>
            Events bulletin
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Curated events from Bridgemakers and the community.
          </p>
        </div>
        <Link to="/dashboard/submit" style={{
          padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          border: '1px solid var(--border)', color: 'var(--text-muted)',
          textDecoration: 'none', background: 'var(--surface)',
        }}>
          + Suggest an event
        </Link>
      </div>

      {/* Format filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            border: filter === f ? '1.5px solid var(--brand)' : '1px solid var(--border)',
            background: filter === f ? 'var(--brand)' : 'var(--surface)',
            color: filter === f ? 'var(--brand-contrast)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Events list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0',
                      color: 'var(--text-subtle)', fontSize: 14 }}>
          Loading events...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '60px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
          <p style={{ fontSize: 15, fontWeight: 600,
                      color: 'var(--text-strong)', marginBottom: 6 }}>
            No events yet
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 20 }}>
            Be the first to suggest one for the community.
          </p>
          <Link to="/dashboard/submit" style={{
            padding: '10px 22px', borderRadius: 8,
            background: 'var(--brand)', color: 'var(--brand-contrast)',
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
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)',
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
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)',
                            textTransform: 'uppercase', letterSpacing: '.06em',
                            marginTop: 12, marginBottom: 4 }}>
                Past events
              </div>
              {past.map(e => <EventCard key={e._id} event={e} isPast={true} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
