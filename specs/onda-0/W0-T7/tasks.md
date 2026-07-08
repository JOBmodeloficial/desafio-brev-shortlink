# Tasks — W0-T7 · Lint, Format e Configuração de Teste do Backend

Arquivos: `server/eslint.config.js`, `server/.prettierrc.json`, `server/.prettierignore`,
`server/vitest.config.ts`, `server/src/server.test.ts`, scripts no `package.json`.

## Tarefas

- [x] **T7.1** — ESLint flat config (`eslint.config.js`) com `@eslint/js` + `typescript-eslint`
      recommended + `eslint-config-prettier` por último; `ignores`: dist/coverage/node_modules/migrations. — FR-1/FR-2
- [x] **T7.2** — Scripts `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:coverage`. — FR-3
- [x] **T7.3** — `vitest.config.ts`: `environment: 'node'`, `globals: true`, coverage provider `v8`,
      `include` exato `src/use-cases/**` e `src/http/routes/**`, sem thresholds. — FR-4
- [x] **T7.4** — Smoke test único `src/server.test.ts`: `buildApp()` + `app.inject GET /health` → 200
      `{ status: 'ok' }`, sem abrir socket. — FR-5/FR-6
- [x] **T7.5** — devDeps: `eslint`, `typescript-eslint`, `@eslint/js`, `prettier`,
      `eslint-config-prettier`, `vitest`, `@vitest/coverage-v8`. — FR-7

## Notas

- `.prettierrc.json` com C7: `{ singleQuote:true, semi:true, printWidth:100, trailingComma:'all' }`.
- Smoke test determinístico e sem banco (buildApp não carrega env no import).
- Sem thresholds de gate (ficam para W3). Sem regra de negócio.
