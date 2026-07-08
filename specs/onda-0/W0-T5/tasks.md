# Tasks — W0-T5 · drizzle.config.ts + script exato db:migrate

Arquivos: `server/drizzle.config.ts`, `server/src/db/schema.ts` (stub), `server/package.json` (scripts).

## Tarefas

- [x] **T5.1** — `server/drizzle.config.ts` via `defineConfig` de `drizzle-kit`. — FR-1
- [x] **T5.2** — `dialect: 'postgresql'`. — FR-2
- [x] **T5.3** — `schema: './src/db/schema.ts'`. — FR-3
- [x] **T5.4** — `out: './src/db/migrations'`. — FR-4
- [x] **T5.5** — `dbCredentials.url = process.env.DATABASE_URL` (nada hardcoded). — FR-5
- [x] **T5.6** — Script exato `"db:migrate": "drizzle-kit migrate"`. — FR-6
- [x] **T5.7** — Script `"db:generate": "drizzle-kit generate"`. — FR-7
- [x] **T5.8** — `src/db/schema.ts` stub (`export {}`, sem tabelas). — FR-8
- [x] **T5.9** — `drizzle-kit` (dev) + `drizzle-orm` (prod) no package.json. — FR-9

## Notas

- `import "dotenv/config"` no topo do config (C9) + guard fail-fast se `DATABASE_URL` ausente (NFR-3).
- Nenhuma migration gerada nesta onda (pasta `src/db/migrations/` inexistente).
