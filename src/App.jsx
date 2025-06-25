import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [seed, setSeed] = useState(42);

  const fetchProducts = (currentSeed) => {
    fetch(`/api/products?seed=${currentSeed}`)
      .then(res => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchProducts(seed);
  }, [seed]);

  const handleReload = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    console.log('React seed:', newSeed); // ← ce log doit changer à chaque clic
    setSeed(newSeed);
  };

  return (
    <>
      <h1>Catalogue produits</h1>
      <button onClick={handleReload}>Recharger</button>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} — {p.price}€
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;

