# Brev.ly

Encurtador de URL full-stack — desafio prático da Rocketseat (Frontend + Backend + DevOps).

Monorepo com dois pacotes npm independentes (**sem workspaces**) e uma suíte E2E:

- **`web/`** — SPA em React + Vite + TypeScript (Tailwind, React Query, React Hook Form, Zod).
- **`server/`** — API em Fastify + Drizzle + Postgres + TypeScript (upload de CSV para Cloudflare R2).
- **`e2e/`** — testes end-to-end com Playwright (desktop + mobile).

Documentos de projeto: [`PRD.md`](./PRD.md) · [`constitution.md`](./constitution.md) · [`WAVES.md`](./WAVES.md) · [`ACEITE.md`](./ACEITE.md).

---

## Funcionalidades

- Criar link (slug informado ou gerado automaticamente), rejeitando URL mal formatada ou slug duplicado.
- Listar, deletar e resolver links; o acesso incrementa o contador ao abrir a URL encurtada.
- Exportar os links em **CSV** (streaming do Postgres) hospedado em **CDN** (Cloudflare R2), com nome único.
- SPA responsiva (mobile-first) com 3 páginas: home (`/`), redirecionamento (`/:url-encurtada`) e 404.

---

## Estrutura

```
desafio-brev-shortlink/
├── server/   API Fastify + Drizzle + Postgres (+ Dockerfile, docker-compose)
├── web/      SPA React + Vite + Tailwind (tema Dracula)
├── e2e/      Playwright (7 jornadas × desktop/mobile)
├── PRD.md · constitution.md · WAVES.md · ACEITE.md
└── mockups/ · assets/
```

---

## Pré-requisitos

- **Node 22** (fixado em [`.nvmrc`](./.nvmrc); `nvm use` / `fnm use`).
- **Docker** + **Docker Compose v2** (`docker compose`) para o Postgres.

## Setup

```bash
# 1. Dependências (por pasta — sem workspaces)
cd server && npm install
cd ../web && npm install

# 2. Variáveis de ambiente (copie os templates)
cp server/.env.example server/.env   # PowerShell: Copy-Item server/.env.example server/.env
cp web/.env.example web/.env          # e preencha VITE_BACKEND_URL / VITE_FRONTEND_URL
```

Credenciais de dev (padrão do compose/`.env.example`): `brevly:brevly@localhost:5432/brevly`.

## Rodar em desenvolvimento

```bash
# Banco
cd server && docker compose up -d      # Postgres (aguarde "healthy")
npm run db:migrate                     # aplica as migrations

# Backend  (server/)
npm run dev                            # http://localhost:3333  (GET /health → 200)

# Frontend (web/, em outro terminal)
npm run dev                            # http://localhost:5173
```

No `web/.env`, use `VITE_BACKEND_URL=http://localhost:3333` e `VITE_FRONTEND_URL=http://localhost:5173`.

---

## Contrato de API

| Método | Rota | Descrição | Sucesso | Erros |
|--------|------|-----------|---------|-------|
| `POST` | `/links` | Cria link (`originalUrl`, `shortUrl?`) | `201` | `400` · `409` |
| `GET` | `/links?page=&pageSize=` | Lista paginada (`created_at desc`, `total`) | `200` | — |
| `GET` | `/links/:shortUrl` | Resolve a URL original **e incrementa o acesso** | `200` | `404` |
| `DELETE` | `/links/:id` | Deleta pelo `id` (UUID) | `204` | `404` |
| `POST` | `/links/exports` | Gera o CSV, envia ao R2 e retorna `{ url }` | `200` | — |

Detalhes de payload em [`PRD.md`](./PRD.md#8-contrato-de-api).

---

## Testes

```bash
# Backend — Vitest + Postgres (suba o compose antes)
cd server && npm run test:coverage     # gate: linhas ≥85% / branches ≥80%

# Frontend — Vitest + Testing Library + MSW
cd web && npm run test:coverage        # gate: features/links linhas ≥80% / branches ≥75%

# E2E — Playwright (7 jornadas × desktop/mobile)
cd server && docker compose up -d && npm run db:migrate   # Postgres pronto
cd ../e2e && npm install && npm run e2e:install           # Chromium (1ª vez)
npm run e2e                                               # sobe server (stub R2) + web e roda 20 testes
```

O E2E usa `STORAGE_DRIVER=stub` no backend para a jornada de CSV não depender do R2 real.

---

## DevOps

- **Dockerfile** multi-stage (`node:22-alpine`, usuário não-root) gera a imagem do backend:

  ```bash
  cd server && docker build -t brevly-server .
  ```

- Variáveis do backend (`server/.env.example`): `PORT`, `DATABASE_URL`, `CLOUDFLARE_ACCOUNT_ID`,
  `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_BUCKET`, `CLOUDFLARE_PUBLIC_URL`.
  Opcional: `STORAGE_DRIVER` (`r2` padrão | `stub`).
- Variáveis do frontend (`web/.env.example`): `VITE_FRONTEND_URL`, `VITE_BACKEND_URL`.

Detalhes por pacote em [`server/README.md`](./server/README.md) e [`web/README.md`](./web/README.md).
