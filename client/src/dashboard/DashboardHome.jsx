import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMembers, getEvents } from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

const avatarColors = ['#e0e7ff','#fce7f3','#d1fae5','#fef3c7','#dbeafe'];
const avatarText   = ['#4338ca','#9d174d','#065f46','#92400e','#1e40af'];
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

const statGrads = [
  { grad: 'linear-gradient(135deg, #2563eb, #60a5fa)', glow: 'rgba(37,99,235,0.3)'  },
  { grad: 'linear-gradient(135deg, #7c3aed, #a78bfa)', glow: 'rgba(124,58,237,0.3)' },
  { grad: 'linear-gradient(135deg, #059669, #34d399)', glow: 'rgba(5,150,105,0.3)'  },
  { grad: 'linear-gradient(135deg, #d97706, #fbbf24)', glow: 'rgba(217,119,6,0.3)'  },
];

const quickActions = [
  { icon: '🤝', label: 'Post an exchange',    sub: 'Share your skills with the community',         to: '/dashboard/exchanges', cta: 'Post exchange →',   grad: 'linear-gradient(135deg,#2563eb,#60a5fa)' },
  { icon: '📅', label: 'Suggest an event',   sub: 'Propose an event for Bridgemakers to approve', to: '/dashboard/submit',   cta: 'Submit →',         grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { icon: '👥', label: 'Find a mentor',      sub: 'Browse members who are here to guide',         to: '/dashboard/members',  cta: 'Browse mentors →', grad: 'linear-gradient(135deg,#059669,#34d399)' },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [members, setMembers] = useState([]);
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMembers({}), getEvents()])
      .then(([m, e]) => {
        setMembers(Array.isArray(m.data) ? m.data : []);
        setEvents(Array.isArray(e.data) ? e.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = members.slice(0, 3);
  const upcoming = events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);

  const stats = [
    { label: 'Members',  value: members.length },
    { label: 'Mentors',  value: members.filter(m => m.platformRole === 'Mentor').length },
    { label: 'Events',   value: events.length },
    { label: 'Exchanges', value: '—' },
  ];

  return (
    <div>

      {/* Welcome banner */}
      <div className="anim-fade-up" style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 20,
        padding: isMobile ? '24px 20px' : '36px 40px',
        marginBottom: 20,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite',
        boxShadow: '0 24px 64px rgba(37,99,235,0.45)',
      }}>
        <div className="anim-orb" style={{
          position: 'absolute', top: -60, right: -40,
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.55), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="anim-orb" style={{
          position: 'absolute', bottom: -50, left: -30,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.45), transparent 70%)',
          pointerEvents: 'none', animationDelay: '1.2s',
        }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6, fontWeight: 500 }}>
              Welcome back 👋
            </div>
            <h1 style={{
              fontSize: isMobile ? 22 : 30,
              fontWeight: 800, color: '#fff',
              letterSpacing: '-0.8px', marginBottom: 10, lineHeight: 1.1,
            }}>
              {user?.name}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[...(user?.memberType || []), user?.platformRole, user?.location && `📍 ${user.location}`]
                .filter(Boolean)
                .map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 12, padding: '4px 12px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(8px)',
                    color: 'rgba(255,255,255,0.95)', fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {tag}
                  </span>
                ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/dashboard/profile" style={{
              padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.1)',
            }}>
              Edit profile
            </Link>
            {!isMobile && (
              <Link to="/dashboard/members" style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: '#fff', color: '#2563eb', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              }}>
                Browse members →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 12, marginBottom: 20,
      }}>
        {stats.map((s, i) => (
          <div key={s.label} className="anim-fade-up" style={{
            position: 'relative', overflow: 'hidden',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '20px',
            boxShadow: `0 8px 32px ${statGrads[i].glow}`,
            animationDelay: `${0.05 * i}s`,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: statGrads[i].grad,
            }} />
            <div style={{
              fontSize: 30, fontWeight: 800, letterSpacing: '-1.5px',
              background: statGrads[i].grad,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {loading ? '…' : s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 16,
      }}>

        {/* Recent members */}
        <div className="anim-fade-up" style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)',
          animationDelay: '0.1s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>
              New members
            </h2>
            <Link to="/dashboard/members" style={{
              fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none',
            }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', padding: '20px 0' }}>
              Loading...
            </p>
          ) : featured.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', padding: '20px 0' }}>
              No members yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {featured.map((m, i) => {
                const ts = typeColors[m.memberType?.[0]] || typeColors.Other;
                return (
                  <Link key={m._id} to={`/dashboard/members/${m._id}`} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--surface-muted)',
                    transition: 'transform 0.15s', textDecoration: 'none',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: avatarColors[i % avatarColors.length],
                      color: avatarText[i % avatarText.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {initials(m.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {m.role ? `${m.role}${m.company ? ` @ ${m.company}` : ''}` : m.location || '—'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 20,
                      background: ts.bg, color: ts.color, fontWeight: 500, flexShrink: 0,
                    }}>
                      {m.memberType?.[0]}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming events */}
        <div className="anim-fade-up" style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)',
          animationDelay: '0.15s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>
              Upcoming events
            </h2>
            <Link to="/dashboard/events" style={{
              fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none',
            }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', padding: '20px 0' }}>
              Loading...
            </p>
          ) : upcoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 10 }}>No events yet</p>
              <Link to="/dashboard/submit" style={{
                fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none',
              }}>
                + Suggest one
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcoming.map(e => {
                const d     = new Date(e.date);
                const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
                const day   = d.getDate();
                return (
                  <div key={e._id} style={{
                    display: 'flex', gap: 12, alignItems: 'center',
                    padding: '10px 12px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--surface-muted)',
                    transition: 'transform 0.15s',
                  }}
                    onMouseEnter={ev => ev.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={ev => ev.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{
                      width: 42, flexShrink: 0, textAlign: 'center',
                      background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      borderRadius: 8, padding: '6px 0',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
                    }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '.06em' }}>
                        {month}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                        {day}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                        {e.format} · {e.host || 'Bridgemakers'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link to="/dashboard/submit" style={{
            display: 'block', textAlign: 'center', marginTop: 14,
            fontSize: 12, color: 'var(--text-subtle)', padding: '9px',
            border: '1px dashed var(--border)', borderRadius: 8, textDecoration: 'none',
            transition: 'color 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-subtle)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            + Suggest an event
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 12, marginTop: 16,
      }}>
        {quickActions.map((a, i) => (
          <div key={a.label} className="anim-fade-up" style={{
            position: 'relative', overflow: 'hidden',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '22px',
            boxShadow: 'var(--shadow)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            animationDelay: `${0.05 * i}s`,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.14)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: a.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            }}>
              {a.icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 5 }}>
              {a.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.55 }}>
              {a.sub}
            </div>
            <Link to={a.to} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 600,
              background: a.grad,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
            }}>
              {a.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
