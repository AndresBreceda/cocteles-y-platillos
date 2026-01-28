//URL
const BASE = "https://world.openfoodfacts.org";

//Evita que la API mande nulls o texto donde requiere un numero
function safeNumber(v) 
{
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

//Reorganiza la info en un formato más limpio
function normalize(p) 
{
  const nutr = p?.nutriments ?? {};
  const kcal100g = safeNumber(nutr["energy-kcal_100g"]);

  return {
    id: p?.code ?? crypto.randomUUID(),
    name: p?.product_name || p?.generic_name || "Sin nombre",
    brand: p?.brands || "—",
    image:
      p?.image_front_small_url ||
      p?.image_front_url ||
      p?.image_url ||
      null,
    kcal100g,
    allergens: p?.allergens || "—",
  };
}

// Query para evitar que devuelva resultados nadaqueverientos
function includesQuery(p, qLower) 
{
  const name = (p?.product_name || p?.generic_name || "").toLowerCase();
  const brands = (p?.brands || "").toLowerCase();
  return name.includes(qLower) || brands.includes(qLower);
}

//Funcion principal
//ESTA LIMITADA A 6 OBJETOS POR BUSQUEDA
export async function searchFoodFacts(query, { pageSize = 6 } = {}) 
{
    //Limpia de busqueda
  const q = query.trim();
  if (!q) return [];

 //Parametros de busqueda
  const url =
    `${BASE}/cgi/search.pl?` +
    new URLSearchParams({
      search_terms: q,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: String(pageSize * 4), 
      page: "1",
    });

    //Fetch y validación
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OFF error: ${res.status}`);

  //Conversion
  const data = await res.json();
  const products = Array.isArray(data?.products) ? data.products : [];

  //Noramlizar la busqueda a minuscula
  const qLower = q.toLowerCase();
  //Filtros de busqueda por 1. Relevancia 2. PageSize
  const filtered = products.filter((p) => includesQuery(p, qLower));
  const finalList = (filtered.length >= 3 ? filtered : products).slice(0, pageSize);

  //Hola
  return finalList.map(normalize);
}
