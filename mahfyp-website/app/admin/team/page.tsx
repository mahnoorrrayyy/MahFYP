"use client";
import { useEffect, useState } from "react";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Loader, Trash2, Plus, KeyRound, Shield, ShieldAlert } from "lucide-react";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
);

type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function TeamPage() {
  const supabase = createClient();

  const [admins, setAdmins]         = useState<AdminUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [currentRole, setCurrentRole] = useState("");
  const [currentId, setCurrentId]   = useState("");

  // Add form
  const [newEmail, setNewEmail]     = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole]       = useState("moderator");
  const [adding, setAdding]         = useState(false);
  const [addError, setAddError]     = useState("");

  // Change password form
  const [newPass, setNewPass]       = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg]       = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentId(user.id);

    // Get current user role
    const { data: profile } = await adminSupabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user?.id)
      .single();
    if (profile) setCurrentRole(profile.role);

    // Get all admins
    const { data } = await adminSupabase
      .from("admin_profiles")
      .select("*")
      .order("created_at");
    setAdmins((data as AdminUser[]) || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError("");

    try {
      // Create auth user
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: newEmail,
        password: newPassword,
        email_confirm: true,
      });

      if (authError) throw new Error(authError.message);

      // Add to admin_profiles
      const { error: profileError } = await adminSupabase
        .from("admin_profiles")
        .insert({ id: authData.user.id, email: newEmail, role: newRole });

      if (profileError) throw new Error(profileError.message);

      setNewEmail("");
      setNewPassword("");
      setNewRole("moderator");
      await loadData();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Failed to add admin");
    }

    setAdding(false);
  }

  async function handleDelete(admin: AdminUser) {
    if (!confirm(`Remove ${admin.email}?`)) return;

    await adminSupabase.from("admin_profiles").delete().eq("id", admin.id);
    await adminSupabase.auth.admin.deleteUser(admin.id);
    await loadData();
  }

  async function handleRoleChange(adminId: string, role: string) {
    await adminSupabase
      .from("admin_profiles")
      .update({ role })
      .eq("id", adminId);
    await loadData();
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setChangingPass(true);
    setPassMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setPassMsg(error ? error.message : "✅ Password updated successfully!");
    setNewPass("");
    setChangingPass(false);
  }

  const isAdmin = currentRole === "admin";

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-plum-900 mb-2">Manage Admins</h1>
      <p className="text-plum-500 text-sm mb-8">
        {isAdmin ? "You have full admin access." : "You have moderator access — you can view but not manage admin accounts."}
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="animate-spin text-plum-400" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">

          {/* Current admins list */}
          <div className="bg-white rounded-2xl border border-plum-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-plum-100">
              <h2 className="font-semibold text-plum-900">Admin Accounts</h2>
            </div>

            <div className="divide-y divide-plum-50">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 bg-plum-100 rounded-full flex items-center justify-center text-sm font-bold text-plum-700 shrink-0">
                    {admin.email[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-plum-900 truncate">
                      {admin.email}
                      {admin.id === currentId && (
                        <span className="ml-2 text-xs text-plum-400">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-plum-400">
                      Added {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Role badge / selector */}
                  {isAdmin && admin.id !== currentId ? (
                    <select
                      value={admin.role}
                      onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                      className="text-xs border border-plum-200 rounded-lg px-2 py-1.5 text-plum-700 focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  ) : (
                    <div className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                      admin.role === "admin"
                        ? "bg-plum-100 text-plum-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {admin.role === "admin" ? <Shield size={12} /> : <ShieldAlert size={12} />}
                      {admin.role}
                    </div>
                  )}

                  {/* Delete button — admin only, can't delete self */}
                  {isAdmin && admin.id !== currentId && (
                    <button
                      onClick={() => handleDelete(admin)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add new admin — admin only */}
          {isAdmin && (
            <div className="bg-white rounded-2xl border border-plum-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Plus size={18} className="text-plum-700" />
                <h2 className="font-semibold text-plum-900">Add New Admin</h2>
              </div>

              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-plum-600 block mb-1">Email *</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full border border-plum-200 rounded-xl px-3 py-2 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-plum-600 block mb-1">Password *</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      className="w-full border border-plum-200 rounded-xl px-3 py-2 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-plum-600 block mb-1">Role *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full border border-plum-200 rounded-xl px-3 py-2 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                    >
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {addError && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{addError}</p>
                )}

                <button
                  type="submit"
                  disabled={adding}
                  className="self-start flex items-center gap-2 bg-plum-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-plum-900 transition-colors disabled:opacity-60"
                >
                  {adding && <Loader size={14} className="animate-spin" />}
                  {adding ? "Adding..." : "Add Admin"}
                </button>
              </form>
            </div>
          )}

          {/* Change own password */}
          <div className="bg-white rounded-2xl border border-plum-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <KeyRound size={18} className="text-plum-700" />
              <h2 className="font-semibold text-plum-900">Change My Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-medium text-plum-600 block mb-1">New Password *</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full border border-plum-200 rounded-xl px-3 py-2 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                />
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="flex items-center gap-2 bg-plum-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-plum-900 transition-colors disabled:opacity-60 shrink-0"
              >
                {changingPass && <Loader size={14} className="animate-spin" />}
                Update Password
              </button>
            </form>

            {passMsg && (
              <p className={`text-xs mt-3 px-3 py-2 rounded-lg ${
                passMsg.startsWith("✅")
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-red-600 bg-red-50"
              }`}>
                {passMsg}
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}