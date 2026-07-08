# Plano de Implementação em Ondas — Brev.ly

Decomposição executável da implementação, derivada do [PRD](./PRD.md) e da
[constitution](./constitution.md). Gerado por workflow multi-agente (7 planejadores +
auditor de cobertura) e **revisado** com os ajustes da auditoria aplicados (ver §Ajustes).

**Cobertura:** todos os requisitos **BE-01…BE-12**, **FE-01…FE-08**, as 3 páginas e as
3 camadas de teste (back, front, E2E) têm task e teste mapeados (ver §Rastreabilidade).

---

## Grafo de dependências

```
W0 Fundação & DevOps
├─▶ W1 Backend: Domínio & Persistência ─▶ W2 Backend: API ─▶ W3 Backend: CSV/R2 & Testes ─┐
└─▶ W4 Frontend: Fundação & Design System ────────────────────────────────────────────────┼─▶ W5 Frontend: Features & Páginas ─▶ W6 E2E & Fechamento
```

- **W1→W2→W3** (backend) e **W4** (fundação front) correm **em paralelo** após W0.
- **W5** exige **W3** (contrato de API estável) **e W4** (fundação do front).
- **W6** exige **W5** (front completo) + backend das W2–W3 operacional.

| Onda | Título | Depende de | Paralelizável com |
|------|--------|-----------|-------------------|
| **W0** | Fundação & DevOps | — | — |
| **W1** | Backend: Domínio & Persistência | W0 | W4 |
| **W2** | Backend: API (rotas & casos de uso) | W1 | W4 |
| **W3** | Backend: Export CSV, R2 & Testes | W2 | W4 |
| **W4** | Frontend: Fundação & Design System | W0 | W1–W3 |
| **W5** | Frontend: Features & Páginas | W3 **e** W4 | — |
| **W6** | E2E & Fechamento | W5 (+ W2–W3) | — |

---

## Onda 0 — Fundação & DevOps

**Meta:** monorepo (`web/` + `server/`, npm, sem workspaces) com scaffolds compiláveis, toolchain, DevOps (Docker/Postgres) e o script exato `db:migrate` — **sem regra de negócio**.
**Paralelismo:** após W0-T1, as trilhas server (T2–T7) e web (T8–T11) são independentes.

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W0-T1 | Estrutura raiz do monorepo, `.gitignore`, `.nvmrc` (sem workspaces) | D4 | `.gitignore`, `.nvmrc`, `web/`, `server/` |
| W0-T2 | Scaffold backend Fastify+TS: `server.ts` (CORS + `/health`), `env.ts`, árvore `src/` (stubs), tsconfig, scripts. **Deps incl. `nanoid` e `@aws-sdk/client-s3`** ⚑ | D4, BE-01 | `server/package.json`, `src/server.ts`, `src/env.ts` |
| W0-T3 | `docker-compose.yml` com Postgres 16 (healthcheck, volume) | D4, BE-11 | `server/docker-compose.yml` |
| W0-T4 | Dockerfile multi-stage (node:lts-alpine, não-root) + `.dockerignore` | O5 | `server/Dockerfile` |
| W0-T5 | `drizzle.config.ts` + script **exato `db:migrate`** | BE-11, D4 | `server/drizzle.config.ts` |
| W0-T6 | `.env.example` do backend (7 chaves do PRD §5.1) | D2 | `server/.env.example` |
| W0-T7 | ESLint + Prettier + `vitest.config` (smoke `/health`) | D5 | `server/eslint.config.js`, `vitest.config.ts` |
| W0-T8 | Scaffold frontend Vite+React+TS, árvore `src/` da constitution, 3 rotas stub | D3, D4, FE-01 | `web/package.json`, `src/app/router.tsx` |
| W0-T9 | Tailwind + tokens Dracula (fonte da verdade dos hexes) | D3, O4 | `web/tailwind.config.ts`, `src/styles/globals.css` |
| W0-T10 | ESLint + Prettier + `vitest` (jsdom + MSW) + smoke render | D3 | `web/vitest.config.ts`, `src/test/setup.ts` |
| W0-T11 | `.env.example` do frontend (`VITE_FRONTEND_URL`, `VITE_BACKEND_URL`) | D3 | `web/.env.example` |
| W0-T12 | README de setup + verificação end-to-end da fundação | D4 | `README.md` |

**Saída:** ambos buildam; `/health` 200; CORS on; Postgres sobe; `db:migrate` executa; 3 rotas placeholder; lint/format/test verdes. **Sem** tabela `links`, rotas de negócio ou schemas de URL.

---

## Onda 1 — Backend: Domínio & Persistência

**Meta:** envs validadas, schema Drizzle `links` + migration, cliente, schemas Zod (URL/slug) e mapa de erros→HTTP. **Sem rotas.**
**Nota de propriedade (⚑ausência de retrabalho):** W1 **evolui** os stubs criados em W0-T2/T5 — `env.ts`, `db/schema.ts`, `db/client.ts`, `drizzle.config.ts` têm sua **fonte da verdade nesta onda**.

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W1-T1 | `env.ts` — Zod fail-fast (PORT, DATABASE_URL, CLOUDFLARE_*) | Art.2 R4, D2 | `server/src/env.ts` |
| W1-T2 | Schema Drizzle `links` (id uuid pk, original_url, short_url **unique**, access_count d0, created_at) | D1, D12, BE-03, BE-11 | `server/src/db/schema.ts` |
| W1-T3 | Gerar + aplicar migration inicial (`db:migrate`); `CREATE EXTENSION pgcrypto` | Art.2 R3, BE-11, D1 | `src/db/migrations/` |
| W1-T4 | `db/client.ts` (Drizzle + Postgres, conexão via `env`) | Art.2 R1, D6 | `server/src/db/client.ts` |
| W1-T5 | Schemas Zod input/output — URL `http/https` (**D13**), slug `^[a-z0-9-]+$` opcional (D8), paginação (D9) | BE-02, D8, D9, D11, **D13** | `server/src/schemas/link.ts` |
| W1-T6 | Erros de negócio → status (400/404/409) via função pura `mapErrorToHttp` | D11, BE-02/03/04/05 | `server/src/http/errors/index.ts` |
| W1-T7 | Testes unit dos schemas Zod + mapa de erros (**100%**) | D5, D11, BE-02/03 | `schemas/link.test.ts`, `errors.test.ts` |
| W1-T8 | `drizzle.config.ts` (dialect postgresql, schema, out, DATABASE_URL) | Art.2 R3, D1 | `server/drizzle.config.ts` |

**Saída:** `tsc` limpo; `db:migrate` cria `links` + índice único (idempotente); Zod aplica URL http/https + slug + defaults de paginação; mapa de erros cobre 400/404/409/(400 Zod)/(500). Vitest 100% em `schemas` e `errors`.

---

## Onda 2 — Backend: API (rotas & casos de uso)

**Meta:** Fastify + CORS + error handler global + CRUD (create/list/resolve/delete), em camadas rota→use-case→repo. **Sem CSV/R2.**
**Paralelismo:** após T1+T2, os 4 casos de uso (T4–T7) são independentes.

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W2-T1 | Bootstrap `server.ts`/`app.ts` (CORS, `setErrorHandler`, `buildApp` p/ testes) | D11, Art.2 R2/R5 | `server/src/server.ts`, `app.ts` |
| W2-T2 | Erros de negócio + error handler global (Zod→400, 409, 404, 500 sem stack) | D11, BE-02/03 | `src/http/error-handler.ts` |
| W2-T3 | Schemas Zod das rotas (create, list query, serializer camelCase) | BE-02, D8/D9/D11 | `src/schemas/link.ts`, `pagination.ts` |
| W2-T4 | `POST /links` — cria; slug opcional via **nanoid alfabeto `[a-z0-9-]`**; 409 duplicado | BE-01, BE-03, D8, D11, D1 | `use-cases/create-link.ts`, `lib/slug.ts` |
| W2-T5 | `GET /links` — paginado offset/limit, `created_at desc`, `total` | BE-06, BE-11, D9 | `use-cases/list-links.ts` |
| W2-T6 | `GET /links/:shortUrl` — resolve + **incremento atômico** (`+1 RETURNING`), 404 | BE-05, BE-07, D7 | `use-cases/resolve-link.ts` |
| W2-T7 | `DELETE /links/:id` — por UUID (D1), 204/404 | BE-04, D1, D11 | `use-cases/delete-link.ts` |
| W2-T8 | Testes de integração das rotas (`buildApp` + Postgres teste, truncate/beforeEach) | BE-01..07, BE-11, D5/D7/D8/D9 | `test/http/*.test.ts` |

**Saída:** 4 rotas ponta a ponta com status semânticos; slug gerado quando ausente; incremento no resolve (sem PATCH); mutação por `id`; suíte de integração verde e isolada.

---

## Onda 3 — Backend: Export CSV, R2 & Testes

**Meta:** export CSV por **streaming** → R2 (nome único) via `POST /links/exports` → `{url}`; fechar a suíte de integração cobrindo BE-01…BE-12 com **linhas ≥85% / branches ≥80%**.
**Paralelismo:** T1, T2, T7 independentes; T3←T1+T2; T4←T3.

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W3-T1 | `lib/storage.ts` — S3Client→endpoint R2, `uploadCsv`, `buildCsvKey` (`links-<nanoid>.csv`). **Modo configurável real/stub por env** ⚑ (p/ E2E) | BE-09, BE-10, D2 | `server/src/lib/storage.ts` |
| W3-T2 | `lib/csv.ts` — `Readable` por cursor/stream; header `original_url,short_url,access_count,created_at`; escaping CSV | BE-08, BE-12, D6 | `server/src/lib/csv.ts` |
| W3-T3 | Use-case `export-links` (csv→upload→`{url}`), storage injetável/mockável | BE-08/09/10, D6, D10 | `use-cases/export-links.ts` |
| W3-T4 | `POST /links/exports` (rota fina → `{url}`, 200) | BE-08/09, D10, D11 | `http/routes/export-links.ts` |
| W3-T5 | Conferir env R2 no `env.ts` + `.env.example` | BE-09, D2 | `server/src/env.ts` |
| W3-T6 | Mock de storage p/ testes (captura o Readable) + `read-stream` helper | BE-09, D2 | `test/mocks/storage.mock.ts` |
| W3-T7 | Harness de integração (Postgres teste, `globalSetup` migrate, thresholds 85/80) | D5, BE-11 | `vitest.config.ts`, `docker-compose.test.yml` |
| W3-T8 | Testes CRUD/resolve/list (BE-01..07, BE-11, D8) | BE-01..07, BE-11, D7/D8/D11 | `http/routes/*.test.ts` |
| W3-T9 | Teste do export (header 4 campos, escaping, `buildCsvKey` único) | BE-08/09/10/12, D6/D10 | `export-links.test.ts`, `csv.test.ts` |
| W3-T10 | Gate de cobertura + verificação BE-01..BE-12 | BE-01..12, D5 | `vitest.config.ts` |

**Saída:** export 200 `{url}` do R2, streaming, nome único; suíte determinística (roda 2×) com gate 85/80 em `use-cases`+`routes` e 100% schemas/erros; R2 mockado nos testes.

---

## Onda 4 — Frontend: Fundação & Design System

**Meta:** base do SPA — Tailwind Dracula, router das 3 rotas, http client + QueryClient, UI base (Button/Input/IconButton/Logo), schemas Zod. **Sem páginas completas.**
**Paralelismo:** após T1, três trilhas (estilos/logo · http/query/schemas · router/stubs).

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W4-T1 | Scaffold Vite+React+TS, alias `@`, `.env.example`, deps runtime/teste | FE-01/06, D3/D4 | `web/package.json`, `vite.config.ts` |
| W4-T2 | Tailwind com **todos** os tokens Dracula (bater 1:1 com SECOES) | D3, O4 | `web/tailwind.config.ts` |
| W4-T3 | `globals.css` + Open Sans + reset; fundo `--bg`/`--fg` | D3, O4 | `src/styles/globals.css` |
| W4-T4 | Router: `/`, `/:shortUrl`, `*` (param exatamente `shortUrl`) | FE-05, D7 | `src/app/router.tsx`, `App.tsx` |
| W4-T5 | Stubs das 3 páginas | FE-01, FE-05 | `src/pages/{home,redirect,not-found}/` |
| W4-T6 | `lib/http.ts` — baseURL `VITE_BACKEND_URL`, erro tipado preservando status (D11) | D11, FE-02/03/05 | `src/lib/http.ts` |
| W4-T7 | `query-client.ts` + `providers.tsx` (QueryClientProvider) | D3, FE-06 | `src/lib/query-client.ts` |
| W4-T8 | Schemas Zod compartilhados — URL **http/https** (D13), slug (D8); msgs pt-BR; **100%** | FE-02/03, D8/D11/**D13** | `src/features/links/schemas.ts` |
| W4-T9 | Assets da logo em `public/` + favicon (ícone isolado) | O4 | `web/public/brev.ly-logo*.png`, `Logo.tsx` |
| W4-T10 | `Button` (primary/secondary, 48px, loading/disabled) | FE-01, FE-08 | `src/components/Button.tsx` |
| W4-T11 | `Input` (label, prefixo `brev.ly/`, erro, a11y, RHF ref) | FE-01, FE-02 | `src/components/Input.tsx` |
| W4-T12 | `IconButton` (copiar/deletar/download, ≥32px, aria-label) + lib de ícones | FE-04, FE-08 | `src/components/IconButton.tsx` |
| W4-T13 | Barrel + setup de teste + smoke tests dos componentes/App | FE-01/04/08, D3 | `src/components/index.ts` |

**Saída:** dev/build limpos; 3 rotas montam stubs; tokens Dracula 1:1; QueryClient ativo; http tipado preservando 400/409/404; schemas 100%; componentes base com smoke test. **Sem** páginas nem chamadas de endpoint.

---

## Onda 5 — Frontend: Features & Páginas

**Meta:** api + hooks React Query + 3 páginas completas com todos os estados de UX e responsividade; testes RTL+MSW cobrindo FE-01…FE-08 com **linhas ≥80% / branches ≥75%**.
**Paralelismo:** gargalo T1→T2→T3; depois trilha home (T5–T7) ∥ páginas simples (T8–T9) ∥ utils (T4).

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W5-T1 | Schemas Zod de links (URL http/https, slug); tipos `LinkItem`/`LinkListResponse`; msgs pt-BR; **100%** | FE-02, D8/D11/D13 | `features/links/schemas.ts` |
| W5-T2 | Camada `api/` (create/list/delete/resolve/export) — **toda I/O aqui**; `ApiError` c/ status | FE-01/04/05/06/08, D1/D7/D9/D10/D11 | `features/links/api/*` |
| W5-T3 | 5 hooks React Query (create/list/delete/resolve/export) + query-keys; invalidação | FE-01/04/05/06/08, D7/D9/D11 | `features/links/hooks/*` |
| W5-T4 | Utils UX: `copyToClipboard` (feedback), `downloadFromUrl` (CSV) | FE-07, FE-08, D10 | `src/lib/clipboard.ts`, `download.ts` |
| W5-T5 | `LinkForm` (RHF + zodResolver): erro 400/409 no campo; estado "Salvando…" | FE-01/02/03, D11 | `features/links/components/LinkForm.tsx` |
| W5-T6 | `LinkList`/`LinkRow`/`EmptyState`: contador, copiar, deletar, Baixar CSV, loading/error, **ações bloqueadas por estado** | FE-04/06/07/08, D10 | `components/LinkList.tsx`, `LinkRow.tsx` |
| W5-T7 | Página **Home** (logo, grid 2col desktop / empilhado mobile-first) | FE-01/04/06/07/08 | `src/pages/home/HomePage.tsx` |
| W5-T8 | Página **Redirect** (useResolve → `location.assign`; 404→not-found; fallback) | FE-05, FE-07, D7/D11 | `src/pages/redirect/RedirectPage.tsx` |
| W5-T9 | Página **404** (título, CTA brev.ly, catch-all) | FE-05 | `src/pages/not-found/NotFoundPage.tsx` |
| W5-T10 | Setup RTL+MSW + testes de schemas/api/hooks (100% schemas) | FE-01/02/03/06, D9/D11 | `test/msw/*`, `*.test.ts` |
| W5-T11 | Testes de componentes Home (LinkForm + LinkList) | FE-01/02/03/04/06/08 | `LinkForm.test.tsx`, `LinkList.test.tsx` |
| W5-T12 | Testes das páginas Redirect e 404 (mock `location.assign`) | FE-05, FE-07 | `RedirectPage.test.tsx`, `NotFoundPage.test.tsx` |

**Saída:** FE-01…FE-08 implementados e testados; I/O só em `features/links/api`; 3 páginas roteadas; UX loading/empty/error + bloqueio por estado; mobile-first ≤768px; gate 80/75 em `features/links`; `npm test`/`build` verdes.

---

## Onda 6 — E2E & Fechamento

**Meta:** 7 jornadas (constitution Art.5) em Playwright **mobile + desktop** sobre ambiente efêmero (Compose); validar aceite do PRD §9; preparar repositório público.
**Paralelismo:** após T1+T2, specs T4–T10 independentes; README/aceite em paralelo.

| Task | Descrição | Requisitos | Arquivos-chave |
|------|-----------|-----------|----------------|
| W6-T1 | Scaffold Playwright (`e2e/` na raiz), 2 projects (desktop 1280 / mobile 390) | Art.5, D9/D11 | `e2e/playwright.config.ts` |
| W6-T2 | Compose E2E (Postgres+server+web), **storage stub via env** (usa modo de W3-T1) ⚑, seed/cleanup | Art.5 R2, D2/D6, BE-09 | `e2e/docker-compose.e2e.yml`, `scripts/run-e2e.sh` |
| W6-T3 | Page Objects (Home/Redirect/NotFound) por role/label | FE-01/04/06/08 | `e2e/pages/*.page.ts` |
| W6-T4 | Jornada 1 — Criar link (+ slug aleatório D8) | FE-01, BE-01, D8 | `create-link.spec.ts` |
| W6-T5 | Jornada 2 — Validação + duplicado (400/409) | FE-02/03, BE-02/03, D11 | `validate-duplicate.spec.ts` |
| W6-T6 | Jornada 3 — Redirect + incremento de contador | FE-05/07, BE-05/07, D7 | `redirect-counter.spec.ts` |
| W6-T7 | Jornada 4 — 404 (slug inexistente + rota inválida) | FE-05, BE-05, D11 | `not-found.spec.ts` |
| W6-T8 | Jornada 5 — Deletar link | FE-04, BE-04, D1 | `delete-link.spec.ts` |
| W6-T9 | Jornada 6 — Baixar CSV (URL/download + desabilitado no empty) | FE-08, BE-08/09/10/12, D6/D10 | `export-csv.spec.ts` |
| W6-T10 | Jornada 7 — Empty state (base limpa, ações bloqueadas) | FE-06, UX, Art.1 R7 | `empty-state.spec.ts` |
| W6-T11 | READMEs raiz + `web/` + `server/` | PRD §5/§7, Art.2 R3, D4 | `README.md`, `*/README.md` |
| W6-T12 | Matriz responsiva (7 jornadas × 2 viewports) + estabilização (web-first assertions) | Art.5 R3/R2 | `e2e/playwright.config.ts` |
| W6-T13 | Revisão final do aceite PRD §9 + matriz rastreabilidade | PRD §9, BE/FE, Art.6 | `ACEITE.md` |
| W6-T14 | Repo público (web/+server/), sem segredos, extras em branch separada; CI opcional | PRD §7, Art.6 R3, D4 | `.github/workflows/ci.yml` |

**Saída:** 14 execuções (7×2) estáveis em 3 rodadas; README sobe tudo do zero; aceite §9 verificado com evidências; repo público sem segredos, extras isolados.

---

## Rastreabilidade (requisito → onda/task → teste)

**Backend**

| Req | Implementação | Teste |
|-----|---------------|-------|
| BE-01 | W2-T4 | W2-T8 / W3-T8 · E2E W6-T4 |
| BE-02 | W1-T5/T6, W2-T3/T4 | W1-T7 / W3-T8 · E2E W6-T5 |
| BE-03 | W1-T2 (unique), W2-T4 | W2-T8 / W3-T8 · E2E W6-T5 |
| BE-04 | W2-T7 | W3-T8 · E2E W6-T8 |
| BE-05 | W2-T6 | W3-T8 · E2E W6-T6/T7 |
| BE-06 | W2-T5 | W3-T8 |
| BE-07 | W2-T6 (atômico) | W3-T8 · E2E W6-T6 |
| BE-08 | W3-T2/T3/T4 | W3-T9 |
| BE-09 | W3-T1/T4 | W3-T9 |
| BE-10 | W3-T1 (`buildCsvKey`) | W3-T9 |
| BE-11 | W1-T2 (índice), W2-T5 (paginação) | W3-T8 |
| BE-12 | W3-T2 (4 campos) | W3-T9 |

**Frontend**

| Req | Implementação | Teste |
|-----|---------------|-------|
| FE-01 | W5-T5, W5-T2/T3 | W5-T11 · E2E W6-T4 |
| FE-02 | W4-T8/W5-T1, W5-T5 | W5-T10/T11 · E2E W6-T5 |
| FE-03 | W5-T5 (trata 409) | W5-T11 · E2E W6-T5 |
| FE-04 | W5-T6, W5-T3 | W5-T11 · E2E W6-T8 |
| FE-05 | W5-T8, W5-T3 | W5-T12 · E2E W6-T6/T7 |
| FE-06 | W5-T6 (empty state) | W5-T11 · E2E W6-T10 |
| FE-07 | W5-T6/T8 | W5-T12 · E2E W6-T6 |
| FE-08 | W5-T4/T6, W5-T3 | W5-T11 · E2E W6-T9 |

**Camadas de teste:** back (W1-T7, W2-T8, W3-T7…T10 · gate 85/80) · front (W4-T13, W5-T10…T12 · gate 80/75) · E2E (W6-T4…T10, 2 viewports).

---

## Ajustes aplicados (pós-auditoria)

O auditor deu veredito **AJUSTAR** — cobertura funcional completa, mas com 5 correções de consistência, todas incorporadas acima:

1. **Dependências renumeradas** — referências cruzadas `dependsOn` normalizadas para o esquema único W0…W6 (o grafo no topo é a fonte da verdade). W5 depende de **W3 + W4** (não "Onda 3/4" soltas).
2. **`nanoid` e `@aws-sdk/client-s3` declarados na fundação** (W0-T2) — antes eram usados em W2/W3 sem task de instalação.
3. **Decisão http/https resolvida → D13** — `z.string().url()` restrito a `http`/`https`, regra idêntica no back (W1-T5) e front (W4-T8/W5-T1).
4. **Contradição D1×D7 reconciliada** — PRD ajustado: D1 cobre só `DELETE /links/:id`; incremento no resolve (D7), sem `PATCH /access`.
5. **Propriedade de arquivos W0×W1 esclarecida** + **storage configurável real/stub** (W3-T1) para o E2E (W6-T2) usar sem refactor.

**Gaps menores registrados** (não são requisitos numerados, sem bloqueio): feedback "copiado" coberto só por unit test (sem E2E dedicado); o corpo do erro 409 não amarra semanticamente o campo `shortUrl` (só o status) — o front assume 409 = conflito de slug.
