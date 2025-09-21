import { Star, Phone, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export const ContactSection: React.FC<{
  rating: number;
  reviews: { id: string; name: string; text: string; stars: number }[];
}> = ({ rating, reviews }) => {
  const totalStars = 5;
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! You will hear from us soon.");   
      setForm({ name: "", contact: "", message: "" });
    }, 1500);
  };

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
        <h3 className="text-4xl font-serif text-black">Contact Us</h3>
        <p className="text-sm text-slate-600 mt-2">
          Have a question or custom order? Send us a message and we’ll reply within 24 hours.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
            placeholder="Your name"
            required
          />
          <input
            type="email"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
            placeholder="Email or phone"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
            placeholder="Message"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-semibold transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-700"}`}
          >
            {loading ? (
              <span className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <Send className="w-5 h-5" />
            )}
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Quick Contact Info */}
        <div className="mt-6 text-sm text-slate-700 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600" />
            <span>+233 24 881 2860</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-600" />
            <span>3vivibakery@gmail.com</span>
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
        <h3 className="text-4xl font-serif text-black">Customer Reviews</h3>

        <div className="flex items-center gap-4 mt-3">
          <div className="text-4xl font-sans font-semibold text-slate-800">{rating.toFixed(1)}</div>
          <div className="flex">
            {Array.from({ length: totalStars }, (_, idx) => (
              <Star
                key={idx}
                className={`w-6 h-6 ${
                  idx < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
         
        </div>

        <div className="mt-6 space-y-4">
          {reviews.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-800">{r.name}</div>
                <div className="flex">
                  {Array.from({ length: totalStars }, (_, starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${
                        starIdx < r.stars ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600 italic">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
