

export const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="mt-10 bg-white rounded-2xl p-6 shadow">
      <h3 className="text-xl font-bold">FAQs</h3>
      <div className="mt-4 space-y-3">
        <details className="p-3 border rounded">
          <summary className="font-medium">How do I place a custom order?</summary>
          <p className="mt-2 text-sm text-slate-600">Use our contact form or visit the shop to discuss your idea.</p>
        </details>
        <details className="p-3 border rounded">
          <summary className="font-medium">What is your cancellation policy?</summary>
          <p className="mt-2 text-sm text-slate-600">Cancel 72+ hours before pickup for a partial refund.</p>
        </details>
        <details className="p-3 border rounded">
          <summary className="font-medium">Do you offer tastings?</summary>
          <p className="mt-2 text-sm text-slate-600">Yes — by appointment. Contact us to schedule.</p>
        </details>
      </div>
    </section>
  );
};