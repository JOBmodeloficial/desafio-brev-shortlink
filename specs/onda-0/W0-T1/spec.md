# W0-T1 — Estrutura raiz do monorepo

> Onda 0 (Fundação & DevOps) · Requisitos: **D4**
> Especificação no formato Spec Kit. Fonte da verdade: [PRD](../../../PRD.md) §7,
> [constitution](../../../constitution.md) Art.1/Art.2, [WAVES](../../../WAVES.md) Onda 0.

---

## Contexto / Por quê

O desafio Brev.ly é uma entrega FullStack com três frentes (frontend, backend, DevOps)
que **MUST** morar em um único repositório público com duas subpastas: `web/` (SPA React)
e `server/` (API + Docker). A decisão de arquitetura **D4** fixa: *"Pastas simples
(`web/`, `server/`) + npm"*, com racional **"exatamente o que o desafio pede; zero tooling
extra"**.

Esta task é o **alicerce físico** do monorepo. Ela estabelece a raiz do repositório e os
artefatos transversais (higiene de Git e versão de Node) **antes** que as trilhas server
(W0-T2…T7) e web (W0-T8…T11) sejam scaffolded em paralelo. Sem ela, cada trilha teria que
inventar sua própria higiene de repositório, gerando divergência e retrabalho.

**Fronteira explícita (anti-retrabalho):** esta task **não** cria `package.json`, código,
Dockerfile, compose nem configs de toolchain — esses pertencem às tasks subsequentes da
Onda 0. Aqui só existe a **casca do monorepo**: as duas pastas, o `.gitignore` raiz e o
`.nvmrc`. O ponto mais sensível de D4 é o que **NÃO** deve existir: **nenhum `package.json`
com `workspaces` na raiz** (nem npm/yarn/pnpm workspaces). Cada subprojeto é um pacote npm
independente, instalado e executado dentro da sua própria pasta.

---

## Requisitos funcionais

- **FR-1** — A raiz do repositório **MUST** conter as pastas `web/` e `server/`, ambas
  versionadas no Git (mesmo que ainda vazias de conteúdo de aplicação nesta task).
- **FR-2** — A raiz **MUST NOT** conter um `package.json` que declare `workspaces` (npm),
  nem `pnpm-workspace.yaml`, nem `lerna.json`, nem qualquer configuração de monorepo com
  gerenciamento de workspaces (D4). Cada subprojeto é um pacote npm autônomo.
- **FR-3** — A raiz **MUST** conter um `.gitignore` que ignore, no mínimo:
  `node_modules`, `dist`, `.env` (e variantes locais como `.env.local`, `.env.*.local`,
  preservando `.env.example`), `coverage` e **artefatos de Docker**.
- **FR-4** — O `.gitignore` raiz **MUST** cobrir os subdiretórios `web/` e `server/`
  (ex.: `web/node_modules`, `server/dist`), de forma que padrões globais valham para ambas
  as trilhas sem exigir `.gitignore` duplicado por pasta.
- **FR-5** — A raiz **MUST** conter um `.nvmrc` fixando uma versão **LTS** do Node,
  garantindo toolchain consistente entre as trilhas web e server e nos ambientes de CI/dev.
- **FR-6** — O arquivo `.env.example` (em `web/` e `server/`, criados em tasks posteriores)
  **MUST NOT** ser ignorado pelo `.gitignore` raiz — apenas os `.env` reais são ignorados.

---

## Requisitos não funcionais

- **NFR-1 (Fidelidade a D4)** — Zero tooling extra: nenhuma ferramenta de monorepo
  (workspaces, Turborepo, Nx, Lerna). A estrutura é a mais simples que atende o desafio.
- **NFR-2 (Higiene de segredos)** — Nenhum segredo, credencial ou `.env` real pode ser
  commitado; o `.gitignore` é a primeira linha de defesa (reforça PRD §9 "repo público sem
  segredos").
- **NFR-3 (Consistência de versão)** — O `.nvmrc` é a fonte da verdade da versão de Node
  para toda a equipe/CI; deve ser compatível com o `node:lts-alpine` planejado no Dockerfile
  do backend (W0-T4) e com a stack Vite/Fastify.
- **NFR-4 (Portabilidade)** — Os arquivos usam finais de linha e padrões compatíveis com
  Windows, Linux e macOS (o repo é desenvolvido em Windows 11 e roda em containers Linux).
- **NFR-5 (Idempotência conceitual)** — A estrutura não introduz estado nem build; é
  puramente declarativa e não deve quebrar nenhuma trilha subsequente.

---

## Abordagem técnica

Estrutura resultante na raiz do repositório
(`desafio-brev-shortlink/`), conforme constitution Art.1/Art.2 e PRD §7:

```
desafio-brev-shortlink/
├── .gitignore          # higiene raiz (cobre web/ e server/)
├── .nvmrc              # versão LTS do Node
├── web/                # Frontend (React SPA) — scaffold em W0-T8+
│   └── .gitkeep        # mantém a pasta versionada enquanto vazia
└── server/             # Backend (API) + DevOps — scaffold em W0-T2+
    └── .gitkeep        # mantém a pasta versionada enquanto vazia
```

> Observação: os arquivos de contexto do desafio (`PRD.md`, `constitution.md`, `WAVES.md`)
> e a pasta `specs/` já existem na raiz e não são afetados por esta task.

### `.gitignore` (raiz) — conteúdo concreto

Padrões globais (valem para a raiz e para os subdiretórios `web/` e `server/`, satisfazendo
FR-3 e FR-4):

```gitignore
# Dependencies
node_modules/

# Build output
dist/
build/

# Test coverage
coverage/

# Environment (mantém os .env.example versionados — FR-6)
.env
.env.local
.env.*.local
!.env.example

# Docker artifacts
*.pid
docker-compose.override.yml

# Logs
*.log
npm-debug.log*

# OS / editor
.DS_Store
Thumbs.db
```

- Os padrões sem prefixo de caminho (`node_modules/`, `dist/`, `coverage/`, `.env`) são
  aplicados recursivamente pelo Git, cobrindo `web/` e `server/` automaticamente (FR-4).
- A negação `!.env.example` garante FR-6 (o exemplo permanece versionado).

### `.nvmrc` (raiz) — FR-5 / NFR-3

Arquivo de uma linha com a major LTS do Node (ex.: `22` — a LTS ativa "Jod"). O formato
`lts/<codename>` também é aceito pelo nvm, mas o número da major é o mais portável entre
ferramentas (Volta, fnm, asdf).

### Pastas `web/` e `server/` — FR-1

Criadas com um marcador `.gitkeep` cada, para que o Git as versione enquanto ainda não têm
conteúdo (Git não versiona diretórios vazios). Esses `.gitkeep` **SHOULD** ser removidos
quando as tasks de scaffold (W0-T2 no server, W0-T8 no web) adicionarem `package.json` e o
restante da árvore.

### O que NÃO é criado aqui (fronteira com D4 / outras tasks)

- **Nenhum** `package.json` na raiz (e portanto nenhum `workspaces`) — FR-2.
- **Nenhum** `package.json` em `web/` ou `server/` (isso é W0-T2 / W0-T8).
- **Nenhum** Dockerfile, `docker-compose.yml`, `drizzle.config.ts`, config de ESLint/
  Prettier/Vitest, `.env.example` de conteúdo — todos pertencem a tasks específicas da Onda 0.

---

## Critérios de aceite

- [ ] Existe a pasta `web/` na raiz, versionada no Git.
- [ ] Existe a pasta `server/` na raiz, versionada no Git.
- [ ] **Não existe** `package.json` na raiz do repositório.
- [ ] **Não existe** `pnpm-workspace.yaml`, `lerna.json`, `turbo.json` nem `nx.json` na raiz.
- [ ] Existe `.gitignore` na raiz ignorando: `node_modules`, `dist`, `.env`, `coverage` e
      artefatos de Docker.
- [ ] `git check-ignore -v web/node_modules server/dist server/.env` confirma que os
      padrões globais cobrem ambos os subdiretórios (FR-4).
- [ ] `git check-ignore server/.env.example` retorna vazio (o `.env.example` **não** é
      ignorado — FR-6).
- [ ] Existe `.nvmrc` na raiz com uma versão **LTS** válida do Node em uma única linha.
- [ ] `nvm use` (ou `fnm use`) na raiz resolve a versão do `.nvmrc` sem erro de formato.
- [ ] Nenhum segredo/credencial/`.env` real está versionado (`git ls-files` não lista `.env`).

---

## Fora de escopo

- Criação de `package.json`, instalação de dependências ou scripts npm (W0-T2 server /
  W0-T8 web e seguintes).
- Qualquer código de aplicação (Fastify, React, Vite, Drizzle, schemas, rotas).
- Toolchain: ESLint, Prettier, Vitest, tsconfig (W0-T7 / W0-T10).
- DevOps: Dockerfile, `.dockerignore`, `docker-compose.yml`, Postgres (W0-T3 / W0-T4).
- `.env.example` com o conjunto de chaves (W0-T6 server / W0-T11 web) — aqui apenas se
  garante que ele **não** seja ignorado.
- README de setup e verificação end-to-end da fundação (W0-T12).
- Configuração de workspaces de qualquer gerenciador (explicitamente proibido por D4).

---

## Dependências

- **Upstream:** nenhuma. W0-T1 é a primeira task da Onda 0 e não depende de outra task.
- **Downstream (habilita):** toda a Onda 0 depende desta estrutura raiz —
  - trilha server: W0-T2 (scaffold Fastify), W0-T3 (compose), W0-T4 (Dockerfile),
    W0-T5 (drizzle/`db:migrate`), W0-T6 (`.env.example`), W0-T7 (lint/vitest);
  - trilha web: W0-T8 (scaffold Vite), W0-T9 (Tailwind), W0-T10 (lint/vitest), W0-T11
    (`.env.example`);
  - W0-T12 (README) fecha a onda.
- **Decisões aplicadas:** **D4** (pastas simples `web/` + `server/` + npm, sem workspaces).
- **Restrições herdadas:** ambiente de desenvolvimento em Windows 11 (finais de linha e
  paths compatíveis); o `.nvmrc` deve casar com o `node:lts-alpine` do Dockerfile (W0-T4).
