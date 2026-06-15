import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers } from '../api';

const TYPES = ['All', 'Founder', 'VC', 'Developer', 'Designer', 'Marketer', 'Lawyer', 'Other'];
const ROLES = ['All', 'Member', 'Mentor'];

const typeColors = {
  Founder:  { bg: '#fef3c7', color: '#92400e' },
  VC:       { bg: '#ede9fe', color: '#5b21b6' },
  Developer:{ bg: '#dbeafe', color: '#1e40af' },
  Designer: { bg: '#fce7f3', color: '#9d174d' },
  Marketer: { bg: '#d1fae5', color: '#065f46' },
  Lawyer:   { bg: '#fee2e2', color: '#991b1b' },
  Other:    { bg: '#f3f4f6', color: '#374151' },
};

const avatarColors = ['#e0e7ff','#fce7f3','#d1fae5','#fef3c7','#dbeafe','#fee2e2','#f3f4f6'];
const avatarText   = ['#4338ca','#9d174d','#065f46','#92400e','#1e40af','#991b1b','#374151'];

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch]         = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (typeFilter !== 'All') params.type = typeFilter;
    if (roleFilter !== 'All') params.role = roleFilter;
    getMembers(params)
      .then(r => { setMembers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [typeFilter, roleFilter]);

  const filtered = members.filter(m =>
    search === '' ||
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.company?.toLowerCase().includes(search.toLowerCase()) ||
    m.location?.toLowerCase().includes(search.toLowerCase())
  );

  const FilterBtn = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
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
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{
        background: '#fff', border: '1px solid #ebebeb',
        borderRadius: 16, padding: '28px 32px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a',
                         letterSpacing: '-0.5px', marginBottom: 4 }}>
              Member directory
            </h1>
            <p style={{ fontSize: 14, color: '#888' }}>
              {loading ? 'Loading...' : `${filtered.length} member${filtered.length !== 1 ? 's' : ''}`}
              {typeFilter !== 'All' || roleFilter !== 'All' ? ' (filtered)' : ''}
            </p>
          </div>
          <Link to="/members/create" style={{
            padding: '10px 20px', borderRadius: 10,
            background: '#1a1a1a', color: '#fff',
            fontSize: 13, fontWeight: 500, display: 'inline-block',
          }}>
            + Create profile
          </Link>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', color: '#aaa', fontSize: 16,
          }}>🔍</span>
          <input
            placeholder="Search by name, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              border: '1px solid #e5e5e5', borderRadius: 10,
              fontSize: 14, color: '#1a1a1a', outline: 'none',
              background: '#fafafa',
            }}
          />
        </div>

        {/* Type filters */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#aaa', fontWeight: 500,
                        textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
            Member tag
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <FilterBtn key={t} label={t}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)} />
            ))}
          </div>
        </div>

        {/* Role filters */}
        <div>
          <div style={{ fontSize: 11, color: '#aaa', fontWeight: 500,
                        textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
            Platform role
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {ROLES.map(r => (
              <FilterBtn key={r} label={r}
                active={roleFilter === r}
                onClick={() => setRoleFilter(r)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 14 }}>
          Loading members...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #ebebeb', borderRadius: 16,
          padding: '60px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>
            No members found
          </p>
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>
            {search ? 'Try a different search term' : 'Be the first to join The Bridge'}
          </p>
          <Link to="/members/create" style={{
            padding: '10px 20px', borderRadius: 8, background: '#1a1a1a',
            color: '#fff', fontSize: 13, fontWeight: 500, display: 'inline-block',
          }}>
            Create your profile
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {filtered.map((m, i) => {
            const typeStyle = typeColors[m.memberType] || typeColors.Other;
            const isMentor  = m.platformRole === 'Mentor';
            return (
              <div key={m._id} style={{
                background: '#fff', border: '1px solid #ebebeb',
                borderRadius: 14, padding: '20px',
                transition: 'border-color 0.15s, transform 0.15s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#d0d0d0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#ebebeb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', gap: 12,
                              alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: avatarColors[i % avatarColors.length],
                    color: avatarText[i % avatarText.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700,
                  }}>
                    {initials(m.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20,
                    background: typeStyle.bg, color: typeStyle.color, fontWeight: 500,
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
                    fontSize: 12, color: '#777', lineHeight: 1.5, marginBottom: 14,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {m.bio}
                  </p>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f5f5f5', paddingTop: 14 }}>
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" style={{
                      flex: 1, textAlign: 'center', padding: '7px',
                      border: '1px solid #e5e5e5', borderRadius: 8,
                      fontSize: 12, color: '#555', fontWeight: 500,
                    }}>
                      LinkedIn
                    </a>
                  )}
                  <a href={`mailto:${m.email}`} style={{
                    flex: 1, textAlign: 'center', padding: '7px',
                    background: '#1a1a1a', borderRadius: 8,
                    fontSize: 12, color: '#fff', fontWeight: 500,
                  }}>
                    Connect
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}