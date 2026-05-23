"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Loader } from "lucide-react";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
);

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

type Period = "daily" | "weekly" | "monthly";

function groupOrders(orders: Order[], period: Period) {
  const groups: Record<string, { label: string; revenue: number; orders: number }> = {};

  orders.forEach((order) => {
    if (order.status === "rejected") return;
    const date = new Date(order.created_at);
    let key = "";

    if (period === "daily") {
      key = date.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
    } else if (period === "weekly") {
      const week = Math.ceil(date.getDate() / 7);
      key = `W${week} ${date.toLocaleDateString("en-PK", { month: "short" })}`;
    } else {
      key = date.toLocaleDateString("en-PK", { month: "short", year: "numeric" });
    }

    if (!groups[key]) groups[key] = { label: key, revenue: 0, orders: 0 };
    groups[key].revenue += order.total_amount;
    groups[key].orders += 1;
  });

  return Object.values(groups).slice(-12);
}

export default function AnalyticsPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState<Period>("monthly");

  useEffect(() => {
    adminSupabase
      .from("orders")
      .select("id, total_amount, status, created_at")
      .order("created_at")
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  }, []);

  const chartData = groupOrders(orders, period);

  const totalRevenue = orders
    .filter((o) => o.status !== "rejected")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const totalOrders   = orders.length;
  const delivered     = orders.filter((o) => o.status === "delivered").length;
  const pending       = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-plum-900 mb-8">Analytics</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="animate-spin text-plum-400" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue",  value: `PKR ${totalRevenue.toLocaleString()}`, color: "text-plum-900" },
              { label: "Total Orders",   value: totalOrders,                            color: "text-blue-700"  },
              { label: "Delivered",      value: delivered,                              color: "text-emerald-700" },
              { label: "Pending",        value: pending,                                color: "text-amber-700" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-plum-100 p-5">
                <p className="text-xs text-plum-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Period filter */}
          <div className="flex gap-2 mb-6">
            {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-sm font-medium px-4 py-2 rounded-full border capitalize transition-all ${
                  period === p
                    ? "bg-plum-700 text-white border-plum-700"
                    : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="bg-white rounded-2xl border border-plum-100 p-6 mb-6">
            <h2 className="font-semibold text-plum-900 mb-4">Revenue</h2>
            {chartData.length === 0 ? (
              <p className="text-plum-400 text-sm text-center py-10">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e2ec" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a0527e" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#a0527e" }} />
                  <Tooltip
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #f0e2ec" }}
                  />
                  <Bar dataKey="revenue" fill="#6e2b55" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Orders chart */}
          <div className="bg-white rounded-2xl border border-plum-100 p-6">
            <h2 className="font-semibold text-plum-900 mb-4">Number of Orders</h2>
            {chartData.length === 0 ? (
              <p className="text-plum-400 text-sm text-center py-10">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e2ec" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a0527e" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#a0527e" }} />
                  <Tooltip
                    formatter={(value: number) => [value, "Orders"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #f0e2ec" }}
                  />
                  <Line dataKey="orders" stroke="#c9956c" strokeWidth={2} dot={{ fill: "#c9956c" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}