# Brev.ly — Server

API do Brev.ly: **Fastify + Drizzle + Postgres + TypeScript**, com exportação de CSV para **Cloudflare R2**.

## Scripts

| Script                           | Descrição                                                |
| -------------------------------- | -------------------------------------------------------- |
| `npm run dev`                    | Sobe a API em modo watch (tsx) — `http://localhost:3333` |
| `npm run build`                  | Compila TypeScript para `dist/`                          |
| `npm start`                      | Executa `dist/server.js`                                 |
| `npm run db:generate`            | Gera migrations a partir do schema Drizzle               |
| `npm run db:migrate`             | Aplica as migrations (nome exato exigido pelo desafio)   |
| `npm run test` / `test:coverage` | Vitest (integração contra Postgres)                      |
| `npm run lint` / `format`        | ESLint / Prettier                                        |

## Ambiente

Copie `.env.example` para `.env`. Variáveis:

- `PORT` (padrão `3333`), `DATABASE_URL`.
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`,
  `CLOUDFLARE_BUCKET`, `CLOUDFLARE_PUBLIC_URL` — credenciais do R2 (necessárias para o export real).
- `STORAGE_DRIVER` — `r2` (padrão) ou `stub` (dev/E2E, não sobe ao R2).

## Banco (Postgres via Docker)

```bash
docker compose up -d      # serviço "db": postgres:16-alpine em localhost:5432
npm run db:migrate        # aplica as migrations
```

## Docker (imagem da aplicação)

```bash
docker build -t brevly-server .          # multi-stage, node:22-alpine, usuário não-root
docker run --env-file .env -p 3333:3333 brevly-server
```

## Estrutura

```
src/
├── server.ts            # bootstrap Fastify (CORS, error handler, buildApp)
├── env.ts               # validação de env (Zod, fail-fast)
├── http/
│   ├── routes/          # create / list / resolve / delete / export (rotas finas)
│   └── errors/          # erros de negócio → status HTTP (400/404/409/500)
├── use-cases/           # regras de negócio (uma por funcionalidade)
├── db/                  # schema Drizzle, client, migrations
├── schemas/             # Zod (URL http/https, slug, paginação)
└── lib/                 # slug (nanoid), csv (streaming), storage (R2)
```
