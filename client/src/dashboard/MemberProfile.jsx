import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMember, getExchangesByMember } from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

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

const categoryColors = {
  Partnership:          { bg: '#e0f2fe', color: '#075985' },
  Marketing:            { bg: '#d1fae5', color: '#065f46' },
  Design:               { bg: '#fce7f3', color: '#9d174d' },
  Content:              { bg: '#fef9c3', color: '#713f12' },
  Website:              { bg: '#dbeafe', color: '#1e40af' },
  Software:             { bg: '#eef2ff', color: '#3730a3' },
  'Business development':{ bg: '#fef3c7', color: '#92400e' },
  Introduction:         { bg: '#ffedd5', color: '#9a3412' },
  Events:               { bg: '#f0fdf4', color: '#14532d' },
  'Work opportunity':   { bg: '#ede9fe', color: '#5b21b6' },
  Other:                { bg: '#f3f4f6', color: '#374151' },
};

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

function ExchangeCard({ ex }) {
  const cs = categoryColors[ex.category] || categoryColors.Other;
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 18,
    }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 20,
          background: cs.bg, color: cs.color, fontWeight: 500,
        }}>
          {ex.category}
        </span>
      </div>
      <h3 style={{
        fontSize: 14, fontWeight: 700, color: 'var(--text-strong)',
        marginBottom: ex.description ? 6 : 0, lineHeight: 1.3,
      }}>
        {ex.title}
      </h3>
      {ex.description && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          {ex.description}
        </p>
      )}
    </div>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const [member, setMember] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    Promise.all([getMember(id), getExchangesByMember(id)])
      .then(([mRes, eRes]) => {
        setMember(mRes.data);
        const all = Array.isArray(eRes.data) ? eRes.data : [];
        setExchanges(all.filter(e => {
          const posterId = e.postedBy?._id ?? e.postedBy;
          return String(posterId) === id;
        }));
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-subtle)', fontSize: 14 }}>
      Loading...
    </div>
  );

  if (notFound || !member) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>
        Member not found
      </p>
      <button onClick={() => navigate(-1)} style={{
        marginTop: 8, padding: '9px 18px', borderRadius: 8, fontSize: 13,
        border: '1px solid var(--border)', background: 'var(--surface)',
        color: 'var(--text-muted)', cursor: 'pointer',
      }}>
        ← Go back
      </button>
    </div>
  );

  const isMe = member._id === user?._id;
  const offered = exchanges.filter(e => e.type === 'Offered');
  const requested = exchanges.filter(e => e.type === 'Requested');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 20, padding: '7px 14px', borderRadius: 8,
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}
      >
        ← Back
      </button>

      {/* Profile card */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: isMobile ? '24px 20px' : '36px 40px',
        marginBottom: 20, position: 'relative',
      }}>
        {isMe && (
          <div style={{
            position: 'absolute', top: 20, right: 20,
            fontSize: 10, padding: '3px 10px', borderRadius: 20,
            background: 'var(--brand-soft)', color: 'var(--brand-soft-text)', fontWeight: 600,
          }}>
            You
          </div>
        )}

        <div style={{ display: 'flex', gap: isMobile ? 16 : 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: isMobile ? 64 : 80, height: isMobile ? 64 : 80,
            borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
            color: 'var(--brand-contrast)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMobile ? 22 : 28, fontWeight: 800,
          }}>
            {initials(member.name)}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: isMobile ? 20 : 26, fontWeight: 800, color: 'var(--text-strong)',
              letterSpacing: '-0.5px', marginBottom: 4,
            }}>
              {member.name}
            </h1>

            {(member.role || member.company) && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
                {member.role && member.company
                  ? `${member.role} @ ${member.company}`
                  : member.role || member.company}
              </p>
            )}

            {member.location && (
              <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 12 }}>
                📍 {member.location}
              </p>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: member.bio ? 14 : 0 }}>
              {member.memberType?.map(t => {
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
              {member.platformRole === 'Mentor' && (
                <span style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20,
                  background: '#ede9fe', color: '#5b21b6', fontWeight: 600,
                }}>
                  Mentor
                </span>
              )}
            </div>

            {member.bio && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 12 }}>
                {member.bio}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 24,
          borderTop: '1px solid var(--border)', paddingTop: 20,
          flexWrap: 'wrap',
        }}>
          {isMe ? (
            <Link to="/dashboard/profile" style={{
              padding: '10px 22px', borderRadius: 8, fontSize: 13,
              background: 'var(--brand)', color: 'var(--brand-contrast)',
              fontWeight: 600, textDecoration: 'none',
            }}>
              Edit my profile
            </Link>
          ) : (
            <>
              <a
                href={`mailto:${member.email}?subject=Connecting via The Bridge`}
                style={{
                  padding: '10px 22px', borderRadius: 8, fontSize: 13,
                  background: 'var(--brand)', color: 'var(--brand-contrast)',
                  fontWeight: 600, textDecoration: 'none',
                }}
              >
                Connect via email
              </a>
              {member.linkedin && (
                <a
                  href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 22px', borderRadius: 8, fontSize: 13,
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  LinkedIn ↗
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Exchanges */}
      <div>
        <h2 style={{
          fontSize: 16, fontWeight: 700, color: 'var(--text-strong)',
          letterSpacing: '-0.3px', marginBottom: 16,
        }}>
          Exchanges
        </h2>

        {exchanges.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '40px 24px',
            textAlign: 'center', color: 'var(--text-subtle)', fontSize: 14,
          }}>
            No exchanges posted yet.
          </div>
        ) : (
          <>
            {offered.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)',
                  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10,
                }}>
                  🙋 Offering — {offered.length}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 12,
                }}>
                  {offered.map(ex => <ExchangeCard key={ex._id} ex={ex} />)}
                </div>
              </div>
            )}

            {requested.length > 0 && (
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)',
                  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10,
                }}>
                  🙏 Requesting — {requested.length}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 12,
                }}>
                  {requested.map(ex => <ExchangeCard key={ex._id} ex={ex} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
