# Brev.ly — Web

SPA do Brev.ly: **React + Vite + TypeScript**, com **Tailwind** (tema Dracula), **React Query**,
**React Hook Form** e **Zod**.

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Vite dev server — `http://localhost:5173` |
| `npm run build` | Type-check + build de produção (`dist/`) |
| `npm run preview` | Serve o build de produção |
| `npm run test` / `test:coverage` | Vitest + Testing Library + MSW |
| `npm run lint` / `format` | ESLint / Prettier |

## Ambiente

Copie `.env.example` para `.env`:

- `VITE_BACKEND_URL` — URL da API (ex.: `http://localhost:3333`).
- `VITE_FRONTEND_URL` — URL pública do front (ex.: `http://localhost:5173`), usada para compor a URL curta.

## Páginas e estrutura

3 páginas: `/` (form + listagem), `/:url-encurtada` (redireciona) e `*` (404).

```
src/
├── app/                 # router (3 rotas) + providers (QueryClient)
├── pages/               # home / redirect / not-found
├── features/links/      # api, hooks (React Query), components (form, list, row), schemas
├── components/          # UI base (Button, Input, IconButton, Logo)
├── lib/                 # http client, clipboard, download, redirect, cn
└── styles/              # globals + Open Sans (self-host)
```

Os tokens de cor (tema Dracula) vivem em `tailwind.config.ts` — fonte da verdade do design.
