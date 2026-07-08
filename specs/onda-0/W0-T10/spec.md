# W0-T10 — Lint, format e teste do frontend (`web/`)

> Onda 0 — Fundação & DevOps · Requisito: **D3**
> Depende de: **W0-T8** (scaffold Vite+React+TS com árvore `src/` e 3 rotas stub)

---

## Contexto / Por quê

A Onda 0 entrega scaffolds **compiláveis** com toolchain e DevOps, **sem regra de
negócio**. Esta task estabelece a fundação de **qualidade de código** e de **testes**
do frontend (`web/`), de modo que as ondas seguintes (W4/W5) já encontrem lint, format
e o runner de testes prontos e verdes.

O PRD adota (D3) React Query, React Hook Form, Zod e TailwindCSS no front; a
constitution (Artigo 3) exige a stack de testes **Vitest + React Testing Library + MSW
+ `@testing-library/user-event`**, com testes de integração de página via MSW (sem bater
na API real). Esta task **não** escreve esses testes de feature — ela apenas instala e
configura o ferramental e o deixa provado por um **smoke test de render**, garantindo
que o pipeline `lint` / `format` / `test` funcione ponta a ponta desde a fundação.

Escopo desta task (do WAVES, W0-T10):
- **ESLint flat** (React + React Hooks) + **Prettier**.
- **`vitest.config.ts`** com ambiente **jsdom**, **jest-dom** e **MSW pronto** (server de
  mock instanciado no setup, ainda sem handlers de negócio).
- **`src/test/setup.ts`** (setup global do Vitest).
- **Smoke test de render**.
- devDeps: `vitest` + `@testing-library/*` + `jsdom` + `msw`.

---

## Requisitos funcionais

- **FR-1** — O projeto `web/` **DEVE** ter ESLint configurado no formato **flat config**
  (`web/eslint.config.js`), cobrindo TypeScript + React + React Hooks (regras
  `react-hooks` e `react-refresh`), e integrado ao Prettier para evitar conflitos de
  regras de formatação.
- **FR-2** — O projeto **DEVE** ter Prettier configurado (`web/.prettierrc.json` +
  `web/.prettierignore`) como fonte única de formatação.
- **FR-3** — O `package.json` de `web/` **DEVE** expor os scripts:
  - `lint` — executa ESLint sobre `src/`.
  - `format` — aplica Prettier (write) sobre o projeto.
  - `format:check` — verifica formatação sem escrever (uso em CI).
  - `test` — executa Vitest em modo run (não-watch), adequado a CI.
  - `test:watch` — executa Vitest em modo watch (DX local).
- **FR-4** — **DEVE** existir `web/vitest.config.ts` com:
  - `environment: 'jsdom'`;
  - `globals: true`;
  - `setupFiles` apontando para `src/test/setup.ts`;
  - resolução do alias `@` consistente com o `vite.config.ts` do scaffold (W0-T8).
- **FR-5** — **DEVE** existir `web/src/test/setup.ts` que:
  - importa `@testing-library/jest-dom` (matchers `toBeInTheDocument`, etc.);
  - instancia um **MSW server** (`setupServer()` de `msw/node`, sem handlers de negócio
    nesta onda) e registra os hooks de ciclo de vida `beforeAll(listen)` /
    `afterEach(resetHandlers)` / `afterAll(close)`;
  - executa `cleanup()` do RTL após cada teste.
- **FR-6** — O MSW **DEVE** ficar "pronto para uso": o `server` de mock **DEVE** ser
  exportável/reutilizável por testes futuros (arquivo dedicado
  `src/test/msw/server.ts`) com um array de handlers vazio (`handlers: []`) nesta onda.
- **FR-7** — **DEVE** existir um **smoke test de render** que monta um componente do
  scaffold (o `App`/roteador stub de W0-T8) e afirma que ele renderiza sem lançar,
  provando que jsdom + RTL + jest-dom + setup estão operacionais.
- **FR-8** — As dependências de desenvolvimento **DEVEM** incluir, no mínimo: `vitest`,
  `@vitejs/plugin-react` (se ainda não presente do scaffold), `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `msw`,
  `eslint`, `prettier`, `eslint-config-prettier`, `eslint-plugin-react-hooks`,
  `eslint-plugin-react-refresh` e `typescript-eslint`.

---

## Requisitos não funcionais

- **NFR-1** — `npm run lint`, `npm run format:check` e `npm test` **DEVEM** sair com
  código **0** no scaffold recém-criado (pipeline verde na fundação).
- **NFR-2** — Zero regra de negócio: **nenhum** handler MSW de endpoints reais,
  **nenhum** schema Zod de URL/slug e **nenhum** teste de feature (isso é escopo de W4/W5).
- **NFR-3** — ESLint e Prettier **não** podem conflitar (regras estilísticas do ESLint
  desativadas via `eslint-config-prettier`); formatação é responsabilidade exclusiva do
  Prettier.
- **NFR-4** — Testes **DEVEM** ser determinísticos e independentes de ordem
  (constitution Art.3 R2): sem estado global compartilhado entre testes.
- **NFR-5** — Configuração TypeScript-first: ESLint flat usando `typescript-eslint`;
  Vitest com tipos globais habilitados (`vitest/globals` no `tsconfig` de teste ou via
  `types`).

---

## Abordagem técnica (arquivos concretos)

Estrutura seguindo a constitution (Artigo 1) e o scaffold de W0-T8:

```
web/
├── eslint.config.js          # ESLint flat: ts + react-hooks + react-refresh + prettier
├── .prettierrc.json          # config do Prettier (fonte única de formatação)
├── .prettierignore           # dist/, node_modules/, coverage/
├── vitest.config.ts          # jsdom, globals, setupFiles, alias @
├── package.json              # scripts lint/format/format:check/test/test:watch + devDeps
└── src/
    └── test/
        ├── setup.ts          # jest-dom + MSW lifecycle + cleanup RTL
        └── msw/
            └── server.ts      # setupServer(...handlers) com handlers=[] (pronto p/ W5)
```

- **`eslint.config.js`** — flat config (array). Bases: `@eslint/js` recommended +
  `typescript-eslint` recommended; plugins `eslint-plugin-react-hooks` (regras
  `recommended`) e `eslint-plugin-react-refresh`; `eslint-config-prettier` por último
  para desligar regras de estilo. `ignores`: `dist`, `coverage`, `node_modules`.
- **`.prettierrc.json`** — configuração explícita (ex.: `semi`, `singleQuote`,
  `printWidth`, `trailingComma`). Ver clarificação C1 sobre estilo exato.
- **`vitest.config.ts`** — importa `defineConfig` de `vitest/config`, aplica
  `@vitejs/plugin-react`, `test.environment='jsdom'`, `test.globals=true`,
  `test.setupFiles=['./src/test/setup.ts']`, e `resolve.alias` `@ -> ./src`
  (espelhando o `vite.config.ts` de W0-T8).
- **`src/test/msw/server.ts`** — `export const server = setupServer(...handlers)` com
  `const handlers = []` (vazio nesta onda; W5-T10 preencherá).
- **`src/test/setup.ts`** — `import '@testing-library/jest-dom'`; importa o `server`;
  `beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))`;
  `afterEach(() => { cleanup(); server.resetHandlers(); })`;
  `afterAll(() => server.close())`.
- **Smoke test** — arquivo colocado junto ao componente-alvo do scaffold (ex.:
  `src/App.test.tsx` ou `src/app/router.test.tsx`, conforme o nome real gerado em
  W0-T8): `render(<App />)` dentro de `MemoryRouter`/provider stub e asserção mínima
  (ex.: `expect(document.body).toBeTruthy()` ou presença de um elemento estático do
  stub). **Não** deve assumir textos de UI final.

**Nota de propriedade:** os arquivos de scaffold base (`package.json`, `vite.config.ts`,
`tsconfig`) têm sua **fonte da verdade em W0-T8**; esta task apenas **adiciona** scripts,
devDeps e os arquivos de lint/format/test acima, sem redefinir o scaffold.

---

## Critérios de aceite (checklist verificável)

- [ ] `web/eslint.config.js` existe, é flat config e inclui react-hooks +
  react-refresh + integração Prettier.
- [ ] `web/.prettierrc.json` e `web/.prettierignore` existem.
- [ ] `web/package.json` tem os scripts `lint`, `format`, `format:check`, `test`,
  `test:watch`.
- [ ] `web/vitest.config.ts` existe com `environment: 'jsdom'`, `globals: true`,
  `setupFiles` → `src/test/setup.ts` e alias `@`.
- [ ] `web/src/test/setup.ts` importa `@testing-library/jest-dom`, sobe o MSW server
  com `onUnhandledRequest: 'error'` e registra `listen/resetHandlers/close` + `cleanup`.
- [ ] `web/src/test/msw/server.ts` exporta `server` via `setupServer` com `handlers = []`.
- [ ] Existe **um smoke test de render** que monta o componente do scaffold e passa.
- [ ] devDeps presentes: `vitest`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `msw`, `eslint`,
  `prettier`, `eslint-config-prettier`, `eslint-plugin-react-hooks`,
  `eslint-plugin-react-refresh`, `typescript-eslint`.
- [ ] `npm run lint` sai com código 0.
- [ ] `npm run format:check` sai com código 0.
- [ ] `npm test` executa o Vitest em modo run e sai com código 0 (smoke test verde).
- [ ] Nenhum handler MSW de endpoint real, schema Zod ou teste de feature foi adicionado.

---

## Fora de escopo

- Handlers MSW de endpoints reais (`/links`, resolve, export) — **W5-T10**.
- Schemas Zod de URL/slug — **W4-T8 / W5-T1**.
- Testes de componentes/páginas de feature (LinkForm, LinkList, Redirect, 404) —
  **W5-T10…T12**.
- Metas/gates de cobertura (linhas ≥80% / branches ≥75% em `features/links`) — **W5**.
  Nesta onda **não** se configura threshold de cobertura.
- Configuração de Tailwind e tokens Dracula — **W0-T9**.
- Scaffold Vite/React/TS, rotas e `vite.config.ts`/`tsconfig` — **W0-T8**.
- `.env.example` do frontend — **W0-T11**.
- E2E (Playwright) — **W6**.
- Integração CI (workflow GitHub Actions) — **W6-T14** (opcional).

---

## Dependências

- **W0-T8** — Scaffold frontend Vite+React+TS com árvore `src/` e as 3 rotas stub;
  fornece o `package.json`, `vite.config.ts`/`tsconfig` e o componente-alvo do smoke
  test. **(Bloqueante.)**
- **Requisito D3** — stack flexível do frontend (React Query + RHF + Zod + Tailwind);
  esta task materializa a fatia de qualidade/teste da fundação front.
- **Constitution Artigo 3** — define a stack de teste (Vitest + RTL + MSW +
  user-event) e as regras de determinismo/isolamento que o setup deve honrar.
