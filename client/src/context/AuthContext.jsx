import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('memberToken');
    if (stored) {
      try {
        const decoded = jwtDecode(stored);
        // Check token not expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(stored);
          setUser(JSON.parse(localStorage.getItem('memberUser')));
        } else {
          // Expired — clear it
          localStorage.removeItem('memberToken');
          localStorage.removeItem('memberUser');
        }
      } catch {
        localStorage.removeItem('memberToken');
        localStorage.removeItem('memberUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, member) => {
    localStorage.setItem('memberToken', token);
    localStorage.setItem('memberUser', JSON.stringify(member));
    setToken(token);
    setUser(member);
  };

  const logout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberUser');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('memberUser', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);