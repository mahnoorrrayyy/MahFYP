import { supabase } from "@/lib/supabase";
import { Package } from "lucide-react";
import type { Product } from "@/lib/types";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import TransparencyDisclosure from "@/components/TransparencyDisclosure";

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Product;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold text-plum-900">Product not found</h1>
        <Link href="/products" className="text-plum-700 hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  const concerns = product.concerns_str && product.concerns_str !== "Not Found"
    ? product.concerns_str.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const ingredients = product.ingredients && product.ingredients !== "Not Found"
    ? product.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
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
            {product.image_url ? (
              <img
                src={product.image_url}
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

            {product.price && (
              <div className="text-2xl font-bold text-plum-700">
                PKR {product.price}
              </div>
            )}

            {concerns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {concerns.map((c) => (
                  <span
                    key={c}
                    className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full capitalize"
                  >
                    {c.replace("_", " ")}
                  </span>
                ))}
              </div>
            )}

            {/* Buy options */}
            <div className="bg-white rounded-2xl border border-plum-100 p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-plum-900 text-sm">Where to buy</h3>

              <AddToCartButton
  id={product.id}
  product_name={product.product_name}
  brand_name={product.brand_name || ""}
  price={parseFloat(product.price || "0")}
  image_url={product.image_url || ""}
/>

              <Link
                href={product.url || "#"}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 border border-plum-200 text-plum-700 font-medium py-3 rounded-xl hover:bg-plum-50 transition-colors"
              >
                Buy from {product.brand_name} directly
              </Link>

              <p className="text-xs text-plum-400 text-center">
                If out of stock, use the brand link above for other buying options.
              </p>
            </div>

          </div>
        </div>

        {/* Ingredients */}
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
        {/* Transparency disclosures */}
          <div className="mt-6">
            <TransparencyDisclosure
              allergens={
                Array.isArray(product.allergens)
                  ? product.allergens
                  : typeof product.allergens === "string"
                  ? JSON.parse(product.allergens || "[]")
                  : []
              }
              cscpFlags={
                Array.isArray(product.cscp_flags)
                  ? product.cscp_flags
                  : typeof product.cscp_flags === "string"
                  ? JSON.parse(product.cscp_flags || "[]")
                  : []
              }
              pregnancyFlag={product.pregnancy_flag || false}
              compact={false}
            />
          </div>

      </div>
    </div>
  );
}