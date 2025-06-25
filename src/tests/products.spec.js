import { test, expect } from '@playwright/test';
import { generateProducts } from '../utils/generateProducts.js';

const BASE_URL = 'http://localhost:5173'; // Adaptez si besoin

test.describe('Catalogue produits', () => {
    test('affiche tous les produits avec leur nom et prix', async ({ page }) => {
        // Génère les produits attendus avec la seed utilisée dans le mock MSW
        const expectedProducts = generateProducts(42);

        await page.goto(BASE_URL + '/');

        // Vérifie que le titre est présent
        await expect(page.getByRole('heading', { name: 'Catalogue produits' })).toBeVisible();

        // Vérifie qu'il y a bien 10 produits affichés
        const items = await page.locator('ul > li');
        await expect(items).toHaveCount(expectedProducts.length);

        // Vérifie que chaque produit a le bon nom et prix
        for (const product of expectedProducts) {
            await expect(
                page.getByText(new RegExp(`${product.name} — ${product.price}€`))
            ).toBeVisible();
        }
    });
});