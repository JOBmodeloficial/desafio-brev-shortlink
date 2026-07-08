# W0-T3 — docker-compose com Postgres (dev)

> Onda 0 — Fundação & DevOps · Requisitos: **D4**, **BE-11**
> Arquivo-chave: `server/docker-compose.yml`
> Escopo: infraestrutura de desenvolvimento. **Sem regra de negócio.**

---

## Contexto / Por quê

O Brev.ly usa **Postgres** como banco obrigatório (PRD §4.1) e a
[constitution](../../../constitution.md) (Artigo 2) prevê um
`server/docker-compose.yml` para subir o **Postgres (+ app)** em desenvolvimento.

Esta task entrega **apenas o serviço de banco** de desenvolvimento: um Postgres
containerizado, determinístico e pronto para receber a `DATABASE_URL` que as
demais tasks consomem — `db:migrate` (W0-T5 / W1-T3), o cliente Drizzle
(W1-T4) e a suíte de integração (W2/W3). Sem um Postgres local reprodutível, o
restante da Onda 0 e das Ondas 1–3 não tem onde persistir.

O vínculo com **BE-11** (listagem performática) é indireto porém real: BE-11 se
apoia em índice único em `short_url` e paginação, o que exige um Postgres real
rodando localmente para validar migrations e desempenho — este compose é a base
dessa capacidade. **D4** fixa monorepo em pastas simples (`web/`, `server/`) com
**npm sem workspaces**, portanto o compose vive dentro de `server/` e usa
caminhos relativos a essa pasta.

O contrato central desta task é: **o Postgres exposto deve ser compatível com a
`DATABASE_URL`** consumida pelo backend (PRD §5.1) — mesmos usuário, senha,
banco, host e porta.

---

## Requisitos funcionais

- **FR-1** — O arquivo `server/docker-compose.yml` **MUST** definir um serviço de
  banco de dados nomeado `db` usando a imagem **`postgres:16-alpine`**.
- **FR-2** — O serviço **MUST** expor a porta **5432** do container para a porta
  **5432** do host (`"5432:5432"`), casando com a `DATABASE_URL` padrão de dev.
- **FR-3** — O serviço **MUST** definir as variáveis de ambiente
  `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` com os valores padrão de
  desenvolvimento (`brevly` / `brevly` / `brevly`), refletidos na `DATABASE_URL`.
- **FR-4** — O serviço **MUST** persistir os dados em um **volume nomeado**
  (`brevly_pgdata`) montado em `/var/lib/postgresql/data`, sobrevivendo a
  `docker compose down` (sem `-v`).
- **FR-5** — O serviço **MUST** declarar um **healthcheck** baseado em
  **`pg_isready`** (usando o mesmo usuário/banco das envs), com `interval`,
  `timeout` e `retries` definidos, de forma que o healthcheck só fique `healthy`
  quando o Postgres aceitar conexões.
- **FR-6** — O serviço **MUST** definir `restart: unless-stopped` para
  resiliência em ambiente de desenvolvimento.
- **FR-7** — O compose **MUST** permitir override das credenciais via variáveis
  do host com fallback embutido, no formato
  `${POSTGRES_USER:-brevly}` / `${POSTGRES_PASSWORD:-brevly}` /
  `${POSTGRES_DB:-brevly}` / `${POSTGRES_PORT:-5432}`, de modo que rodar sem
  `.env` já funcione com os padrões de dev.

---

## Requisitos não funcionais

- **NFR-1 — Determinismo:** subir e derrubar deve ser reprodutível; nenhum estado
  fora do volume nomeado. `docker compose up -d` seguido de `down`/`up` retoma os
  dados.
- **NFR-2 — Compatibilidade de contrato:** os valores de usuário/senha/banco/porta
  **MUST** ser exatamente os embutidos na `DATABASE_URL` de desenvolvimento
  (ver Abordagem técnica), evitando divergência com W0-T6 (`.env.example`).
- **NFR-3 — Zero tooling extra (D4):** apenas Docker Compose; sem scripts de
  orquestração adicionais nesta task. Compatível com a sintaxe
  `docker compose` v2 (sem depender do atributo `version:` legado).
- **NFR-4 — Isolamento:** o volume e (se declarada) a rede **SHOULD** ter nome
  prefixado por `brevly_` para não colidir com outros projetos na máquina.
- **NFR-5 — Leveza:** imagem `-alpine` para menor footprint, coerente com o
  padrão enxuto adotado no Dockerfile (W0-T4).

---

## Abordagem técnica

Arquivo único, conforme estrutura da constitution (Artigo 2):

```
server/
└── docker-compose.yml   # Postgres para dev (ESTA TASK)
```

Conteúdo de referência de `server/docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: brevly-db
    restart: unless-stopped
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-brevly}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-brevly}
      POSTGRES_DB: ${POSTGRES_DB:-brevly}
    volumes:
      - brevly_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-brevly} -d ${POSTGRES_DB:-brevly}"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s

volumes:
  brevly_pgdata:
```

**`DATABASE_URL` correspondente (dev)** — a ser fixada em W0-T6 (`.env.example`):

```
DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly
```

**Notas de implementação:**

- O nome do serviço `db` é o host de rede **entre containers**; a partir do
  host (onde roda o `db:migrate` do npm nesta fase) usa-se `localhost:5432`.
- O atributo `version:` do compose é omitido (obsoleto na CLI v2).
- **O serviço `app` NÃO entra nesta task** — nesta fase da Onda 0 o backend roda
  no host (`npm run dev`) e conecta via `localhost`. Adicionar o serviço `app`
  ao compose é responsabilidade de outra task (Dockerfile em W0-T4 e o compose
  E2E em W6-T2), não de W0-T3.

---

## Critérios de aceite

- [ ] Existe o arquivo `server/docker-compose.yml`.
- [ ] `docker compose config` (rodado dentro de `server/`) valida sem erro.
- [ ] O serviço usa a imagem exatamente `postgres:16-alpine`.
- [ ] A porta `5432` do host mapeia para `5432` do container.
- [ ] Estão definidas `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` com
      padrão `brevly`/`brevly`/`brevly` (via `${VAR:-default}`).
- [ ] Existe um volume nomeado `brevly_pgdata` montado em
      `/var/lib/postgresql/data`.
- [ ] Existe healthcheck via `pg_isready` com `interval`/`timeout`/`retries`.
- [ ] `docker compose up -d` sobe o serviço e ele atinge status `healthy`.
- [ ] Uma conexão com `postgresql://brevly:brevly@localhost:5432/brevly` é aceita
      (ex.: `pg_isready -h localhost -p 5432 -U brevly` retorna 0, ou
      `psql` conecta) — provando compatibilidade com a `DATABASE_URL`.
- [ ] Após `docker compose down` (sem `-v`) e novo `up`, os dados persistem.
- [ ] Não há serviço `app` neste compose (escopo restrito ao Postgres de dev).

---

## Fora de escopo

- Serviço `app`/backend no compose (host roda via npm nesta fase; container do
  app é W0-T4 / E2E é W6-T2).
- Definição do arquivo `.env.example` e da string `DATABASE_URL` (W0-T6) — aqui
  apenas se garante **compatibilidade** de valores.
- `drizzle.config.ts` e o script `db:migrate` (W0-T5 / W1-T3/T8).
- Schema/tabela `links`, índices e migrations (Onda 1).
- Compose de **testes/E2E** (`docker-compose.test.yml` em W3-T7,
  `docker-compose.e2e.yml` em W6-T2).
- Qualquer regra de negócio (Onda 0 é infraestrutura pura).

---

## Dependências

- **Depende de:** W0-T1 (estrutura raiz do monorepo e pasta `server/` já
  existentes).
- **Habilita / é consumida por:**
  - W0-T5 — `drizzle.config.ts` + script `db:migrate` (usa `DATABASE_URL`).
  - W0-T6 — `.env.example` do backend (fixa a `DATABASE_URL` compatível).
  - W1-T3 — geração/aplicação da migration inicial contra este Postgres.
  - W1-T4 — `db/client.ts` (conexão Drizzle) via `DATABASE_URL`.
  - W2/W3 — suíte de integração (usa Postgres real; compose de teste é derivado
    deste padrão em W3-T7).
- **Ferramentas externas:** Docker Engine + Docker Compose v2 instalados na
  máquina de desenvolvimento.
