import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Members from "./pages/Members";
import CreateProfile from "./pages/CreateProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHome from "./dashboard/DashboardHome";
import DashboardMembers from "./dashboard/DashboardMembers";
import DashboardEvents from "./dashboard/DashboardEvents";
import DashboardServices from "./dashboard/DashboardServices";
import DashboardSubmit from "./dashboard/DashboardSubmit";
import MemberProfile from "./dashboard/MemberProfile";
import DashboardProfile from "./dashboard/DashboardProfile";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminMembers from "./admin/AdminMembers";
import AdminEvents from "./admin/AdminEvents";
import AdminServices from "./admin/AdminServices";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main style={{ flex: 1, width: '100%' }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/create" element={<CreateProfile />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />

            {/* Protected dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="members" element={<DashboardMembers />} />
              <Route path="members/:id" element={<MemberProfile />} />
              <Route path="events" element={<DashboardEvents />} />
              <Route path="exchanges" element={<DashboardServices />} />
              <Route path="submit" element={<DashboardSubmit />} />
              <Route path="profile" element={<DashboardProfile />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="exchanges" element={<AdminServices />} />
            </Route>
          </Routes>
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)',
          borderTop: '1px solid var(--border)',
        }}>
          Made with &#9829; by Bridgemakers &copy; {new Date().getFullYear()}
          <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
          <a href="mailto:admin@bridgemakersmn.org" style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-strong)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
          >admin@bridgemakersmn.org</a>
          <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
          <a href="/privacy" style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-strong)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
          >Privacy Policy</a>
          <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
          <a href="/terms" style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-strong)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
          >Terms & Conditions</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}
