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
  // Mock complet de la réponse fetch
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => mockProducts(10),
  });

  render(<App />);

  // Vérifie que le chargement est affiché au début
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend que les produits soient affichés
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(10);

  // Vérifie le contenu de chaque produit
  mockProducts(10).forEach((product) => {
    expect(screen.getByText(new RegExp(`${product.name} — ${product.price}€`))).toBeInTheDocument();
  });

  // Vérifie que le chargement n'est plus affiché
  expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument();
});

test("affiche un message si aucun produit n'est disponible", async () => {
  // Mock complet de la réponse fetch pour un tableau vide
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => [],
  });

  render(<App />);

  // Vérifie que le chargement est affiché au début
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend que le message d'absence de produit apparaisse
  await waitFor(() => {
    expect(screen.getByText(/aucun produit disponible/i)).toBeInTheDocument();
  });

  // Vérifie qu'aucun élément de liste n'est présent
  expect(screen.queryAllByRole('listitem')).toHaveLength(0);
});

test('parcours utilisateur complet : chargement, affichage, rechargement', async () => {
  // 1er appel : 10 produits
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => mockProducts(10),
  });
  
  render(<App />);

  // Loader visible au début
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend la fin du chargement
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(10);

  // Vérifie qu'un produit est visible
  expect(screen.getByText(/Produit 1 — 10€/)).toBeInTheDocument();

  // Prépare le 2e appel : 10 nouveaux produits (avec des noms différents pour tester)
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => mockProducts(10),
  });

  // Clique sur "Recharger"
  fireEvent.click(screen.getByRole('button', { name: /recharger/i }));

  // Loader visible après clic
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend la fin du rechargement
  await waitFor(() => {
    expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument();
  });

  // Vérifie que les produits sont toujours là
  const itemsAfter = screen.getAllByRole('listitem');
  expect(itemsAfter).toHaveLength(10);
});

test('gère les erreurs de l\'API', async () => {
  globalThis.fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

  render(<App />);

  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  await waitFor(() => {
    // Si ce message s'affiche, ça implique que loading est faux
    expect(screen.getByText(/une erreur est survenue/i)).toBeInTheDocument();
  });
});

test('gère les erreurs HTTP (status non-ok)', async () => {
  globalThis.fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({}),
  });

  render(<App />);

  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/une erreur est survenue/i)).toBeInTheDocument();
  });
});
