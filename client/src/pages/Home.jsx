import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMembers, getEvents } from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

const avatarColors = ['#e0e7ff','#fce7f3','#d1fae5','#fef3c7','#dbeafe'];
const avatarText   = ['#4338ca','#9d174d','#065f46','#92400e','#1e40af'];
const typeColors = {
  Founder:  { bg: '#fef3c7', color: '#92400e' },
  VC:       { bg: '#ede9fe', color: '#5b21b6' },
  Developer:{ bg: '#dbeafe', color: '#1e40af' },
  Designer: { bg: '#fce7f3', color: '#9d174d' },
  Marketer: { bg: '#d1fae5', color: '#065f46' },
  Lawyer:   { bg: '#fee2e2', color: '#991b1b' },
  Other:    { bg: '#f3f4f6', color: '#374151' },
};
const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const featureCards = [
  {
    icon: '👥',
    title: 'Member directory',
    desc: 'Find founders, VCs, developers and more. Filter by type and connect directly.',
    grad: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    glow: 'rgba(37,99,235,0.35)',
  },
  {
    icon: '📅',
    title: 'Events bulletin',
    desc: 'Discover and RSVP to curated events from Bridgemakers and the community.',
    grad: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    glow: 'rgba(124,58,237,0.35)',
  },
  {
    icon: '⇄',
    title: 'Services exchange',
    desc: 'Offer your skills or ask for help — a two-sided marketplace for the community.',
    grad: 'linear-gradient(135deg, #db2777, #f472b6)',
    glow: 'rgba(219,39,119,0.35)',
  },
];

const statGrads = [
  { grad: 'linear-gradient(135deg, #2563eb, #60a5fa)', glow: 'rgba(37,99,235,0.3)'  },
  { grad: 'linear-gradient(135deg, #7c3aed, #a78bfa)', glow: 'rgba(124,58,237,0.3)' },
  { grad: 'linear-gradient(135deg, #059669, #34d399)', glow: 'rgba(5,150,105,0.3)'  },
  { grad: 'linear-gradient(135deg, #d97706, #fbbf24)', glow: 'rgba(217,119,6,0.3)'  },
];

const quickActions = [
  { icon: '🤝', label: 'Offer a service',    sub: 'Share your skills with the community',       to: '/dashboard/services', cta: 'Post service →',  grad: 'linear-gradient(135deg,#2563eb,#60a5fa)' },
  { icon: '📅', label: 'Suggest an event',   sub: 'Propose an event for Bridgemakers to approve', to: '/dashboard/submit',   cta: 'Submit →',        grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { icon: '👥', label: 'Find a mentor',      sub: 'Browse members who are here to guide',       to: '/dashboard/members',  cta: 'Browse mentors →', grad: 'linear-gradient(135deg,#059669,#34d399)' },
];

export default function Home() {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [members, setMembers] = useState([]);
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);

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

  // ── Logged-in home ─────────────────────────────────────────
  if (user) {
    const featured = members.slice(0, 3);
    const upcoming = events.slice(0, 3);

    const stats = [
      { label: 'Members',  value: members.length },
      { label: 'Mentors',  value: members.filter(m => m.platformRole === 'Mentor').length },
      { label: 'Events',   value: events.length },
      { label: 'Services', value: '—' },
    ];

    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>

        {/* ── Welcome banner ── */}
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
          {/* Orbs */}
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
            pointerEvents: 'none',
            animationDelay: '1.2s',
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
                {user.name}
              </h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[user.memberType, user.platformRole, user.location && `📍 ${user.location}`]
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

        {/* ── Stats ── */}
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
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1.5px',
                            background: statGrads[i].grad,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text' }}>
                {loading ? '…' : s.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Two columns ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>

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
                  const ts = typeColors[m.memberType] || typeColors.Other;
                  return (
                    <div key={m._id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 10,
                      border: '1px solid var(--border)', background: 'var(--surface-muted)',
                      transition: 'transform 0.15s',
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
                        {m.memberType}
                      </span>
                    </div>
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
                  const d = new Date(e.date);
                  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
                  const day   = d.getDate();
                  return (
                    <div key={e._id} style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '10px 12px', borderRadius: 10,
                      border: '1px solid var(--border)', background: 'var(--surface-muted)',
                      transition: 'transform 0.15s',
                    }}
                      onMouseEnter={e2 => e2.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={e2 => e2.currentTarget.style.transform = 'translateX(0)'}
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

        {/* ── Quick actions ── */}
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

  // ── Logged-out landing ─────────────────────────────────────
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

      {/* ── Hero ── */}
      <div className="anim-fade-in" style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 28, padding: '88px 48px 80px',
        textAlign: 'center', marginBottom: 20,
        boxShadow: 'var(--shadow-strong)',
      }}>
        {/* Background gradient orbs */}
        <div className="anim-orb" style={{
          position: 'absolute', top: -100, left: -80,
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="anim-orb" style={{
          position: 'absolute', top: -60, right: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 65%)',
          pointerEvents: 'none', animationDelay: '1.5s',
        }} />
        <div className="anim-orb" style={{
          position: 'absolute', bottom: -80, left: '50%',
          transform: 'translateX(-50%)',
          width: 500, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 65%)',
          pointerEvents: 'none', animationDelay: '0.8s',
        }} />

        {/* Floating logo */}
        <div className="anim-float" style={{ width: 80, height: 80, margin: '0 auto 28px' }}>
          <img
            src="/bridgemakersLogo.png"
            alt="Bridgemakers"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Badge */}
        <div className="anim-fade-up" style={{ animationDelay: '0.05s' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 999,
            background: 'var(--brand-soft)', border: '1px solid var(--border-strong)',
            fontSize: 12, fontWeight: 600, color: 'var(--brand-soft-text)',
            marginBottom: 22,
          }}>
            ✨ Young leaders community
          </span>
        </div>

        {/* Headline */}
        <h1 className="anim-fade-up" style={{
          fontSize: 52, fontWeight: 900, lineHeight: 1.07,
          letterSpacing: '-2px', marginBottom: 20,
          animationDelay: '0.1s',
        }}>
          <span style={{ color: 'var(--text-strong)' }}>Where young leaders</span>
          <br />
          <span className="gradient-text">connect & grow</span>
        </h1>

        {/* Subtext */}
        <p className="anim-fade-up" style={{
          fontSize: 18, color: 'var(--text-muted)', maxWidth: 480,
          margin: '0 auto 40px', lineHeight: 1.75,
          animationDelay: '0.15s',
        }}>
          The Bridge brings founders, developers, VCs, designers
          and mentors together in one thriving community.
        </p>

        {/* CTAs */}
        <div className="anim-fade-up" style={{
          display: 'flex', gap: 14, justifyContent: 'center',
          flexWrap: 'wrap', animationDelay: '0.2s',
        }}>
          <Link to="/signup" className="shimmer-btn anim-cta-glow" style={{
            padding: '15px 36px', borderRadius: 12,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            textDecoration: 'none',
          }}>
            Join for free →
          </Link>
          <Link to="/login" style={{
            padding: '15px 36px', borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--surface-muted)',
            color: 'var(--text-muted)',
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Log in
          </Link>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16, marginBottom: 20,
      }}>
        {featureCards.map((f, i) => (
          <div key={f.title} className="anim-fade-up" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: `0 8px 32px ${f.glow}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            animationDelay: `${0.08 * i}s`,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = `0 20px 56px ${f.glow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${f.glow}`;
            }}
          >
            {/* Gradient header bar */}
            <div style={{ height: 5, background: f.grad }} />
            <div style={{ padding: '26px 26px 28px' }}>
              {/* Gradient icon container */}
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: f.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 16,
                boxShadow: `0 6px 20px ${f.glow}`,
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 8 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Who it's for ── */}
      <div className="anim-fade-up" style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '40px 36px', marginBottom: 20,
        boxShadow: 'var(--shadow)',
        animationDelay: '0.1s',
      }}>
        <div className="anim-orb" style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <h2 style={{
          fontSize: 20, fontWeight: 800, marginBottom: 6, textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>
          <span className="gradient-text">Built for every type of leader</span>
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
          One community, many disciplines.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Founders',   bg: '#fef3c7', color: '#92400e', emoji: '🚀' },
            { label: 'Developers', bg: '#dbeafe', color: '#1e40af', emoji: '💻' },
            { label: 'VCs',        bg: '#ede9fe', color: '#5b21b6', emoji: '💰' },
            { label: 'Designers',  bg: '#fce7f3', color: '#9d174d', emoji: '🎨' },
            { label: 'Marketers',  bg: '#d1fae5', color: '#065f46', emoji: '📣' },
            { label: 'Lawyers',    bg: '#fee2e2', color: '#991b1b', emoji: '⚖️' },
            { label: 'Mentors',    bg: '#f0fdf4', color: '#166534', emoji: '🎓' },
          ].map(t => (
            <span key={t.label} style={{
              padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: t.bg, color: t.color,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; }}
            >
              {t.emoji} {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="anim-fade-up" style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 24, padding: '60px 48px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 35%, #7c3aed 70%, #db2777 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 7s ease infinite',
        boxShadow: '0 24px 72px rgba(37,99,235,0.5)',
        animationDelay: '0.15s',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: -60, left: -40,
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -50, right: -30,
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <img src="/bridgemakersLogo.png" alt="Bridgemakers" style={{ width: 56, height: 56, objectFit: 'contain', display: 'block', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: '#fff',
                       marginBottom: 12, letterSpacing: '-0.8px' }}>
            Ready to cross the bridge?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)',
                      marginBottom: 36, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Create your free profile in under 2 minutes and start connecting with the community.
          </p>
          <Link to="/signup" className="shimmer-btn" style={{
            display: 'inline-block',
            padding: '16px 40px', borderRadius: 12,
            background: '#fff', color: '#2563eb',
            fontSize: 15, fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)'; }}
          >
            Get started free →
          </Link>
        </div>
      </div>
    </div>
  );
}
