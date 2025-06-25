import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/App';
import { beforeEach, afterEach, test, expect, jest } from '@jest/globals';

// Mock fetch globally
beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

function mockProducts(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Produit ${i + 1}`,
    price: (i + 1) * 10,
  }));
}

test('affiche tous les produits avec leur nom et prix', async () => {
  globalThis.fetch.mockResolvedValueOnce({
    json: async () => mockProducts(10),
  });

  render(<App />);

  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend que les produits soient affichés
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(10);

  // Vérifie le contenu de chaque produit
  mockProducts(10).forEach((product) => {
    expect(screen.getByText(new RegExp(`${product.name} — ${product.price}€`))).toBeInTheDocument();
  });
});

test("affiche un message si aucun produit n'est disponible", async () => {
  globalThis.fetch.mockResolvedValueOnce({
    json: async () => [],
  });

  render(<App />);

  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend que le message d'absence de produit apparaisse
  await waitFor(() => {
    expect(screen.getByText(/aucun produit disponible/i)).toBeInTheDocument();
  });
});

test('parcours utilisateur complet : chargement, affichage, rechargement', async () => {
  // 1er appel : 10 produits
  globalThis.fetch.mockResolvedValueOnce({
    json: async () => mockProducts(10),
  });
  render(<App />);

  // Loader visible au début
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend la fin du chargement
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(10);

  // Clique sur "Recharger" (2e appel : 10 nouveaux produits)
  globalThis.fetch.mockResolvedValueOnce({
    json: async () => mockProducts(10),
  });
  fireEvent.click(screen.getByRole('button', { name: /recharger/i }));

  // Loader visible après clic
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend la fin du rechargement
  const itemsAfter = await screen.findAllByRole('listitem');
  expect(itemsAfter).toHaveLength(10);
});