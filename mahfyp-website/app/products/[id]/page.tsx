import { supabase } from "@/lib/supabase";
import { ExternalLink, ShoppingCart, Package } from "lucide-react";
import type { Product } from "@/lib/types";
import Link from "next/link";

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold text-plum-900">Product not found</h1>
        <Link href="/products" className="text-plum-700 hover:underline mt-4 inline-block">← Back to products</Link>
      </div>
    );
  }

  const concerns = product.concerns_str
    ? product.concerns_str.split(",").map(c => c.trim()).filter(Boolean)
    : [];

  const ingredients = product.ingredients !== "Not Found"
    ? product.ingredients.split(",").map(i => i.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Breadcrumb */}
        <div className="text-sm text-plum-400 mb-8">
          <Link href="/" className="hover:text-plum-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-plum-700">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-plum-700">{product.product_name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Product image */}
          <div className="bg-white rounded-2xl border border-plum-100 overflow-hidden aspect-square flex items-center justify-center p-8">
            {(product as Product & { image_url?: string }).image_url ? (
              <img
                src={(product as Product & { image_url?: string }).image_url}
                alt={product.product_name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-plum-200 text-center">
                <Package size={48} className="mx-auto mb-2" />
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <span className="text-sm font-medium text-plum-500 bg-plum-50 px-3 py-1 rounded-full self-start">
              {product.brand_name}
            </span>

            <h1 className="text-2xl md:text-3xl font-semibold text-plum-900 leading-snug">
              {product.product_name}
            </h1>

            {(product as Product & { price?: string }).price && (
              <div className="text-2xl font-bold text-plum-700">
                PKR {(product as Product & { price?: string }).price}
              </div>
            )}

            {/* Concern tags */}
            {concerns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {concerns.map((c) => (
                  <span key={c} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full capitalize">
                    {c.replace("_", " ")}
                  </span>
                ))}
              </div>
            )}

            {/* Buy options */}
            <div className="bg-white rounded-2xl border border-plum-100 p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-plum-900 text-sm">Where to buy</h3>

              {/* Buy from us */}
              <button className="w-full flex items-center justify-center gap-2 bg-plum-700 text-white font-medium py-3 rounded-xl hover:bg-plum-900 transition-colors">
                <ShoppingCart size={18} />
                Add to Cart — Buy from Us
              </button>

              {/* Buy from brand */}
              
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-plum-200 text-plum-700 font-medium py-3 rounded-xl hover:bg-plum-50 transition-colors"
              >
                <ExternalLink size={16} />
                Buy from {product.brand_name} directly
              </a>

              {/* Out of stock fallback */}
              <p className="text-xs text-plum-400 text-center">
                If out of stock, use the brand link above for other buying options.
              </p>
            </div>

          </div>
        </div>

        {/* Ingredients section */}
        {ingredients.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl border border-plum-100 p-8">
            <h2 className="font-semibold text-plum-900 text-lg mb-4">Ingredients</h2>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="text-xs bg-plum-50 text-plum-700 border border-plum-100 px-3 py-1.5 rounded-full"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}