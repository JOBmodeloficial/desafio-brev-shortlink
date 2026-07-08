# Brev.ly

Encurtador de URL — monorepo com dois pacotes npm independentes: `web/` (SPA React + Vite) e
`server/` (API Fastify + Drizzle + Postgres).

> Este README cobre **apenas a fundação** (setup + verificação): pré-requisitos, variáveis de
> ambiente, banco, migrations, rodar em dev e conferir que tudo sobe. As features de negócio e o
> contrato de API serão documentados nas ondas seguintes — veja
> [`WAVES.md`](./WAVES.md), [`PRD.md`](./PRD.md) e [`constitution.md`](./constitution.md).

---

## Estrutura do projeto

`web/` e `server/` são **pacotes npm independentes** — **não há workspaces** (Turborepo, Nx,
Lerna ou workspaces de gerenciador). Cada subprojeto se instala e roda **dentro da sua própria
pasta**.

```
desafio-brev-shortlink/
├── README.md              # este arquivo (setup + verificação da fundação)
├── .nvmrc                 # versão do Node (22)
├── server/                # API Fastify + TS
│   ├── package.json       # scripts: dev, build, db:migrate, ...
│   ├── docker-compose.yml # serviço "db" (Postgres) para desenvolvimento
│   └── .env.example       # template de variáveis do backend
└── web/                   # SPA React + Vite + TS
    ├── package.json       # scripts: dev, build, ...
    └── .env.example       # template de variáveis do frontend
```

---

## Pré-requisitos

- **Node 22** — a versão está fixada em [`.nvmrc`](./.nvmrc). Com um gerenciador de versões:

  ```bash
  node -v      # deve reportar v22.x
  nvm use      # ou: fnm use  (lê a versão do .nvmrc)
  ```

- **Docker** com **Docker Compose v2** (comando `docker compose`, sem hífen) — usado apenas para
  subir o Postgres de desenvolvimento.

  ```bash
  docker --version
  docker compose version
  ```

---

## Configuração inicial

### 1. Instalar dependências (por pasta)

Sem workspaces: instale em cada subprojeto separadamente.

```bash
cd server && npm install
cd ../web && npm install
```

### 2. Copiar os templates de ambiente

Crie o `.env` de cada pasta a partir do respectivo `.env.example`.

**POSIX (Linux/macOS):**

```bash
cp server/.env.example server/.env
cp web/.env.example web/.env
```

**Windows (PowerShell):**

```powershell
Copy-Item server/.env.example server/.env
Copy-Item web/.env.example web/.env
```

> Os `.env.example` já trazem **placeholders de desenvolvimento** — nenhum segredo real. As
> chaves `CLOUDFLARE_*` do backend são opcionais nesta fase e podem ficar vazias.

---

## Subir o banco (Postgres)

A partir de `server/`, suba o serviço `db` (`postgres:16-alpine`) definido em
`server/docker-compose.yml`:

```bash
cd server
docker compose up -d      # serviço "db": postgres:16-alpine em localhost:5432
docker compose ps         # aguarde o status "healthy" antes de seguir
```

> **Credenciais de dev** (padrão do `docker-compose.yml` e do `.env.example`):
> usuário `brevly` · senha `brevly` · banco `brevly` · `localhost:5432`
>
> `DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly`

---

## Rodar as migrations

Depois que o Postgres estiver **healthy** e o `server/.env` estiver configurado, aplique as
migrations a partir de `server/`:

```bash
cd server
npm run db:migrate
```

---

## Rodar em desenvolvimento

**Backend** — dentro de `server/`:

```bash
npm run dev
```

Verifique a rota de saúde:

```bash
curl http://localhost:3333/health     # → 200 {"status":"ok"}
```

**Frontend** — dentro de `web/` (em outro terminal):

```bash
npm run dev
```

Abra **http://localhost:5173** no navegador (Vite). O app serve 3 rotas placeholder: `/`,
`/:shortUrl` e o catch-all de página não encontrada.

---

## Verificação da fundação

Smoke check — a Onda 0 está de pé quando **todos** os itens abaixo passam:

- [ ] `cd server && npm install` e `cd web && npm install` concluem sem erro.
- [ ] `docker compose up -d` (em `server/`) sobe o serviço `db` e `docker compose ps` mostra
      **healthy** (Postgres aceitando conexão em `localhost:5432`).
- [ ] `npm run db:migrate` (em `server/`) conclui sem erro.
- [ ] `npm run dev` (em `server/`) sobe a API e `GET http://localhost:3333/health` responde
      **200** com `{"status":"ok"}`.
- [ ] `npm run dev` (em `web/`) serve o app em **http://localhost:5173** e as **3 rotas
      placeholder** carregam.

---

## Fora de escopo (nesta fase)

As **features de negócio** (criar/listar/deletar/resolver link, export CSV) e o **contrato de
API** ainda não existem — serão entregues e documentados nas Ondas 1–5. Consulte
[`PRD.md`](./PRD.md) (§8), [`constitution.md`](./constitution.md) e [`WAVES.md`](./WAVES.md) para
o roadmap.
</content>
