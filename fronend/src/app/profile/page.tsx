'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { API_URL } from '@/lib/api';
import { FaCrown, FaCalendarAlt, FaCheckCircle, FaBoxOpen, FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';
import Image from 'next/image';

interface Subscription {
  id: number;
  duration: string;
  duration_display: string;
  price: string;
  start_date: string;
  end_date: string;
  status: string;
  status_display: string;
}

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

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    label: 'Home',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (searchParams.get('subscribed') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('deliveryAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/subscriptions/`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.subscriptions || []);
        }
      } catch (err) {
        console.error('Failed to fetch subscriptions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubscriptions();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const hasActiveSubscription = activeSubscriptions.length > 0;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedAddresses: Address[];
    
    if (editingAddress && editingAddress.id) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addressForm, id: editingAddress.id } : addr
      );
    } else {
      // Add new address
      const newAddress = {
        ...addressForm,
        id: Date.now(), // Simple ID generation
      };
      updatedAddresses = [...addresses, newAddress];
    }
    
    setAddresses(updatedAddresses);
    localStorage.setItem('deliveryAddresses', JSON.stringify(updatedAddresses));
    
    // Reset form
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm({
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      label: 'Home',
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (id: number) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('deliveryAddresses', JSON.stringify(updatedAddresses));
  };

  const openAddAddressModal = () => {
    setEditingAddress(null);
    setAddressForm({
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      label: 'Home',
    });
    setShowAddressModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] via-[#EFEBE9] to-[#FFF8E1]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3E2723] to-[#5D4037] border-b border-[#D4AF37]">
        <div className="container mx-auto px-2 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-[#FFF8E1] hover:text-[#D4AF37] transition-colors flex items-center gap-2 font-semibold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FF6F00] rounded-full flex items-center justify-center font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-[#FFF8E1] font-semibold hidden sm:block">{user.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 py-6 md:py-12">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 text-green-800 px-6 py-4 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-2xl text-green-600" />
              <span className="font-semibold">🎉 Subscription created successfully! Welcome to ANANTHAM family.</span>
            </div>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] rounded-3xl shadow-2xl p-8 border-4 border-[#D4AF37]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#FF6F00] rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg ring-4 ring-[#FFF8E1]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-[#FFF8E1] mb-2 flex items-center justify-center md:justify-start gap-3">
                  {user.name}
                  {hasActiveSubscription && (
                    <FaCrown className="text-[#D4AF37] text-2xl" title="Premium Member" />
                  )}
                </h1>
                <p className="text-[#D4AF37] text-lg">{user.email}</p>
                {hasActiveSubscription && (
                  <div className="mt-3 inline-block bg-gradient-to-r from-[#D4AF37] to-[#FF6F00] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ✨ Premium Member
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Status */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-[#D4AF37]"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-4"></div>
              <p className="text-[#5D4037] text-lg">Loading your subscription details...</p>
            </motion.div>
          ) : !hasActiveSubscription ? (
            /* No Subscription - Advertisement */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-white to-[#FFF8E1] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#D4AF37]"
            >
              <div className="bg-gradient-to-r from-[#FF6F00] to-[#D4AF37] p-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Start Your Wellness Journey</h2>
                <p className="text-[#FFF8E1] text-lg">Subscribe to ANANTHAM Ragi Java for daily health</p>
              </div>
              
              <div className="p-8 md:p-12">
                {/* Product Showcase */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-48 h-48 relative"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#7CB342]/20 to-[#D4AF37]/20 rounded-full absolute blur-2xl"></div>
                    <div className="w-full h-full relative flex items-center justify-center">
                      <GiWheat className="text-9xl text-[#7CB342]" />
                    </div>
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#3E2723] mb-4">Why Subscribe?</h3>
                    <div className="space-y-4">
                      {[
                        { icon: '🌾', text: 'Pure Ragi (Finger Millet) - Rich in calcium & iron' },
                        { icon: '🥛', text: 'Fresh daily delivery before 8 AM' },
                        { icon: '💪', text: 'Boosts energy & strengthens bones' },
                        { icon: '👨‍👩‍👧‍👦', text: 'Perfect for all ages - children to seniors' },
                        { icon: '💰', text: 'Save up to 20% with longer subscriptions' },
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 text-[#5D4037]"
                        >
                          <span className="text-2xl">{benefit.icon}</span>
                          <span className="font-medium">{benefit.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/subscribe')}
                    className="bg-gradient-to-r from-[#FF6F00] to-[#D4AF37] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaCrown />
                    Subscribe Now
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/products')}
                    className="border-2 border-[#5D4037] text-[#5D4037] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#5D4037] hover:text-white transition-all"
                  >
                    Learn More
                  </motion.button>
                </div>

                {/* Pricing Preview */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[#7CB342]/10 to-[#D4AF37]/10 rounded-2xl border-2 border-[#D4AF37]/30">
                  <p className="text-center text-[#5D4037] mb-4 font-semibold">Popular Plans Starting From:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { duration: '1 Month', price: '₹1,800' },
                      { duration: '3 Months', price: '₹5,130', badge: 'Save 5%' },
                      { duration: '6 Months', price: '₹9,720', badge: 'Save 10%' },
                      { duration: '9 Months', price: '₹13,770', badge: 'Save 15%' },
                    ].map((plan, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md">
                        <div className="text-sm text-[#5D4037] font-semibold mb-1">{plan.duration}</div>
                        <div className="text-lg font-bold text-[#3E2723]">{plan.price}</div>
                        {plan.badge && (
                          <div className="text-xs text-green-600 font-semibold mt-1">{plan.badge}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Active Subscriptions */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-[#3E2723] mb-6 flex items-center gap-3">
                <FaBoxOpen className="text-[#D4AF37]" />
                Your Active Subscriptions
              </h2>

              {activeSubscriptions.map((subscription, index) => {
                const startDate = new Date(subscription.start_date);
                const endDate = new Date(subscription.end_date);
                const today = new Date();
                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const progressPercent = Math.max(0, Math.min(100, ((totalDays - remainingDays) / totalDays) * 100));

                return (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#D4AF37]"
                  >
                    {/* Subscription Header */}
                    <div className="bg-gradient-to-r from-[#7CB342] to-[#7CB342]/80 p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            <FaCrown className="text-[#FBBF24]" />
                            {subscription.duration_display} Plan
                          </h3>
                          <p className="text-white/90 text-lg">₹{parseFloat(subscription.price).toLocaleString('en-IN')}</p>
                        </div>
                        <span className="bg-white text-[#7CB342] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          ✓ {subscription.status_display}
                        </span>
                      </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="p-8">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="text-[#D4AF37] text-xl mt-1" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Start Date</div>
                            <div className="font-semibold text-[#3E2723]">{startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="text-[#FF6F00] text-xl mt-1" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">End Date</div>
                            <div className="font-semibold text-[#3E2723]">{endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Subscription Progress</span>
                          <span className="font-semibold text-[#5D4037]">{remainingDays} days remaining</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#7CB342] to-[#D4AF37] rounded-full"
                          />
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="bg-gradient-to-r from-[#FFF8E1] to-[#EFEBE9] rounded-2xl p-6">
                        <h4 className="font-bold text-[#3E2723] mb-4">Your Benefits</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            '🌅 Daily delivery before 8 AM',
                            '🌾 Premium quality Ragi Java',
                            '💝 Traditional wellness recipe',
                            '🔄 Auto-renewal available',
                          ].map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[#5D4037]">
                              <FaCheckCircle className="text-[#7CB342] flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Renew/Add More */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] rounded-3xl p-8 text-center border-4 border-[#D4AF37]"
              >
                <h3 className="text-2xl font-bold text-[#FFF8E1] mb-4">Want to extend or add more?</h3>
                <p className="text-[#D4AF37] mb-6">Save up to 20% with longer subscription plans</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/subscribe')}
                  className="bg-gradient-to-r from-[#FF6F00] to-[#D4AF37] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all"
                >
                  Add New Subscription
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Delivery Addresses Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-8 border-4 border-[#D4AF37]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#3E2723] flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#D4AF37]" />
                Delivery Addresses
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddAddressModal}
                className="bg-gradient-to-r from-[#7CB342] to-[#7CB342]/80 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <FaPlus />
                Add Address
              </motion.button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-r from-[#FFF8E1] to-[#EFEBE9] rounded-2xl">
                <FaMapMarkerAlt className="text-6xl text-[#D4AF37] mx-auto mb-4" />
                <p className="text-[#5D4037] text-lg mb-4">No delivery addresses added yet</p>
                <p className="text-gray-600 text-sm">Add an address to receive your subscription</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-2 border-[#D4AF37]/30 rounded-2xl p-5 bg-gradient-to-br from-white to-[#FFF8E1]/30 hover:border-[#D4AF37] transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-gradient-to-r from-[#D4AF37] to-[#FF6F00] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                        {address.label}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-[#5D4037] hover:text-[#D4AF37] transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => address.id && handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[#3E2723]">
                      <p className="font-semibold mb-1">{address.address_line1}</p>
                      {address.address_line2 && <p className="text-sm mb-1">{address.address_line2}</p>}
                      <p className="text-sm">{address.city}, {address.state} {address.postal_code}</p>
                      {address.phone && <p className="text-sm mt-2 text-gray-600">📞 {address.phone}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Add/Edit Address Modal */}
      {showAddressModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddressModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] text-white px-8 py-6">
              <h3 className="text-3xl font-bold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <p className="text-[#D4AF37] text-sm mt-2">Enter your delivery details</p>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-8">
              <div className="space-y-4">
                {/* Label */}
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Address Label *</label>
                  <select
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={addressForm.address_line1}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    placeholder="Street address, P.O. box"
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={addressForm.address_line2}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3E2723] mb-2">City *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3E2723] mb-2">State *</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                {/* Postal Code & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3E2723] mb-2">Postal Code *</label>
                    <input
                      type="text"
                      value={addressForm.postal_code}
                      onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      placeholder="PIN code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3E2723] mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      placeholder="Contact number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-[#7CB342] to-[#7CB342]/80 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
