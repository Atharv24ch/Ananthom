'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    addToCart(product);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

  if (quantity === 0) {
    return (
      <button
        onClick={handleAddToCart}
        className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-gray-200 rounded-lg px-4 py-2 border border-gray-300">
        <button
          onClick={handleDecrement}
          className="text-gray-900 font-bold text-2xl hover:text-gray-600 w-10 h-10 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition-colors"
        >
          −
        </button>
        <span className="font-bold text-xl min-w-[3rem] text-center text-gray-900">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="text-gray-900 font-bold text-2xl hover:text-gray-600 w-10 h-10 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition-colors"
        >
          +
        </button>
      </div>
      <span className="text-gray-900 font-semibold">in cart</span>
    </div>
  );
}
