import { createBrowserRouter } from 'react-router-dom';

import { HomePage } from '../pages/home';
import { NotFoundPage } from '../pages/not-found';
import { RedirectPage } from '../pages/redirect';

/**
 * Rotas do Brev.ly (PRD §3.2). O parâmetro dinâmico chama-se exatamente `shortUrl` (D7/W4-T4).
 * - `/`           → HomePage
 * - `/:shortUrl`  → RedirectPage
 * - `*`           → NotFoundPage (catch-all)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/:shortUrl',
    element: <RedirectPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
