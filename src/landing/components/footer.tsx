import { Instagram, Twitter } from "lucide-react";
import { NAV_LINKS } from "../../types/navs";

export const FooterSection: React.FC = () => {
  const serviceLinks = [
    { label: "Wishlist", id: "wishlist" },
    { label: "How To Order", id: "howto" },
    { label: "Our Story", id: "about" },
    { label: "Privacy Policy", id: "policy" },
    { label: "Terms & Conditions", id: "terms" },
  ];

  const paymentImages = [
    { src: "https://i.pinimg.com/1200x/e3/ed/cf/e3edcf4f2ae16ddee78bd8a34650ff8e.jpg", alt: "MTN Momo" },
    { src: "https://i.pinimg.com/1200x/59/72/4e/59724edc2f0780c8d5127f6d0e8e94cb.jpg", alt: "AirtelTigo Momo" },
    { src: "https://i.pinimg.com/736x/34/3d/52/343d52baaf6aa79f577fd74bd7d54a7b.jpg", alt: "Telcel Momo" },
    { src: "https://i.pinimg.com/1200x/c6/a1/fe/c6a1fe7033dc3c76ec28d13c3c7699c2.jpg", alt: "Mastercard" },
  ];

  return (
    <footer className="bg-rose-600 text-white pt-12 pb-8 rounded-t-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <img
            src="evivilogo.jpg"
            alt="3vivi bakery Logo"
            className="h-12 w-auto rounded-md shadow-md"
          />
          <p className="text-sm text-rose-100 mt-3">
            Handmade cakes & pastries from the heart of Accra.
            Crafted fresh, baked with love. 🎂
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="p-2 bg-white/20 rounded-full hover:bg-white hover:text-rose-600 transition duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 bg-white/20 rounded-full hover:bg-white hover:text-rose-600 transition duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Navigation</h4>
          <ul className="space-y-2 text-rose-100">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Services</h4>
          <ul className="space-y-2 text-rose-100">
            {serviceLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Payment Methods</h4>
          <div className="mt-2 flex flex-wrap gap-3">
            {paymentImages.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className="h-10 w-auto rounded-md bg-white shadow-md p-1"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-white/30 mt-10 pt-6 text-center text-rose-100 text-sm">
        &copy; {new Date().getFullYear()} <span className="font-semibold">3vivi Bakery</span> — All rights reserved.
      </div>
    </footer>
  );
};
