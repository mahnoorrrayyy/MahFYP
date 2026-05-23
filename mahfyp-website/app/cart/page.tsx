"use client";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={48} className="text-plum-200" />
        <h1 className="text-2xl font-semibold text-plum-900">Your cart is empty</h1>
        <p className="text-plum-500 text-sm">Add some products to get started</p>
        <Link
          href="/products"
          className="bg-plum-700 text-white px-6 py-3 rounded-full font-medium hover:bg-plum-900 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <h1 className="text-3xl font-semibold text-plum-900 mb-8">
          Your Cart ({count} {count === 1 ? "item" : "items"})
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Items */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-plum-100 p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-plum-50 rounded-xl overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-plum-200">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-plum-500 mb-0.5">{item.brand_name}</p>
                  <p className="text-sm font-semibold text-plum-900 line-clamp-2">{item.product_name}</p>
                  <p className="text-sm font-bold text-plum-700 mt-1">PKR {item.price}</p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2 border border-plum-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-plum-500 hover:text-plum-900"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium text-plum-900 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-plum-500 hover:text-plum-900"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-plum-500">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-plum-100 p-6 sticky top-20">
              <h2 className="font-semibold text-plum-900 mb-4">Order Summary</h2>

              <div className="flex justify-between text-sm text-plum-600 mb-2">
                <span>Subtotal ({count} items)</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-plum-600 mb-4">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>

              <div className="border-t border-plum-100 pt-4 flex justify-between font-bold text-plum-900 mb-6">
                <span>Total</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 text-center font-medium">
                💵 Cash on Delivery only
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center bg-plum-700 text-white font-semibold py-3 rounded-xl hover:bg-plum-900 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full flex items-center justify-center text-plum-600 text-sm mt-3 hover:text-plum-900"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}