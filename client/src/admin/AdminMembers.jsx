import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGetMembers, adminDeleteMember } from '../api';

const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const Th = ({ children }) => (
  <th style={{
    padding: '10px 16px', fontSize: 11, fontWeight: 600,
    color: 'var(--text-subtle)', textTransform: 'uppercase',
    letterSpacing: '.04em', textAlign: 'left',
  }}>
    {children}
  </th>
);

const Td = ({ children, style }) => (
  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', ...style }}>
    {children}
  </td>
);

export default function AdminMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetMembers();
      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this member permanently?')) return;
    setRemoving(id);
    try {
      await adminDeleteMember(id);
      setMembers(prev => prev.filter(m => m._id !== id));
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subtle)', fontSize: 14 }}>
      Loading...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.5px', marginBottom: 4 }}>
          Members
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {members.length} registered member{members.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {members.length === 0 ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '48px 24px',
          textAlign: 'center', color: 'var(--text-subtle)', fontSize: 14,
        }}>
          No members yet.
        </div>
      ) : (
        <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Platform Role</Th>
                <Th>Location</Th>
                <Th>Joined</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <Td>
                    <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{m.email}</div>
                  </Td>
                  <Td>{m.memberType?.join(', ') || '—'}</Td>
                  <Td>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                      background: m.platformRole === 'Mentor' ? '#ede9fe' : 'var(--surface-muted)',
                      color: m.platformRole === 'Mentor' ? '#7c3aed' : 'var(--text-muted)',
                    }}>
                      {m.platformRole || 'Member'}
                    </span>
                  </Td>
                  <Td>{m.location || '—'}</Td>
                  <Td>{fmtDate(m.createdAt)}</Td>
                  <Td>
                    <button
                      onClick={() => handleRemove(m._id)}
                      disabled={removing === m._id}
                      style={{
                        padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                        background: 'var(--danger-soft)', color: 'var(--danger)',
                        border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
                        cursor: removing === m._id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {removing === m._id ? '...' : 'Remove'}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
