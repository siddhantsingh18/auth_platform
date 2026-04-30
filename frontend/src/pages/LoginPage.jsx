import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(data.message || "Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 page-enter"
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
            <h1 className="text-2xl font-black tracking-tight">Welcome back.</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
              Sign in to your Nexus account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 w-full mt-2"
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-muted)" }}>
            No account?{" "}
            <Link
              to="/signup"
              className="font-bold underline"
              style={{ color: "var(--color-ink)" }}
            >
              Sign up →
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div
          className="mt-4 p-3 text-xs font-mono"
          style={{
            border: "1.5px dashed var(--color-border)",
            color: "var(--color-muted)",
            background: "var(--color-surface-alt)",
          }}
        >
          Create an account via the signup page to get started.
        </div>
      </div>
    </div>
  );
}
