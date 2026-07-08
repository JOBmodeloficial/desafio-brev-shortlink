# Constitution — Brev.ly

Princípios inegociáveis do projeto. Complementa o [PRD](./PRD.md) e as decisões de
arquitetura (D1–D12). Onde houver conflito, **o PRD define o "o quê"** e esta
constitution define o **"como"** (estrutura e qualidade).

> Convenções: **MUST** = obrigatório · **SHOULD** = recomendado · **MAY** = opcional.

---

## Artigo 1 — Estrutura do Frontend (`web/`)

Aplicação **React + Vite (SPA) + TypeScript**, organizada por **tipo + feature**.

```
web/
├── public/
├── src/
│   ├── app/                    # bootstrap da aplicação
│   │   ├── router.tsx          # rotas (/, /:shortUrl, *)
│   │   └── providers.tsx       # QueryClientProvider, etc.
│   ├── pages/                  # uma pasta por página (Artigo 5 do PRD)
│   │   ├── home/               # / — form + listagem
│   │   ├── redirect/           # /:url-encurtada
│   │   └── not-found/          # * (404)
│   ├── features/
│   │   └── links/              # domínio de links
│   │       ├── api/            # chamadas HTTP (create, list, delete, resolve, export)
│   │       ├── hooks/          # useCreateLink, useLinks, useDeleteLink…
│   │       ├── components/     # LinkForm, LinkList, LinkRow, EmptyState…
│   │       └── schemas.ts      # schemas Zod (compartilha regra com o back)
│   ├── components/             # UI reutilizável, agnóstica de domínio (Button, Input…)
│   ├── lib/                    # http client, query-client, utils
│   ├── styles/                 # tema/tokens (paleta Dracula), globals
│   └── main.tsx
├── .env.example                # VITE_FRONTEND_URL, VITE_BACKEND_URL
├── index.html
├── tailwind.config.ts
└── vite.config.ts
```

**Regras**

1. **MUST** — SPA com Vite, **sem framework** (React Router para as 3 rotas).
2. **MUST** — Toda I/O de rede passa pela camada `features/links/api` (nada de `fetch` solto em componentes).
3. **MUST** — Estado de servidor via **React Query**; nada de estado global manual para dados da API.
4. **MUST** — Formulários com **React Hook Form + Zod**; a regra de URL/slug vive em `schemas.ts`.
5. **MUST** — Paleta e tipografia derivam dos tokens do design system (tema Dracula); sem hex "mágico" espalhado.
6. **SHOULD** — Componentes puros e sem efeito colateral; lógica de dados em hooks.
7. **MUST** — Estados de UX obrigatórios: `loading`, `empty`, `error`, e ações bloqueadas por estado.

---

## Artigo 2 — Estrutura do Backend (`server/`)

API **Fastify + Drizzle + Postgres + TypeScript**, em camadas (rota → caso de uso → repositório).

```
server/
├── src/
│   ├── server.ts               # bootstrap Fastify (CORS, plugins, error handler)
│   ├── env.ts                  # validação das envs com Zod
│   ├── http/
│   │   ├── routes/             # create-link, list-links, delete-link, resolve-link, export-links
│   │   └── errors/             # erros de negócio → status HTTP (400/404/409)
│   ├── use-cases/              # regras de negócio (uma por funcionalidade)
│   ├── db/
│   │   ├── schema.ts           # tabela links (Drizzle)
│   │   ├── client.ts           # conexão
│   │   └── migrations/         # geradas pelo Drizzle Kit
│   ├── schemas/                # Zod (input/output) — regra de URL/slug
│   └── lib/
│       ├── storage.ts          # cliente R2 (S3-compatible) + upload
│       └── csv.ts              # geração do CSV via streaming
├── Dockerfile                  # imagem da aplicação (boas práticas)
├── docker-compose.yml          # Postgres (+ app) para dev
├── drizzle.config.ts
└── .env.example                # PORT, DATABASE_URL, CLOUDFLARE_*
```

**Regras**

1. **MUST** — Stack obrigatória: TypeScript, Fastify, Drizzle, Postgres.
2. **MUST** — **CORS habilitado**.
3. **MUST** — Script **exato** `db:migrate` para rodar as migrations.
4. **MUST** — Envs validadas na inicialização (`env.ts`); falha rápido se faltar variável.
5. **MUST** — Rotas **finas**: validação (Zod) + chamada ao caso de uso; regra de negócio nunca dentro da rota.
6. **MUST** — Erros de negócio mapeados para status semânticos (D11): `201/400/409/404`.
7. **MUST** — CSV gerado por **streaming** (D6) e enviado ao **R2** com nome aleatório e único (D2, BE-10).
8. **MUST** — Identificador das operações de mutação = `id` UUID (D1); incremento de acesso no resolve (D7).
9. **SHOULD** — Dockerfile **multi-stage** e imagem enxuta (ex.: `node:lts-alpine`, usuário não-root).

---

## Artigo 3 — Cobertura de Testes — Frontend

**Ferramentas:** Vitest + React Testing Library + MSW (mock da API) + `@testing-library/user-event`.

**MUST — casos cobertos (mapeados aos requisitos FE):**

| Alvo | Cobre |
|------|-------|
| `LinkForm` cria link com dados válidos | FE-01 |
| `LinkForm` bloqueia URL/slug mal formatado (Zod) | FE-02 |
| `LinkForm` exibe erro de slug duplicado (resposta 409) | FE-03 |
| `LinkList` deleta link e revalida | FE-04 |
| `LinkList` renderiza itens, contador e **empty state** | FE-06, UX |
| Botão **Baixar CSV** dispara export e usa a `url` retornada | FE-08 |
| Página **redirect** resolve slug e trata inexistente → 404 | FE-05 |
| Estados `loading` / `error` / ações desabilitadas | UX |

**Metas de cobertura (gate de CI):**

- **Linhas ≥ 80%**, **branches ≥ 75%** no diretório `src/features/links`.
- **100%** dos schemas Zod (regras de validação são críticas).
- Componentes puramente visuais (`components/`) **SHOULD** ter smoke test de render.

**Regras**

1. **MUST** — Testes de integração de página com **MSW**; sem bater na API real.
2. **MUST** — Nenhum teste depende de ordem de execução ou de estado global compartilhado.
3. **SHOULD** — Preferir queries por papel/rótulo (`getByRole`, `getByLabelText`) a seletores frágeis.

---

## Artigo 4 — Cobertura de Testes — Backend

**Ferramentas:** Vitest (D5) + banco Postgres de teste isolado (container/schema dedicado).

**MUST — casos cobertos (mapeados aos requisitos BE):**

| Alvo | Cobre |
|------|-------|
| Criar link válido | BE-01 |
| Rejeitar URL/slug mal formatado → `400` | BE-02 |
| Rejeitar slug duplicado → `409` | BE-03 |
| Deletar link por `id`; inexistente → `404` | BE-04 |
| Resolver slug → URL original **e** `access_count` incrementado | BE-05, BE-07, D7 |
| Listar paginado, ordenado por `created_at desc`, com `total` | BE-06, BE-11 |
| Gerar slug aleatório quando `shortUrl` vazio | D8 |
| Export gera CSV com os 4 campos e retorna `url` do R2 | BE-08, BE-09, BE-10, BE-12 |

**Metas de cobertura (gate de CI):**

- **Linhas ≥ 85%**, **branches ≥ 80%** em `src/use-cases` e `src/http/routes`.
- **100%** dos schemas Zod e do mapeamento de erros → status HTTP.
- Integração com R2 **MAY** ser testada contra um mock/stub do `storage.ts` (o upload real não é requisito de teste unitário).

**Regras**

1. **MUST** — Testes de **integração** rodando as rotas de ponta a ponta contra um banco real de teste (migrations aplicadas).
2. **MUST** — Cada teste limpa/isola seus dados (transação ou `truncate` no `beforeEach`).
3. **MUST** — Não depender de rede externa; R2 mockado.

---

## Artigo 5 — Cobertura E2E

**Ferramenta:** **Playwright**, rodando o fluxo real (frontend + backend + Postgres via Docker Compose).

**MUST — jornadas cobertas:**

1. **Criar link** — preenche o form, salva, e o novo link aparece na listagem.
2. **Validação** — tenta criar com URL/slug inválido e vê a mensagem de erro (FE-02); tenta slug duplicado e vê o conflito (FE-03).
3. **Redirecionar** — acessa `/:short`, é levado à URL original **e** o contador incrementa (FE-05/FE-07).
4. **404** — acessa slug inexistente e vê a página de não encontrado.
5. **Deletar** — remove um link e ele some da lista (FE-04).
6. **Baixar CSV** — clica em Baixar CSV e um download/URL válido é obtido (FE-08).
7. **Empty state** — com base limpa, a listagem mostra o estado vazio.

**Regras**

1. **MUST** — E2E cobre pelo menos as jornadas acima (as 3 páginas + fluxos-chave).
2. **MUST** — Ambiente efêmero e determinístico (Compose sobe, seed/limpeza controlados, derruba ao fim).
3. **SHOULD** — Rodar **responsivo**: ao menos um viewport mobile e um desktop.
4. **MAY** — Integrar no CI como job separado (mais lento), fora do gate unitário.

---

## Artigo 6 — Governança

1. Todo PR **MUST** passar nos gates de cobertura (Artigos 3–5) antes do merge.
2. Requisito funcional novo **MUST** vir acompanhado do respectivo teste (a matriz BE/FE é a fonte da verdade).
3. Código de correção do desafio fica na branch principal; **extras** (SSR, OpenGraph, UI otimista) em **branch separada** (PRD §1.2, §7).
4. Alterar um princípio **MUST** desta constitution exige atualizar o PRD/ADR correspondente na mesma mudança.
