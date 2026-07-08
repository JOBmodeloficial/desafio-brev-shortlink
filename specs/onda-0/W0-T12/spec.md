# W0-T12 — README de setup e verificação da fundação

> Onda 0 (Fundação & DevOps) · Requisitos: **D4**
> Especificação no formato Spec Kit. Fonte da verdade: [PRD](../../../PRD.md) §5/§7/§9,
> [constitution](../../../constitution.md) Art.1/Art.2, [WAVES](../../../WAVES.md) Onda 0.
> Arquivo-chave: `README.md` (raiz do repositório).
> Escopo: documentação de setup e verificação da fundação. **Sem instruções de features.**

---

## Contexto / Por quê

A Onda 0 entrega o **alicerce** do monorepo Brev.ly: as pastas `web/` e `server/` com
scaffolds compiláveis, toolchain, DevOps (Docker/Postgres) e o script exato `db:migrate`
— **sem regra de negócio** (WAVES §Onda 0). Ao final da onda, "ambos buildam; `/health`
200; CORS on; Postgres sobe; `db:migrate` executa; 3 rotas placeholder; lint/format/test
verdes".

Toda essa capacidade precisa ser **acionável por qualquer pessoa** a partir de um clone
limpo. Sem um README de entrada, cada desenvolvedor teria que reconstruir mentalmente a
ordem de comandos (pré-requisitos → copiar `.env.example` → subir Postgres → `db:migrate`
→ iniciar server e web em dev), e a verificação de que "a fundação está de pé" ficaria
implícita. O critério de aceite do PRD §9 exige, entre outros, `.env.example` presente
em `web/` e `server/` e o script `db:migrate` funcional — o README é o documento que
**amarra esses artefatos em um roteiro reproduzível**.

Esta task é a **última da Onda 0** (fecha a onda) e depende dos artefatos produzidos por
todas as tasks anteriores: estrutura raiz (W0-T1), scaffold server (W0-T2), compose
(W0-T3), Dockerfile (W0-T4), `db:migrate` (W0-T5), `.env.example` server (W0-T6),
toolchain server (W0-T7), scaffold web (W0-T8), Tailwind (W0-T9), toolchain web (W0-T10)
e `.env.example` web (W0-T11).

**Fronteira explícita (anti-retrabalho):** este README documenta **apenas a fundação** —
pré-requisitos, variáveis de ambiente, subir banco, migrar, rodar em dev e verificar. Ele
**MUST NOT** documentar features de negócio (criar/listar/deletar link, resolver slug,
export CSV, contrato de API detalhado), que só existirão a partir das Ondas 1–5. READMEs
específicos e mais completos de `web/` e `server/`, além do fechamento do repositório
público, são responsabilidade de W6-T11/W6-T14 e **não** desta task.

---

## Requisitos funcionais

- **FR-1** — DEVE existir o arquivo `README.md` na **raiz** do repositório
  (`desafio-brev-shortlink/README.md`), versionado no Git.
- **FR-2** — O README DEVE conter uma seção de **Pré-requisitos** listando, no mínimo:
  **Node LTS** (referenciando o `.nvmrc` da raiz — W0-T1) e **Docker** (com Docker Compose
  v2, `docker compose`), usados para subir o Postgres de desenvolvimento.
- **FR-3** — O README DEVE descrever o **layout do monorepo** (`web/` e `server/` como
  pacotes npm independentes, **sem workspaces** — D4), deixando claro que cada subprojeto
  se instala e roda dentro da sua própria pasta.
- **FR-4** — O README DEVE instruir a **instalação de dependências** por pasta
  (`npm install` em `server/` e em `web/`), refletindo a ausência de workspaces (D4).
- **FR-5** — O README DEVE instruir a **cópia dos templates de ambiente**: copiar
  `server/.env.example` → `server/.env` (7 chaves, PRD §5.1 / W0-T6) e
  `web/.env.example` → `web/.env` (`VITE_FRONTEND_URL`, `VITE_BACKEND_URL` / W0-T11),
  usando comandos válidos tanto em shell POSIX quanto em PowerShell (Windows).
- **FR-6** — O README DEVE instruir como **subir o Postgres** via Docker Compose a partir
  de `server/` (`docker compose up -d`), referenciando o serviço `db`
  (`postgres:16-alpine`, porta `5432`) definido em `server/docker-compose.yml` (W0-T3).
- **FR-7** — O README DEVE instruir a execução das **migrations** através do script exato
  **`npm run db:migrate`** dentro de `server/` (nome literal `db:migrate` — Art.2 R3 /
  W0-T5), executado **após** o Postgres estar `healthy` e o `.env` estar configurado.
- **FR-8** — O README DEVE instruir como **iniciar o backend em dev** (script de dev do
  `server/package.json`, ex.: `npm run dev`) e mencionar a rota de verificação
  **`/health`** (200) exposta pelo scaffold (W0-T2).
- **FR-9** — O README DEVE instruir como **iniciar o frontend em dev** (script de dev do
  `web/package.json`, ex.: `npm run dev` do Vite) e onde acessá-lo no navegador.
- **FR-10** — O README DEVE conter uma seção de **Verificação da fundação** (smoke check)
  com passos objetivos para confirmar que a Onda 0 está de pé: `/health` responde 200,
  o Vite serve as 3 rotas placeholder, o Postgres aceita conexão e `db:migrate` conclui
  sem erro. (Espelha a "Saída" da Onda 0 no WAVES.)
- **FR-11** — Os valores de conexão citados no README (usuário/senha/banco/porta do
  Postgres) DEVEM ser **consistentes** com o `docker-compose.yml` (W0-T3) e o
  `.env.example` do server (W0-T6): `brevly` / `brevly` / `brevly` em `localhost:5432`.
- **FR-12** — O README **MUST NOT** conter instruções, contrato de API ou fluxos de
  **features de negócio** (criar/listar/deletar/resolver link, export CSV). Restringe-se
  à fundação/DevOps.

---

## Requisitos não funcionais

- **NFR-1 (Reprodutibilidade)** — Seguir o README de cima para baixo, a partir de um clone
  limpo, DEVE levar um desenvolvedor de zero até a fundação verificada, sem passos
  implícitos ou conhecimento tácito.
- **NFR-2 (Portabilidade / multiplataforma)** — Os comandos DEVEM funcionar em Windows 11
  (ambiente de desenvolvimento — PowerShell) e em Linux/macOS (shell POSIX). Quando um
  comando divergir entre plataformas (ex.: copiar arquivo), o README DEVE oferecer as duas
  variantes.
- **NFR-3 (Fidelidade a D4)** — O texto reforça pastas simples + npm sem workspaces; não
  menciona nem sugere Turborepo, Nx, Lerna ou workspaces de gerenciador algum.
- **NFR-4 (Higiene de segredos)** — O README NÃO DEVE conter segredos reais (credenciais
  R2, senhas de produção); apenas os placeholders de dev já presentes nos `.env.example`.
  Reforça PRD §9 ("repo público sem segredos").
- **NFR-5 (Consistência de contrato)** — Nomes de scripts (`db:migrate`, `dev`), portas,
  credenciais e nomes de serviço citados DEVEM bater 1:1 com os artefatos reais
  (package.json, compose, `.env.example`), evitando divergência de documentação.
- **NFR-6 (Concisão e ordem)** — As instruções DEVEM seguir a ordem executável correta
  (pré-requisitos → install → env → banco → migrate → dev → verificação); nenhum passo
  depende de artefato ainda não configurado no ponto em que aparece.
- **NFR-7 (Formato)** — Markdown válido, codificação UTF-8, blocos de código com a
  linguagem apropriada (`bash`/`powershell`), final de linha LF.

---

## Abordagem técnica

Arquivo único na raiz do repositório, conforme PRD §7 e a "Saída" da Onda 0 no WAVES:

```
desafio-brev-shortlink/
├── README.md          # ← criado por esta task (setup + verificação da fundação)
├── .nvmrc             # versão LTS do Node (W0-T1) — referenciada nos pré-requisitos
├── web/               # scaffold Vite+React+TS (W0-T8+); .env.example (W0-T11)
└── server/            # scaffold Fastify+TS (W0-T2+); docker-compose.yml (W0-T3);
                       # .env.example (W0-T6); script db:migrate (W0-T5)
```

### Estrutura de seções sugerida do `README.md`

1. **Título + descrição curta** — "Brev.ly — encurtador de URL (monorepo `web/` +
   `server/`)". Uma frase; sem detalhar features.
2. **Estrutura do projeto** — árvore mínima mostrando `web/` e `server/` como pacotes npm
   independentes (D4).
3. **Pré-requisitos** — Node LTS (via `.nvmrc`; sugerir `nvm use`/`fnm use`) e Docker +
   Docker Compose v2.
4. **Configuração inicial** — clone; `npm install` em `server/` e `web/`; copiar
   `.env.example` → `.env` em cada pasta (variantes POSIX e PowerShell).
5. **Subir o banco (Postgres)** — a partir de `server/`, `docker compose up -d`; aguardar
   `healthy`; nota de credenciais/porta de dev.
6. **Rodar migrations** — a partir de `server/`, `npm run db:migrate` (script exato).
7. **Rodar em desenvolvimento** — backend (`npm run dev` em `server/`, rota `/health`) e
   frontend (`npm run dev` em `web/`, URL do Vite).
8. **Verificação da fundação** — checklist de smoke (health 200, 3 rotas placeholder,
   Postgres conectando, `db:migrate` ok).
9. **Fora de escopo (nesta fase)** — nota curta de que features e o contrato de API serão
   documentados nas ondas seguintes.

### Comandos concretos (a incluir no README)

**Node (pré-requisito):**

```bash
node -v            # deve casar com a major LTS do .nvmrc (W0-T1)
nvm use            # ou: fnm use / volta pin
```

**Instalar dependências (por pasta — D4, sem workspaces):**

```bash
cd server && npm install
cd ../web && npm install
```

**Copiar templates de ambiente:**

```bash
# POSIX (Linux/macOS)
cp server/.env.example server/.env
cp web/.env.example web/.env
```

```powershell
# Windows (PowerShell)
Copy-Item server/.env.example server/.env
Copy-Item web/.env.example web/.env
```

**Subir Postgres (dev) — dentro de `server/`:**

```bash
docker compose up -d          # serviço "db": postgres:16-alpine, localhost:5432
docker compose ps             # aguardar status "healthy"
```

> Credenciais de dev (padrão do `docker-compose.yml` e `.env.example`):
> usuário `brevly` · senha `brevly` · banco `brevly` · `localhost:5432`
> `DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly`

**Rodar migrations — dentro de `server/`:**

```bash
npm run db:migrate            # script EXATO (Art.2 R3 / W0-T5)
```

**Rodar em dev:**

```bash
# Backend — dentro de server/
npm run dev                   # verificar: GET http://localhost:<PORT>/health → 200

# Frontend — dentro de web/
npm run dev                   # abrir a URL do Vite no navegador (3 rotas placeholder)
```

> Observações de fidelidade: os nomes de script (`dev`, `db:migrate`), portas e
> credenciais citados DEVEM ser lidos dos artefatos reais (`server/package.json`,
> `web/package.json`, `server/docker-compose.yml`, `*/.env.example`) no momento de
> escrever o README, para garantir NFR-5 (consistência). Se algum script de dev tiver
> nome diferente de `dev`, o README usa o nome real.

### O que NÃO entra no README (fronteira)

- Contrato de API (POST /links, GET /links/:shortUrl, DELETE, exports) e qualquer fluxo de
  feature — Ondas 1–5; documentado depois (W6-T11).
- Instruções de build de imagem Docker da aplicação para produção além do necessário à
  fundação (o Dockerfile existe em W0-T4, mas o roteiro dev usa apenas o compose do banco).
- Detalhes de testes/cobertura e E2E (W0-T7/T10 configuram; W6 documenta o fluxo completo).

---

## Critérios de aceite

- [ ] Existe `README.md` na raiz do repositório, versionado no Git.
- [ ] Há seção de **Pré-requisitos** citando Node LTS (referência ao `.nvmrc`) e Docker
      (Compose v2).
- [ ] O README descreve o monorepo `web/` + `server/` **sem workspaces** (D4) e instrui
      `npm install` **por pasta**.
- [ ] Há instrução de copiar `server/.env.example` → `server/.env` **e**
      `web/.env.example` → `web/.env`, com variantes POSIX **e** PowerShell.
- [ ] Há instrução de subir o Postgres via `docker compose up -d` a partir de `server/`,
      citando o serviço `db` / porta `5432`.
- [ ] O README usa o script **exato** `npm run db:migrate` (string literal `db:migrate`)
      para as migrations, na ordem correta (após banco healthy + `.env`).
- [ ] Há instrução de iniciar o backend em dev e menção à rota `/health` (200).
- [ ] Há instrução de iniciar o frontend em dev (Vite) e onde acessá-lo.
- [ ] Há uma seção de **Verificação da fundação** com passos objetivos (health 200,
      3 rotas placeholder, Postgres conectando, `db:migrate` ok).
- [ ] Credenciais/porta citadas (`brevly`/`brevly`/`brevly` @ `localhost:5432`) batem 1:1
      com `docker-compose.yml` (W0-T3) e `server/.env.example` (W0-T6).
- [ ] O README **não** contém instruções de features de negócio nem contrato de API.
- [ ] O README **não** contém segredos reais (só placeholders de dev).
- [ ] Seguir o README de ponta a ponta, a partir de um clone limpo, leva à fundação
      verificada (build ok, `/health` 200, `db:migrate` conclui).

---

## Fora de escopo

- READMEs detalhados de `web/` e `server/` e fechamento do repositório público
  (W6-T11 / W6-T14).
- Documentação de qualquer feature de negócio ou do contrato de API (Ondas 1–5; PRD §8).
- Instruções de produção/deploy, publicação da imagem Docker ou configuração de CDN R2
  além dos placeholders de env.
- Documentação de testes, thresholds de cobertura e fluxo E2E (W6).
- Criação/edição de `package.json`, `docker-compose.yml`, `.env.example` ou scripts — este
  README apenas **referencia** artefatos já criados por W0-T1…T11.
- Guia de contribuição, licença ou badges de CI (não exigidos pela fundação).

---

## Dependências

- **Upstream (consome os artefatos de):**
  - W0-T1 — estrutura raiz, `.gitignore`, `.nvmrc` (pré-requisito Node LTS).
  - W0-T2 — scaffold Fastify, `/health`, script `dev` do server.
  - W0-T3 — `server/docker-compose.yml` (serviço `db`, credenciais, porta).
  - W0-T5 — script exato `db:migrate`.
  - W0-T6 — `server/.env.example` (7 chaves, `DATABASE_URL` de dev).
  - W0-T8 — scaffold Vite, 3 rotas placeholder, script `dev` do web.
  - W0-T11 — `web/.env.example` (`VITE_FRONTEND_URL`, `VITE_BACKEND_URL`).
  - (Complementares: W0-T4 Dockerfile, W0-T7/T10 toolchain, W0-T9 Tailwind — presentes,
    porém não centrais ao roteiro dev.)
- **Downstream (habilita):** onboarding de qualquer desenvolvedor/CI na fundação; serve de
  base para os READMEs mais completos de W6-T11 e o fechamento do repositório em W6-T14.
- **Decisões aplicadas:** **D4** (pastas simples `web/` + `server/` + npm, sem workspaces).
- **Restrições herdadas:** ambiente de desenvolvimento em Windows 11 (comandos com
  variantes PowerShell); nomes de scripts/portas/credenciais devem espelhar os artefatos
  reais no momento da escrita (NFR-5).
