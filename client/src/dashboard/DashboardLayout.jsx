import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const navItems = [
  { to: '/dashboard',          label: 'Home',     icon: '⊞', end: true },
  { to: '/dashboard/members',  label: 'Members',  icon: '👥' },
  { to: '/dashboard/events',   label: 'Events',   icon: '📅' },
  { to: '/dashboard/services', label: 'Services', icon: '⇄'  },
  { to: '/dashboard/submit',   label: 'Submit event', icon: '➕' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    color: isActive ? '#1a1a1a' : '#666',
    background: isActive ? '#f0efe9' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s',
    marginBottom: 2,
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={{
        width: 220,
        background: '#fff',
        borderRight: '1px solid #ebebeb',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        position: 'sticky',
        top: 56,
        height: 'calc(100vh - 56px)',
        overflowY: 'auto',
        flexShrink: 0,
      }}>

        {/* User card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 10px',
          borderRadius: 10,
          background: '#f9f8f6',
          marginBottom: 20,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#1a1a1a', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {initials(user?.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#1a1a1a',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name?.split(' ')[0]}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>
              {user?.memberType}
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div style={{
          fontSize: 10, fontWeight: 600, color: '#bbb',
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
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #ebebeb', margin: '12px 0' }} />

        {/* Bottom links */}
        <NavLink to="/dashboard/profile" style={linkStyle}>
          <span style={{ fontSize: 16 }}>👤</span>
          My profile
        </NavLink>

        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '9px 14px', borderRadius: 8,
          fontSize: 13, color: '#dc2626', background: 'transparent',
          border: 'none', cursor: 'pointer', marginTop: 2,
          textAlign: 'left', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff1f1'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Sign out
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main style={{
        flex: 1,
        padding: '32px 32px',
        background: '#f9f8f6',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        <Outlet />
      </main>
    </div>
  );
}