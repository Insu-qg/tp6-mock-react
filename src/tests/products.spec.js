import { test, expect } from '@playwright/test';
import { generateProducts } from '../utils/generateProducts.js';

const BASE_URL = 'http://localhost:5173'; // Adaptez si besoin

test.describe('Catalogue produits', () => {
  test('affiche tous les produits avec leur nom et prix', async ({ page }) => {
    // Génère les produits attendus avec la seed utilisée dans le mock MSW
    const expectedProducts = generateProducts(42);

    await page.goto(BASE_URL + '/');

    // Vérifie que le titre est présent
    await expect(
      page.getByRole('heading', { name: 'Catalogue produits' }),
    ).toBeVisible();

    // Vérifie qu'il y a bien 10 produits affichés
    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(expectedProducts.length);

    // Vérifie que chaque produit a le bon nom et prix
    for (const product of expectedProducts) {
      await expect(
        page.getByText(new RegExp(`${product.name} — ${product.price}€`)),
      ).toBeVisible();
    }
  });

  test("affiche un message si aucun produit n'est disponible", async ({
    page,
  }) => {
    // On force la génération de 0 produit en utilisant count=0
    await page.goto(BASE_URL + '/?seed=0&count=0');

    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(0);

    await expect(page.getByText(/aucun produit/i)).toBeVisible();
  });

  test('parcours utilisateur complet : chargement, affichage, rechargement', async ({ page }) => {
    // Aller sur la page d'accueil
    await page.goto(BASE_URL + '/');

    // Attendre la disparition du loader (le plus fiable)
    await expect(page.getByText(/chargement/i)).not.toBeVisible();

    // Vérifie que les produits sont affichés
    const items = await page.locator('ul > li');
    await expect(items).toHaveCount(10);

    // Vérifie le contenu du premier produit
    const firstProduct = await items.first();
    await expect(firstProduct).toBeVisible();

    // Clique sur le bouton "Recharger"
    await page.getByRole('button', { name: /recharger/i }).click();

    // Attendre la disparition du loader après rechargement
    await expect(page.getByText(/chargement/i)).not.toBeVisible();

    // Vérifie que 10 produits sont toujours affichés après rechargement
    await expect(page.locator('ul > li')).toHaveCount(10);
  });
});
