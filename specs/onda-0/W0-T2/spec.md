# W0-T2 — Scaffold do backend Fastify + TypeScript

> Onda 0 (Fundação & DevOps) · Requisitos: **D4**, **BE-01** (habilitação; sem regra de negócio)
> Depende de: W0-T1 (estrutura raiz do monorepo)
> Fonte da verdade da estrutura: [constitution.md](../../../constitution.md) Artigo 2 · [PRD.md](../../../PRD.md) §4.1, §5.1

---

## Contexto / Por quê

O backend do Brev.ly é uma API **Fastify + Drizzle + Postgres + TypeScript** organizada em
camadas (rota → caso de uso → repositório), conforme o Artigo 2 da constitution. Antes de
escrever qualquer regra de negócio (Ondas 1–3), a Onda 0 precisa entregar um **scaffold
compilável e executável**: toolchain TypeScript, dependências instaladas, um servidor Fastify
que sobe com **CORS habilitado** e um endpoint `GET /health`, validação de variáveis de
ambiente **fail-fast** com Zod, e a **árvore de diretórios `src/` completa (com stubs)** para
que as ondas seguintes apenas preencham os arquivos, sem retrabalho de estrutura.

Esta task é **puramente estrutural**. Não cria a tabela `links`, rotas de negócio, schemas de
URL/slug, nem o cliente de banco funcional — esses artefatos têm sua fonte da verdade na Onda 1
(WAVES §Onda 1, "Nota de propriedade"). O critério "compila e `/health` responde 200 com CORS"
é o gate desta task.

**Limites de propriedade (evitar retrabalho):**

| Artefato | Fonte da verdade | Nesta task (W0-T2) |
|----------|------------------|--------------------|
| `.gitignore`, `.nvmrc`, pastas raiz | W0-T1 | não cria (consome) |
| `docker-compose.yml` | W0-T3 | não cria |
| `Dockerfile`, `.dockerignore` | W0-T4 | não cria |
| `drizzle.config.ts`, script `db:migrate` | W0-T5 | não cria (deixa placeholder do script — ver FR-9) |
| `server/.env.example` | W0-T6 | não cria |
| ESLint, Prettier, `vitest.config.ts` | W0-T7 | não cria (declara devDeps e scripts `lint`/`format`/`test` — ver FR-9) |
| conteúdo real de `env.ts`, `db/schema.ts`, `db/client.ts`, schemas Zod | Onda 1 | apenas **stub** mínimo |

---

## Requisitos funcionais

- **FR-1** — Criar `server/package.json` com `"type": "module"`, `name`, `private: true`,
  `engines.node` compatível com o `.nvmrc` do repositório, e o conjunto de scripts descrito em FR-9.
- **FR-2** — Declarar **dependencies** de runtime: `fastify`, `@fastify/cors`, `drizzle-orm`,
  `postgres`, `zod`, `nanoid`, `@aws-sdk/client-s3`. (`nanoid` e `@aws-sdk/client-s3` são
  declarados já na fundação por decisão de WAVES §Ajustes item 2, ainda que só sejam usados nas
  Ondas 2/3.)
- **FR-3** — Declarar **devDependencies** de toolchain: `typescript`, `tsx`, `drizzle-kit`,
  `vitest`, `@types/node`. (Configs de lint/format ficam a cargo de W0-T7, mas seus scripts já
  são expostos — ver FR-9.)
- **FR-4** — Criar `server/tsconfig.json` com `strict: true`, `module: "NodeNext"`,
  `moduleResolution: "NodeNext"`, `target` moderno (ES2022+), `outDir: "dist"`, `rootDir: "src"`,
  `esModuleInterop`, `skipLibCheck`, `forceConsistentCasingInFileNames` e `resolveJsonModule`.
- **FR-5** — Criar `server/src/env.ts`: valida as variáveis de ambiente com **Zod** e falha na
  **inicialização** (fail-fast) se alguma faltar/for inválida, exportando um objeto `env` tipado.
  Deve validar ao menos `PORT` (coerção para número, default `3333`) e `DATABASE_URL` (string,
  url). As chaves `CLOUDFLARE_*` (PRD §5.1) podem ser declaradas como **opcionais** neste
  scaffold, pois só são exercidas na Onda 3; a validação estrita delas é evoluída em W1-T1/W3-T5.
- **FR-6** — Criar `server/src/server.ts` (bootstrap Fastify): instancia o Fastify, **registra
  `@fastify/cors`** (origem liberada para dev), registra a rota `GET /health`, lê `PORT`/host do
  `env`, e faz `listen`. Em erro de listen, loga e encerra com código diferente de zero.
- **FR-7** — A rota `GET /health` responde **`200`** com corpo JSON `{ "status": "ok" }`
  (payload simples, sem tocar no banco). Serve de smoke test da fundação e do CI (W0-T7).
- **FR-8** — Criar a **árvore de diretórios `src/`** com stubs mínimos que compilam, espelhando
  o Artigo 2 da constitution: `http/routes/`, `http/errors/`, `use-cases/`, `db/`, `schemas/`,
  `lib/`. Cada pasta recebe um arquivo stub exportado (ver Abordagem técnica) para não ficar
  vazia e para dar o ponto de extensão às ondas seguintes. **Sem** lógica de negócio.
- **FR-9** — Definir os scripts do `package.json`:
  - `dev` → executa `src/server.ts` em watch via `tsx` (ex.: `tsx watch src/server.ts`).
  - `build` → compila com `tsc` para `dist/`.
  - `start` → executa `node dist/server.js` (produção).
  - `test` → `vitest run` (config concreta entregue por W0-T7).
  - `lint` → placeholder de lint (config concreta entregue por W0-T7; ex.: `eslint .`).
  - `format` → placeholder de format (config concreta entregue por W0-T7; ex.: `prettier --write .`).
  - `db:migrate` → placeholder do comando **exato** exigido pelo PRD/constitution; o conteúdo
    definitivo (`drizzle-kit migrate`) é entregue por W0-T5. O **nome** do script `db:migrate`
    já deve existir aqui.

---

## Requisitos não funcionais

- **NFR-1 (Compilação)** — `npm run build` (`tsc`) conclui **sem erros** sob `strict` + `NodeNext`.
- **NFR-2 (Execução)** — `npm run dev` sobe o servidor e `GET /health` retorna `200`
  `{ "status": "ok" }`; encerra graciosamente com `Ctrl+C`.
- **NFR-3 (CORS)** — Requisição cross-origin ao `/health` recebe cabeçalho
  `Access-Control-Allow-Origin` (Artigo 2 R2 / PRD §4.1).
- **NFR-4 (Fail-fast)** — Subir sem `DATABASE_URL` (ou com valor inválido) aborta o processo na
  inicialização com mensagem clara do Zod (Artigo 2 R4).
- **NFR-5 (ESM)** — Projeto 100% ESM (`type: module`); imports relativos usam extensão conforme
  NodeNext exige; nenhum `require`.
- **NFR-6 (Estrutura fiel)** — A árvore `src/` bate 1:1 com o Artigo 2 da constitution.
- **NFR-7 (Sem regra de negócio)** — Nenhum arquivo criado nesta task contém lógica de links,
  validação de URL/slug, tabela `links` ou rotas de negócio.

---

## Abordagem técnica

Arquivos concretos (todos sob `server/`):

```
server/
├── package.json            # FR-1..FR-3, FR-9  ("type":"module", deps, devDeps, scripts)
├── tsconfig.json           # FR-4  (strict, NodeNext, outDir dist, rootDir src)
└── src/
    ├── server.ts           # FR-6/FR-7  (Fastify + @fastify/cors + GET /health + listen)
    ├── env.ts              # FR-5  (Zod fail-fast; PORT, DATABASE_URL, CLOUDFLARE_* opcionais)
    ├── http/
    │   ├── routes/
    │   │   └── health.ts   # stub: registra GET /health (ou inline em server.ts + index stub)
    │   └── errors/
    │       └── index.ts    # stub: placeholder do mapa de erros (Onda 1 W1-T6)
    ├── use-cases/
    │   └── index.ts        # stub: barrel vazio (Onda 2)
    ├── db/
    │   ├── schema.ts       # stub: comentário/placeholder (fonte da verdade Onda 1 W1-T2)
    │   └── client.ts       # stub: placeholder de conexão (fonte da verdade Onda 1 W1-T4)
    ├── schemas/
    │   └── index.ts        # stub: barrel vazio (Onda 1 W1-T5)
    └── lib/
        └── index.ts        # stub: barrel vazio (storage/csv/slug nas Ondas 2/3)
```

**Notas de implementação:**

- **`server.ts`**: `const app = Fastify({ logger: true })`; `await app.register(cors, { origin: true })`;
  registrar `GET /health` → `{ status: 'ok' }`; `app.listen({ port: env.PORT, host: '0.0.0.0' })`
  dentro de um `try/catch` que loga e `process.exit(1)` em falha. `host: '0.0.0.0'` para funcionar
  dentro do container (W0-T3/W0-T4).
- **`env.ts`**: `const envSchema = z.object({ PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(), CLOUDFLARE_ACCOUNT_ID: z.string().optional(), ... })`;
  `const parsed = envSchema.safeParse(process.env)`; se `!parsed.success`, logar
  `parsed.error.format()` e `process.exit(1)`; `export const env = parsed.data`.
- **`tsconfig.json`**: como imports NodeNext exigem extensão, os imports relativos internos usam
  `./env.js` / `./http/routes/health.js` (resolução ESM). Alternativa aceita: `tsx` em dev
  tolera imports sem extensão, mas o `build` (`tsc`) deve passar — padronizar com extensão `.js`.
- **Stubs**: cada arquivo de stub deve **exportar** algo (ex.: `export {}` ou uma função
  placeholder tipada) para que o `tsc` sob `isolatedModules`/NodeNext não reclame e para deixar
  claro o ponto de extensão da onda dona.
- **Versões de dependência**: não fixadas por PRD/constitution → ver Clarifications; recomendação
  é usar as `latest` estáveis compatíveis com Node ≥ 20 no momento do scaffold, com ranges `^`.

---

## Critérios de aceite

- [ ] `server/package.json` existe com `"type": "module"` e `private: true`.
- [ ] dependencies contêm: `fastify`, `@fastify/cors`, `drizzle-orm`, `postgres`, `zod`,
      `nanoid`, `@aws-sdk/client-s3`.
- [ ] devDependencies contêm: `typescript`, `tsx`, `drizzle-kit`, `vitest`, `@types/node`.
- [ ] Scripts presentes: `dev`, `build`, `start`, `test`, `lint`, `format`, `db:migrate`
      (o nome `db:migrate` deve existir mesmo que o corpo definitivo venha de W0-T5).
- [ ] `server/tsconfig.json` com `strict: true` e `module`/`moduleResolution` = `NodeNext`.
- [ ] `npm install` no `server/` conclui sem erros.
- [ ] `npm run build` (`tsc`) compila sem erros de tipo.
- [ ] `npm run dev` sobe o servidor Fastify.
- [ ] `GET /health` responde `200` com corpo `{ "status": "ok" }`.
- [ ] Resposta de `/health` inclui cabeçalho `Access-Control-Allow-Origin` (CORS ativo).
- [ ] Iniciar sem `DATABASE_URL` válida aborta na inicialização com erro do Zod (fail-fast).
- [ ] A árvore `src/` reproduz o Artigo 2: `http/routes`, `http/errors`, `use-cases`, `db`,
      `schemas`, `lib` — cada uma com ao menos um arquivo stub que compila.
- [ ] Nenhum arquivo desta task contém tabela `links`, rotas de negócio ou validação de URL/slug.

---

## Fora de escopo

- Tabela `links`, migrations e cliente de banco funcional (Onda 1: W1-T2/T3/T4).
- Schemas Zod de URL/slug/paginação e mapa de erros → HTTP (Onda 1: W1-T5/T6).
- Rotas de negócio (`POST /links`, `GET /links`, `GET /links/:shortUrl`, `DELETE /links/:id`,
  `POST /links/exports`) e casos de uso (Ondas 2/3).
- Integração R2/S3, geração e streaming de CSV (Onda 3: W3-T1..T4).
- `docker-compose.yml` (W0-T3), `Dockerfile`/`.dockerignore` (W0-T4).
- `drizzle.config.ts` e conteúdo definitivo do script `db:migrate` (W0-T5).
- `server/.env.example` (W0-T6).
- Configuração concreta de ESLint/Prettier e `vitest.config.ts` (W0-T7).
- Qualquer código do frontend (`web/` — Onda 0 trilha web, W0-T8..T11).

---

## Dependências

- **W0-T1** — estrutura raiz do monorepo (pasta `server/`, `.gitignore`, `.nvmrc`) deve existir
  antes; o `engines.node`/toolchain desta task alinha-se ao `.nvmrc`.
- **Consumidores diretos** — W0-T5 (adiciona corpo do `db:migrate` e `drizzle.config.ts`),
  W0-T6 (`.env.example` alimenta o `env.ts`), W0-T7 (configs de lint/format/vitest para os
  scripts declarados aqui), e a Onda 1 inteira (evolui os stubs `env.ts`/`db/*`/`schemas/*`).
- **Requisitos referenciados** — D4 (monorepo npm sem workspaces), BE-01 (habilitação da base da
  API; a criação de link em si é W2-T4). Regras de constitution: Artigo 2 R1 (stack), R2 (CORS),
  R4 (envs fail-fast), R5 (rotas finas — estrutura preparada).
