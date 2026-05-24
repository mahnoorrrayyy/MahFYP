import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">

        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>

        <h1 className="text-3xl font-semibold text-plum-900 mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-plum-500 mb-4 leading-relaxed">
          Thank you for shopping with MahMetics! We have received your order
          and will contact you shortly on your phone number to confirm delivery.
        </p>

        {params.id && (
          <p className="text-xs text-plum-400 mb-6 font-mono bg-plum-50 px-3 py-2 rounded-lg inline-block">
            Order ID: {params.id}
          </p>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-sm text-amber-800 text-left">
          <p className="font-semibold mb-2">📦 What happens next?</p>
          <ul className="space-y-1.5">
            <li>✅ Your order has been received</li>
            <li>📞 We will call you to confirm your order</li>
            <li>🚚 Your order will be dispatched after confirmation</li>
            <li>💵 Pay cash when your order arrives at your door</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="bg-plum-700 text-white font-medium py-3 rounded-xl hover:bg-plum-900 transition-colors block"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="text-plum-500 text-sm hover:text-plum-900"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}