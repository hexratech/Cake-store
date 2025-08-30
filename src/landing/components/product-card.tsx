import { Heart } from "lucide-react";
import type {Product} from "../../types/data/products"


export const ProductsSection: React.FC<{ products: Product[]; wishList: Record<string, boolean>; addToCart: (p: Product) => void; toggleWish: (id: string) => void }> = ({ products, wishList, addToCart, toggleWish }) => {
  return (
    <section id="products" className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Our Cakes</h2>
        <div className="text-sm text-slate-600">Prices in GHS</div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <article key={p.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
            <div className="relative rounded-xl overflow-hidden h-48">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <button
                className="absolute right-3 top-3 bg-white/80 p-2 rounded-full"
                onClick={() => toggleWish(p.id)}
                aria-label="wishlist"
              >
                <Heart size={16} className={`${wishList[p.id] ? "text-rose-500" : "text-slate-600"}`} />
              </button>
            </div>
            <div className="mt-3 flex-1 flex flex-col">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-lg font-bold">GHS {p.priceGHS}</div>
                <button
                  onClick={() => addToCart(p)}
                  className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
