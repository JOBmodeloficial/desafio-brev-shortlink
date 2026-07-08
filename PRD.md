# PRD — Brev.ly (Encurtador de URL)

> **Product Requirements Document**
> Desafio Prático FullStack — Rocketseat · Disciplina "Fundamentos Técnicos e Estratégicos"
> Nível: Intermediário · Áreas: Frontend, Backend, DevOps

---

## 1. Visão Geral

O **Brev.ly** é uma aplicação FullStack de encurtamento de URLs que permite cadastrar, listar e remover links encurtados, gerar relatório de acessos de cada link (exportação CSV) e redirecionar corretamente da URL encurtada para a URL original.

O projeto exercita três frentes:

- **Frontend** — SPA em React + Vite consumindo a API.
- **Backend** — API REST em Fastify + Drizzle + Postgres.
- **DevOps** — Containerização (Docker) e integração com CDN (Cloudflare R2 / S3) para hospedagem dos CSVs.

### 1.1 Objetivos

| # | Objetivo |
|---|----------|
| O1 | Permitir criar, listar e remover links encurtados |
| O2 | Redirecionar da URL encurtada para a original, contabilizando acessos |
| O3 | Gerar e disponibilizar relatório de acessos em CSV via CDN |
| O4 | Entregar uma UX responsiva e fiel ao layout do Figma |
| O5 | Empacotar o backend em imagem Docker seguindo boas práticas |

### 1.2 Fora de escopo (correção oficial)

Funcionalidades "extras" (SSR, OpenGraph, upload de imagem, UI otimista) **não** entram na correção e, se implementadas, devem ficar em **branch separada**, preservando o código original do desafio.

---

## 2. Personas & Casos de Uso

- **Usuário final:** cria links curtos, acompanha a listagem, apaga links, baixa o relatório e usa o link curto para ser redirecionado.
- **Visitante do link curto:** acessa `dominio/:url-encurtada` e é redirecionado para a URL original (incrementando o contador).

---

## 3. Requisitos Funcionais

### 3.1 Backend (API)

> Ordem e itens espelham exatamente a checklist oficial do desafio (12 itens).

| ID | Requisito | Regra |
|----|-----------|-------|
| BE-01 | Criar um link | — |
| BE-02 | Impedir URL encurtada mal formatada | Não deve ser possível criar link com encurtamento mal formatado |
| BE-03 | Impedir URL encurtada já existente | Não deve ser possível criar link com encurtamento duplicado |
| BE-04 | Deletar um link | — |
| BE-05 | Obter URL original pela URL encurtada | — |
| BE-06 | Listar todas as URLs cadastradas | — |
| BE-07 | Incrementar a quantidade de acessos de um link | Contador por link |
| BE-08 | Exportar os links criados em um CSV | Gerar relatório |
| BE-09 | Acessar o CSV por meio de uma CDN | Amazon S3, Cloudflare R2, etc. |
| BE-10 | Gerar nome aleatório e único para o arquivo | — |
| BE-11 | Realizar a listagem de forma performática | Paginação / índices |
| BE-12 | CSV com os campos obrigatórios | URL original, URL encurtada, contagem de acessos e data de criação |

### 3.2 Frontend (SPA)

| ID | Requisito | Regra |
|----|-----------|-------|
| FE-01 | Criar link | — |
| FE-02 | Validar encurtamento | Rejeitar encurtamento mal formatado |
| FE-03 | Impedir duplicidade | Rejeitar encurtamento já existente |
| FE-04 | Deletar link | — |
| FE-05 | Obter URL original | A partir do encurtamento |
| FE-06 | Listar todas as URLs | — |
| FE-07 | Incrementar acessos | Ao acessar o link curto |
| FE-08 | Baixar CSV | Relatório dos links criados |

#### Páginas

1. **`/`** — Formulário de cadastro + listagem dos links.
2. **`/:url-encurtada`** — Busca o valor dinâmico, consulta a API e redireciona.
3. **`*` (404)** — Recurso não encontrado (endereço errado ou URL curta inexistente).

---

## 4. Requisitos Não Funcionais

### 4.1 Backend — stack obrigatória

- **TypeScript**
- **Fastify**
- **Drizzle** (ORM)
- **Postgres**
- **CORS** habilitado
- **Dockerfile** seguindo boas práticas
- Script **exato** `db:migrate` para executar as migrations

**Adotado (não obrigatório):**
- **Vitest** — testes de integração das rotas/casos de uso (D5)
- **Zod** — validação de payloads (compartilha schema de URL com o frontend)
- **@aws-sdk/client-s3** — upload do CSV para o Cloudflare R2 via streaming (D2, D6)

### 4.2 Frontend — stack

**Obrigatório:**
- **TypeScript**
- **React**
- **Vite** (SPA, sem framework)

**Adotado (D3):**
- **TailwindCSS** — estilização utility-first, mobile-first
- **React Query** — cache, loading/error states, sincronização com a API
- **React Hook Form** — formulário de cadastro performático
- **Zod** — validação de schema (URL mal formatada), compartilhado com o backend

### 4.3 Qualidade / UX

- Empty state, ícones de carregamento, bloqueio de ações conforme estado da aplicação.
- Responsividade (bom uso em desktop e mobile), abordagem **mobile-first**.
- Fidelidade ao layout do Figma (iniciar pela aba **Style Guide**).

---

## 5. Variáveis de Ambiente

### 5.1 Backend — `server/.env.example`

```
PORT=
DATABASE_URL=
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

### 5.2 Frontend — `web/.env.example`

```
VITE_FRONTEND_URL=
VITE_BACKEND_URL=
```

---

## 6. Decisões de Arquitetura

Registro de decisões (ADR resumido) — deliberadas com o time em 08/07/2026:

| # | Decisão | Escolha | Racional |
|---|---------|---------|----------|
| D1 | Identificador das operações de mutação (delete) | **`id` (UUID)** | Consistência; o `id` nunca muda, a short-url poderia. Contrato: `DELETE /links/:id`. (O incremento de acesso ocorre no resolve — ver D7 — logo não há `PATCH /access`.) |
| D2 | Armazenamento/CDN do CSV | **Cloudflare R2 (real)** | Env vars do desafio são todas `CLOUDFLARE_*`. SDK `@aws-sdk/client-s3` apontando para o endpoint R2 |
| D3 | Stack flexível do frontend | **TailwindCSS + React Query + React Hook Form + Zod** | Cobre UX (loaders/empty/estado), validação e cache; melhor DX |
| D4 | Estrutura do monorepo + gerenciador | **Pastas simples (`web/`, `server/`) + npm** | Exatamente o que o desafio pede; zero tooling extra |
| D5 | Testes | **Vitest no backend (integração)** | Reforça as regras críticas (URL mal formatada, duplicidade, contador); valoriza a entrega |
| D6 | Geração/entrega do CSV | **Streaming Postgres → R2** | Atende o requisito de exportação performática sem carregar tudo em memória |
| D7 | Incremento de acessos | **Automático no `GET /links/:shortUrl`** | Resolve a URL e conta o acesso em 1 chamada; dispensa endpoint de incremento dedicado |
| D8 | Origem do slug | **Informado pelo usuário; gera aleatório (nanoid) se vazio** | Fiel ao form do Figma, com conveniência quando não informado |
| D9 | Estratégia de listagem | **Paginação `offset/limit`** | `GET /links?page=&pageSize=`, ordenado por `created_at desc`, retorna `total` |
| D10 | Resposta do export | **`POST /links/exports` → `{ url }`** | Desacopla geração do download; front baixa a URL da CDN |
| D11 | Status HTTP de erro | **Semântico: 201/400/409/404** | Permite ao front distinguir mal formatada (400), duplicado (409) e não encontrado (404) |
| D12 | Colunas de controle | **Apenas `created_at`** | Modelo enxuto; nada além do exigido pelo desafio |
| D13 | Escopo da URL válida | **Apenas `http`/`https`** | `z.string().url()` aceita `ftp:`/`mailto:`; um encurtador só encurta URLs web. Regra idêntica no back e no front (evita divergência FE-02/BE-02) |

- **Nome do arquivo CSV:** aleatório e único (ex.: `nanoid`/`uuid` + timestamp).
- **Listagem performática:** paginação (D9) + índice único em `short_url`.
- **Consequência de D7:** não há endpoint `PATCH /links/:id/access`; o incremento é efeito do resolve.

---

## 7. Estrutura do Repositório (Entrega)

Repositório **público** no GitHub contendo os três desafios:

```
desafio-brev-shortlink/
├── web/      → Frontend (React SPA)
└── server/   → Backend (API) + DevOps (Docker)
```

- Código de correção deve conter apenas as regras e funcionalidades **obrigatórias**.
- Extras vão em **branch separada**, preservando o código original.

---

## 8. Contrato de API

> Contrato fechado (D7–D11). Corpo em JSON, casing `camelCase`. CORS habilitado.

| Método | Rota | Descrição | Sucesso | Erros |
|--------|------|-----------|---------|-------|
| `POST` | `/links` | Cria um link (`originalUrl`, `shortUrl?`) | `201` | `400` mal formatada · `409` slug duplicado |
| `GET` | `/links` | Lista paginada (`?page=1&pageSize=20`, `created_at desc`) | `200` | — |
| `GET` | `/links/:shortUrl` | Resolve a URL original **e incrementa o acesso** (D7) | `200` | `404` não encontrado |
| `DELETE` | `/links/:id` | Deleta um link pelo `id` (D1) | `204` | `404` não encontrado |
| `POST` | `/links/exports` | Gera o CSV, envia ao R2 e retorna a URL da CDN | `200` | — |

### 8.1 Payloads

**`POST /links`** — request:
```json
{ "originalUrl": "https://exemplo.com/pagina", "shortUrl": "meu-link" }
```
- `shortUrl` é **opcional** (D8): se ausente/vazio, o backend gera um slug aleatório (`nanoid`).
- Validação (Zod): `originalUrl` = URL válida; `shortUrl` = minúsculas, dígitos e hífens (`^[a-z0-9-]+$`), sem espaço/caractere especial.

**Item de link (response)** — usado em `POST`, `GET /links[]` e `GET /links/:shortUrl`:
```json
{
  "id": "uuid",
  "originalUrl": "https://exemplo.com/pagina",
  "shortUrl": "meu-link",
  "accessCount": 0,
  "createdAt": "2026-07-08T12:00:00.000Z"
}
```

**`GET /links`** — response:
```json
{ "links": [ /* itens */ ], "total": 42, "page": 1, "pageSize": 20 }
```

**`POST /links/exports`** — response:
```json
{ "url": "https://<CLOUDFLARE_PUBLIC_URL>/links-a1b2c3d4.csv" }
```

### 8.2 Modelo de dados — tabela `links` (D1, D12)

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `original_url` | `text` | `not null` |
| `short_url` | `text` | `not null`, **`unique`** (índice) |
| `access_count` | `integer` | `not null`, default `0` |
| `created_at` | `timestamp` | `not null`, default `now()` |

- Índice único em `short_url` garante BE-03 (duplicidade) e acelera o resolve (BE-05/BE-11).

---

## 9. Critérios de Aceite

- [ ] Todos os 12 requisitos de Backend atendidos (BE-01 … BE-12).
- [ ] Todos os 8 requisitos funcionais de Frontend atendidos (FE-01 … FE-08).
- [ ] As 3 páginas do frontend funcionando (raiz, redirecionamento, 404).
- [ ] SPA em React + Vite; layout fiel ao Figma; responsivo; estados de UX cobertos.
- [ ] `.env.example` presente em `web/` e `server/`.
- [ ] Script `db:migrate` funcional.
- [ ] Dockerfile do backend gera imagem funcional.
- [ ] CORS habilitado.
- [ ] CSV gerado com os 4 campos e acessível via CDN, com nome único.
- [ ] Repositório público com subpastas `web/` e `server/`.

---

## 10. Referências

- **Layout:** Figma (aba Style Guide primeiro).
- **Projeto inspiração:** Upload Widget (Rocketseat) — aulas e código de frontend e backend.
- **Prazo de envio:** até **08/07/2026**.

---

## 11. Roadmap sugerido de execução

1. **Setup & DevOps:** monorepo (`web/`, `server/`), Postgres via Docker Compose, `.env.example`.
2. **Backend:** schema Drizzle → migrations (`db:migrate`) → rotas CRUD → validações (Zod) → contador → integração R2/CSV → CORS → Dockerfile.
3. **Frontend:** Style Guide (tema/tokens/componentes) → páginas → integração API (React Query) → formulário (RHF + Zod) → estados UX → responsividade.
4. **Fechamento:** revisão de critérios de aceite, README, publicação do repositório.
