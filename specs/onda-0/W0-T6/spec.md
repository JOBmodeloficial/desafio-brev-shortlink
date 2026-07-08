# W0-T6 — `.env.example` do backend

> Onda 0 — Fundação & DevOps · Item **W0-T6** · Requisitos: **D2**
> Fonte da verdade: [PRD §5.1](../../../PRD.md) · [constitution Art.2](../../../constitution.md) · [WAVES §Onda 0](../../../WAVES.md)

---

## Contexto / Por quê

O backend valida suas variáveis de ambiente na inicialização (constitution Art.2 R4:
`env.ts` com Zod, fail-fast). Para que qualquer pessoa consiga subir o projeto sem
adivinhar quais variáveis existem, o repositório precisa de um `server/.env.example`
declarando **exatamente** as chaves consumidas pela aplicação.

O PRD §5.1 fixa o conjunto de 7 chaves (uma para porta, uma para o banco e cinco
`CLOUDFLARE_*` para o R2 — decisão **D2**: armazenamento/CDN do CSV é Cloudflare R2 real,
acessado via `@aws-sdk/client-s3` apontando para o endpoint R2). Este arquivo é também
critério de aceite explícito do PRD §9 ("`.env.example` presente em `web/` e `server/`").

Esta task **cria apenas o template** (`.env.example`). A validação Zod dessas envs em
`env.ts` é responsabilidade de W0-T2 (stub) e W1-T1 (fonte da verdade); o consumo das
`CLOUDFLARE_*` pelo cliente R2 é de W3-T1/T5. W0-T6 apenas garante que o template esteja
presente, completo e **alinhado 1:1** com o que essas tasks irão ler.

---

## Requisitos funcionais

- **FR-1** — DEVE existir o arquivo `server/.env.example` no repositório (versionado).
- **FR-2** — O arquivo DEVE conter **exatamente estas 7 chaves**, nesta ordem, sem chaves
  a mais nem a menos:
  1. `PORT`
  2. `DATABASE_URL`
  3. `CLOUDFLARE_ACCOUNT_ID`
  4. `CLOUDFLARE_ACCESS_KEY_ID`
  5. `CLOUDFLARE_SECRET_ACCESS_KEY`
  6. `CLOUDFLARE_BUCKET`
  7. `CLOUDFLARE_PUBLIC_URL`
- **FR-3** — O conjunto de chaves DEVE ser um espelho exato do PRD §5.1 (nomes idênticos,
  em maiúsculas, sem prefixo/sufixo).
- **FR-4** — O template DEVE fornecer **valores de exemplo/placeholder** úteis para dev
  (não secretos): `PORT` com um default de desenvolvimento e `DATABASE_URL` com uma
  connection string apontando para o Postgres do `docker-compose.yml` (W0-T3). As chaves
  `CLOUDFLARE_*` DEVEM ficar vazias ou com placeholder claramente não-secreto.
- **FR-5** — As chaves DEVEM ser um **superset ≥** do que `env.ts` valida — ou seja, toda
  variável exigida por `env.ts` (W0-T2/W1-T1) DEVE estar presente no `.env.example`, e o
  `.env.example` NÃO DEVE declarar variáveis que `env.ts` não conhece. (Alinhamento
  bidirecional.)
- **FR-6** — Os valores de `DATABASE_URL` (usuário, senha, host, porta, nome do banco)
  DEVEM ser consistentes com o serviço Postgres definido em `server/docker-compose.yml`
  (W0-T3), de modo que copiar `.env.example` para `.env` permita conectar ao container
  sem edição.

---

## Requisitos não funcionais

- **NFR-1 — Segurança:** o arquivo NÃO DEVE conter segredos reais (chaves de acesso R2,
  senhas de produção). Apenas placeholders/valores de dev descartáveis. O `.env` real
  (não versionado) fica coberto pelo `.gitignore` de W0-T1.
- **NFR-2 — Documentação:** comentários curtos (`#`) SÃO permitidos para orientar o
  preenchimento das `CLOUDFLARE_*`, mas o arquivo DEVE permanecer parseável como
  `KEY=value` por dotenv/Vite-like loaders.
- **NFR-3 — Formato:** uma variável por linha, `CHAVE=valor`, sem espaços ao redor do `=`,
  codificação UTF-8, final de linha LF.
- **NFR-4 — Manutenibilidade:** este arquivo é o contrato humano das envs; qualquer nova
  env adicionada ao `env.ts` em ondas futuras DEVE ser refletida aqui na mesma mudança
  (governança — mesma disciplina do Art.6).

---

## Abordagem técnica

Arquivo único, conforme a estrutura da constitution (Art.2, árvore `server/`):

```
server/
└── .env.example        # PORT, DATABASE_URL, CLOUDFLARE_*   (este item)
```

Conteúdo proposto (placeholders de dev, sem segredos):

```dotenv
# Porta HTTP do servidor Fastify
PORT=3333

# Postgres (bate com o serviço do docker-compose.yml — W0-T3)
DATABASE_URL="postgresql://docker:docker@localhost:5432/brevly"

# Cloudflare R2 (S3-compatible) — CDN do CSV (D2). Preencher com credenciais próprias.
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

Notas de implementação:

- O formato das 5 chaves `CLOUDFLARE_*` com aspas vazias (`=""`) segue literalmente o
  bloco do PRD §5.1; `PORT` e `DATABASE_URL` recebem valores de exemplo por serem
  necessárias para rodar em dev.
- `DATABASE_URL`, `PORT` e o nome do banco (`brevly`) são candidatos a clarificação
  (ver seção de retorno) — os valores acima são a recomendação a fixar e devem ser
  mantidos idênticos ao `docker-compose.yml` (W0-T3) e ao default de `PORT` em
  `env.ts` (W0-T2), se houver.
- Nenhuma lógica, dependência ou código é adicionado nesta task — é puro template.

---

## Critérios de aceite

- [ ] O arquivo `server/.env.example` existe e está versionado no git.
- [ ] O arquivo contém as 7 chaves exatas do PRD §5.1: `PORT`, `DATABASE_URL`,
      `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`,
      `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_BUCKET`, `CLOUDFLARE_PUBLIC_URL`.
- [ ] Não há nenhuma chave além dessas 7.
- [ ] Nenhum segredo real está presente (grep por valores plausíveis de credencial R2
      retorna vazio).
- [ ] `PORT` e `DATABASE_URL` possuem valores de exemplo de dev preenchidos; as 5
      `CLOUDFLARE_*` estão vazias ou com placeholder não-secreto.
- [ ] `DATABASE_URL` conecta ao Postgres do `docker-compose.yml` (mesmos user/senha/porta/db)
      — verificável assim que W0-T3 existir.
- [ ] Cada chave do `.env.example` é conhecida pelo schema Zod de `env.ts`, e cada env
      exigida por `env.ts` está no `.env.example` (paridade) — verificável assim que
      W0-T2/W1-T1 existirem.
- [ ] O arquivo é parseável como `KEY=value` (uma variável por linha, sem erro de dotenv).

---

## Fora de escopo

- Implementar ou validar `env.ts` (Zod fail-fast) — W0-T2 (stub) e W1-T1 (definitivo).
- Definir o serviço Postgres do `docker-compose.yml` — W0-T3.
- Criar/consumir o cliente R2 (`lib/storage.ts`) que lê as `CLOUDFLARE_*` — W3-T1/T5.
- `.env.example` do **frontend** (`web/.env.example`, `VITE_*`) — W0-T11.
- `.gitignore` que exclui o `.env` real — W0-T1.
- Qualquer regra de negócio, rota, schema ou migration.

## Dependências

- **Depende de:** W0-T1 (estrutura raiz do monorepo — a pasta `server/` deve existir).
- **Alinha-se a (soft, sem bloqueio de escrita):**
  - **W0-T2** — `env.ts` (as chaves aqui devem casar com o schema Zod).
  - **W0-T3** — `docker-compose.yml` (o `DATABASE_URL` deve casar com o Postgres).
- **Habilita:** W1-T1 (validação de env), W3-T1/T5 (cliente R2) e o critério de aceite
  PRD §9 ("`.env.example` presente em `server/`").
