# W0-T12 — Tasks

> Onda 0 (Fundação & DevOps) · Requisitos: **D4**
> Spec: [spec.md](./spec.md) · Fontes: [PRD](../../../PRD.md) §5/§7/§9,
> [constitution](../../../constitution.md) Art.1/Art.2, [WAVES](../../../WAVES.md) Onda 0.
> Arquivo-chave: `README.md` (raiz do repositório).

Esta é a **última task da Onda 0**: escreve o `README.md` na raiz, amarrando os artefatos
de W0-T1…T11 em um roteiro reproduzível de setup + verificação da fundação. **Sem features,
sem contrato de API.**

---

## T1 — Levantar os fatos dos artefatos reais (NFR-5)

Ler, no momento da escrita, os valores canônicos a citar no README (evitar divergência):

- [x] `.nvmrc` → `22` (Node 22 nos pré-requisitos; `nvm use` / `fnm use`).
- [x] `server/package.json` → scripts `dev` (`tsx watch src/server.ts`) e **`db:migrate`**
      (`drizzle-kit migrate`); `engines.node >=22`.
- [x] `server/docker-compose.yml` → serviço **`db`** (`postgres:16-alpine`), porta `5432`,
      user/senha/db `brevly`/`brevly`/`brevly`, volume `brevly_pgdata`, healthcheck
      `pg_isready`.
- [x] `server/.env.example` → `PORT=3333`,
      `DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly`, `CLOUDFLARE_*`.
- [x] `web/package.json` → script `dev` (`vite`).
- [x] `web/vite.config.ts` → sem override de porta ⇒ Vite dev em `http://localhost:5173`.
- [x] `web/.env.example` → `VITE_FRONTEND_URL`, `VITE_BACKEND_URL`.
- [x] `web/src/app/router.tsx` → 3 rotas placeholder (`/`, `/:shortUrl`, `*`).

**AC:** todos os nomes de script, portas, credenciais e URLs do README batem 1:1 com os
arquivos acima. (FR-11, NFR-5)

## T2 — Criar `README.md` na raiz com a estrutura de seções da spec

- [x] Título + descrição curta (uma frase; sem features). (FR-1)
- [x] Seção **Estrutura do projeto** — árvore mínima com `web/` e `server/` como pacotes
      npm independentes, **sem workspaces** (D4). (FR-3, NFR-3)
- [x] Seção **Pré-requisitos** — Node 22 via `.nvmrc` (`nvm use`/`fnm use`) + Docker com
      **Docker Compose v2** (`docker compose`). (FR-2)

**AC:** existe `README.md` na raiz, versionado; Markdown válido, UTF-8, LF, blocos com
linguagem (`bash`/`powershell`). (FR-1, NFR-7)

## T3 — Configuração inicial (install + env)

- [x] `npm install` **por pasta** em `server/` e `web/` (reflete D4, sem workspaces). (FR-4)
- [x] Copiar `server/.env.example` → `server/.env` e `web/.env.example` → `web/.env`, com
      variantes **POSIX** (`cp`) **e** **PowerShell** (`Copy-Item`). (FR-5, NFR-2)

**AC:** ambas as pastas instaladas isoladamente; ambos os `.env` criados; duas variantes de
cópia presentes.

## T4 — Subir o banco + migrations (ordem correta)

- [x] Subir Postgres a partir de `server/`: `docker compose up -d` (serviço `db`, porta
      `5432`); aguardar `healthy` via `docker compose ps`. (FR-6)
- [x] Nota de credenciais de dev: `brevly`/`brevly`/`brevly` @ `localhost:5432` e a
      `DATABASE_URL` correspondente. (FR-11)
- [x] Rodar migrations com o script **exato** `npm run db:migrate` dentro de `server/`,
      **após** banco healthy + `.env` configurado. (FR-7, NFR-6)

**AC:** ordem executável (env → banco → migrate); string literal `db:migrate`; credenciais
consistentes com compose e `.env.example`. (FR-6, FR-7, FR-11, NFR-6)

## T5 — Rodar em desenvolvimento

- [x] Backend: `npm run dev` em `server/`; verificar `GET http://localhost:3333/health` →
      `200 {"status":"ok"}`. (FR-8)
- [x] Frontend: `npm run dev` em `web/`; abrir `http://localhost:5173` (3 rotas
      placeholder). (FR-9)

**AC:** ambos os comandos de dev documentados com URL/rota de verificação corretas.

## T6 — Seção de verificação da fundação (smoke) + fronteira

- [x] Checklist objetivo espelhando a "Saída" da Onda 0: `/health` 200; Vite serve as 3
      rotas placeholder; Postgres aceita conexão; `db:migrate` conclui sem erro. (FR-10)
- [x] Nota **Fora de escopo (nesta fase)**: features e contrato de API virão nas ondas
      seguintes. (FR-12)
- [x] Referenciar `PRD.md`, `constitution.md`, `WAVES.md`.

**AC:** seção de verificação presente; README **não** contém instruções de feature,
contrato de API nem segredos reais (só placeholders de dev). (FR-10, FR-12, NFR-4)

---

## Verificação global (critérios de aceite da spec)

- [x] `README.md` na raiz, versionado. (FR-1)
- [x] Pré-requisitos: Node LTS (via `.nvmrc`) + Docker Compose v2. (FR-2)
- [x] Monorepo `web/` + `server/` sem workspaces; `npm install` por pasta. (FR-3, FR-4)
- [x] Cópia de `.env.example` → `.env` nas duas pastas, POSIX **e** PowerShell. (FR-5)
- [x] `docker compose up -d` a partir de `server/`, serviço `db` / porta `5432`. (FR-6)
- [x] Script exato `npm run db:migrate`, na ordem correta. (FR-7)
- [x] Backend em dev + rota `/health` (200). (FR-8)
- [x] Frontend em dev (Vite) + onde acessá-lo. (FR-9)
- [x] Seção de Verificação da fundação. (FR-10)
- [x] Credenciais `brevly`/`brevly`/`brevly` @ `localhost:5432` batem com compose e
      `.env.example`. (FR-11)
- [x] Sem features / contrato de API / segredos reais. (FR-12, NFR-4)
</content>
</invoke>
