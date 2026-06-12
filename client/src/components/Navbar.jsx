import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    fontSize: 14,
    padding: '6px 12px',
    borderRadius: 6,
    color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
    background: isActive ? 'var(--brand-soft)' : 'transparent',
    fontWeight: isActive ? 500 : 400,
    transition: 'all 0.15s',
    textDecoration: 'none',
  });

  return (
    <nav style={{
      background: 'color-mix(in srgb, var(--surface) 86%, transparent)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(18px)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.05)',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 24px',
        minHeight: 72, display: 'flex', alignItems: 'center', gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 18, fontWeight: 800, color: 'var(--text-strong)',
          marginRight: 8, letterSpacing: '-0.5px', textDecoration: 'none',
        }}>
          <img
            src="/bridgemakersLogo.png"
            alt="Bridgemakers"
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain', display: 'block' }}
          />
          <span><span style={{ color: 'var(--brand)' }}>The</span> Bridge</span>
        </NavLink>

        {/* Nav links — only show dashboard links when logged in */}
        <div style={{ display: 'flex', gap: 4, flex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <NavLink to="/dashboard"          style={navLinkStyle}>Home</NavLink>
              <NavLink to="/dashboard/members"  style={navLinkStyle}>Members</NavLink>
              <NavLink to="/dashboard/events"   style={navLinkStyle}>Events</NavLink>
              <NavLink to="/dashboard/services" style={navLinkStyle}>Services</NavLink>
              <NavLink to="/dashboard/submit"   style={navLinkStyle}>Submit event</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" end style={navLinkStyle}>Home</NavLink>
            </>
          )}
        </div>

        <button type="button" onClick={toggleTheme} className="theme-toggle" data-active={mode} aria-label="Toggle dark and light mode">
          <span className="theme-toggle__track">
            <span className="theme-toggle__thumb" />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
            {mode === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Right side */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavLink to="/dashboard/profile" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 12px 5px 5px', borderRadius: 999,
              border: '1px solid var(--border)', textDecoration: 'none',
              color: 'var(--text-strong)',
              background: 'var(--surface)',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', color: 'var(--brand-contrast)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
              }}>
                {initials(user.name)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {user.name.split(' ')[0]}
              </span>
            </NavLink>
            <button onClick={handleLogout} style={{
              fontSize: 13, padding: '10px 16px', borderRadius: 999,
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600,
            }}>
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <NavLink to="/login" style={{
              fontSize: 13, padding: '10px 16px', borderRadius: 999,
              border: '1px solid var(--border)', color: 'var(--text-muted)',
              textDecoration: 'none', fontWeight: 600,
              background: 'var(--surface)',
            }}>
              Log in
            </NavLink>
            <NavLink to="/signup" style={{
              fontSize: 13, padding: '10px 16px', borderRadius: 999,
              background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', color: 'var(--brand-contrast)',
              textDecoration: 'none', fontWeight: 700,
              boxShadow: 'var(--shadow)',
            }}>
              Join now
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}