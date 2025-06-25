// handlers.js
import { http, HttpResponse } from 'msw';
import { generateProducts } from '../utils/generateProducts.js';

export const handlers = [
  http.get('/api/products', (req) => {
    const url = new URL(req.request?.url || req.url, self.location.origin);
    const seed = Number(url.searchParams.get('seed')) || 42;
    const count = url.searchParams.has('count')
      ? Number(url.searchParams.get('count'))
      : 10;
    console.log('MSW seed:', seed, 'count:', count);
    const products = generateProducts(seed, count);
    return HttpResponse.json(products, { status: 200 });
  }),
];
