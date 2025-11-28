'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GiWheat } from 'react-icons/gi';
import { FaLeaf, FaClock, FaTruck, FaStar } from 'react-icons/fa';
import { products } from '@/data/products';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function ProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    router.push('/');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const ragiProduct = products[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] via-[#EFEBE9] to-[#FFF8E1]">
      <header className="bg-gradient-to-r from-[#3E2723] to-[#5D4037] border-b border-[#D4AF37] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-[#FFF8E1] hover:text-[#D4AF37] transition-colors flex items-center gap-2 font-semibold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('ingredients')}
              className="text-[#FFF8E1] hover:text-[#D4AF37] transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-[#5D4037]" 
            >
              Ingredients
            </button>
            <button
              onClick={() => scrollToSection('about-us')}
              className="text-[#FFF8E1] hover:text-[#D4AF37] transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-[#5D4037]"
            >
              About Us
            </button>
          </div>
          
          <div className="relative">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-[#FFF8E1] hover:text-[#D4AF37] transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FF6F00] rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border-2 border-[#D4AF37]">
                    <button
                      onClick={() => router.push('/profile')}
                      className="w-full text-left px-4 py-2 text-[#3E2723] hover:bg-[#FFF8E1] flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Profile
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-[#D4AF37] to-[#FF6F00] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push(`/products/${ragiProduct.id}`)}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer group"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-[#8B4513] to-[#5D4037] p-16 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6F00] rounded-full blur-3xl"
                  />
                </div>

                <motion.div
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10"
                >
                  <div className="relative w-80 h-96 group-hover:scale-105 transition-transform">
                    <Image
                      src="/refilled.jpg"
                      alt="ANANTHAM Ragi Java Product"
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </motion.div>
              </div>

              <div className="p-12">
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <FaLeaf /> {ragiProduct.category}
                  </span>
                  <h1 className="text-5xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {ragiProduct.name}
                  </h1>
                  <p className="text-xl text-[#5D4037] leading-relaxed mb-8">
                    {ragiProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF8E1] to-white p-4 rounded-xl border border-[#D4AF37]/20">
                    <FaStar className="text-2xl text-[#FF6F00]" />
                    <div>
                      <p className="text-sm text-gray-600">Premium Quality</p>
                      <p className="font-bold text-[#3E2723]">100% Natural</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF8E1] to-white p-4 rounded-xl border border-[#D4AF37]/20">
                    <FaClock className="text-2xl text-[#7CB342]" />
                    <div>
                      <p className="text-sm text-gray-600">Fresh Daily</p>
                      <p className="font-bold text-[#3E2723]">Before 8 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF8E1] to-white p-4 rounded-xl border border-[#D4AF37]/20">
                    <FaTruck className="text-2xl text-[#D4AF37]" />
                    <div>
                      <p className="text-sm text-gray-600">Home Delivery</p>
                      <p className="font-bold text-[#3E2723]">Every Morning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF8E1] to-white p-4 rounded-xl border border-[#D4AF37]/20">
                    <GiWheat className="text-2xl text-[#5D4037]" />
                    <div>
                      <p className="text-sm text-gray-600">Traditional</p>
                      <p className="font-bold text-[#3E2723]">Time-Tested</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-[#D4AF37]/30 pt-8">
                  <div className="mb-6">
                    <p className="text-sm text-[#5D4037] mb-2">Starting from</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#3E2723]">₹{ragiProduct.price}</span>
                      <span className="text-xl text-[#5D4037]">/month</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${ragiProduct.id}`);
                    }}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FF6F00] text-white py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-[#D4AF37]/50 transition-all mb-4"
                  >
                    View Full Details →
                  </motion.button>

                  <p className="text-center text-[#5D4037] text-sm">
                    🌅 Delivered fresh every morning • 💚 Trusted by 10,000+ families
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-[#5D4037] text-lg mb-4">
              ✨ Click the card above to explore the full story of ANANTHAM Ragi Java ✨
            </p>
          </motion.div>

          {/* Nutritional Information Section */}
          <motion.div
            id="ingredients"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-br from-white to-[#FFF8E1] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#D4AF37]"
          >
            <div className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] p-8 text-center">
              <h2 className="text-4xl font-bold text-[#FFF8E1] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Key Nutrients in 250ml Ragi Java
              </h2>
              <p className="text-[#D4AF37] text-lg">Complete nutritional breakdown for your wellness</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Energy & Macros */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#D4AF37]/30"
                >
                  <h3 className="text-xl font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Energy & Macronutrients
                  </h3>
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Energy</span>
                        <span className="text-[#3E2723] font-bold">Around 120-150 kcal</span>
                      </div>
                      <p className="text-sm text-gray-600 italic">[fitia +2]</p>
                    </div>
                    
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Protein</span>
                        <span className="text-[#3E2723] font-bold">3-4 grams</span>
                      </div>
                      <p className="text-sm text-gray-600 italic">[snapcalorie +1]</p>
                    </div>
                    
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Carbohydrates</span>
                        <span className="text-[#3E2723] font-bold">28-30 grams</span>
                      </div>
                      <p className="text-sm text-gray-600">(mainly complex carbs)</p>
                      <p className="text-sm text-gray-600 italic">[milletmaagicmeal +1]</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Fat</span>
                        <span className="text-[#3E2723] font-bold">Around 1 gram</span>
                      </div>
                      <p className="text-sm text-gray-600">(mainly healthy fats)</p>
                      <p className="text-sm text-gray-600 italic">[snapcalorie +1]</p>
                    </div>
                  </div>
                </motion.div>

                {/* Fiber & Key Minerals */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#7CB342]/30"
                >
                  <h3 className="text-xl font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                    <span className="text-2xl">🦴</span> Fiber & Key Minerals
                  </h3>
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Dietary Fiber</span>
                        <span className="text-[#3E2723] font-bold">About 2 grams</span>
                      </div>
                      <p className="text-sm text-gray-600">per 250ml serving</p>
                      <p className="text-sm text-gray-600 italic">[milletmaagicmeal +1]</p>
                    </div>
                    
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Calcium</span>
                        <span className="text-[#3E2723] font-bold">96-150 mg</span>
                      </div>
                      <p className="text-sm text-gray-600">per serving, supporting bone health</p>
                      <p className="text-sm text-gray-600 italic">[snapcalorie +1]</p>
                    </div>
                    
                    <div className="pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#5D4037] font-bold">Iron</span>
                        <span className="text-[#3E2723] font-bold">About 3.9 mg</span>
                      </div>
                      <p className="text-sm text-gray-600">per serving</p>
                      <p className="text-sm text-gray-600 italic">[milletmaagicmeal]</p>
                    </div>
                    
                    <div>
                      <div className="mb-1">
                        <span className="text-[#5D4037] font-bold">Magnesium, Phosphorus, Potassium</span>
                      </div>
                      <p className="text-sm text-gray-600">Significant levels, contributing to overall mineral intake</p>
                      <p className="text-sm text-gray-600 italic">[ayurved.dpu +1]</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Vitamins Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8 bg-gradient-to-r from-[#FFF8E1] to-[#EFEBE9] rounded-2xl p-6 border-2 border-[#FF6F00]/30"
              >
                <h3 className="text-xl font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                  <span className="text-2xl">💊</span> Vitamin Content
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <p className="font-bold text-[#3E2723] mb-2">Vitamin B6, Thiamine (B1), Riboflavin (B2), Niacin (B3)</p>
                    <p className="text-sm text-[#5D4037] mb-1">
                      Ragi is a good source of these B vitamins, essential for energy metabolism and nervous system health.
                    </p>
                    <p className="text-sm text-gray-600 italic">[redcliffelabs +1]</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 shadow-md">
                    <p className="font-bold text-[#3E2723] mb-2">Vitamin E and C</p>
                    <p className="text-sm text-[#5D4037] mb-1">
                      Present in small amounts, helpful for immunity and cellular health.
                    </p>
                    <p className="text-sm text-gray-600 italic">[netmeds +1]</p>
                  </div>
                </div>
              </motion.div>

              {/* Fiber Content Detail */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-8 bg-gradient-to-r from-[#7CB342]/10 to-[#D4AF37]/10 rounded-2xl p-6 border-2 border-[#7CB342]/30"
              >
                <h3 className="text-xl font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌾</span> Fiber Content
                </h3>
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <p className="text-[#5D4037] leading-relaxed">
                    A 250ml glass of ragi java typically provides around <span className="font-bold text-[#3E2723]">2 grams of dietary fiber</span>, 
                    which aids digestion and promotes a feeling of fullness, supporting weight management and gut health.
                  </p>
                  <p className="text-sm text-gray-600 italic mt-2">[krishikosh.egranth +2]</p>
                </div>
              </motion.div>

              {/* Benefits Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-r from-[#D4AF37]/10 to-[#FF6F00]/10 rounded-2xl p-6 border-2 border-[#D4AF37]/40"
              >
                <h3 className="text-2xl font-bold text-[#3E2723] mb-6 text-center">
                  ✨ Health Benefits ✨
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: '🦴', title: 'Bone Health', desc: 'High calcium (96-150mg) supports strong bones' },
                    { icon: '💪', title: 'Energy Boost', desc: 'Complex carbs for sustained energy throughout the day' },
                    { icon: '🧠', title: 'Nervous System', desc: 'B vitamins essential for brain function' },
                    { icon: '🌾', title: 'Digestive Health', desc: '2g fiber aids digestion & promotes fullness' },
                    { icon: '❤️', title: 'Mineral Rich', desc: 'Magnesium, phosphorus & potassium support' },
                    { icon: '⚖️', title: 'Weight Management', desc: 'Promotes feeling of fullness & gut health' },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                      <div className="text-3xl mb-2">{benefit.icon}</div>
                      <p className="font-bold text-[#3E2723] text-sm mb-1">{benefit.title}</p>
                      <p className="text-xs text-[#5D4037]">{benefit.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-6 text-center text-sm text-gray-600 italic"
              >
                * Nutritional values may vary slightly based on preparation method and ingredients used
              </motion.p>
            </div>
          </motion.div>

          {/* About Us - Our Story Section */}
          <motion.div
            id="about-us"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 bg-gradient-to-br from-white to-[#FFF8E1] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#D4AF37]"
          >
            <div className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] p-8 text-center">
              <h2 className="text-4xl font-bold text-[#FFF8E1] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                ⭐ ANANTHAM — Our Story
              </h2>
              <p className="text-[#D4AF37] text-xl italic">A personal journey. A cultural responsibility.</p>
            </div>

            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              {/* Opening */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center mb-12"
              >
                <p className="text-2xl text-[#3E2723] font-bold mb-2">Our story didn't begin in a boardroom.</p>
                <p className="text-2xl text-[#3E2723] font-bold">It began on a running ground.</p>
              </motion.div>

              {/* Personal Journey */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-[#FFF8E1] to-[#EFEBE9] rounded-2xl p-8 mb-8 border-2 border-[#D4AF37]/30"
              >
                <p className="text-lg text-[#5D4037] leading-relaxed mb-4">
                  I'm <span className="font-bold text-[#3E2723]">Shashank Ananthula</span>, and growing up, I was overweight, unhealthy, and addicted to sodas and junk food.
                  Colas were a daily routine. Health wasn't even a thought.
                </p>
                <p className="text-lg text-[#5D4037] leading-relaxed mb-4">
                  After my 10th class, something woke me up.
                  I wanted to feel lighter, healthier and confident.
                  So I began running every morning, eating better, and rebuilding my life step by step.
                </p>
                <p className="text-xl text-[#3E2723] font-bold text-center mt-6">
                  And that's where I discovered something powerful.
                </p>
              </motion.div>

              {/* Discovery Moment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-2xl p-8 mb-8 shadow-lg border-2 border-[#7CB342]/30"
              >
                <div className="flex items-center justify-center mb-6">
                  <GiWheat className="text-6xl text-[#7CB342]" />
                </div>
                <p className="text-lg text-[#5D4037] leading-relaxed mb-4">
                  Outside the ground, small local stalls sold Ragi Java.
                  One morning, I tried it.
                  <span className="block mt-2 text-xl font-bold text-[#3E2723] text-center">That first sip changed everything.</span>
                </p>
                <div className="mt-6 space-y-2 text-center">
                  <p className="text-lg text-[#5D4037]">The energy.</p>
                  <p className="text-lg text-[#5D4037]">The warmth.</p>
                  <p className="text-lg text-[#5D4037]">The strength it gave after a tiring run —</p>
                  <p className="text-xl font-bold text-[#3E2723] mt-4">Ragi Java became a part of my transformation.</p>
                </div>
              </motion.div>

              {/* Realization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-r from-[#FF6F00]/10 to-[#D4AF37]/10 rounded-2xl p-8 mb-8 border-2 border-[#FF6F00]/30"
              >
                <p className="text-xl text-[#3E2723] font-bold mb-6 text-center">
                  But during this journey, I realized something deeper:
                </p>
                <p className="text-lg text-[#5D4037] leading-relaxed mb-4 text-center font-semibold">
                  In just one generation, we shifted from traditional foods to packaged, processed drinks.
                </p>
                <div className="space-y-3 mt-6">
                  <p className="text-lg text-[#5D4037] leading-relaxed">Children choose fizz over nourishment.</p>
                  <p className="text-lg text-[#5D4037] leading-relaxed">Adults skip wholesome breakfasts.</p>
                  <p className="text-lg text-[#5D4037] leading-relaxed">Grandparents silently watch the recipes they grew up on fade away.</p>
                </div>
                <p className="text-xl text-[#3E2723] font-bold mt-6 text-center">
                  A heritage drink that once strengthened every household was disappearing…<br />
                  including the very drink that helped me rebuild my health.
                </p>
              </motion.div>

              {/* Birth of ANANTHAM */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] rounded-2xl p-8 mb-8 text-white"
              >
                <p className="text-3xl font-bold text-center mb-6 text-[#D4AF37]">
                  That's when ANANTHAM was born.
                </p>
                <p className="text-xl text-center mb-4">Not as a trend.</p>
                <p className="text-xl text-center font-bold text-[#FFF8E1]">But as a responsibility.</p>
              </motion.div>

              {/* Mission Points */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid md:grid-cols-3 gap-6 mb-8"
              >
                {[
                  { text: 'To revive a forgotten tradition.' },
                  { text: 'To make Ragi Java a daily habit again.' },
                  { text: "To give families the nutrition they've been missing." },
                ].map((mission, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#7CB342]/30 text-center"
                  >
                    <div className="text-4xl mb-3 text-[#7CB342]">✔</div>
                    <p className="text-lg font-semibold text-[#3E2723]">{mission.text}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Our Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="bg-white rounded-2xl p-8 mb-8 shadow-lg border-2 border-[#D4AF37]/30"
              >
                <div className="space-y-4">
                  <p className="text-lg text-[#5D4037] leading-relaxed">We work directly with farmers.</p>
                  <p className="text-lg text-[#5D4037] leading-relaxed">We sprout our ragi for higher iron and calcium absorption.</p>
                  <p className="text-lg text-[#5D4037] leading-relaxed">We prepare every batch fresh each morning.</p>
                  <p className="text-lg text-[#5D4037] leading-relaxed">And we deliver it to your home before 8 AM —<br />
                    <span className="font-bold text-[#3E2723]">just like your grandmother would.</span>
                  </p>
                </div>
              </motion.div>

              {/* Heritage Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="bg-gradient-to-r from-[#FFF8E1] to-[#EFEBE9] rounded-2xl p-8 mb-8 border-2 border-[#FF6F00]/30 text-center"
              >
                <p className="text-2xl text-[#3E2723] font-bold leading-relaxed">
                  Because heritage shouldn't just be remembered.<br />
                  It should be lived, sipped, and passed on.
                </p>
              </motion.div>

              {/* Closing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
                className="text-center bg-gradient-to-r from-[#7CB342] to-[#558B2F] rounded-2xl p-8 text-white"
              >
                <p className="text-xl leading-relaxed mb-4">
                  ANANTHAM Ragi Java is my personal journey<br />
                  and our shared journey of returning to the strength of our roots.
                </p>
                <p className="text-2xl font-bold text-[#FFF8E1] mt-6">
                  🌾 ANANTHAM Ragi Java —<br />
                  A habit for health. A drink from our heritage.
                </p>
              </motion.div>

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="text-center bg-white rounded-2xl p-8 shadow-lg border-2 border-[#D4AF37]/30"
              >
                <h3 className="text-2xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Get in Touch
                </h3>
                <p className="text-lg text-[#5D4037] mb-4">
                  Have questions or want to know more about our products?
                </p>
                <a
                  href="mailto:ananthamfoods.contacts@gmail.com"
                  className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#FF6F00] transition-colors text-xl font-semibold"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  ananthamfoods.contacts@gmail.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
