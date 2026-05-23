import Link from "next/link";
import { LayoutDashboard, Package, BarChart2, Upload } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex">

      {/* Sidebar */}
      <aside className="w-56 bg-plum-900 text-white shrink-0 flex flex-col">
        <div className="p-5 border-b border-plum-700">
          <p className="text-xs font-semibold text-plum-300 uppercase tracking-wide">Admin Panel</p>
          <p className="text-sm font-bold text-white mt-0.5">MahMetics</p>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {[
            { href: "/admin",           icon: <Upload size={16} />,       label: "Upload Products" },
            { href: "/admin/orders",    icon: <Package size={16} />,      label: "Orders" },
            { href: "/admin/analytics", icon: <BarChart2 size={16} />,    label: "Analytics" },
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

        <div className="p-4 border-t border-plum-700">
          <Link href="/" className="text-xs text-plum-400 hover:text-white">
            ← Back to website
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

    </div>
  );
}