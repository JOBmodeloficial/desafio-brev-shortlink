# Aceite — Brev.ly

Verificação final dos critérios do desafio ([PRD §9](./PRD.md#9-critérios-de-aceite)) com evidências
e matriz de rastreabilidade requisito → implementação → teste.

## Checklist do PRD §9

- [x] **12 requisitos de Backend** (BE-01…BE-12) atendidos e testados.
- [x] **8 requisitos funcionais de Frontend** (FE-01…FE-08) atendidos e testados.
- [x] **3 páginas** funcionando (raiz, redirecionamento, 404).
- [x] SPA em React + Vite; tema fiel ao design (Dracula); responsivo; estados de UX cobertos.
- [x] `.env.example` presente em `web/` e `server/`.
- [x] Script **exato** `db:migrate` funcional (drizzle-kit).
- [x] Dockerfile do backend gera imagem funcional (multi-stage, `node:22-alpine`, não-root).
- [x] CORS habilitado (`@fastify/cors`).
- [x] CSV com os 4 campos, acessível via CDN (R2), com nome aleatório e único.
- [x] Repositório público com subpastas `web/` e `server/`.

## Suítes de teste (todas verdes)

| Suíte | Ferramentas | Testes | Cobertura |
|-------|-------------|:------:|-----------|
| Backend | Vitest + Postgres | 46 | 99% stmts / 97% branch (gate 85/80) |
| Frontend | Vitest + RTL + MSW | 36 | 94% stmts / 89% branch (`features/links` gate 80/75) |
| E2E | Playwright (desktop + mobile) | 20 (7 jornadas × 2) | 7 jornadas, estável em execuções repetidas |

## Rastreabilidade — Backend

| Req | Implementação | Teste |
|-----|---------------|-------|
| BE-01 criar link | `use-cases/create-link` + `POST /links` | `http/routes/links.test` · E2E criar |
| BE-02 URL/slug mal formatado → 400 | `schemas/link` + error handler | `schemas/link.test` · `links.test` · E2E validação |
| BE-03 slug duplicado → 409 | `db/schema` (unique) + `create-link` | `links.test` · E2E duplicado |
| BE-04 deletar → 204/404 | `use-cases/delete-link` + `DELETE /links/:id` | `links.test` · E2E deletar |
| BE-05 resolver por shortUrl | `use-cases/resolve-link` + `GET /links/:shortUrl` | `links.test` · E2E redirect/404 |
| BE-06 listar | `use-cases/list-links` + `GET /links` | `links.test` |
| BE-07 incrementar acessos | `resolve-link` (UPDATE atômico) | `links.test` · E2E contador |
| BE-08 exportar CSV | `lib/csv` + `use-cases/export-links` | `csv.test` · `export-links.test` · E2E CSV |
| BE-09 CSV via CDN (R2) | `lib/storage` (S3/R2) + `POST /links/exports` | `storage.test` · `export-links.test` |
| BE-10 nome único do arquivo | `lib/storage` (`buildCsvKey`) | `storage.test` |
| BE-11 listagem performática | índice único + paginação offset/limit | `links.test` |
| BE-12 CSV com 4 campos | `lib/csv` (header + linhas) | `csv.test` · `export-links.test` |

## Rastreabilidade — Frontend

| Req | Implementação | Teste |
|-----|---------------|-------|
| FE-01 criar link | `LinkForm` + `useCreateLink` | `LinkForm.test` · E2E criar |
| FE-02 validar encurtamento | `schemas` (Zod) + `LinkForm` | `schemas.test` · `LinkForm.test` · E2E validação |
| FE-03 impedir duplicidade | `LinkForm` (trata 409) | `LinkForm.test` · E2E duplicado |
| FE-04 deletar link | `LinkRow` + `useDeleteLink` | `LinkList.test` · E2E deletar |
| FE-05 obter URL original | `RedirectPage` + `useResolve` | `redirect.test` · E2E redirect/404 |
| FE-06 listar + empty state | `LinkList` / `EmptyState` | `LinkList.test` · E2E empty |
| FE-07 incrementar acessos | `LinkRow` (link) + `RedirectPage` | `redirect.test` · E2E contador |
| FE-08 baixar CSV | `LinkList` + `useExport` + `downloadFromUrl` | `LinkList.test` · E2E CSV |

## DevOps / NFR

| Item | Evidência |
|------|-----------|
| CORS | `server/src/server.ts` (`@fastify/cors`, `origin: true`) |
| `db:migrate` exato | `server/package.json` (`drizzle-kit migrate`) + migration aplicada |
| Dockerfile multi-stage | `server/Dockerfile` (build validado com `docker build`) |
| `.env.example` (web + server) | presentes, com as chaves exatas do PRD §5 |
| CSV por streaming + nome único | `lib/csv` (cursor) + `lib/storage` (`links-<id>.csv`) |
| Repositório público | https://github.com/JOBmodeloficial/desafio-brev-shortlink |
