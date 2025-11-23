'use client';

import { notFound, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GiWheat, GiMilkCarton, GiSugarCane, GiCook } from 'react-icons/gi';
import { FaLeaf, FaHeart, FaStar, FaClock, FaTruck } from 'react-icons/fa';
import { IoNutrition } from 'react-icons/io5';
import { BsLightningChargeFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { products } from '@/data/products';
import Image from 'next/image';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    setMounted(true);
    params.then(({ id }) => setProductId(id));
  }, [params]);

  if (!mounted || !productId) {
    return null;
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  const ingredients = [
    { name: 'Ragi (Finger Millet)', icon: GiWheat, benefit: 'Rich in calcium & iron', color: '#7CB342' },
    { name: 'Fresh Milk', icon: GiMilkCarton, benefit: 'Protein & vitamins', color: '#FFF8E1' },
    { name: 'Natural Jaggery', icon: GiSugarCane, benefit: 'Healthy sweetener', color: '#D4AF37' },
    { name: 'Traditional Spices', icon: GiCook, benefit: 'Aids digestion', color: '#FF6F00' },
  ];

  const nutritionFacts = [
    { name: 'Calcium', value: 85, unit: 'mg', icon: '🦴', benefit: 'Strong bones' },
    { name: 'Iron', value: 72, unit: 'mg', icon: '💪', benefit: 'Energy boost' },
    { name: 'Protein', value: 68, unit: 'g', icon: '🏋️', benefit: 'Muscle health' },
    { name: 'Fiber', value: 90, unit: 'g', icon: '🌾', benefit: 'Digestion' },
  ];

  const handleSubscribe = () => {
    router.push('/subscribe');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] via-[#EFEBE9] to-[#FFF8E1] overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#FF6F00] to-[#7CB342] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#D4AF37] rounded-full opacity-20"
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 50 - 25],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ y: backgroundY }}
        >
          <div className="w-full h-full bg-[url('/pattern.svg')] bg-repeat" />
        </motion.div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full aspect-square max-w-md mx-auto"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FF6F00] rounded-full blur-3xl opacity-30 animate-pulse" />
              
              {/* Product bottle - using the uploaded image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-64 h-96 bg-gradient-to-br from-[#5D4037] to-[#3E2723] rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Label design */}
                  <div className="absolute inset-x-8 top-20 bottom-20 bg-gradient-to-b from-[#3E2723] to-[#5D4037] rounded-2xl flex flex-col items-center justify-center p-6 border-4 border-[#D4AF37]">
                    <div className="relative w-32 h-32 mb-4">
                      <Image
                        src="/anantham-logo.png"
                        alt="ANANTHAM Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <p className="text-xs text-[#D4AF37] text-center font-semibold tracking-widest">RAGI JAVA</p>
                  </div>
                  {/* Glass cap */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#8B4513] rounded-t-full" />
                </div>
              </div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <FaLeaf /> Traditional Wellness Drink
              </span>
              <h1 className="text-6xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                ANANTHAM<br />
                <span className="text-[#D4AF37]">Ragi Java</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-[#5D4037] leading-relaxed"
            >
              A timeless blend of tradition and nutrition. Made fresh daily with premium finger millet, 
              delivered to your doorstep before 8 AM. Start your mornings the wholesome way. 🌅
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-md">
                <FaStar className="text-[#FF6F00] text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Premium Quality</p>
                  <p className="font-bold text-[#3E2723]">100% Natural</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-md">
                <FaClock className="text-[#7CB342] text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Fresh Daily</p>
                  <p className="font-bold text-[#3E2723]">Before 8 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-md">
                <FaTruck className="text-[#D4AF37] text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Home Delivery</p>
                  <p className="font-bold text-[#3E2723]">Every Morning</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubscribe}
                className="group relative bg-gradient-to-r from-[#D4AF37] to-[#FF6F00] text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-[#D4AF37]/50 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Subscribe Now <BsLightningChargeFill className="group-hover:rotate-12 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#FF6F00] to-[#D4AF37]"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <p className="text-sm text-[#5D4037] mt-3 flex items-center gap-2">
                <FaHeart className="text-red-500" /> Join 10,000+ families starting their day right
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What is Ragi Java Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              What is Ragi Java?
            </h2>
            <p className="text-xl text-[#5D4037] max-w-3xl mx-auto">
              A centuries-old South Indian breakfast tradition, crafted to perfection. 
              Ragi Java is more than a drink—it's a morning ritual that nourishes body and soul.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Ancient Wisdom', desc: 'Passed down through generations, perfected over centuries', icon: '🏛️' },
              { title: 'Power-Packed Nutrition', desc: 'Loaded with calcium, iron, and essential amino acids', icon: '💎' },
              { title: 'Family Favorite', desc: 'Loved by kids and adults alike for its rich, comforting taste', icon: '👨‍👩‍👧‍👦' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white to-[#FFF8E1] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-[#D4AF37]/20"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-[#3E2723] mb-3">{item.title}</h3>
                <p className="text-[#5D4037]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#EFEBE9] to-[#FFF8E1]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Pure Ingredients
            </h2>
            <p className="text-xl text-[#5D4037]">
              Only the finest, all-natural ingredients. Nothing artificial, ever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ingredients.map((ingredient, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateY: 90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ 
                  rotateY: 15,
                  scale: 1.05,
                  boxShadow: `0 20px 40px ${ingredient.color}40`
                }}
                className="bg-white p-6 rounded-2xl shadow-lg text-center relative overflow-hidden group cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{ backgroundColor: ingredient.color }}
                />
                <ingredient.icon className="text-6xl mx-auto mb-4" style={{ color: ingredient.color }} />
                <h4 className="text-xl font-bold text-[#3E2723] mb-2">{ingredient.name}</h4>
                <p className="text-sm text-[#5D4037]">{ingredient.benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Facts */}
      <section className="py-20 px-4 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <IoNutrition className="text-6xl text-[#7CB342] mx-auto mb-4" />
            <h2 className="text-5xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nutritional Powerhouse
            </h2>
            <p className="text-xl text-[#5D4037]">
              Every glass packed with essential nutrients your body craves
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {nutritionFacts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white to-[#FFF8E1] p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{fact.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-[#3E2723]">{fact.name}</h4>
                    <p className="text-sm text-[#7CB342] font-semibold">{fact.benefit}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {fact.value}{fact.unit}
                  </span>
                </div>
                <div className="relative h-3 bg-[#EFEBE9] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${fact.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    className="absolute h-full bg-gradient-to-r from-[#7CB342] to-[#D4AF37] rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#3E2723] to-[#5D4037] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grain-pattern.svg')] bg-repeat" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#D4AF37] to-[#FF6F00] rounded-full flex items-center justify-center"
            >
              <FaHeart className="text-4xl text-white" />
            </motion.div>

            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why ANANTHAM?
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl leading-relaxed mb-8 text-[#FFF8E1]"
            >
              We believe wellness begins at sunrise. That's why every bottle of ANANTHAM Ragi Java 
              is crafted with love, using traditional recipes passed down through generations. 
              <br /><br />
              <span className="text-[#D4AF37] font-semibold">
                Fresh. Authentic. Delivered before 8 AM. Every single day.
              </span>
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#3E2723] px-8 py-3 rounded-full font-bold text-lg"
            >
              <FaStar /> Trusted by 10,000+ Families
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#FFF8E1] to-[#EFEBE9]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-3xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold text-[#3E2723] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Start Your Wellness Journey Today
            </h2>
            <p className="text-xl text-[#5D4037] mb-8">
              Choose your subscription plan and get fresh Ragi Java delivered before 8 AM
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-16 py-6 rounded-full font-bold text-2xl shadow-2xl hover:shadow-[#7CB342]/50 transition-all mb-4"
            >
              Subscribe Now 🌅
            </motion.button>

            <p className="text-sm text-[#5D4037] flex items-center justify-center gap-2">
              <FaClock /> Cancel anytime • Flexible plans • Morning delivery guaranteed
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#D4AF37] p-4 shadow-2xl lg:hidden z-40"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubscribe}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FF6F00] text-white py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2"
        >
          Subscribe Now <BsLightningChargeFill />
        </motion.button>
      </motion.div>
    </div>
  );
}
