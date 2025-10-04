import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I place a custom order?",
      a: "Use our contact form or visit the shop to discuss your idea. We’ll provide a quote and confirm details.",
    },
    {
      q: "What is your cancellation policy?",
      a: "Orders canceled 72+ hours before pickup are eligible for a partial refund. Within 72 hours, cancellations are non-refundable.Please read our full policy for more details.",
    },
    {
      q: "Do you offer tastings?",
      a: "Yes - tastings are available by appointment. Contact us to schedule your session.",
    },
    {
      q: "Do you provide delivery?",
      a: "Yes, we deliver within the city for an additional fee. Free delivery on large event orders.",
    },
  ];

  return (
    <section
      id="faq"
      className="mt-20 px-6 sm:px-10 lg:px-20 py-16 bg-gradient-to-b from-rose-50 to-white rounded-[2rem] shadow-xl"
    >
      <div className="flex items-center justify-center gap-3 mb-10">
        <HelpCircle className="w-7 h-7 text-rose-600" />
        <h3 className="text-3xl sm:text-4xl font-serif  text-black">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-rose-100 bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-slate-800 hover:bg-rose-50 transition"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                {item.q}
                <ChevronDown
                  className={`w-5 h-5 text-rose-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-5 pb-4 text-sm text-slate-600 transition-[max-height,opacity] duration-300 ${
                  isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
