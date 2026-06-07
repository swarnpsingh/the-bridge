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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
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
        <Route path="/admin/login" element={<div>Admin Login</div>} />
      </Routes>
    </BrowserRouter>
  );
}
