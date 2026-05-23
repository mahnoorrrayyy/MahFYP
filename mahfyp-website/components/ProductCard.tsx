import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const concerns = product.concerns_str
    ? product.concerns_str.split(",").slice(0, 2).map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-plum-100 overflow-hidden hover:border-plum-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Product image */}
      <div className="aspect-square bg-plum-50 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package size={32} className="text-plum-200" />
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-xs font-medium text-plum-500 bg-plum-50 px-2 py-0.5 rounded-full self-start">
          {product.brand_name}
        </span>

        <h3 className="text-sm font-semibold text-plum-900 leading-snug line-clamp-2 flex-1 group-hover:text-plum-700 transition-colors">
          {product.product_name}
        </h3>

        {concerns.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {concerns.map((c) => (
              <span key={c} className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full capitalize">
                {c.replace("_", " ")}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          {product.price ? (
            <span className="text-sm font-bold text-plum-700">PKR {product.price}</span>
          ) : (
            <span className="text-xs text-plum-400">Price unavailable</span>
          )}
          <span className="text-xs font-medium text-plum-500 group-hover:text-plum-700 group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}