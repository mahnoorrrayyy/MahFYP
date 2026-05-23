"use client";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type Props = {
  id: string;
  product_name: string;
  brand_name: string;
  price: number;
  image_url: string;
};

export default function AddToCartButton({ id, product_name, brand_name, price, image_url }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, product_name, brand_name, price, image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-all ${
        added
          ? "bg-emerald-600 text-white"
          : "bg-plum-700 text-white hover:bg-plum-900"
      }`}
    >
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}