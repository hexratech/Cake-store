

export const ContactSection: React.FC<{ rating: number; reviews: { id: number; name: string; text: string; stars: number }[] }> = ({ rating, reviews }) => {
  return (
    <section id="contact" className="mt-10 grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-xl font-bold">Contact Us</h3>
        <p className="text-sm text-slate-600 mt-2">Send a message and we'll get back within 24 hours.</p>
        <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full rounded-md border px-3 py-2" placeholder="Your name" />
          <input className="w-full rounded-md border px-3 py-2" placeholder="Email or phone" />
          <textarea className="w-full rounded-md border px-3 py-2" placeholder="Message" rows={4} />
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-rose-500 text-white" type="submit">Send</button>
            <div className="text-sm text-slate-600">Or call: +233 24 000 0000</div>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-xl font-bold">Customer Ratings & Reviews</h3>
        <div className="flex items-center gap-3 mt-2">
          <div className="text-3xl font-extrabold">{rating.toFixed(1)}</div>
          <div className="text-sm text-slate-600">(based on {reviews.length} reviews)</div>
        </div>
        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-slate-600">{"⭐".repeat(r.stars)}</div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};