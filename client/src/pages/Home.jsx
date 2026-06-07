import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMembers, getEvents } from '../api';

export default function Home() {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);

  // Only fetch real data if logged in
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([getMembers({}), getEvents()])
        .then(([m, e]) => {
          setMembers(Array.isArray(m.data) ? m.data : []);
          setEvents(Array.isArray(e.data) ? e.data : []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const avatarColors = ['#e0e7ff','#fce7f3','#d1fae5','#fef3c7','#dbeafe'];
  const avatarText   = ['#4338ca','#9d174d','#065f46','#92400e','#1e40af'];
  const initials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const typeColors = {
    Founder:  { bg: '#fef3c7', color: '#92400e' },
    VC:       { bg: '#ede9fe', color: '#5b21b6' },
    Developer:{ bg: '#dbeafe', color: '#1e40af' },
    Designer: { bg: '#fce7f3', color: '#9d174d' },
    Marketer: { bg: '#d1fae5', color: '#065f46' },
    Lawyer:   { bg: '#fee2e2', color: '#991b1b' },
    Other:    { bg: '#f3f4f6', color: '#374151' },
  };

  // ── Logged-in home ─────────────────────────────────────────
  if (user) {
    const featured = Array.isArray(members) ? members.slice(0, 3) : [];
    const upcoming = Array.isArray(events) ? events.slice(0, 3) : [];

    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px' }}>

        {/* Welcome banner */}
        <div style={{
          background: '#1a1a1a', borderRadius: 16,
          padding: '32px 36px', marginBottom: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
              Welcome back 👋
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff',
                         letterSpacing: '-0.5px', marginBottom: 6 }}>
              {user.name}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: '#333', color: '#aaa', fontWeight: 500,
              }}>
                {user.memberType}
              </span>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: '#333', color: '#aaa', fontWeight: 500,
              }}>
                {user.platformRole}
              </span>
              {user.location && (
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: '#333', color: '#aaa', fontWeight: 500,
                }}>
                  📍 {user.location}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/dashboard/profile" style={{
              padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: '1px solid #333', color: '#ccc', textDecoration: 'none',
            }}>
              Edit profile
            </Link>
            <Link to="/dashboard/members" style={{
              padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: '#fff', color: '#1a1a1a', textDecoration: 'none',
            }}>
              Browse members →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12, marginBottom: 20,
        }}>
          {[
            { label: 'Members',  value: members.length },
            { label: 'Mentors',  value: members.filter(m => m.platformRole === 'Mentor').length },
            { label: 'Events',   value: events.length },
            { label: 'Services', value: '—' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', border: '1px solid #ebebeb',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a',
                            letterSpacing: '-1px' }}>
                {loading ? '...' : s.value}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Recent members */}
          <div style={{
            background: '#fff', border: '1px solid #ebebeb',
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                New members
              </h2>
              <Link to="/dashboard/members" style={{ fontSize: 12,
                color: '#4f46e5', fontWeight: 500, textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {loading ? (
              <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                Loading...
              </p>
            ) : featured.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: 13, color: '#aaa' }}>No members yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {featured.map((m, i) => {
                  const ts = typeColors[m.memberType] || typeColors.Other;
                  return (
                    <div key={m._id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 10,
                      border: '1px solid #f3f3f3', background: '#fafafa',
                    }}>
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
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a',
                                      overflow: 'hidden', textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#888' }}>
                          {m.role ? `${m.role}${m.company ? ` @ ${m.company}` : ''}` : m.location || '—'}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 20,
                        background: ts.bg, color: ts.color, fontWeight: 500,
                        flexShrink: 0,
                      }}>
                        {m.memberType}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming events */}
          <div style={{
            background: '#fff', border: '1px solid #ebebeb',
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                Upcoming events
              </h2>
              <Link to="/dashboard/events" style={{ fontSize: 12,
                color: '#4f46e5', fontWeight: 500, textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {loading ? (
              <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '20px 0' }}>
                Loading...
              </p>
            ) : upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>
                  No events yet
                </p>
                <Link to="/dashboard/submit" style={{
                  fontSize: 12, color: '#4f46e5', fontWeight: 500, textDecoration: 'none',
                }}>
                  + Suggest one
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map(e => {
                  const d = new Date(e.date);
                  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
                  const day   = d.getDate();
                  return (
                    <div key={e._id} style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '10px 12px', borderRadius: 10,
                      border: '1px solid #f3f3f3', background: '#fafafa',
                    }}>
                      <div style={{
                        width: 40, flexShrink: 0, textAlign: 'center',
                        background: '#1a1a1a', borderRadius: 8, padding: '5px 0',
                      }}>
                        <div style={{ fontSize: 9, color: '#aaa', letterSpacing: '.05em' }}>
                          {month}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700,
                                      color: '#fff', lineHeight: 1.1 }}>
                          {day}
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a',
                                      overflow: 'hidden', textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap' }}>
                          {e.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
                          {e.format} · {e.host || 'Bridgemakers'}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 4,
                        background: e.format === 'Online' ? '#dbeafe' : '#d1fae5',
                        color: e.format === 'Online' ? '#1e40af' : '#065f46',
                        fontWeight: 500, flexShrink: 0,
                      }}>
                        {e.format}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <Link to="/dashboard/submit" style={{
              display: 'block', textAlign: 'center', marginTop: 12,
              fontSize: 12, color: '#888', padding: '8px',
              border: '1px dashed #ddd', borderRadius: 8, textDecoration: 'none',
            }}>
              + Suggest an event
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12, marginTop: 16,
        }}>
          {[
            { icon: '🤝', label: 'Offer a service', sub: 'Share your skills with the community', to: '/dashboard/services', cta: 'Post service' },
            { icon: '📅', label: 'Suggest an event', sub: 'Propose an event for Bridgemakers to approve', to: '/dashboard/submit', cta: 'Submit' },
            { icon: '👥', label: 'Find a mentor', sub: 'Browse members who are here to guide', to: '/dashboard/members', cta: 'Browse mentors' },
          ].map(a => (
            <div key={a.label} style={{
              background: '#fff', border: '1px solid #ebebeb',
              borderRadius: 14, padding: '20px',
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
                {a.label}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
                {a.sub}
              </div>
              <Link to={a.to} style={{
                fontSize: 12, fontWeight: 500, color: '#4f46e5', textDecoration: 'none',
              }}>
                {a.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Logged-out landing page ────────────────────────────────
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div style={{
        background: '#fff', border: '1px solid #ebebeb',
        borderRadius: 20, padding: '72px 48px',
        textAlign: 'center', marginBottom: 20,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: '#1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, margin: '0 auto 24px',
        }}>
          🌉
        </div>
        <h1 style={{
          fontSize: 46, fontWeight: 800, color: '#1a1a1a',
          letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 18,
        }}>
          Where young leaders<br />
          <span style={{ color: '#4f46e5' }}>connect & grow</span>
        </h1>
        <p style={{
          fontSize: 17, color: '#666', maxWidth: 460,
          margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          The Bridge connects founders, developers, VCs, designers
          and mentors in one community built for the next generation.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{
            padding: '14px 32px', borderRadius: 10, background: '#1a1a1a',
            color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none',
          }}>
            Join for free →
          </Link>
          <Link to="/login" style={{
            padding: '14px 32px', borderRadius: 10,
            border: '1px solid #ddd', color: '#1a1a1a',
            fontSize: 15, fontWeight: 500, textDecoration: 'none',
          }}>
            Log in
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14, marginBottom: 20,
      }}>
        {[
          { icon: '👥', title: 'Member directory', desc: 'Find founders, VCs, developers and more. Filter by type, connect directly.' },
          { icon: '📅', title: 'Events bulletin', desc: 'Discover and RSVP to curated events from Bridgemakers and the community.' },
          { icon: '⇄',  title: 'Services exchange', desc: 'Offer your skills or ask for help. A two-sided marketplace for the community.' },
        ].map(f => (
          <div key={f.title} style={{
            background: '#fff', border: '1px solid #ebebeb',
            borderRadius: 14, padding: '24px',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600,
                          color: '#1a1a1a', marginBottom: 6 }}>
              {f.title}
            </div>
            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Who is it for */}
      <div style={{
        background: '#fff', border: '1px solid #ebebeb',
        borderRadius: 16, padding: '32px', marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a',
                     marginBottom: 20, textAlign: 'center' }}>
          Built for young leaders across every field
        </h2>
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { label: 'Founders',   bg: '#fef3c7', color: '#92400e' },
            { label: 'Developers', bg: '#dbeafe', color: '#1e40af' },
            { label: 'VCs',        bg: '#ede9fe', color: '#5b21b6' },
            { label: 'Designers',  bg: '#fce7f3', color: '#9d174d' },
            { label: 'Marketers',  bg: '#d1fae5', color: '#065f46' },
            { label: 'Lawyers',    bg: '#fee2e2', color: '#991b1b' },
            { label: 'Mentors',    bg: '#f0fdf4', color: '#166534' },
          ].map(t => (
            <span key={t.label} style={{
              padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: t.bg, color: t.color,
            }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        background: '#1a1a1a', borderRadius: 16,
        padding: '44px 48px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff',
                     marginBottom: 10, letterSpacing: '-0.5px' }}>
          Ready to cross the bridge?
        </h2>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
          Create your profile in under 2 minutes and start connecting.
        </p>
        <Link to="/signup" style={{
          padding: '13px 32px', borderRadius: 10, background: '#fff',
          color: '#1a1a1a', fontSize: 14, fontWeight: 700,
          textDecoration: 'none', display: 'inline-block',
        }}>
          Get started →
        </Link>
      </div>
    </div>
  );
}