// handlers.js
import { http, HttpResponse } from 'msw';
import { generateProducts } from '../utils/generateProducts.js';

export const handlers = [
  http.get('/api/products', (req) => {
    const url = new URL(req.request?.url || req.url, self.location.origin);
    const seed = Number(url.searchParams.get('seed')) || 42;
    console.log('MSW seed:', seed);
    const products = generateProducts(seed);
    return HttpResponse.json(products, { status: 200 });
  })
];

