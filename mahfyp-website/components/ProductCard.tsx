import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const concerns = product.concerns_str
    ? product.concerns_str.split(",").slice(0, 2).map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-plum-100 p-5 hover:border-plum-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Brand */}
      <span className="text-xs font-medium text-plum-500 bg-plum-50 px-2.5 py-1 rounded-full self-start mb-3">
        {product.brand_name}
      </span>

      {/* Name */}
      <h3 className="text-sm font-semibold text-plum-900 leading-snug line-clamp-2 flex-1 group-hover:text-plum-700 transition-colors mb-3">
        {product.product_name}
      </h3>

      {/* Concern tags */}
      {concerns.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {concerns.map((c) => (
            <span key={c} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full capitalize">
              {c.replace("_", " ")}
            </span>
          ))}
        </div>
      )}

      <span className="text-xs font-medium text-plum-700 group-hover:underline">
        View details →
      </span>
    </Link>
  );
}