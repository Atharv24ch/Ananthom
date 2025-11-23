'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCsrfToken, fetchCsrfToken } from '@/lib/csrf';
import { API_URL } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PlanDetails {
  duration: string;
  title: string;
  price: number;
}

const PLAN_INFO: { [key: string]: PlanDetails } = {
  '1': { duration: '1', title: '1 Month', price: 1800 },
  '3': { duration: '3', title: '3 Months', price: 5130 },
  '6': { duration: '6', title: '6 Months', price: 9720 },
  '9': { duration: '9', title: '9 Months', price: 13770 },
  '12': { duration: '12', title: '12 Months', price: 17280 },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<PlanDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCsrfToken();

    const duration = searchParams.get('duration');
    if (duration && PLAN_INFO[duration]) {
      setPlan(PLAN_INFO[duration]);
    } else {
      router.push('/subscribe');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!plan) return;

    setIsProcessing(true);
    setError('');

    try {
      // Create order on backend
      const csrfToken = getCsrfToken();
      const orderResponse = await fetch(`${API_URL}/auth/payment/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          duration: plan.duration,
          amount: plan.price,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'HighOnChem',
        description: `Subscription - ${plan.title}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Verify payment on backend
            try {
            const verifyResponse = await fetch(`${API_URL}/auth/payment/verify/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken() || '',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                duration: plan.duration,
              }),
            });

            if (verifyResponse.ok) {
              router.push('/profile?subscribed=true');
            } else {
              setError('Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification error');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: orderData.user_name || '',
          email: orderData.user_email || '',
        },
        theme: {
          color: '#D97706',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError('Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Complete Payment</h1>
          <p className="text-gray-300">You're almost there!</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subscription Plan</span>
              <span className="font-semibold text-gray-900">{plan.title}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold text-gray-900">{plan.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per month</span>
              <span className="font-semibold text-gray-900">
                ₹{Math.round(plan.price / parseInt(plan.duration)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-gray-900">Total Amount</span>
            <span className="text-3xl font-bold text-amber-600">
              ₹{plan.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white py-4 rounded-lg font-bold text-lg hover:from-amber-700 hover:to-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
            </button>

            <button
              onClick={() => router.push('/subscribe')}
              disabled={isProcessing}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Change Plan
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure Payment
          </h3>
          <p className="text-gray-300 text-sm">
            Your payment information is encrypted and secure. We use Razorpay for safe and reliable payment processing.
          </p>
        </div>
      </div>
    </div>
  );
}
