// src/landing/components/hero.tsx
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HERO_SLIDES } from "../../types/data/slider";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

export const HeroSection: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate(); // ✅ hook

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // ✅ scroll to services section
  const handleLearnMore = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
  <section className="relative text-center text-white overflow-hidden min-h-screen w-full">
      {/* Background slides with overlay */}
  <div className="absolute inset-0 w-full h-full min-h-screen">
        <AnimatePresence initial={false}>
          <motion.img
            key={HERO_SLIDES[slideIndex].id}
            src={HERO_SLIDES[slideIndex].image}
            alt={HERO_SLIDES[slideIndex].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full min-h-screen object-cover object-center"
            style={{ minHeight: '100vh', width: '100vw', maxWidth: '100%', maxHeight: '100vh' }}
          />
        </AnimatePresence>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content overlay (centered) */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 min-h-screen w-full text-center">
        <motion.h1
          key={HERO_SLIDES[slideIndex].title}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif drop-shadow text-balance"
        >
          {HERO_SLIDES[slideIndex].title}
        </motion.h1>
        <motion.p
          key={HERO_SLIDES[slideIndex].subtitle}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg italic max-w-xl mx-auto drop-shadow text-balance"
        >
          {HERO_SLIDES[slideIndex].subtitle}
        </motion.p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* ✅ Order Now goes to /menu */}
          <button
            onClick={() => navigate("/shop")}
            className="px-5 py-3 rounded-full bg-rose-600 text-white font-medium shadow-md hover:bg-rose-700 transition-colors"
          >
            Order Now
          </button>
          {/* ✅ Learn More scrolls to Services */}
          <button
            onClick={handleLearnMore}
            className="px-5 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
