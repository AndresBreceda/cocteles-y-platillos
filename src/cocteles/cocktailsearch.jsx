//import { useState } from "react";

//Codigo de Marco
/*
export default function CocktailSearch() {
  const [query, setQuery] = useState("");
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await res.json();
      setDrinks(data.drinks || []);
    } catch (error) {
      console.error(error);
      setDrinks([]);
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Buscador de Cócteles</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Ej: margarita, mojito, martini, vodka..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>
      {loading && <p>Cargando...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drinks.map((drink) => (
          <div key={drink.idDrink} className="border rounded p-3 shadow">
            <img
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
              className="rounded mb-2"
            />
            <h3 className="font-semibold text-lg">{drink.strDrink}</h3>
            <p className="text-sm text-gray-600">{drink.strCategory}</p>
            <p className="text-sm mt-2">{drink.strInstructions}</p>
          </div>
        ))}
      </div>
    </div>        
  ); 
}
*/

import { useState } from "react";
import { searchFoodFacts } from "../OPF/FoodFactsAPI.js";

export default function CocktailSearch() {
  const [query, setQuery] = useState("");
  const [drinks, setDrinks] = useState([]);
  const [foodFacts, setFoodFacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true);

    try {
      // 1. Cocteles 
      const cocktailRes = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
      );
      const cocktailData = await cocktailRes.json();
      setDrinks(cocktailData.drinks || []);

      // 2. Open FoodFacts
      const offResults = await searchFoodFacts(q, { pageSize: 6 });
      setFoodFacts(offResults || []);
    } catch (error) {
      console.error(error);
      setDrinks([]);
      setFoodFacts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Buscador</h2>

      {/* Barra única */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Ej: margarita, mojito, coca cola..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
        />
        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      {/* ===== Cócteles ===== */}
      <h3 className="text-xl font-semibold mb-3 mt-4">Cócteles</h3>
      {drinks.length === 0 && !loading && (
        <p className="text-sm text-gray-500">Sin resultados de cócteles.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drinks.map((drink) => (
          <div key={drink.idDrink} className="bg-white rounded-2xl shadow p-4">
            {drink.strDrinkThumb && (
              <img
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                className="rounded-xl mb-3 w-full h-48 object-cover"
              />
            )}
            <h3 className="font-semibold text-lg">{drink.strDrink}</h3>
            <p className="text-sm text-gray-600">{drink.strCategory}</p>
            <p className="text-sm mt-2 text-gray-700 overflow-hidden text-ellipsis">
              {drink.strInstructions}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Open Food Facts ===== */}
      <h3 className="text-xl font-semibold mb-3 mt-8">Open Food Facts</h3>
      {foodFacts.length === 0 && !loading && (
        <p className="text-sm text-gray-500">Sin resultados en Open Food Facts.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {foodFacts.map((p) => (
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

            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.brand}</p>

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


