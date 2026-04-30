import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen page-enter" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div
          className="text-2xl font-black tracking-tighter"
          style={{ fontFamily: "var(--font-display)" }}
        >
          NX<span style={{ color: "var(--color-accent)" }}>.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm px-4 py-2">
            Login
          </Link>
          <Link to="/signup" className="btn-primary text-sm px-4 py-2">
            Sign Up →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 mb-8"
              style={{
                border: "1.5px solid var(--color-border)",
                background: "var(--color-surface-alt)",
                color: "var(--color-muted)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              SECURE · FAST · RELIABLE
            </div>

            <h1
              className="text-6xl sm:text-7xl font-black leading-none tracking-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AUTH
              <br />
              <span style={{ color: "var(--color-accent)" }}>MADE</span>
              <br />
              BRUTAL.
            </h1>

            <p
              className="text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: "var(--color-muted)" }}
            >
              A full-stack authentication platform built with React, Node.js, and MongoDB.
              Production-ready, brutally honest security.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-ghost">
                Sign In
              </Link>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 mt-10">
              {["React 18", "Node.js", "Express", "MongoDB", "JWT", "TailwindCSS v4"].map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2.5 py-1"
                  style={{
                    border: "1.5px solid var(--color-border)",
                    color: "var(--color-muted)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative">
            <div
              className="card-brutal p-8 relative z-10"
              style={{ background: "var(--color-ink)" }}
            >
              <div
                className="text-xs font-mono mb-6 flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
                terminal@nexus:~
              </div>
              {[
                { label: "POST /api/auth/signup", status: "201 Created", ok: true },
                { label: "POST /api/auth/login", status: "200 OK", ok: true },
                { label: "GET /api/auth/me", status: "200 OK", ok: true },
                { label: "PUT /api/auth/profile", status: "200 OK", ok: true },
                { label: "GET /api/users/stats", status: "200 OK", ok: true },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 font-mono text-sm"
                  style={{
                    borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <span>{r.label}</span>
                  <span style={{ color: r.ok ? "#86efac" : "#fca5a5" }}>{r.status}</span>
                </div>
              ))}
            </div>
            {/* Decorative offset */}
            <div
              className="absolute inset-0 translate-x-3 translate-y-3"
              style={{
                border: "2px solid var(--color-accent)",
                background: "var(--color-accent-soft)",
                zIndex: 0,
              }}
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            {
              icon: Shield,
              title: "Secure by Default",
              desc: "bcrypt hashing, JWT tokens, rate limiting, and helmet.js protection baked in.",
            },
            {
              icon: Zap,
              title: "Blazing Fast",
              desc: "Optimistic updates, instant feedback, and a React frontend that never blocks.",
            },
            {
              icon: Lock,
              title: "Real Auth Flow",
              desc: "Signup, login, profile management, password change — all production-grade.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-brutal p-6">
              <div
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{ background: "var(--color-accent)", border: "2px solid var(--color-ink)" }}
              >
                <Icon size={18} color="white" />
              </div>
              <h3 className="font-black text-lg mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 text-center"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-xs font-mono" style={{ color: "var(--color-muted)" }}>
          NEXUS AUTH — BUILT WITH REACT + EXPRESS + MONGODB — DEPLOYED ON RENDER
        </p>
      </footer>
    </div>
  );
}
