# Tasks — W0-T8 · Scaffold do Frontend (Vite + React + TypeScript)

> Trilha: FRONTEND · Diretório: `web/` (package.json único) · Onda 0
> Status: implementado (arquivos criados; `npm install`/build são verificados pelo orquestrador).

## Tarefas

- [x] **T8.1** — `web/package.json` (`type: module`) com scripts `dev`, `build` (`tsc -b && vite build`), `preview` e deps de runtime: `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@fontsource/open-sans`.
- [x] **T8.2** — `web/index.html` com `div#root`, `title` = `Brev.ly` e `<script type="module" src="/src/main.tsx">`.
- [x] **T8.3** — `web/vite.config.ts` com `@vitejs/plugin-react` e alias `@` → `./src` (C8).
- [x] **T8.4** — `web/tsconfig.json` (+ `tsconfig.app.json` / `tsconfig.node.json`) com `strict: true` e `paths` `@/*` → `src/*`; `web/src/vite-env.d.ts`.
- [x] **T8.5** — `src/main.tsx`: `StrictMode` + `createRoot(#root).render(<App/>)` e import de `styles/globals.css`.
- [x] **T8.6** — `src/app/App.tsx` (providers + `RouterProvider`), `src/app/providers.tsx` (`QueryClientProvider` via `lib/query-client`), `src/app/router.tsx` (rotas `/` → HomePage, `/:shortUrl` → RedirectPage, `*` → NotFoundPage; parâmetro nomeado exatamente `shortUrl`).
- [x] **T8.7** — `src/pages/{home,redirect,not-found}/index.tsx` — stubs com heading identificável (`Home`, `Redirect`, `404 - Not Found`); RedirectPage usa `useParams` só para exibir.
- [x] **T8.8** — `src/features/links/{api,hooks,components}/.gitkeep`, `src/features/links/schemas.ts` (stub), `src/components/.gitkeep`.
- [x] **T8.9** — `src/lib/http.ts` (stub, lê `import.meta.env.VITE_BACKEND_URL`) e `src/lib/query-client.ts` (`new QueryClient()`).

## Critérios de aceite

- [x] Árvore `web/src/` bate 1:1 com Artigo 1 da constitution.
- [x] Exatamente 3 rotas com parâmetro `shortUrl`.
- [x] Sem regra de negócio (sem fetch/axios, sem Zod ativo, sem componente de domínio).
- [ ] `npm run build` / `npm run dev` verdes — **verificado pelo orquestrador**.

## Notas

- `npm install` NÃO executado (verificação externa; lockfile gerado depois).
- Node 22 (`.nvmrc` da raiz).
