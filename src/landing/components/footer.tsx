import { Instagram } from "lucide-react";
import { NAV_LINKS } from "../../types/navs";
import { faTiktok ,faSnapchat} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <footer className="bg-rose-600 text-white pt-16 pb-12 rounded-t-[3rem] shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Logo & About */}
        <div className="flex flex-col items-start">
          <img
            src="evivilogo.jpg"
            alt="3vivi bakery Logo"
            className="h-14 w-auto rounded-xl shadow-lg"
          />
          <p className="text-sm text-rose-100 mt-4 leading-relaxed">
            Handmade cakes & pastries from the heart of Accra. Crafted fresh, baked with love. 🎂
          </p>
          <div className="mt-6 flex items-center gap-5">
            <a
              href="https://www.instagram.com/3vivi_bakery"
              aria-label="Instagram"
              className="p-3 bg-white/20 rounded-full hover:bg-white hover:text-rose-600 transition-all duration-300 transform hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-3 bg-white/20 rounded-full hover:bg-white hover:text-rose-600 transition-all duration-300 transform hover:scale-110"
            >
            <FontAwesomeIcon icon={faSnapchat}  className="w-5 h-5" />
            </a>
            <a  href="https://www.tiktok.com/@3vivi_bakery"
              aria-label="Twitter"
              className="p-2 bg-white/20 rounded-full hover:bg-white hover:text-rose-600 transition duration-300">
              <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-bold text-xl mb-5">Navigation</h4>
          <ul className="space-y-3 text-rose-100">
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
          <h4 className="font-bold text-xl mb-5">Services</h4>
          <ul className="space-y-3 text-rose-100">
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
          <h4 className="font-bold text-xl mb-5">Payment Methods</h4>
          <div className="mt-2 flex flex-wrap gap-4">
            {paymentImages.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className="h-10 w-auto rounded-lg bg-white shadow-md p-1"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-white/30 mt-16 pt-8 text-center text-rose-100 text-sm">
        &copy; {new Date().getFullYear()} <span className="font-bold">3vivi Bakery</span> — All rights reserved.
      </div>
    </footer>
  );
};