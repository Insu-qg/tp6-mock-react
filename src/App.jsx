import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [seed, setSeed] = useState(42);
  const [loading, setLoading] = useState(false);

  // Lis les paramètres de l'URL
  const searchParams = new URLSearchParams(window.location.search);
  const urlCount = searchParams.get('count');

  const fetchProducts = (currentSeed) => {
    setLoading(true);
    // Ajoute count à la requête si présent dans l'URL
    const countParam = urlCount ? `&count=${urlCount}` : '';
    fetch(`/api/products?seed=${currentSeed}${countParam}`)
      .then((res) => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(seed);
  }, [seed]);

  const handleReload = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    setSeed(newSeed);
  };

  return (
    <>
      <h1>Catalogue produits</h1>
      <button onClick={handleReload}>Recharger</button>
      {loading ? (
        <p>Chargement...</p>
      ) : products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} — {p.price}€
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
