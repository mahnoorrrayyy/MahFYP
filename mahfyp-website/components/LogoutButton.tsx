"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router   = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-xs text-plum-400 hover:text-red-400 transition-colors px-3 py-1"
    >
      <LogOut size={13} />
      Sign Out
    </button>
  );
}