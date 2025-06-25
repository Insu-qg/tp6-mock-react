
import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <><h1>Catalogue produits</h1>
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

