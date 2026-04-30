import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Save, Key, User, Calendar, Clock } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  const formatDate = (d) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("Name is required.");
    setProfileLoading(true);
    try {
      const data = await updateProfile(profileForm);
      toast.success(data.message || "Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (!passForm.currentPassword || !passForm.newPassword) {
      return toast.error("Please fill in all password fields.");
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    if (passForm.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.");
    }
    setPassLoading(true);
    try {
      const data = await changePassword(passForm.currentPassword, passForm.newPassword);
      toast.success(data.message || "Password changed!");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Header */}
      <div className="mb-10">
        <p
          className="text-xs font-mono uppercase tracking-widest mb-2"
          style={{ color: "var(--color-muted)" }}
        >
          Settings
        </p>
        <h1 className="text-4xl font-black tracking-tight">Your Profile.</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile overview */}
        <div className="card-brutal p-6 h-fit">
          <div
            className="w-20 h-20 flex items-center justify-center text-2xl font-black mb-4 mx-auto"
            style={{
              background: "var(--color-accent)",
              border: "2px solid var(--color-ink)",
              boxShadow: "var(--shadow-brutal-sm)",
              color: "white",
            }}
          >
            {getInitials(user?.name)}
          </div>
          <h2 className="text-lg font-black text-center">{user?.name}</h2>
          <p
            className="text-sm text-center font-mono mt-1"
            style={{ color: "var(--color-muted)" }}
          >
            {user?.email}
          </p>

          <div
            className="mt-5 pt-4 flex flex-col gap-2.5"
            style={{ borderTop: "1.5px solid var(--color-border)" }}
          >
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--color-muted)" }}>
              <Calendar size={11} />
              Joined {formatDate(user?.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--color-muted)" }}>
              <Clock size={11} />
              Last login {formatDate(user?.lastLogin)}
            </div>
          </div>

          <div
            className="mt-4 text-center text-xs font-mono px-2 py-1"
            style={{
              background: "var(--color-surface-alt)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            ROLE: {user?.role?.toUpperCase()}
          </div>
        </div>

        {/* Edit forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Edit profile */}
          <div className="card-brutal p-6">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: "var(--color-ink)", border: "1.5px solid var(--color-ink)" }}
              >
                <User size={13} color="white" />
              </div>
              <h2 className="font-black text-lg">Edit Profile</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--color-ink)" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="input-brutal"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--color-ink)" }}
                >
                  Bio{" "}
                  <span className="font-normal normal-case tracking-normal" style={{ color: "var(--color-muted)" }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  className="input-brutal resize-none"
                  style={{ minHeight: "80px" }}
                  placeholder="Tell us a bit about yourself…"
                  maxLength={200}
                />
                <p
                  className="text-xs font-mono mt-1 text-right"
                  style={{ color: "var(--color-muted)" }}
                >
                  {profileForm.bio.length}/200
                </p>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="btn-primary flex items-center gap-2 self-start"
              >
                {profileLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="card-brutal p-6">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: "var(--color-accent)", border: "1.5px solid var(--color-ink)" }}
              >
                <Key size={13} color="white" />
              </div>
              <h2 className="font-black text-lg">Change Password</h2>
            </div>

            <form onSubmit={handlePassSubmit} className="flex flex-col gap-5">
              {[
                { label: "Current Password", key: "currentPassword", ph: "••••••••" },
                { label: "New Password", key: "newPassword", ph: "Min. 6 characters" },
                { label: "Confirm New Password", key: "confirmPassword", ph: "Repeat new password" },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label
                    className="block text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passForm[key]}
                    onChange={(e) =>
                      setPassForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="input-brutal"
                    placeholder={ph}
                    autoComplete="off"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={passLoading}
                className="btn-ghost flex items-center gap-2 self-start"
              >
                {passLoading ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: "var(--color-ink)", borderTopColor: "transparent" }}
                    />
                    Changing...
                  </>
                ) : (
                  <>
                    <Key size={14} /> Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
