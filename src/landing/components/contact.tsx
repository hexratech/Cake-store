import { Star, Phone, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";

export const ContactSection: React.FC<{
  rating: number;
  reviews: { id: number; name: string; text: string; stars: number }[];
}> = ({ rating, reviews }) => {
  return (
    <section
      id="contact"
      className="mt-20 grid md:grid-cols-2 gap-10 px-6 sm:px-10 lg:px-20"
    >
      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-gradient-to-b from-rose-50 to-white rounded-3xl p-8 shadow-lg"
      >
        <h3 className="text-4xl font-extrabold text-black">Contact Us</h3>
        <p className="text-sm text-slate-600 mt-2">
          Have a question or custom order? Send us a message and we’ll reply
          within 24 hours.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
            placeholder="Your name"
          />
          <input
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
            placeholder="Email or phone"
          />
          <textarea
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
            placeholder="Message"
            rows={4}
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
        </form>

        {/* Quick Contact Info */}
        <div className="mt-6 text-sm text-slate-700 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600" />
            <span>+233 24 000 0000</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-600" />
            <span>info@3vivi-bakery.com</span>
          </div>
        </div>
      </motion.div>

      {/* Reviews */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-gradient-to-b from-rose-50 to-white rounded-3xl p-8 shadow-lg"
      >
        <h3 className="text-4xl font-extrabold text-black">Customer Reviews</h3>

        <div className="flex items-center gap-4 mt-3">
          <div className="text-4xl font-bold text-slate-800">
            {rating.toFixed(1)}
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.round(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">
            ({reviews.length} reviews)
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {reviews.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-800">{r.name}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.stars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
