import { test, expect } from '@playwright/test';
import { generateProducts } from '../../src/utils/generateProducts.js';

const BASE_URL = 'http://localhost:5173'; // Adaptez si besoin

test.describe('Catalogue produits', () => {
  test('affiche tous les produits avec leur nom et prix', async ({ page }) => {
    const expectedProducts = generateProducts(42);

    await page.goto(BASE_URL + '/');
    await expect(page.getByRole('heading', { name: 'Catalogue produits' })).toBeVisible();

    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(expectedProducts.length);

    for (const product of expectedProducts) {
      await expect(
        page.getByText(new RegExp(`${product.name} — ${product.price}€`)),
      ).toBeVisible();
    }
  });

  test("affiche un message si aucun produit n'est disponible", async ({ page }) => {
    await page.goto(BASE_URL + '/?seed=0&count=0');
    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(0);
    await expect(page.getByText(/aucun produit/i)).toBeVisible();
  });

  test('parcours utilisateur complet : chargement, affichage, rechargement', async ({ page }) => {
    await page.goto(BASE_URL + '/');
    await expect(page.getByText(/chargement/i)).not.toBeVisible();
    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(10);
    const firstProduct = await items.first();
    await expect(firstProduct).toBeVisible();
    await page.getByRole('button', { name: /recharger/i }).click();
    await expect(page.getByText(/chargement/i)).not.toBeVisible();
    await expect(page.locator('ul > li')).toHaveCount(10);
  });

   test('gère le cas d\'une API qui retourne une réponse vide', async ({ page }) => {
       // Intercepter window.fetch avant de charger la page
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('/api/products')) {
          // Retourner une réponse vide
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([]) // Tableau vide
          });
        }
        return originalFetch.apply(this, args);
      };
    });

    await page.goto(BASE_URL + '/');
    
    // Attendre un peu pour que la requête se fasse
    await page.waitForTimeout(1000);
    
    // Vérifier qu'aucun produit n'est affiché
    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(0);
    
    // Vérifier que le message "aucun produit" s'affiche
    await expect(page.getByText(/aucun produit disponible/i)).toBeVisible();
  });

});
