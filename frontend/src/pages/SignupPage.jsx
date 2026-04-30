import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const passwordRules = [
  { test: (p) => p.length >= 6, label: "At least 6 characters" },
  { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p) => /[0-9]/.test(p), label: "One number" },
];

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const data = await signup(form.name, form.email, form.password);
      toast.success(data.message || "Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allRulesMet = passwordRules.every((r) => r.test(form.password));

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 page-enter"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="block text-center text-3xl font-black tracking-tighter mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          NX<span style={{ color: "var(--color-accent)" }}>.</span>
        </Link>

        <div className="card-brutal p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight">Create account.</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
              Join Nexus. Takes less than a minute.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-brutal"
                placeholder="Your Name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-brutal"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-brutal pr-12"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPass(!showPass)}
                  style={{ color: "var(--color-muted)" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password rules */}
              {form.password && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {passwordRules.map(({ test, label }) => {
                    const ok = test(form.password);
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-2 text-xs font-mono"
                        style={{ color: ok ? "var(--color-success)" : "var(--color-muted)" }}
                      >
                        <Check size={12} strokeWidth={ok ? 3 : 1} />
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !allRulesMet}
              className="btn-primary flex items-center justify-center gap-2 w-full mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-muted)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold underline"
              style={{ color: "var(--color-ink)" }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
