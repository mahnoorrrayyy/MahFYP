import Link from "next/link";
import type { Product } from "@/lib/types";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const concerns = product.concerns_str
    ? product.concerns_str.split(",").slice(0, 2)
    : [];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-plum-100 p-5 hover:shadow-md hover:border-plum-200 transition flex flex-col gap-3"
    >
      {/* Brand badge */}
      <span className="text-xs font-medium text-plum-500 bg-plum-50 px-2 py-1 rounded-full self-start">
        {product.brand_name}
      </span>

      {/* Product name */}
      <h3 className="text-sm font-semibold text-plum-900 leading-snug line-clamp-2 group-hover:text-plum-700">
        {product.product_name}
      </h3>

      {/* Concern tags */}
      {concerns.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {concerns.map((c) => (
            <span
              key={c}
              className="text-xs bg-gold/10 text-amber-800 px-2 py-0.5 rounded-full"
            >
              {c.trim()}
            </span>
          ))}
        </div>
      )}

      {/* View button */}
      <div className="mt-auto text-xs font-medium text-plum-700 group-hover:underline">
        View product →
      </div>
    </Link>
  );
}