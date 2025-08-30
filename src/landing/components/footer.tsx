import {Instagram,Twitter} from "lucide-react";
import  {NAV_LINKS} from "../../types/navs"
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
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img
            src="evivilogo.jpg"
            alt="3vivi bakery Logo"
            className="h-10 w-auto rounded-md"
          />
          <p className="text-sm text-slate-400 mt-2">Handmade cakes from the heart of Accra.</p>
          <div className="mt-4 flex items-center gap-3">
           
             <div className="text-rose-400 hover:text-white transition-colors duration-200">
            <a href="#" aria-label="Instagram">
              <Instagram />
            </a>
            </div>
            
             <div className="text-rose-400 hover:text-white transition-colors duration-200">
            <a href="#" aria-label="Twitter">
              <Twitter className="text-rose-400 hover:text-white transition-colors duration-200" />
            </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg">Navigation</h4>
          <ul className="mt-4 space-y-2 text-slate-400">
            {NAV_LINKS.map(link => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="hover:text-rose-400 transition-colors duration-200">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg">Services</h4>
          <ul className="mt-4 space-y-2 text-slate-400">
            {serviceLinks.map(link => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="hover:text-rose-400 transition-colors duration-200">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg">Payment Methods</h4>
          <div className="mt-4 flex flex-wrap gap-4">
            {paymentImages.map((img, index) => (
              <img key={index} src={img.src} alt={img.alt} className="h-10 w-auto rounded-md object-contain" />
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 mt-10 pt-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} 3vivi Bakery — All rights reserved. 
      </div>
    </footer>
  );
};