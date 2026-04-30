import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-12 h-12 border-4 rounded-none animate-spin"
        style={{ borderColor: "var(--color-ink)", borderTopColor: "var(--color-accent)" }}
      />
      <p className="font-mono text-sm" style={{ color: "var(--color-muted)" }}>
        LOADING...
      </p>
    </div>
  </div>
);

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen noise-bg" style={{ background: "var(--color-surface)" }}>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
