import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Members from "./pages/Members";
import CreateProfile from "./pages/CreateProfile";

import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHome from "./dashboard/DashboardHome";
import DashboardMembers from "./dashboard/DashboardMembers";
import DashboardEvents from "./dashboard/DashboardEvents";
import DashboardServices from "./dashboard/DashboardServices";
import DashboardSubmit from "./dashboard/DashboardSubmit";
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
              <Route path="events" element={<DashboardEvents />} />
              <Route path="services" element={<DashboardServices />} />
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
              <Route path="services" element={<AdminServices />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
