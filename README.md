# TP6 Catalogue Produits React – Projet avec Mock API et Tests

Ce projet est une application React utilisant Vite, qui affiche un catalogue de produits générés dynamiquement via une API mockée avec MSW (Mock Service Worker). Des tests end-to-end sont réalisés avec Playwright.

---

## Fonctionnalités

- **Affichage du catalogue** : Liste de produits avec nom et prix.
- **Bouton "Recharger"** : Génère une nouvelle liste de produits (nouvelle seed aléatoire).
- **Loader** : Affiche "Chargement..." pendant la récupération des produits.
- **Gestion du vide** : Affiche "Aucun produit disponible." si la liste est vide.

---

## Structure du projet

```
src/
  App.jsx                // Composant principal React
  main.jsx               // Point d’entrée React
  mocks/
    browser.js           // Setup MSW côté navigateur
    handlers.js          // Définition des endpoints mockés
  utils/
    generateProducts.js  // Génération aléatoire des produits
  tests/
    products.spec.js     // Tests Playwright
```

---

## API Mockée

- **Endpoint** : `/api/products?seed=XXX&count=YYY`
- Les produits sont générés aléatoirement selon la seed et le nombre demandé.

---

## Installation et utilisation

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement**

   ```bash
   npm run dev
   ```

3. **Lancer les tests Playwright**
   ```bash
   npx playwright test
   ```

---

## Technologies utilisées

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Playwright](https://playwright.dev/)
- [Faker.js](https://fakerjs.dev/) (pour la génération des produits)

---

## Personnalisation

- Vous pouvez modifier la génération des produits dans `src/utils/generateProducts.js`.
- Les endpoints mockés sont définis dans `src/mocks/handlers.js`.

---

# TP7

## Commits

Pour pouvoir commit sans avoir d'erreur il faut executer `npm run dev` en arrière plan. Il s'agit de la commande pour lancer l'application.

## Liste des scripts

| Script      | Commande                  | Utilité                                                                 |
|-------------|--------------------------|-------------------------------------------------------------------------|
| `dev`       | `vite`                   | Démarre le serveur de développement Vite avec hot reload.               |
| `build`     | `vite build`             | Génère la version de production de l’application.                       |
| `preview`   | `vite preview`           | Lance un serveur local pour prévisualiser la build de production.        |
| `lint`      | `eslint .`               | Analyse le code source avec ESLint pour détecter les erreurs/linting.    |
| `format`    | `prettier --write .`     | Formate automatiquement tout le code avec Prettier.                      |
| `prepare`   | `husky`                  | Installe les hooks Git Husky (exécuté automatiquement après install).    |
| `test`      | `npx playwright test`    | Exécute les tests end-to-end avec Playwright.                           |