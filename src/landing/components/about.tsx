import  {CAKE_TYPES} from "../../types/caketypes"
import  {TYPE_GALLERY} from "../../types/data/gallery"
export const AboutSection: React.FC<{ selectedType: string | null; setSelectedType: (type: string | null) => void }> = ({ selectedType, setSelectedType }) => {
  return (
    <section id="about" className="mt-12 bg-white rounded-2xl shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <h3 className="text-xl font-bold">About SweetLayers Bakery</h3>
          <p className="mt-2 text-slate-600">
            SweetLayers is a family-owned bakery crafting custom cakes for every celebration. We use
            quality ingredients sourced locally to deliver flavors that make moments memorable.
          </p>
          <div className="mt-4">
            <label className="block text-sm font-medium">Choose a cake type</label>
            <div className="mt-2 inline-block relative">
              <select
                className="rounded-md border px-3 py-2"
                value={selectedType ?? ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
              >
                <option value=""> Select</option>
                {CAKE_TYPES.map((t) => (
                  <option value={t.key} key={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
            {selectedType && (
              <div className="mt-4">
                <h4 className="font-semibold">{CAKE_TYPES.find((c) => c.key === selectedType)?.label}</h4>
                <div className="mt-3 flex gap-3 overflow-x-auto py-2">
                  {TYPE_GALLERY[selectedType].map((src, i) => (
                    <div key={i} className="min-w-[220px] rounded-xl overflow-hidden shadow">
                      <img src={src} className="w-full h-40 object-cover" alt={`${selectedType}-${i}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <aside className="md:w-1/3 bg-rose-50 rounded-xl p-4">
          <h4 className="font-semibold">Quick Info</h4>
          <ul className="mt-2 text-sm text-slate-600 space-y-2">
            <li>Open: Mon - Sat, 8:00 AM — 8:00 PM</li>
            <li>Custom orders accepted (48+ hours notice for medium cakes)</li>
            <li>Delivery available in Accra metro and selected areas</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};