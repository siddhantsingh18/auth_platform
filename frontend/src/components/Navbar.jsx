import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "var(--color-ink)",
        borderBottom: "2px solid var(--color-ink)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-white font-black text-xl tracking-tighter"
            style={{ fontFamily: "var(--font-display)" }}
          >
            NX<span style={{ color: "var(--color-accent)" }}>.</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" active={isActive("/dashboard")}>
              <LayoutDashboard size={14} />
              Dashboard
            </NavLink>
            <NavLink to="/profile" active={isActive("/profile")}>
              <User size={14} />
              Profile
            </NavLink>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <span
              className="text-xs font-mono px-2 py-1"
              style={{
                color: "var(--color-muted)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 text-white transition-all"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t py-3 flex flex-col gap-2"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <MobileNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={14} /> Dashboard
            </MobileNavLink>
            <MobileNavLink to="/profile" onClick={() => setMobileOpen(false)}>
              <User size={14} /> Profile
            </MobileNavLink>
            <div
              className="pt-2 mt-1 border-t"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <p
                className="text-xs font-mono px-3 py-1 mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 text-white w-full"
                style={{ color: "var(--color-accent)" }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 transition-all"
    style={{
      color: active ? "white" : "rgba(255,255,255,0.5)",
      background: active ? "rgba(255,255,255,0.08)" : "transparent",
    }}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 text-sm font-semibold px-3 py-2 text-white"
    style={{ color: "rgba(255,255,255,0.7)" }}
  >
    {children}
  </Link>
);
