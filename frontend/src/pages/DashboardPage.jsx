import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Users, UserCheck, TrendingUp, Clock, Calendar } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/stats")
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    api
      .get("/users?limit=6")
      .then((r) => setMembers(r.data.data.users))
      .catch(() => {})
      .finally(() => setMembersLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Welcome header */}
      <div className="mb-10">
        <p
          className="text-xs font-mono uppercase tracking-widest mb-2"
          style={{ color: "var(--color-muted)" }}
        >
          Dashboard
        </p>
        <h1 className="text-4xl font-black tracking-tight">
          Welcome back,{" "}
          <span style={{ color: "var(--color-accent)" }}>
            {user?.name?.split(" ")[0]}
          </span>
          .
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Here's what's happening on Nexus today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon={Users}
          label="Total Members"
          value={statsLoading ? "—" : stats?.totalUsers ?? 0}
          accent={false}
        />
        <StatCard
          icon={TrendingUp}
          label="New This Week"
          value={statsLoading ? "—" : stats?.newThisWeek ?? 0}
          accent={true}
        />
        <StatCard
          icon={UserCheck}
          label="Joined Today"
          value={statsLoading ? "—" : stats?.newToday ?? 0}
          accent={false}
        />
      </div>

      {/* User info + members grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your profile card */}
        <div className="card-brutal p-6">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-5"
            style={{ color: "var(--color-muted)" }}
          >
            Your Profile
          </p>

          <div
            className="w-16 h-16 flex items-center justify-center text-xl font-black mb-4"
            style={{
              background: "var(--color-accent)",
              border: "2px solid var(--color-ink)",
              color: "white",
              boxShadow: "var(--shadow-brutal-sm)",
            }}
          >
            {getInitials(user?.name)}
          </div>

          <h2 className="text-xl font-black">{user?.name}</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            {user?.email}
          </p>

          {user?.bio && (
            <p
              className="text-sm mt-3 p-3 leading-relaxed"
              style={{
                background: "var(--color-surface-alt)",
                border: "1.5px solid var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              {user.bio}
            </p>
          )}

          <div className="mt-4 pt-4" style={{ borderTop: "1.5px solid var(--color-border)" }}>
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--color-muted)" }}>
              <Calendar size={12} />
              Joined {formatDate(user?.createdAt)}
            </div>
            {user?.lastLogin && (
              <div className="flex items-center gap-2 text-xs font-mono mt-1.5" style={{ color: "var(--color-muted)" }}>
                <Clock size={12} />
                Last login {formatDate(user.lastLogin)}
              </div>
            )}
          </div>
        </div>

        {/* Members list */}
        <div className="card-brutal p-6 lg:col-span-2">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-5"
            style={{ color: "var(--color-muted)" }}
          >
            Recent Members
          </p>

          {membersLoading ? (
            <div className="flex items-center justify-center h-32">
              <div
                className="w-6 h-6 border-2 animate-spin"
                style={{
                  borderColor: "var(--color-border)",
                  borderTopColor: "var(--color-accent)",
                }}
              />
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              No members found.
            </p>
          ) : (
            <div className="flex flex-col gap-0">
              {members.map((m, i) => (
                <div
                  key={m._id}
                  className="flex items-center gap-4 py-3"
                  style={{
                    borderBottom:
                      i < members.length - 1
                        ? "1.5px solid var(--color-border)"
                        : "none",
                  }}
                >
                  <div
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-xs font-black"
                    style={{
                      background:
                        m._id === user?._id
                          ? "var(--color-accent)"
                          : "var(--color-ink)",
                      border: "1.5px solid var(--color-ink)",
                      color: "white",
                    }}
                  >
                    {getInitials(m.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {m.name}
                      {m._id === user?._id && (
                        <span
                          className="ml-2 text-xs font-mono px-1.5 py-0.5"
                          style={{
                            background: "var(--color-accent-soft)",
                            color: "var(--color-accent)",
                            border: "1px solid var(--color-accent)",
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </p>
                    <p
                      className="text-xs font-mono truncate"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {m.email}
                    </p>
                  </div>
                  <p
                    className="text-xs font-mono flex-shrink-0 hidden sm:block"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {formatDate(m.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card-brutal p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 flex items-center justify-center"
          style={{
            background: accent ? "var(--color-accent)" : "var(--color-ink)",
            border: "2px solid var(--color-ink)",
          }}
        >
          <Icon size={16} color="white" />
        </div>
      </div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
        {label}
      </p>
    </div>
  );
}
