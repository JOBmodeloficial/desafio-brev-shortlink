# Tasks — W0-T3 · docker-compose com Postgres (dev)

Arquivo: `server/docker-compose.yml`.

## Tarefas

- [x] **T3.1** — Serviço `db` com imagem `postgres:16-alpine`. — FR-1
- [x] **T3.2** — Porta `${POSTGRES_PORT:-5432}:5432`. — FR-2
- [x] **T3.3** — Envs `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` default `brevly` (C3). — FR-3
- [x] **T3.4** — Volume nomeado `brevly_pgdata` em `/var/lib/postgresql/data`. — FR-4
- [x] **T3.5** — Healthcheck via `pg_isready -U ... -d ...` com interval/timeout/retries/start_period. — FR-5
- [x] **T3.6** — `restart: unless-stopped`. — FR-6
- [x] **T3.7** — Override via `${VAR:-default}` (user/password/db/port). — FR-7

## Notas

- Sem atributo `version:` (Compose v2). Sem serviço `app` (escopo restrito ao Postgres de dev).
- Compatível 1:1 com `DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly` do `.env.example`.
