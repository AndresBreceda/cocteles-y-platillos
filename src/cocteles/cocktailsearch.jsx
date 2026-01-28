import { useState } from "react";

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


