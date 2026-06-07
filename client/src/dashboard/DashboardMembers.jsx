import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMembers } from '../api';

const TYPES = ['All','Founder','VC','Developer','Designer','Marketer','Lawyer','Other'];
const ROLES = ['All','Member','Mentor'];

const typeColors = {
  Founder:  { bg: '#fef3c7', color: '#92400e' },
  VC:       { bg: '#ede9fe', color: '#5b21b6' },
  Developer:{ bg: '#dbeafe', color: '#1e40af' },
  Designer: { bg: '#fce7f3', color: '#9d174d' },
  Marketer: { bg: '#d1fae5', color: '#065f46' },
  Lawyer:   { bg: '#fee2e2', color: '#991b1b' },
  Other:    { bg: '#f3f4f6', color: '#374151' },
};

const avatarColors = ['#e0e7ff','#fce7f3','#d1fae5','#fef3c7','#dbeafe','#fee2e2'];
const avatarText   = ['#4338ca','#9d174d','#065f46','#92400e','#1e40af','#991b1b'];
const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';

export default function DashboardMembers() {
  const { user } = useAuth();
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (typeFilter !== 'All') params.type = typeFilter;
    if (roleFilter !== 'All') params.role = roleFilter;
    getMembers(params)
      .then(r => setMembers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [typeFilter, roleFilter]);

  const filtered = members.filter(m => {
    if (search === '') return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.company?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q)
    );
  });

  // separate current user so they appear first
  const sorted = [
    ...filtered.filter(m => m._id === user?._id),
    ...filtered.filter(m => m._id !== user?._id),
  ];

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
      border: active ? '1.5px solid #1a1a1a' : '1px solid #e5e5e5',
      background: active ? '#1a1a1a' : '#fff',
      color: active ? '#fff' : '#555',
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a',
                     letterSpacing: '-0.5px', marginBottom: 4 }}>
          Member directory
        </h1>
        <p style={{ fontSize: 14, color: '#888' }}>
          {loading ? 'Loading...' : `${filtered.length} member${filtered.length !== 1 ? 's' : ''}`}
          {(typeFilter !== 'All' || roleFilter !== 'All') && ' (filtered)'}
        </p>
      </div>

      {/* Filter card */}
      <div style={{
        background: '#fff', border: '1px solid #ebebeb',
        borderRadius: 14, padding: '20px 24px', marginBottom: 20,
      }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', fontSize: 15, color: '#bbb',
          }}>🔍</span>
          <input
            placeholder="Search by name, role, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              border: '1px solid #e5e5e5', borderRadius: 8,
              fontSize: 14, color: '#1a1a1a', outline: 'none',
              background: '#fafafa', transition: 'border-color 0.15s',
            }}
            onFocus={e  => e.target.style.borderColor = '#1a1a1a'}
            onBlur={e   => e.target.style.borderColor = '#e5e5e5'}
          />
        </div>

        {/* Type */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '.05em',
                        marginBottom: 8 }}>
            Member type
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <Chip key={t} label={t}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)} />
            ))}
          </div>
        </div>

        {/* Role */}
        <div>
          <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '.05em',
                        marginBottom: 8 }}>
            Platform role
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {ROLES.map(r => (
              <Chip key={r} label={r}
                active={roleFilter === r}
                onClick={() => setRoleFilter(r)} />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 14 }}>
          Loading members...
        </div>
      ) : sorted.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 14, padding: '60px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>
            No members found
          </p>
          <p style={{ fontSize: 13, color: '#aaa' }}>
            {search ? 'Try a different search term' : 'Be the first to join The Bridge'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 14,
        }}>
          {sorted.map((m, i) => {
            const ts       = typeColors[m.memberType] || typeColors.Other;
            const isMe     = m._id === user?._id;
            const isMentor = m.platformRole === 'Mentor';

            return (
              <div key={m._id} style={{
                background: '#fff',
                border: `1px solid ${isMe ? '#c7d2fe' : '#ebebeb'}`,
                borderRadius: 14, padding: 20,
                position: 'relative',
                transition: 'transform 0.15s, border-color 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  if (!isMe) e.currentTarget.style.borderColor = '#d0d0d0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isMe ? '#c7d2fe' : '#ebebeb';
                }}
              >
                {/* "You" badge */}
                {isMe && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    fontSize: 10, padding: '2px 8px', borderRadius: 20,
                    background: '#e0e7ff', color: '#4338ca', fontWeight: 600,
                  }}>
                    You
                  </div>
                )}

                {/* Top row */}
                <div style={{ display: 'flex', gap: 12,
                              alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: avatarColors[i % avatarColors.length],
                    color: avatarText[i % avatarText.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700,
                  }}>
                    {initials(m.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a',
                                  overflow: 'hidden', textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2,
                                  overflow: 'hidden', textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap' }}>
                      {m.role && m.company
                        ? `${m.role} @ ${m.company}`
                        : m.role || m.company || '—'}
                    </div>
                    {m.location && (
                      <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
                        📍 {m.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6,
                              flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20,
                    background: ts.bg, color: ts.color, fontWeight: 500,
                  }}>
                    {m.memberType}
                  </span>
                  {isMentor && (
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: '#ede9fe', color: '#5b21b6', fontWeight: 500,
                    }}>
                      Mentor
                    </span>
                  )}
                </div>

                {/* Bio */}
                {m.bio && (
                  <p style={{
                    fontSize: 12, color: '#777', lineHeight: 1.55,
                    marginBottom: 14,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {m.bio}
                  </p>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex', gap: 8,
                  borderTop: '1px solid #f5f5f5', paddingTop: 14,
                }}>
                  {isMe ? (
                    <Link to="/dashboard/profile" style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      background: '#1a1a1a', borderRadius: 8,
                      fontSize: 12, color: '#fff', fontWeight: 500,
                      textDecoration: 'none',
                    }}>
                      Edit my profile
                    </Link>
                  ) : (
                    <>
                      {m.linkedin && (
                        <a href={m.linkedin.startsWith('http')
                            ? m.linkedin : `https://${m.linkedin}`}
                          target="_blank" rel="noreferrer" style={{
                            flex: 1, textAlign: 'center', padding: '8px',
                            border: '1px solid #e5e5e5', borderRadius: 8,
                            fontSize: 12, color: '#555', fontWeight: 500,
                            textDecoration: 'none',
                          }}>
                          LinkedIn
                        </a>
                      )}
                      <a href={`mailto:${m.email}`} style={{
                        flex: 1, textAlign: 'center', padding: '8px',
                        background: '#1a1a1a', borderRadius: 8,
                        fontSize: 12, color: '#fff', fontWeight: 500,
                        textDecoration: 'none',
                      }}>
                        Connect
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}