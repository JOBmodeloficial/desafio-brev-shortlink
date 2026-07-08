# Tasks — W0-T6 · .env.example do backend

Arquivo: `server/.env.example`.

## Tarefas

- [x] **T6.1** — Arquivo `server/.env.example` versionado. — FR-1
- [x] **T6.2** — Exatamente 7 chaves na ordem: `PORT`, `DATABASE_URL`, `CLOUDFLARE_ACCOUNT_ID`,
      `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_BUCKET`,
      `CLOUDFLARE_PUBLIC_URL`. — FR-2/FR-3
- [x] **T6.3** — `PORT=3333` (C2) e `DATABASE_URL` apontando ao Postgres do compose. — FR-4
- [x] **T6.4** — Paridade com o schema Zod de `env.ts` (superset exato). — FR-5
- [x] **T6.5** — `DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly` (C3), consistente
      com `docker-compose.yml`. — FR-6

## Notas

- Gate `/clarify` C3 sobrescreve o exemplo `docker:docker` do rascunho da spec → usa `brevly:brevly`.
- `CLOUDFLARE_*` com `=""` (não-secretos). Uma variável por linha, sem espaços ao redor do `=`, LF.
