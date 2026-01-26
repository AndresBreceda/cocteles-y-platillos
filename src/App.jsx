import { useEffect, useState } from "react";

export default function App() {
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
        // 1️⃣ Cócteles
        const cocktailRes = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita"
        );
        const cocktailData = await cocktailRes.json();

        const cocktails = cocktailData.drinks.map((drink) => ({
          id: drink.idDrink,
          name: drink.strDrink,
          type: "cocktail",
          difficulty: "Easy",
          country: "Mexico",
          image: drink.strDrinkThumb,
        }));

        // 2️⃣ Platillos (Spoonacular – requiere API KEY)
        const foodRes = await fetch(
          "https://api.spoonacular.com/recipes/random?number=2&apiKey=YOUR_API_KEY"
        );
        const foodData = await foodRes.json();

        const dishes = foodData.recipes.map((recipe) => ({
          id: recipe.id,
          name: recipe.title,
          type: "dish",
          difficulty: recipe.readyInMinutes < 30 ? "Easy" : "Medium",
          country: recipe.cuisines[0] || "Unknown",
          image: recipe.image,
        }));

        // 3️⃣ Unificar datos
        const combined = [...cocktails, ...dishes];

        // 4️⃣ Obtener banderas
        const withFlags = await Promise.all(
          combined.map(async (item) => {
            const res = await fetch(
              `https://restcountries.com/v3.1/name/${item.country}`
            );
            const data = await res.json();
            return {
              ...item,
              flag: data[0]?.flags?.svg,
            };
          })
        );

        setItems(withFlags);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-4">
            <img
              src={item.image}
              alt={item.name}
              className="rounded-xl mb-3"
            />
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">
              {texts[language][item.type]}
            </p>
            <div className="mt-3 space-y-1">
              <p>
                <strong>{texts[language].difficulty}:</strong> {item.difficulty}
              </p>
              <p className="flex items-center gap-2">
                <strong>{texts[language].country}:</strong> {item.country}
                {item.flag && (
                  <img src={item.flag} alt="flag" className="w-6" />
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
