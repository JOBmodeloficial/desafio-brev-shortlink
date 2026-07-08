# W0-T1 — Tasks: Estrutura raiz do monorepo

> Onda 0 (Fundação & DevOps) · Requisitos: **D4**
> Tasks no formato Spec Kit, numeradas e ordenadas por dependência.
> Fonte da verdade: [spec.md](./spec.md), [PRD](../../../PRD.md) §7,
> [constitution](../../../constitution.md) Art.1/Art.2, [WAVES](../../../WAVES.md) Onda 0.

---

## Contexto de execução

- Raiz do repositório: `desafio-brev-shortlink/`.
- Ambiente de dev: Windows 11; execução em containers Linux (finais de linha e paths portáveis).
- **Fronteira dura (D4):** NÃO criar `package.json` na raiz, nem qualquer config de workspaces
  (`pnpm-workspace.yaml`, `lerna.json`, `turbo.json`, `nx.json`).
- Escopo desta task: apenas a casca do monorepo — `.gitignore` raiz, `.nvmrc` e as pastas
  `web/` e `server/` versionadas (via `.gitkeep`).

---

## Tasks (dependency-ordered)

### T001 — Verificar pré-condições da raiz [P]

- **Objetivo:** garantir que a raiz não contém artefatos proibidos por D4 antes de escrever.
- **Ações:**
  - Confirmar ausência de `package.json` na raiz.
  - Confirmar ausência de `pnpm-workspace.yaml`, `lerna.json`, `turbo.json`, `nx.json`.
  - Confirmar que `PRD.md`, `constitution.md`, `WAVES.md` e `specs/` já existem e não serão tocados.
- **Cobre:** FR-2, NFR-1.
- **Depende de:** nenhuma.

### T002 — Criar `.nvmrc` na raiz

- **Objetivo:** fixar a versão LTS do Node como fonte da verdade da toolchain (C1: Node 22).
- **Ações:**
  - Criar `.nvmrc` com o conteúdo exatamente `22` (major LTS ativa "Jod"), em uma única linha.
- **Cobre:** FR-5, NFR-3 (compatível com `node:22-alpine` do Dockerfile W0-T4).
- **Depende de:** T001.

### T003 — Criar `.gitignore` raiz com padrões globais

- **Objetivo:** estabelecer a higiene de Git recursiva que cobre raiz, `web/` e `server/`.
- **Ações:**
  - Criar `.gitignore` na raiz com, no mínimo: `node_modules/`, `dist/`, `build/`,
    `coverage/`, `.env` e variantes locais, artefatos de Docker (`*.pid`,
    `docker-compose.override.yml`), logs (`*.log`, `playwright-report/`) e `.DS_Store`.
  - Incluir a negação `!.env.example` para preservar os exemplos versionados.
- **Cobre:** FR-3, FR-4, FR-6, NFR-2, NFR-4.
- **Depende de:** T001.

### T004 — Criar pasta `web/` versionada [P]

- **Objetivo:** materializar a subpasta do frontend, versionada mesmo vazia.
- **Ações:**
  - Criar `web/.gitkeep` (Git não versiona diretórios vazios).
- **Cobre:** FR-1.
- **Depende de:** T003 (para que o `.gitkeep` não colida com padrões de ignore).

### T005 — Criar pasta `server/` versionada [P]

- **Objetivo:** materializar a subpasta do backend/DevOps, versionada mesmo vazia.
- **Ações:**
  - Criar `server/.gitkeep`.
- **Cobre:** FR-1.
- **Depende de:** T003.

### T006 — Verificação dos critérios de aceite

- **Objetivo:** confirmar que a estrutura satisfaz todos os critérios de aceite do spec.
- **Ações (verificação — feita pelo orquestrador, não executar npm/docker aqui):**
  - `git check-ignore -v web/node_modules server/dist server/.env` cobre ambos os subdirs (FR-4).
  - `git check-ignore server/.env.example` retorna vazio (FR-6).
  - `git ls-files` não lista nenhum `.env` real (NFR-2).
  - Confirmar ausência de `package.json`/configs de workspace na raiz (FR-2).
  - `.nvmrc` resolve versão válida em uma única linha (FR-5).
- **Cobre:** todos os critérios de aceite.
- **Depende de:** T002, T003, T004, T005.

---

## Rastreabilidade (task → requisito)

| Task | Requisitos cobertos            |
| ---- | ------------------------------ |
| T001 | FR-2, NFR-1                    |
| T002 | FR-5, NFR-3                    |
| T003 | FR-3, FR-4, FR-6, NFR-2, NFR-4 |
| T004 | FR-1                           |
| T005 | FR-1                           |
| T006 | Critérios de aceite (todos)    |

> `[P]` = paralelizável com outras tasks marcadas `[P]` no mesmo nível de dependência.
