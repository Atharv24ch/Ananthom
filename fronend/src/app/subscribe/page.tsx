'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCsrfToken, fetchCsrfToken } from '@/lib/csrf';
import { API_URL } from '@/lib/api';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface Address {
  id?: number;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  label?: string;
}

const PLANS = [
  {
    duration: '1',
    title: '1 Month',
    price: 1800,
    discount: 0,
    popular: false,
  },
  {
    duration: '3',
    title: '3 Months',
    price: 5130,
    originalPrice: 5400,
    discount: 5,
    popular: false,
  },
  {
    duration: '6',
    title: '6 Months',
    price: 9720,
    originalPrice: 10800,
    discount: 10,
    popular: false,
  },
  {
    duration: '9',
    title: '9 Months',
    price: 13770,
    originalPrice: 16200,
    discount: 15,
    popular: true,
  },
  {
    duration: '12',
    title: '12 Months',
    price: 17280,
    originalPrice: 21600,
    discount: 20,
    popular: false,
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const [pendingDuration, setPendingDuration] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    // Fetch CSRF token on component mount
    fetchCsrfToken();
    
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('deliveryAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const handleSubscribe = async (duration: string) => {
    setError('');
    setSelectedPlan(duration);
    
    if (addresses.length === 0) {
      setError('Please add at least one delivery address before subscribing');
      router.push('/products');
      return;
    }
    
    // Show address selection modal
    setPendingDuration(duration);
    setShowAddressSelection(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddress || !pendingDuration) {
      setError('Please select a delivery address');
      return;
    }

    const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
    if (!selectedAddr) return;

    try {
      setIsLoading(true);
      
      // Save selected address to backend
      const csrfToken = getCsrfToken();
      const response = await fetch(`${API_URL}/auth/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify(selectedAddr),
      });

      if (response.ok) {
        // Redirect to payment page with plan details
        router.push(`/payment?duration=${pendingDuration}`);
      } else {
        setError('Failed to save address. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-12 md:py-20 px-2 relative overflow-hidden">
      {/* Animated Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="w-full mx-auto relative z-10" ref={containerRef}>
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Select the subscription that fits your needs
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl text-center backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {PLANS.slice(0, 4).map((plan, index) => (
            <PricingCard
              key={plan.duration}
              plan={plan}
              index={index}
              isInView={isInView}
              isHovered={hoveredCard === plan.duration}
              onHover={() => setHoveredCard(plan.duration)}
              onLeave={() => setHoveredCard(null)}
              onClick={() => {
                setSelectedPlan(plan.duration);
                handleSubscribe(plan.duration);
              }}
              isLoading={isLoading && selectedPlan === plan.duration}
            />
          ))}
        </div>

        {/* 12 Months Plan - Centered */}
        <div className="flex justify-center">
          <div className="w-full md:w-1/2 lg:w-1/4">
            <PricingCard
              plan={PLANS[4]}
              index={4}
              isInView={isInView}
              isHovered={hoveredCard === PLANS[4].duration}
              onHover={() => setHoveredCard(PLANS[4].duration)}
              onLeave={() => setHoveredCard(null)}
              onClick={() => {
                setSelectedPlan(PLANS[4].duration);
                handleSubscribe(PLANS[4].duration);
              }}
              isLoading={isLoading && selectedPlan === PLANS[4].duration}
            />
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-gray-400 text-sm">
            All subscriptions auto-renew. You can cancel anytime from your profile.
          </p>
        </motion.div>
      </div>

      {/* Address Selection Modal */}
      {showAddressSelection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white px-8 py-6">
              <h3 className="text-3xl font-bold">Select Delivery Address</h3>
              <p className="text-orange-100 text-sm mt-2">Choose where you want your subscription delivered</p>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                {addresses.map((addr, index) => (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedAddress(addr.id || null)}
                    className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                      selectedAddress === addr.id
                        ? 'border-[#F97316] bg-orange-50 shadow-lg shadow-orange-500/20'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedAddress === addr.id
                            ? 'border-[#F97316] bg-[#F97316]'
                            : 'border-gray-300'
                        }`}>
                          {selectedAddress === addr.id && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                            {addr.label}
                          </span>
                        </div>
                        <p className="text-gray-900 font-semibold text-lg">{addr.address_line1}</p>
                        {addr.address_line2 && <p className="text-gray-600 text-sm mt-1">{addr.address_line2}</p>}
                        <p className="text-gray-600 text-sm mt-1">
                          {addr.city}, {addr.state} {addr.postal_code}
                        </p>
                        {addr.phone && <p className="text-gray-600 text-sm mt-1">📞 {addr.phone}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 px-8 py-6 flex gap-4 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAddressSelection(false);
                  setPendingDuration(null);
                  setSelectedAddress(null);
                }}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-white transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToPayment}
                disabled={!selectedAddress || isLoading}
                className="flex-1 bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Pricing Card Component with Premium Animations
interface PricingCardProps {
  plan: typeof PLANS[0];
  index: number;
  isInView: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  isLoading: boolean;
}

function PricingCard({ plan, index, isInView, isHovered, onHover, onLeave, onClick, isLoading }: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
    
    onClick();
  };

  const features = ['Premium Content', 'Monthly Delivery', 'Cancel Anytime'];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
    >
      <motion.div
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className={`relative bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 ${
          plan.popular ? 'border-4 border-[#F97316]' : 'border-2 border-transparent'
        } ${isHovered ? 'shadow-2xl' : ''}`}
        style={{
          boxShadow: isHovered
            ? plan.popular
              ? '0 25px 50px -12px rgba(249,115,22,0.4), 0 0 0 4px rgba(249,115,22,0.1)'
              : '0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.08)'
            : undefined
        }}
      >
        {/* Most Popular Badge */}
        {plan.popular && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <motion.span
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/30 uppercase tracking-wide"
            >
              Most Popular
            </motion.span>
          </motion.div>
        )}

        <div className="text-center">
          {/* Plan Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-2xl font-bold text-[#0F172A] mb-3"
          >
            {plan.title}
          </motion.h3>
          
          {/* Save Badge */}
          {plan.discount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="mb-3"
            >
              <motion.span
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="inline-block bg-[#D1FAE5] text-[#10B981] px-4 py-2 rounded-full text-sm font-bold"
              >
                Save {plan.discount}%
              </motion.span>
            </motion.div>
          )}

          {/* Pricing */}
          <div className="mb-8">
            {plan.originalPrice && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="text-gray-500 line-through text-lg font-medium"
              >
                ₹{plan.originalPrice.toLocaleString('en-IN')}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="text-5xl font-extrabold text-[#0F172A] mb-2"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              ₹{plan.price.toLocaleString('en-IN')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              className="text-gray-600 text-sm"
            >
              ₹{Math.round(plan.price / parseInt(plan.duration)).toLocaleString('en-IN')}/month
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            disabled={isLoading}
            className={`relative w-full py-4 rounded-xl font-bold text-base transition-all overflow-hidden ${
              plan.popular
                ? 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                : 'bg-[#1E293B] text-white hover:bg-[#0F172A] shadow-md'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* Ripple Effect */}
            {ripples.map(ripple => (
              <motion.span
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute w-full h-full bg-white rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
            <span className="relative z-10">
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </span>
          </motion.button>
        </div>

        {/* Features List */}
        <div className="mt-8 space-y-4">
          {features.map((feature, featureIndex) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1 + 0.7 + featureIndex * 0.1,
                duration: 0.4,
                ease: [0.68, -0.55, 0.265, 1.55]
              }}
              className="flex items-center text-gray-700"
            >
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.1 + 0.7 + featureIndex * 0.1,
                  type: "spring",
                  stiffness: 500,
                  damping: 15
                }}
                className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
              <span className="text-base font-medium">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
