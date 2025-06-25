import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [seed, setSeed] = useState(42);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lis les paramètres de l'URL
  const searchParams = new URLSearchParams(window.location.search);
  const urlCount = searchParams.get('count');

  const fetchProducts = (currentSeed) => {
    setLoading(true);
    setError(null);
    const countParam = urlCount ? `&count=${urlCount}` : '';
    fetch(`/api/products?seed=${currentSeed}${countParam}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(setProducts)
      .catch(() => setError('Une erreur est survenue lors du chargement des produits.'))
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
      ) : error ? (
        <p>{error}</p>
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