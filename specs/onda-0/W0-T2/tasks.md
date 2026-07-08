# Tasks — W0-T2 · Scaffold do backend Fastify + TypeScript

Trilha backend implementada em `server/` (package único, consistente entre W0-T2..T7).

## Tarefas

- [x] **T2.1** — `server/package.json` (`type: module`, `private: true`, `engines.node >=22`
      alinhado ao `.nvmrc` "22"). — FR-1
- [x] **T2.2** — dependencies de runtime: `fastify` ^5, `@fastify/cors`, `drizzle-orm`,
      `postgres`, `zod` ^3, `nanoid`, `@aws-sdk/client-s3`, `dotenv` (C9). — FR-2
- [x] **T2.3** — devDependencies de toolchain: `typescript`, `tsx`, `drizzle-kit`, `vitest`,
      `@types/node` (+ eslint/prettier/coverage de W0-T7). — FR-3
- [x] **T2.4** — `server/tsconfig.json` (`strict`, `module`/`moduleResolution` NodeNext,
      `target` ES2022, `outDir dist`, `rootDir src`, `esModuleInterop`, `skipLibCheck`,
      `forceConsistentCasingInFileNames`, `resolveJsonModule`). — FR-4
- [x] **T2.5** — `src/env.ts`: `import "dotenv/config"` + Zod fail-fast (`PORT` coerce default
      3333, `DATABASE_URL` url, `CLOUDFLARE_*` opcionais), `process.exit(1)` logando o flatten. — FR-5
- [x] **T2.6** — `src/server.ts`: Fastify 5 + `@fastify/cors` `origin: true`; `buildApp()`
      exportado separado do `listen`; `listen host 0.0.0.0 port env.PORT` em try/catch com exit≠0. — FR-6
- [x] **T2.7** — `GET /health` → `200 { status: "ok" }` (sem tocar banco). — FR-7
- [x] **T2.8** — Árvore `src/` do Artigo 2: `http/routes/`, `http/errors/`, `use-cases/`,
      `schemas/` (`.gitkeep`), `db/schema.ts` + `db/client.ts`, `lib/storage.ts` + `lib/csv.ts`
      (stubs com TODO das ondas 2/3). — FR-8
- [x] **T2.9** — Scripts: `dev` (tsx watch), `build` (tsc), `start` (node dist), `test`, `lint`,
      `format`, `db:migrate`. — FR-9

## Notas

- Imports relativos internos com extensão `.js` (NodeNext). ESM puro, sem `require`.
- `buildApp()` não importa `env` no topo (import dinâmico em `start()`) para manter o smoke
  test determinístico e sem dependência de `DATABASE_URL`.
- Sem regra de negócio: nenhuma tabela `links`, rota de domínio ou schema de URL/slug.
