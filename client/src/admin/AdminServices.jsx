import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGetServices, adminDeleteService } from '../api';

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

export default function AdminServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetServices();
      setServices(Array.isArray(res.data) ? res.data : []);
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
    if (!window.confirm('Remove this exchange permanently?')) return;
    setRemoving(id);
    try {
      await adminDeleteService(id);
      setServices(prev => prev.filter(s => s._id !== id));
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
          Exchanges
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {services.length} exchange{services.length !== 1 ? 's' : ''} in the community.
        </p>
      </div>

      {services.length === 0 ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '48px 24px',
          textAlign: 'center', color: 'var(--text-subtle)', fontSize: 14,
        }}>
          No exchanges yet.
        </div>
      ) : (
        <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Type</Th>
                <Th>Posted by</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <Td>
                    <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 13 }}>{s.title}</div>
                    {s.description && (
                      <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.description}
                      </div>
                    )}
                  </Td>
                  <Td>{s.category || '—'}</Td>
                  <Td>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                      background: s.type === 'Offered' ? '#dbeafe' : '#fef3c7',
                      color: s.type === 'Offered' ? '#1e40af' : '#92400e',
                    }}>
                      {s.type}
                    </span>
                  </Td>
                  <Td>{s.postedBy?.name || '—'}</Td>
                  <Td>{fmtDate(s.createdAt)}</Td>
                  <Td>
                    <button
                      onClick={() => handleRemove(s._id)}
                      disabled={removing === s._id}
                      style={{
                        padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                        background: 'var(--danger-soft)', color: 'var(--danger)',
                        border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
                        cursor: removing === s._id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {removing === s._id ? '...' : 'Remove'}
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
