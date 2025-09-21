import { Cake, Coffee, Truck, Heart, ShoppingCart, Sparkles } from "lucide-react";
import { motion} from "framer-motion";
import type { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier equivalent of "ease"
    },
  }),
};

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Cake className="w-6 h-6 text-rose-600" />,
      title: "Custom Cakes",
      desc: "From birthdays to weddings, we design cakes to match your style, theme, and flavors.",
    },
    {
      icon: <Coffee className="w-6 h-6 text-rose-600" />,
      title: "Pastries & Coffee",
      desc: "Freshly baked pastries, cookies, and cupcakes paired with coffee, tea, or hot chocolate.",
    },
    {
      icon: <Truck className="w-6 h-6 text-rose-600" />,
      title: "Catering & Delivery",
      desc: "We cater for birthdays, office events, and parties with doorstep delivery available.",
    },
  ];

  const process = [
    {
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      title: "Wishlist",
      desc: "Save cakes you love and come back later to order or share with friends.",
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-rose-600" />,
      title: "Order Process",
      desc: (
        <ol className="text-sm text-slate-600 mt-2 list-decimal list-inside space-y-1">
          <li>Add cake to cart.</li>
          <li>Proceed to checkout and fill in your details.</li>
          <li>Place your order and make payment.</li>
        </ol>
      ),
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      title: "Special Requests",
      desc: "Share your dream design or flavors, and we’ll create a one-of-a-kind cake just for you.",
    },
  ];

  return (
    <section
      id="services"
      className="mt-16 px-6 sm:px-10 lg:px-20 py-16  bg-gradient-to-b from-rose-50 to-white rounded-[2rem] shadow-xl "
    >
      {/* Heading */}
      <h3 className="text-3xl sm:text-4xl font-serif  text-black mb-30 text-center pb-8">
        Our Sweet Services <span className="text-center">🍰</span>
      </h3>

      {/* Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {services.map((s, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
          >
            <div className="p-3 bg-rose-100 rounded-xl w-fit mb-4">{s.icon}</div>
            <h4 className="text-lg font-semibold">{s.title}</h4>
            <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Procedure */}
      <h4 className="text-2xl font-semibold font-sans text-center text-black mb-8">How It Works 💡</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {process.map((p, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i + services.length}
          >
            <div className="p-3 bg-rose-100 rounded-xl w-fit mb-4">{p.icon}</div>
            <h4 className="text-lg font-semibold">{p.title}</h4>
            {typeof p.desc === "string" ? (
              <p className="text-sm text-slate-600 mt-2">{p.desc}</p>
            ) : (
              p.desc
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
