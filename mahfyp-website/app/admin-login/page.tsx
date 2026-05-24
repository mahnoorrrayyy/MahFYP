"use client";
import { useState } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { Loader, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-plum-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl">

        <div className="text-center mb-8">
          <img src="/logo.png" alt="MahMetics" className="h-8 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-plum-900">Admin Login</h1>
          <p className="text-sm text-plum-400 mt-1">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-plum-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mahmetics.store"
              required
              className="w-full border border-plum-200 rounded-xl px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-plum-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-plum-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-plum-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-plum-700 text-white font-medium py-3 rounded-xl hover:bg-plum-900 transition-colors disabled:opacity-60 mt-2"
          >
            {loading && <Loader size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}