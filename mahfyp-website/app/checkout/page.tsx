"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
);

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_city: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.customer_address || !form.customer_city) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          ...form,
          total_amount: total,
          payment_method: "cod",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.product_name,
        brand_name: item.brand_name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw new Error(itemsError.message);

      clearCart();
      router.push(`/order-success?id=${order.id}`);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <h1 className="text-3xl font-semibold text-plum-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 flex flex-col gap-5">

            <div className="bg-white rounded-2xl border border-plum-100 p-6">
              <h2 className="font-semibold text-plum-900 mb-4">Delivery Information</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-plum-700 block mb-1">Full Name *</label>
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full border border-plum-200 rounded-xl px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-plum-700 block mb-1">Phone Number *</label>
                  <input
                    name="customer_phone"
                    value={form.customer_phone}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                    className="w-full border border-plum-200 rounded-xl px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-plum-700 block mb-1">City *</label>
                  <input
                    name="customer_city"
                    value={form.customer_city}
                    onChange={handleChange}
                    placeholder="Lahore, Karachi, Islamabad..."
                    className="w-full border border-plum-200 rounded-xl px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-plum-700 block mb-1">Full Address *</label>
                  <input
                    name="customer_address"
                    value={form.customer_address}
                    onChange={handleChange}
                    placeholder="House no., street, area"
                    className="w-full border border-plum-200 rounded-xl px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:border-plum-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-plum-700 block mb-1">Order Notes (optional)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="w-full border border-plum-200 rounded-xl px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:border-plum-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-plum-700 text-white font-semibold py-4 rounded-xl hover:bg-plum-900 transition-colors disabled:opacity-60"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Placing Order..." : "Place Order — Cash on Delivery"}
            </button>
          </form>

          {/* Order summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-plum-100 p-6 sticky top-20">
              <h2 className="font-semibold text-plum-900 mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-plum-50 rounded-lg overflow-hidden shrink-0">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-plum-900 font-medium line-clamp-1">{item.product_name}</p>
                      <p className="text-xs text-plum-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-plum-700 shrink-0">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-plum-100 pt-4 flex justify-between font-bold text-plum-900">
                <span>Total</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>

              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-center">
                💵 Cash on Delivery
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}