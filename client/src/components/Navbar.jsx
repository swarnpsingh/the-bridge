import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    fontSize: 14,
    padding: '6px 12px',
    borderRadius: 6,
    color: isActive ? '#1a1a1a' : '#666',
    background: isActive ? '#f0efe9' : 'transparent',
    fontWeight: isActive ? 500 : 400,
    transition: 'all 0.15s',
    textDecoration: 'none',
  });

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #ebebeb',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '0 24px',
        height: 56, display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {/* Logo */}
        <NavLink to="/" style={{
          fontSize: 16, fontWeight: 700, color: '#1a1a1a',
          marginRight: 20, letterSpacing: '-0.3px', textDecoration: 'none',
        }}>
          The Bridge
        </NavLink>

        {/* Nav links — only show dashboard links when logged in */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
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

        {/* Right side */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavLink to="/dashboard/profile" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 10px 4px 4px', borderRadius: 20,
              border: '1px solid #e5e5e5', textDecoration: 'none',
              color: '#1a1a1a',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1a1a1a', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>
                {initials(user.name)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                {user.name.split(' ')[0]}
              </span>
            </NavLink>
            <button onClick={handleLogout} style={{
              fontSize: 13, padding: '7px 14px', borderRadius: 8,
              border: '1px solid #e5e5e5', background: '#fff',
              color: '#888', cursor: 'pointer',
            }}>
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <NavLink to="/login" style={{
              fontSize: 13, padding: '7px 16px', borderRadius: 8,
              border: '1px solid #e5e5e5', color: '#555',
              textDecoration: 'none', fontWeight: 500,
            }}>
              Log in
            </NavLink>
            <NavLink to="/signup" style={{
              fontSize: 13, padding: '7px 16px', borderRadius: 8,
              background: '#1a1a1a', color: '#fff',
              textDecoration: 'none', fontWeight: 500,
            }}>
              Join now
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}