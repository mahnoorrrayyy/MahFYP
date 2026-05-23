"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader, ChevronDown, ChevronUp } from "lucide-react";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
);

type OrderItem = {
  id: string;
  product_name: string;
  brand_name: string;
  price: number;
  quantity: number;
  image_url: string;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  total_amount: number;
  status: string;
  payment_method: string;
  notes: string;
  created_at: string;
  order_items?: OrderItem[];
};

const STATUS_OPTIONS = ["pending", "approved", "shipped", "delivered", "rejected"];

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-800",
  approved:  "bg-blue-100 text-blue-800",
  shipped:   "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  rejected:  "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [filter, setFilter]         = useState("all");
  const [updating, setUpdating]     = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await adminSupabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    await adminSupabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setUpdating(null);
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-plum-900">Orders</h1>
          <p className="text-plum-500 text-sm mt-1">{filtered.length} orders</p>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all ${
                filter === s
                  ? "bg-plum-700 text-white border-plum-700"
                  : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="animate-spin text-plum-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-plum-100">
          <p className="text-plum-400">No orders found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-plum-100 overflow-hidden">

              {/* Order header */}
              <div className="p-5 flex flex-wrap items-center gap-4">

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-plum-400 font-mono">
                      #{order.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="font-semibold text-plum-900">{order.customer_name}</p>
                  <p className="text-sm text-plum-500">{order.customer_phone} · {order.customer_city}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-plum-900">PKR {order.total_amount.toLocaleString()}</p>
                  <p className="text-xs text-plum-400">
                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>

                {/* Status update */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className="text-xs border border-plum-200 rounded-lg px-2 py-1.5 text-plum-700 focus:outline-none focus:border-plum-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="text-plum-400 hover:text-plum-700 p-1"
                  >
                    {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t border-plum-100 p-5 bg-plum-50">

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-plum-500 mb-1">Delivery Address</p>
                      <p className="text-sm text-plum-900">{order.customer_address}, {order.customer_city}</p>
                    </div>
                    {order.notes && (
                      <div>
                        <p className="text-xs font-medium text-plum-500 mb-1">Notes</p>
                        <p className="text-sm text-plum-900">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-medium text-plum-500 mb-3">Order Items</p>
                  <div className="flex flex-col gap-2">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-plum-900 line-clamp-1">{item.product_name}</p>
                          <p className="text-xs text-plum-500">{item.brand_name} · Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-plum-700 shrink-0">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}