import { useEffect, useState } from "react";
import { searchFoodFacts } from "./FoodFactsAPI.js";

export default function FoodFactsRes({ query }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const q = (query || "").trim();
      if (!q) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchFoodFacts(q, { pageSize: 6 });
        if (!cancelled) setItems(results);
      } catch (e) {
        console.error(e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Open Food Facts</h2>

      {loading && <p className="text-sm">Cargando productos...</p>}

      {!loading && items.length === 0 && (
        <p className="text-sm text-gray-500">Sin resultados.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow p-4">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="rounded-xl mb-3 w-full h-48 object-cover"
              />
            ) : (
              <div className="rounded-xl mb-3 w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                Sin imagen
              </div>
            )}

            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.brand}</p>

            <div className="text-sm mt-2 space-y-1">
              <p>
                <strong>Calorías (kcal/100g):</strong> {p.kcal100g ?? "—"}
              </p>
              <p>
                <strong>Alérgenos:</strong> {p.allergens || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
