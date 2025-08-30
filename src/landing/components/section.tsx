export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="mt-10">
      <h3 className="text-xl font-bold">Services</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold">Wishlist</h4>
          <p className="text-sm text-slate-600 mt-2">Save cakes and come back later to order or share.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold">How To Order</h4>
          <ol className="text-sm text-slate-600 mt-2 list-decimal list-inside">
            <li>Choose a cake from Products</li>
            <li>Add to cart & select pickup or delivery</li>
            <li>Pay with Momo (MTN/AT/Telcel) or Mastercard</li>
          </ol>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold">Custom Orders</h4>
          <p className="text-sm text-slate-600 mt-2">Tell us the design, theme and flavors and we will send a quote.</p>
        </div>
      </div>
    </section>
  );
};
