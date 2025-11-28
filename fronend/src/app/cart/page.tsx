'use client';

import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-2 py-6 md:py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Shopping Cart</h1>">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty. Start shopping to add items!</p>
            <Link
              href="/products"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-gray-700">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    {item.category && (
                      <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mt-2">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 bg-gray-200 rounded-lg px-3 py-2 border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-white text-gray-900 font-bold w-10 h-10 rounded hover:bg-gray-50 text-2xl flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold text-xl min-w-[3rem] text-center text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white text-gray-900 font-bold w-10 h-10 rounded hover:bg-gray-50 text-2xl flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700 font-medium">${item.price.toFixed(2)} each</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
