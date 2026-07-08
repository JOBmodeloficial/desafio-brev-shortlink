# Tasks — W0-T10 · Lint, format e teste do frontend (`web/`)

> Trilha: FRONTEND · Diretório: `web/` · Onda 0
> Status: implementado (arquivos criados; pipeline verde verificado pelo orquestrador).

## Tarefas

- [x] **T10.1** — `web/eslint.config.js` flat: `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `eslint-config-prettier` (por último); `ignores`: `dist`, `coverage`, `node_modules`.
- [x] **T10.2** — `web/.prettierrc.json` (C7: `singleQuote`, `semi`, `printWidth: 100`, `trailingComma: all`) + `web/.prettierignore` (`dist`, `coverage`, `node_modules`).
- [x] **T10.3** — Scripts em `web/package.json`: `lint` (eslint src), `format`, `format:check`, `test` (`vitest run`), `test:watch`, `test:coverage`.
- [x] **T10.4** — `web/vitest.config.ts`: `environment: 'jsdom'`, `globals: true`, `setupFiles: ['./src/test/setup.ts']`, alias `@` → `./src`, coverage v8 (sem thresholds).
- [x] **T10.5** — `web/src/test/msw/server.ts`: `export const server = setupServer(...handlers)` com `handlers = []`.
- [x] **T10.6** — `web/src/test/setup.ts`: import `@testing-library/jest-dom`; `beforeAll(listen{onUnhandledRequest:'error'})`, `afterEach(cleanup + resetHandlers)`, `afterAll(close)`.
- [x] **T10.7** — Smoke test `web/src/App.test.tsx`: renderiza o router (rota `/`) dentro dos providers e acha o heading `Home` (`getByRole`).
- [x] **T10.8** — devDeps: `vitest`, `@vitest/coverage-v8`, `@testing-library/{react,jest-dom,user-event}`, `jsdom`, `msw`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`, `prettier`, `globals`.

## Critérios de aceite

- [x] ESLint flat com react-hooks + react-refresh + integração Prettier.
- [x] MSW pronto (handlers vazios), reutilizável por testes futuros.
- [x] Smoke test determinístico e independente de ordem.
- [x] Nenhum handler MSW real, schema Zod ou teste de feature.
- [ ] `npm run lint` / `format:check` / `test` saem com código 0 — **verificado pelo orquestrador**.

## Notas

- Sem threshold de cobertura nesta onda (metas de W5).
- `onUnhandledRequest: 'error'` garante que testes não vazem para rede real.
