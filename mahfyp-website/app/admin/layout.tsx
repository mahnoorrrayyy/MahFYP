import Link from "next/link";
import { BarChart2, Package, Upload, Users, LogOut } from "lucide-react";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin-login");

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "moderator";

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Sidebar */}
      <aside className="w-56 bg-plum-900 text-white shrink-0 flex flex-col">
        <div className="p-5 border-b border-plum-700">
          <img src="/logo.png" alt="MahMetics" className="h-6 w-auto mb-3 opacity-90" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-plum-700 rounded-full flex items-center justify-center text-xs font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white font-medium truncate">{user.email}</p>
              <p className="text-xs text-plum-400 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {[
            { href: "/admin",           icon: <Upload size={15} />,    label: "Upload Products" },
            { href: "/admin/orders",    icon: <Package size={15} />,   label: "Orders"          },
            { href: "/admin/analytics", icon: <BarChart2 size={15} />, label: "Analytics"       },
            { href: "/admin/team",      icon: <Users size={15} />,     label: "Manage Admins"   },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-plum-200 hover:bg-plum-700 hover:text-white transition-all"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-plum-700 flex flex-col gap-2">
          <Link href="/" className="text-xs text-plum-400 hover:text-white px-3 py-1">
            ← Back to website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Pass role via data attribute for client components */}
      <div className="flex-1 overflow-auto" data-role={role}>
        {children}
      </div>

    </div>
  );
}