import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-md mx-auto px-5 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>

        <h1 className="text-3xl font-semibold text-plum-900 mb-3">Order Placed!</h1>
        <p className="text-plum-500 mb-2">
          Thank you for your order. We&apos;ll contact you on your phone number to confirm delivery.
        </p>

        {searchParams.id && (
          <p className="text-xs text-plum-400 mb-8 font-mono bg-plum-50 px-3 py-2 rounded-lg">
            Order ID: {searchParams.id}
          </p>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-sm text-amber-800">
          <p className="font-semibold mb-1">💵 Cash on Delivery</p>
          <p>Please keep the exact amount ready at the time of delivery.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="bg-plum-700 text-white font-medium py-3 rounded-xl hover:bg-plum-900 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="text-plum-600 text-sm hover:text-plum-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}