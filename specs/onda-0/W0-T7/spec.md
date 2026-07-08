# W0-T7 — Lint, Format e Configuração de Teste do Backend

> Onda 0 (Fundação & DevOps) · Trilha server · Requisitos: **D5**
> Depende de: **W0-T2** (scaffold Fastify+TS com `src/server.ts`, `src/env.ts`, `package.json`, `tsconfig`).
> Fonte da verdade estrutural: [constitution](../../../constitution.md) Artigo 2 e Artigo 4.

---

## Contexto / Por quê

O backend (`server/`) foi scaffoldado em W0-T2 com Fastify + TypeScript e uma rota
`/health`. Esta task estabelece a **toolchain de qualidade e teste** do backend, sem
introduzir nenhuma regra de negócio:

- **Lint + Format** — padroniza estilo e captura erros estáticos desde a fundação,
  para que todas as ondas seguintes (W1–W3) escrevam código já dentro do padrão.
- **Configuração de teste (Vitest)** — a decisão **D5** adota Vitest no backend para
  testes de integração das rotas/casos de uso. Esta task cria o `vitest.config.ts`
  base (ambiente `node`, coverage v8 apontando `use-cases` e `http/routes`) e um
  **único smoke test** contra `/health`, validando que o runner executa de ponta a
  ponta. Os testes de negócio e os thresholds de gate (linhas ≥85% / branches ≥80%,
  Artigo 4) são responsabilidade das ondas W1–W3 — **não** desta task.

A saída da Onda 0 exige "lint/format/test verdes" (WAVES §Onda 0). Esta task entrega
exatamente essa fatia para o backend.

---

## Requisitos funcionais

- **FR-1** — Configurar **ESLint** no formato **flat config** (`eslint.config.js`),
  com suporte a TypeScript, cobrindo os arquivos `.ts` de `server/src/**` e os arquivos
  de teste.
- **FR-2** — Configurar **Prettier** como formatador, integrado ao ESLint de forma que
  conflitos de formatação sejam desligados no lint (o formato é responsabilidade do
  Prettier, não de regras de estilo do ESLint).
- **FR-3** — Expor scripts npm **exatos** no `server/package.json`:
  - `lint` — roda o ESLint sobre o projeto.
  - `lint:fix` — roda o ESLint com autofix.
  - `format` — roda o Prettier em modo escrita sobre o projeto.
  - `format:check` — roda o Prettier em modo verificação (falha se algo estiver fora do padrão).
  - `test` — roda a suíte Vitest (modo run, não watch).
  - `test:coverage` — roda a suíte Vitest com coverage.
- **FR-4** — Configurar **Vitest** via `server/vitest.config.ts` com:
  - `test.environment = 'node'`.
  - `test.globals = true` (permite `describe/it/expect` sem import explícito).
  - Provider de coverage **v8**.
  - `coverage.include` apontando **exatamente** para `src/use-cases/**` e
    `src/http/routes/**` (os alvos definidos no Artigo 4 da constitution).
  - **Sem** definição de thresholds de gate nesta task (deixados para W3-T7/T10).
- **FR-5** — Prover **um único smoke test** que constrói a aplicação Fastify e faz uma
  requisição à rota `GET /health`, asserindo status `200`. O teste deve usar a API de
  injeção do Fastify (`app.inject`) ou `buildApp`/factory equivalente exposta em W0-T2,
  **sem** subir porta de rede real.
- **FR-6** — O comando `npm run test` no diretório `server/` deve terminar com sucesso
  (exit code 0) executando apenas o smoke test.
- **FR-7** — O comando `npm run lint` deve terminar com sucesso (exit code 0) sobre o
  código scaffoldado da fundação (nenhum erro de lint remanescente).

---

## Requisitos não funcionais

- **NFR-1 (D5)** — A ferramenta de teste é **Vitest**; nenhuma outra (Jest, node:test)
  é introduzida.
- **NFR-2** — ESLint em **flat config** (`eslint.config.js`), padrão do ESLint 9+;
  não usar `.eslintrc.*`.
- **NFR-3** — Ignorar de lint/format/coverage: `node_modules`, `dist`/build,
  `coverage`, e artefatos gerados (ex.: `src/db/migrations`), evitando ruído.
- **NFR-4** — Configs em **TypeScript** onde a ferramenta suporta (`vitest.config.ts`);
  o `eslint.config.js` pode ser JS por convenção da ferramenta.
- **NFR-5** — Nenhuma regra de negócio, schema de URL/slug, tabela `links` ou rota de
  domínio é criada nesta task (isolamento de escopo da Onda 0).
- **NFR-6** — Determinismo: o smoke test não depende de rede externa, banco de dados,
  R2, nem de ordem de execução.

---

## Abordagem técnica

Estrutura-alvo (relativa a `server/`, conforme Artigo 2 da constitution):

```
server/
├── eslint.config.js            # ESLint flat config (TS + Prettier compat)  [NOVO]
├── .prettierrc                 # regras do Prettier                          [NOVO]
├── .prettierignore             # ignora dist/coverage/migrations             [NOVO]
├── vitest.config.ts            # ambiente node + coverage v8 (use-cases/routes) [NOVO]
├── package.json                # + scripts lint/format/test + devDeps        [EDITA — de W0-T2]
└── src/
    ├── server.ts               # bootstrap Fastify + /health                 [de W0-T2]
    └── http/
        └── routes/
            └── health.test.ts  # smoke test GET /health -> 200               [NOVO]
```

### Detalhes

- **`eslint.config.js`** — flat config exportando array de configs:
  - base recomendada do ESLint;
  - `typescript-eslint` (recommended) para os `.ts`;
  - `eslint-config-prettier` por último, para desligar regras de estilo conflitantes;
  - bloco `ignores` com `dist`, `coverage`, `node_modules`, `src/db/migrations`.
- **`.prettierrc`** — configuração explícita e mínima (ex.: `semi`, `singleQuote`,
  `trailingComma`, `printWidth`) para que `format:check` seja determinístico.
- **`.prettierignore`** — `dist`, `coverage`, `node_modules`, `src/db/migrations`.
- **`vitest.config.ts`** — `defineConfig({ test: { environment: 'node', globals: true,
  coverage: { provider: 'v8', include: ['src/use-cases/**', 'src/http/routes/**'] } } })`.
  Como em W0-T2 os diretórios `use-cases`/`http/routes` ainda são stubs, `include`
  simplesmente não terá cobertura relevante ainda — a intenção é fixar o alvo correto
  para as ondas seguintes.
- **Smoke test (`health.test.ts`)** — importa o factory de app de W0-T2 (`buildApp`
  ou `app`), faz `app.inject({ method: 'GET', url: '/health' })` e asserta
  `response.statusCode === 200`. Não abre socket.
- **devDependencies a adicionar** ao `server/package.json` (versões exatas ficam a
  cargo da implementação; ver clarificação): `eslint`, `typescript-eslint`,
  `@eslint/js`, `prettier`, `eslint-config-prettier`, `vitest`, `@vitest/coverage-v8`.
  `typescript` e `fastify` já vêm de W0-T2.

---

## Critérios de aceite

- [ ] `server/eslint.config.js` existe em formato flat config, com suporte a TypeScript.
- [ ] `server/.prettierrc` e `server/.prettierignore` existem e são coerentes com o `eslint.config.js`.
- [ ] `server/vitest.config.ts` define `environment: 'node'`, coverage provider `v8` e
      `coverage.include` apontando **exatamente** para `src/use-cases/**` e `src/http/routes/**`.
- [ ] `server/vitest.config.ts` **não** define thresholds de gate (permanece para W3).
- [ ] `server/package.json` expõe os scripts `lint`, `lint:fix`, `format`,
      `format:check`, `test`, `test:coverage`.
- [ ] Existe **exatamente um** smoke test que faz `GET /health` e asserta `200`, sem abrir porta de rede.
- [ ] `npm --prefix server run lint` termina com exit code 0.
- [ ] `npm --prefix server run format:check` termina com exit code 0.
- [ ] `npm --prefix server test` termina com exit code 0 rodando apenas o smoke test.
- [ ] `npm --prefix server run test:coverage` executa e gera relatório de coverage sem erro.
- [ ] Nenhum arquivo de negócio (schema `links`, rotas de domínio, schemas Zod de URL/slug) foi criado.

---

## Fora de escopo

- Testes de negócio / integração de rotas (BE-01…BE-12) — ondas **W1–W3**.
- Thresholds de gate de cobertura (linhas ≥85% / branches ≥80%, Artigo 4) — **W3-T7/T10**.
- Banco Postgres de teste, `globalSetup`/migrate para testes, `docker-compose.test.yml` — **W3-T7**.
- Mock de storage/R2 e helpers de stream — **W3-T6**.
- Lint/format/test do **frontend** (`web/`) — **W0-T10**.
- Configuração de CI (`.github/workflows`) — **W6-T14**.
- Qualquer regra de negócio, schema de URL/slug, ou tabela `links`.

---

## Dependências

- **W0-T2** (bloqueante) — fornece `server/package.json`, `tsconfig`, `src/server.ts`
  com a rota `/health` e o factory/`buildApp` usado pelo smoke test.
- **D5** — decisão que adota **Vitest** no backend.
- **Constitution Artigo 2** — estrutura de diretórios `src/` (`use-cases`, `http/routes`).
- **Constitution Artigo 4** — define os alvos de coverage (`src/use-cases`,
  `src/http/routes`); esta task apenas os aponta, sem aplicar os thresholds.
