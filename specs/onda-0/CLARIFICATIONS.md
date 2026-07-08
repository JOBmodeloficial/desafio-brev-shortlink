# Onda 0 — Respostas de Clarificação (gate humano)

Decisões tomadas no gate `/clarify`, aplicáveis a todos os itens W0-T1…T12.

| # | Decisão | Escolha |
|---|---------|---------|
| C1 | Versão do Node (`.nvmrc` + imagem base) | **22** → `.nvmrc = 22`, Docker `node:22-alpine` |
| C2 | PORT padrão do backend | **3333** (env.ts default, compose, EXPOSE, .env.example) |
| C3 | Postgres de dev (compose + .env + DATABASE_URL) | **`brevly / brevly / brevly`** → `postgresql://brevly:brevly@localhost:5432/brevly` |
| C4 | Estratégia de versões npm | **Latest estável com `^` + `package-lock.json` commitado** |
| C5 | Versão do Tailwind | **v3** (`tailwind.config.ts` + `postcss` + `@tailwind` directives) |
| C6 | Carregamento da fonte Open Sans | **`@fontsource/open-sans`** (self-host) |
| C7 | Estilo Prettier | **`singleQuote: true, semi: true, printWidth: 100, trailingComma: "all"`** (back + front) |
| C8 | Alias `@` → `./src` | **Configurar já em W0-T8** (vite.config + tsconfig); W4 confirma |
| C9 | Carregamento do `.env` no `drizzle.config.ts` | **`import 'dotenv/config'`** (dotenv como devDependency) |

Complementos herdados dos *assumptions* dos specs: ESM (`type: module`), tsconfig `NodeNext` strict, imports internos com extensão `.js`; CORS `origin: true` em dev, host `0.0.0.0`, `GET /health → { status: 'ok' }`; `CLOUDFLARE_*` opcionais no scaffold da Onda 0 (validação estrita evolui em W1/W3); compose sem serviço `app` (só `db`), volume `brevly_pgdata`.
