import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBreakpoint } from '../hooks/useBreakpoint';

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const navItems = [
  { to: '/dashboard',          label: 'Home',     icon: '⊞', end: true },
  { to: '/dashboard/members',  label: 'Members',  icon: '👥' },
  { to: '/dashboard/events',   label: 'Events',   icon: '📅' },
  { to: '/dashboard/exchanges', label: 'Exchanges', icon: '⇄'  },
  { to: '/dashboard/submit',   label: 'Submit event', icon: '➕' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
    background: isActive ? 'var(--brand-soft)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s',
    marginBottom: 2,
  });

  const isBelowDesktop = isMobile || isTablet;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', width: '100%' }}>

      {/* Backdrop for mobile/tablet */}
      {isBelowDesktop && (
        <div
          className={`sidebar-backdrop${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={{
        width: 260,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        ...(isDesktop ? {
          position: 'sticky',
          top: 72,
          height: 'calc(100vh - 72px)',
          flexShrink: 0,
        } : {
          position: 'fixed',
          top: 72,
          left: sidebarOpen ? 0 : -280,
          height: 'calc(100vh - 72px)',
          zIndex: 200,
          transition: 'left 0.25s ease',
          flexShrink: 0,
        }),
        overflowY: 'auto',
        backdropFilter: 'blur(16px)',
      }}>

        {/* User card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 10px',
          borderRadius: 14,
          background: 'var(--surface-muted)',
          marginBottom: 20,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', color: 'var(--brand-contrast)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {initials(user?.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--text-strong)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name?.split(' ')[0]}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {user?.memberType?.join(', ')}
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text-subtle)',
          textTransform: 'uppercase', letterSpacing: '.06em',
          padding: '0 10px', marginBottom: 6,
        }}>
          Navigation
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={linkStyle}
              onClick={() => isBelowDesktop && setSidebarOpen(false)}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />

        {/* Bottom links */}
        <NavLink
          to="/dashboard/profile"
          style={linkStyle}
          onClick={() => isBelowDesktop && setSidebarOpen(false)}
        >
          <span style={{ fontSize: 16 }}>👤</span>
          My profile
        </NavLink>

        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '9px 14px', borderRadius: 8,
          fontSize: 13, color: 'var(--danger)', background: 'transparent',
          border: 'none', cursor: 'pointer', marginTop: 2,
          textAlign: 'left', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Sign out
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main style={{
        flex: 1,
        padding: isMobile ? '20px 16px' : '32px 32px',
        background: 'transparent',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {/* Hamburger button — mobile/tablet only */}
        {isBelowDesktop && (
          <button
            type="button"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Open sidebar"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 16, padding: '8px 14px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 16 }}>☰</span>
            Menu
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
