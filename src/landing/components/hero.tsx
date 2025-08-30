import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HERO_SLIDES } from "../../types/data/slider";

export const HeroSection: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="relative text-center text-white py-10 sm:py-16 md:py-20 overflow-hidden">
      {/* Background slides with a darker overlay */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={HERO_SLIDES[slideIndex].id}
            src={HERO_SLIDES[slideIndex].image}
            alt={HERO_SLIDES[slideIndex].title}
            initial={{ opacity: 0.2, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-10 md:pt-20">
        <motion.h1
          key={HERO_SLIDES[slideIndex].title}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow"
        >
          {HERO_SLIDES[slideIndex].title}
        </motion.h1>
        <motion.p
          key={HERO_SLIDES[slideIndex].subtitle}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-2 md:mt-4 text-sm md:text-lg max-w-2xl mx-auto drop-shadow"
        >
          {HERO_SLIDES[slideIndex].subtitle}
        </motion.p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="px-5 py-3 rounded-lg bg-rose-500 text-white font-medium shadow-md hover:bg-rose-600 transition-colors">Order Now</button>
          <button className="px-5 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors">Learn More</button>
        </div>
      </div>
    </header>
  );
};