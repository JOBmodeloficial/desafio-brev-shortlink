# W0-T5 — `drizzle.config.ts` + script exato `db:migrate`

> Onda 0 (Fundação & DevOps) · Trilha **server**
> Requisitos: **BE-11**, **D4** · Constitution: Artigo 2 (regras R1, R3)
> Depende de: W0-T2 (scaffold backend, `package.json`, árvore `src/`) · W0-T3 (Postgres via Compose)

---

## Contexto / Por quê

O desafio Brev.ly exige, de forma **explícita e não negociável**, um script **exato**
`db:migrate` para aplicar as migrations do banco (PRD §4.1, PRD §9 critério "Script
`db:migrate` funcional", Constitution Art.2 R3). O ORM escolhido é **Drizzle** sobre
**Postgres** (D4, stack obrigatória), e o Drizzle Kit precisa de um arquivo de
configuração (`drizzle.config.ts`) que declare onde está o schema, para onde gerar as
migrations, o dialeto e a credencial de conexão.

Esta task pertence à **Onda 0 (Fundação)**: seu papel é **estabelecer a infraestrutura de
migrations compilável e executável**, sem nenhuma regra de negócio e **sem a tabela `links`**.
A definição do schema de negócio (`links`) e a geração/aplicação da migration inicial são
**propriedade da Onda 1** (W1-T2, W1-T3), que **evolui** o `drizzle.config.ts` e o
`src/db/schema.ts` criados aqui (WAVES §Onda 1, Nota de propriedade). Portanto, nesta task:

- Criamos `drizzle.config.ts` apontando para um `src/db/schema.ts` que existe como **stub vazio**
  (sem tabelas) — o arquivo é criado/garantido por W0-T2/aqui, mas o conteúdo de negócio vem em W1.
- Registramos os scripts npm `db:generate` e o **exato** `db:migrate`.
- Não geramos nem aplicamos migration alguma (não há tabela ainda).

O vínculo com **BE-11** (listagem performática) é indireto e de fundação: a infraestrutura de
migrations é o que, nas ondas seguintes, permitirá criar a tabela `links` com o **índice único
em `short_url`** que sustenta a performance da listagem/resolve. Aqui só habilitamos o mecanismo.

---

## Requisitos funcionais

- **FR-1** — Existe o arquivo `server/drizzle.config.ts`, escrito em TypeScript, exportando a
  configuração do Drizzle Kit via `defineConfig` de `drizzle-kit`.
- **FR-2** — A config declara `dialect: 'postgresql'`.
- **FR-3** — A config declara `schema: './src/db/schema.ts'` (caminho relativo à raiz de `server/`).
- **FR-4** — A config declara `out: './src/db/migrations'` (destino das migrations geradas),
  coerente com a árvore da constitution (`server/src/db/migrations/`).
- **FR-5** — A config declara `dbCredentials: { url: <DATABASE_URL> }`, lendo a variável de
  ambiente `DATABASE_URL` do processo.
- **FR-6** — O `server/package.json` contém o script **exato** `"db:migrate": "drizzle-kit migrate"`.
  O nome do script (`db:migrate`) e a natureza do comando (aplicar migrations) são obrigatórios e
  imutáveis (PRD §4.1, Art.2 R3).
- **FR-7** — O `server/package.json` contém o script `"db:generate": "drizzle-kit generate"`
  (geração de migrations a partir do schema — usado a partir da Onda 1).
- **FR-8** — Existe um `src/db/schema.ts` **stub** (sem definição de tabela de negócio) referenciado
  por `schema`, de modo que `drizzle-kit` consiga carregar a config sem erro de módulo inexistente.
- **FR-9** — `drizzle-kit` está declarado como `devDependency` e `drizzle-orm` como `dependency` em
  `server/package.json` (declarados/garantidos aqui se ainda não presentes do W0-T2).

---

## Requisitos não funcionais

- **NFR-1 (Type-safety)** — `drizzle.config.ts` compila sob `tsc --noEmit` sem erros; usa
  `defineConfig` (tipado) em vez de objeto solto.
- **NFR-2 (Config-as-env)** — Nenhuma credencial hardcoded no `drizzle.config.ts`; a URL de conexão
  vem **exclusivamente** de `process.env.DATABASE_URL`.
- **NFR-3 (Fail-fast local)** — Se `DATABASE_URL` estiver ausente, a config deve falhar de forma
  clara (lançar erro), evitando execução silenciosa contra um destino indefinido. (A validação
  formal de envs com Zod é propriedade de W1-T1/`env.ts`; aqui basta um guard mínimo.)
- **NFR-4 (Consistência estrutural)** — Caminhos (`schema`, `out`) batem 1:1 com a árvore de
  diretórios definida na constitution (Art.2): `src/db/schema.ts` e `src/db/migrations/`.
- **NFR-5 (Sem regra de negócio)** — Nenhuma tabela, coluna, índice ou migration é criada nesta
  task. Zero acoplamento com o domínio `links`.
- **NFR-6 (Idempotência do comando)** — `db:migrate` (drizzle-kit migrate) é, por natureza,
  idempotente: rodar com zero migrations pendentes é no-op e não falha.

---

## Abordagem técnica

Arquivos concretos (raiz de trabalho: `server/`), conforme a árvore da Constitution Art.2:

### `server/drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida (necessária para drizzle-kit)')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
```

### `server/src/db/schema.ts` (stub — conteúdo de negócio virá em W1-T2)

```ts
// Stub da Onda 0: sem tabelas ainda.
// A tabela `links` (id/original_url/short_url unique/access_count/created_at)
// é propriedade da Onda 1 (W1-T2). Este arquivo existe para que drizzle.config
// consiga resolvê-lo sem erro de módulo.
export {}
```

### `server/package.json` (scripts — trecho relevante)

```jsonc
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  },
  "dependencies": {
    "drizzle-orm": "<versão>"
  },
  "devDependencies": {
    "drizzle-kit": "<versão>"
  }
}
```

**Observações de implementação:**

- Carregamento de `.env`: `drizzle-kit` lê o arquivo de config em runtime Node. Para que
  `process.env.DATABASE_URL` esteja populada ao rodar `db:migrate`/`db:generate` localmente, use o
  mecanismo padrão do projeto para carregar `.env` (ex.: `import 'dotenv/config'` no topo do
  `drizzle.config.ts`, ou a flag `--env-file`). A decisão do mecanismo exato de carregamento de
  `.env` no dev é registrada em Clarifications.
- `out: './src/db/migrations'` mantém as migrations **dentro de `src/`** (coerente com a árvore da
  constitution `server/src/db/migrations/`), e não em uma pasta `drizzle/` na raiz.

---

## Critérios de aceite

- [ ] Existe `server/drizzle.config.ts` exportando `defineConfig({ ... })` do `drizzle-kit`.
- [ ] `dialect` = `'postgresql'`.
- [ ] `schema` = `'./src/db/schema.ts'`.
- [ ] `out` = `'./src/db/migrations'`.
- [ ] `dbCredentials.url` lê `process.env.DATABASE_URL` (nenhum valor hardcoded).
- [ ] `server/package.json` contém **exatamente** `"db:migrate": "drizzle-kit migrate"`.
- [ ] `server/package.json` contém `"db:generate": "drizzle-kit generate"`.
- [ ] `server/src/db/schema.ts` existe e é um stub sem tabelas de negócio.
- [ ] `drizzle-kit` (dev) e `drizzle-orm` (prod) estão em `server/package.json`.
- [ ] `tsc --noEmit` passa incluindo `drizzle.config.ts` (sem erro de tipo).
- [ ] Com `DATABASE_URL` apontando ao Postgres do Compose (W0-T3), `npm run db:migrate` executa e
      termina com sucesso (no-op: zero migrations pendentes, pois não há schema de negócio ainda).
- [ ] Com `DATABASE_URL` ausente, a config lança erro claro (não segue silenciosamente).
- [ ] Nenhuma migration é criada nesta task (pasta `src/db/migrations/` vazia ou inexistente).

---

## Fora de escopo

- **Definição da tabela `links`** (id UUID, `short_url` unique, `access_count`, `created_at`) — é
  W1-T2 (D1, D12, BE-03, BE-11).
- **Geração e aplicação da migration inicial** e `CREATE EXTENSION pgcrypto` — é W1-T3.
- **`src/db/client.ts`** (conexão Drizzle+Postgres em runtime da aplicação) — é W1-T4.
- **Validação formal de envs com Zod** (`src/env.ts` fail-fast completo) — é W1-T1.
- **Qualquer índice, constraint ou regra de performance concreta** — dependem do schema (Onda 1).
- **`.env.example`** do backend (7 chaves `CLOUDFLARE_*` + PORT + DATABASE_URL) — é W0-T6.
- **`docker-compose.yml`** do Postgres — é W0-T3.

---

## Dependências

- **W0-T2** — scaffold do backend: `server/package.json` (onde os scripts entram), `tsconfig`,
  árvore `src/`. Esta task **edita** o `package.json` produzido por W0-T2.
- **W0-T3** — `docker-compose.yml` com Postgres 16 fornece o alvo real de `DATABASE_URL` para
  validar o critério de execução de `db:migrate`.
- **W0-T6** — `.env.example` (documenta `DATABASE_URL`); não bloqueia, mas é a referência da chave.
- **Consumidores a jusante:** W1-T2/W1-T3 evoluem `schema.ts` e usam esta config para
  `db:generate` + `db:migrate` reais (fonte da verdade do schema muda para a Onda 1).
