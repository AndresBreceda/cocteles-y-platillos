import { useEffect, useState } from "react";

export default function App() {
  const API_KEY = import.meta.env.VITE_API_KEY_COCTAIL;

  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState("es");
  const [loading, setLoading] = useState(true);

  const texts = {
    es: {
      title: "Platillos y Cócteles",
      difficulty: "Dificultad",
      country: "País",
      cocktail: "Cóctel",
      dish: "Platillo",
    },
    en: {
      title: "Dishes & Cocktails",
      difficulty: "Difficulty",
      country: "Country",
      cocktail: "Cocktail",
      dish: "Dish",
    },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // =========================
        // 1️⃣ CÓCTELES
        // =========================
        const cocktailRes = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita"
        );
        const cocktailData = await cocktailRes.json();

        const cocktails = cocktailData?.drinks
          ? cocktailData.drinks.map((drink) => ({
              id: `cocktail-${drink.idDrink}`,
              name: drink.strDrink,
              type: "cocktail",
              difficulty: "Easy",
              country: "Mexico",
              image: drink.strDrinkThumb,
            }))
          : [];

        // =========================
        // 2️⃣ PLATILLOS
        // =========================
        const foodRes = await fetch(
          `https://api.spoonacular.com/recipes/random?number=2&apiKey=${API_KEY}`
        );
        const foodData = await foodRes.json();

        const dishes = foodData?.recipes
          ? foodData.recipes.map((recipe) => ({
              id: `dish-${recipe.id}`,
              name: recipe.title,
              type: "dish",
              difficulty:
                recipe.readyInMinutes && recipe.readyInMinutes < 30
                  ? "Easy"
                  : "Medium",
              country:
                recipe.cuisines && recipe.cuisines.length > 0
                  ? recipe.cuisines[0]
                  : null,
              image: recipe.image,
            }))
          : [];

        // =========================
        // 3️⃣ UNIFICAR
        // =========================
        const combined = [...cocktails, ...dishes];

        // =========================
        // 4️⃣ BANDERAS (SEGURO)
        // =========================
        const withFlags = await Promise.all(
          combined.map(async (item) => {
            if (!item.country) {
              return { ...item, flag: null };
            }

            try {
              const res = await fetch(
                `https://restcountries.com/v3.1/name/${item.country}`
              );
              const data = await res.json();

              return {
                ...item,
                flag: Array.isArray(data) ? data[0]?.flags?.svg : null,
              };
            } catch {
              return { ...item, flag: null };
            }
          })
        );

        setItems(withFlags);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [API_KEY]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{texts[language].title}</h1>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded"
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>

      {items.length === 0 && (
        <p className="text-gray-500">No data available</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-4">
            <img
              src={item.image}
              alt={item.name}
              className="rounded-xl mb-3 w-full h-48 object-cover"
            />

            <h2 className="text-xl font-semibold">{item.name}</h2>

            <p className="text-sm text-gray-500">
              {texts[language][item.type]}
            </p>

            <div className="mt-3 space-y-1">
              <p>
                <strong>{texts[language].difficulty}:</strong>{" "}
                {item.difficulty}
              </p>

              <p className="flex items-center gap-2">
                <strong>{texts[language].country}:</strong>{" "}
                {item.country || "—"}
                {item.flag && (
                  <img
                    src={item.flag}
                    alt="flag"
                    className="w-6 h-4 object-cover"
                  />
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
