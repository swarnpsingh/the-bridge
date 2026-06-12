import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminGetMembers, adminGetEvents, adminGetServices,
  adminApproveEvent, adminDeleteEvent,
} from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const StatCard = ({ label, value, accent }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '20px 24px',
  }}>
    <div style={{
      fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4,
      color: accent ? 'var(--brand)' : 'var(--text-strong)',
    }}>
      {value}
    </div>
    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
  </div>
);

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [mRes, eRes, sRes] = await Promise.all([
        adminGetMembers(),
        adminGetEvents(),
        adminGetServices(),
      ]);
      setMembers(Array.isArray(mRes.data) ? mRes.data : []);
      setEvents(Array.isArray(eRes.data) ? eRes.data : []);
      setServices(Array.isArray(sRes.data) ? sRes.data : []);
    } catch {
      navigate('/admin/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const pending = events.filter(e => !e.approved);
  const mentors = members.filter(m => m.platformRole === 'Mentor').length;

  const handleApprove = async (id) => {
    setActionLoading(id + '-a');
    try {
      await adminApproveEvent(id);
      setEvents(prev => prev.map(e => e._id === id ? { ...e, approved: true } : e));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '-r');
    try {
      await adminDeleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } finally {
      setActionLoading(null);
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
          Overview
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Community health at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, marginBottom: 36,
      }}>
        <StatCard label="Total members" value={members.length} />
        <StatCard label="Mentors" value={mentors} />
        <StatCard label="Pending approvals" value={pending.length} accent={pending.length > 0} />
        <StatCard label="Service listings" value={services.length} />
      </div>

      {/* Pending approvals */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 14 }}>
          Pending event approvals
        </h2>

        {pending.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '32px 24px',
            textAlign: 'center', color: 'var(--text-subtle)', fontSize: 14,
          }}>
            No pending events — you&apos;re all caught up.
          </div>
        ) : (
          <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                  <Th>Event</Th>
                  <Th>Submitted by</Th>
                  <Th>Date</Th>
                  <Th>Format</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {pending.map(event => (
                  <tr key={event._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <Td>
                      <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 13 }}>
                        {event.title}
                      </div>
                      {event.description && (
                        <div style={{
                          fontSize: 12, color: 'var(--text-subtle)', marginTop: 2,
                          maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {event.description}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div>{event.submittedBy?.name || '—'}</div>
                      <div style={{ fontSize: 11 }}>{event.submittedBy?.email || ''}</div>
                    </Td>
                    <Td>{fmtDate(event.date)}</Td>
                    <Td>
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                        background: event.format === 'Online' ? '#dbeafe' : '#d1fae5',
                        color: event.format === 'Online' ? '#1e40af' : '#065f46',
                      }}>
                        {event.format}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleApprove(event._id)}
                          disabled={!!actionLoading}
                          style={{
                            padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                            background: '#d1fae5', color: '#065f46',
                            border: '1px solid #6ee7b7', cursor: 'pointer',
                          }}
                        >
                          {actionLoading === event._id + '-a' ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(event._id)}
                          disabled={!!actionLoading}
                          style={{
                            padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                            background: 'var(--danger-soft)', color: 'var(--danger)',
                            border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
                            cursor: 'pointer',
                          }}
                        >
                          {actionLoading === event._id + '-r' ? '...' : 'Reject'}
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent members */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 14 }}>
          Recent members
        </h2>
        <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Role</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 5).map(m => (
                <tr key={m._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <Td>
                    <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{m.email}</div>
                  </Td>
                  <Td>{m.memberType || '—'}</Td>
                  <Td>{m.platformRole || 'Member'}</Td>
                  <Td>{fmtDate(m.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
