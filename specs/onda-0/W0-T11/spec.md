# W0-T11 — `.env.example` do Frontend

> Onda 0 — Fundação & DevOps · Trilha `web/`
> Requisitos: **D3** · Referências: PRD §5.2, constitution Art.1 (estrutura `web/`, regra R2/R5), WAVES W0-T11.

---

## Contexto / Por quê

O frontend é um SPA em React + Vite. O Vite expõe ao código do cliente apenas as
variáveis de ambiente com o prefixo `VITE_` através de `import.meta.env`. Duas
configurações precisam ser injetadas em tempo de build/dev:

- **`VITE_BACKEND_URL`** — URL base da API Fastify. É a origem de toda I/O de rede
  do front. A constitution (Art.1 R2) exige que toda comunicação HTTP passe pela
  camada de client em `lib/http.ts`; esse client lê `import.meta.env.VITE_BACKEND_URL`
  para montar sua `baseURL` (ver W4-T6).
- **`VITE_FRONTEND_URL`** — URL base pública do próprio front. É usada para compor a
  URL curta exibida ao usuário (ex.: prefixo `brev.ly/` que na verdade aponta para o
  domínio hospedado) e para o fluxo de redirect (`/:shortUrl`). Declarada no PRD §5.2
  como uma das duas envs obrigatórias do `web/`.

Esta task é **puramente de fundação**: cria o arquivo-documento (`.env.example`) que
enumera as chaves esperadas, sem carregar regra de negócio. É o análogo frontend da
W0-T6 (`.env.example` do backend). O arquivo real `.env` **não** é versionado (fica no
`.gitignore`, W0-T1); apenas o `.env.example` entra no repositório como contrato.

O PRD §5.2 fixa **exatamente** o conteúdo:

```
VITE_FRONTEND_URL=
VITE_BACKEND_URL=
```

---

## Requisitos funcionais (FR)

- **FR-1** — Existe o arquivo `web/.env.example` versionado (rastreado pelo git).
- **FR-2** — O arquivo contém **exatamente** duas chaves, nesta ordem: `VITE_FRONTEND_URL`
  e depois `VITE_BACKEND_URL`, uma por linha, conforme PRD §5.2. Nenhuma chave a mais,
  nenhuma a menos.
- **FR-3** — Ambas as chaves usam o prefixo `VITE_` (exigência do Vite para exposição via
  `import.meta.env`).
- **FR-4** — Os valores no `.env.example` são placeholders/vazios (o arquivo é template,
  não contém URLs reais nem segredos). Formato `CHAVE=<placeholder ou vazio>`.
- **FR-5** — O client HTTP do front (`web/src/lib/http.ts`, criado em W4-T6) referencia a
  variável **como** `import.meta.env.VITE_BACKEND_URL` para derivar a `baseURL`. Esta task
  fixa o **contrato do nome** da variável que o `http.ts` consumirá; a implementação do
  `http.ts` pertence a W4-T6.

---

## Requisitos não funcionais

- **RNF-1 (Segredos)** — O `.env.example` NÃO contém credenciais, tokens ou URLs de
  produção. Diferente do backend, nenhuma das duas envs do front é sensível (são apenas
  URLs públicas), mas o template permanece vazio por convenção.
- **RNF-2 (Versionamento)** — `.env.example` é versionado; `.env`, `.env.local` e
  variações são ignorados pelo `.gitignore` (responsabilidade de W0-T1). Esta task
  assume que o padrão de ignore de `.env*` já cobre o real e preserva o `.example`.
- **RNF-3 (Documentação mínima)** — Cada chave PODE ter um comentário curto (`#`)
  explicando seu papel, desde que o comentário não altere as chaves em si. Comentários
  são opcionais e não contam como "chave extra" para FR-2.
- **RNF-4 (Consistência)** — Os nomes batem 1:1 com PRD §5.2 e com o consumo em
  `import.meta.env.*`. Qualquer divergência de nome quebra o boot do front.

---

## Abordagem técnica

Arquivo único, conforme estrutura da constitution (Art.1 — `web/.env.example`):

```
web/
└── .env.example        # ← esta task
```

Conteúdo (fiel ao PRD §5.2, com comentários opcionais permitidos por RNF-3):

```dotenv
# URL pública do frontend (SPA). Usada para compor a URL curta exibida (brev.ly/<slug>).
VITE_FRONTEND_URL=

# URL base da API (Fastify). Consumida por src/lib/http.ts via import.meta.env.VITE_BACKEND_URL.
VITE_BACKEND_URL=
```

**Contrato de consumo (definido aqui, implementado em W4-T6):**

- `web/src/lib/http.ts` lê `import.meta.env.VITE_BACKEND_URL` e a usa como `baseURL` do
  client HTTP. Nenhum componente faz `fetch` solto (Art.1 R2).
- `VITE_FRONTEND_URL` é consumida pela camada de apresentação/features de links quando
  precisa montar a URL curta completa para exibição/cópia (Onda 5), também via
  `import.meta.env.VITE_FRONTEND_URL`.

**Fora de responsabilidade desta task (apenas fixação de nome):** a leitura em si, a
tipagem de `ImportMetaEnv` (`vite-env.d.ts`), e a validação de presença ficam nas ondas
que criam esses arquivos (W4-T1/W4-T6). Esta task garante que o **template** exista e
esteja correto para essas ondas consumirem.

---

## Critérios de aceite (checklist)

- [ ] O arquivo `web/.env.example` existe.
- [ ] O arquivo contém exatamente as chaves `VITE_FRONTEND_URL` e `VITE_BACKEND_URL`
      (verificável: `grep -E '^VITE_' web/.env.example` retorna exatamente essas 2 linhas).
- [ ] `VITE_FRONTEND_URL` aparece antes de `VITE_BACKEND_URL`.
- [ ] Ambas as chaves têm o prefixo `VITE_`.
- [ ] Nenhuma chave possui valor real/segredo (valores vazios ou placeholder).
- [ ] Não há chaves extras além das duas (ex.: sem `PORT`, sem `CLOUDFLARE_*`, que são do
      backend/W0-T6).
- [ ] O arquivo é rastreado pelo git (`git ls-files web/.env.example` retorna o caminho).
- [ ] O nome `VITE_BACKEND_URL` corresponde exatamente ao que `src/lib/http.ts`
      (W4-T6) espera em `import.meta.env.VITE_BACKEND_URL`.

---

## Fora de escopo

- Criação/implementação de `web/src/lib/http.ts` (pertence a **W4-T6**).
- Criação do arquivo `.env` real (não versionado; feito localmente pelo dev).
- Configuração do `.gitignore` para ignorar `.env*` (pertence a **W0-T1**).
- Tipagem de `import.meta.env` via `vite-env.d.ts` (pertence a **W4-T1**).
- Scaffold do projeto Vite/React, `package.json`, `vite.config.ts` (pertence a
  **W0-T8 / W4-T1**).
- Validação em runtime da presença das envs no front (não exigida; o back valida as suas
  via `env.ts`, o front apenas consome).
- `.env.example` do backend, com as 7 chaves `PORT`/`DATABASE_URL`/`CLOUDFLARE_*`
  (pertence a **W0-T6**).

---

## Dependências

- **W0-T1** — Estrutura raiz do monorepo com a pasta `web/` e o `.gitignore`
  (para que `.env.example` seja versionado e o `.env` real ignorado).
- **Consumidores (downstream):**
  - **W4-T6** — `lib/http.ts` lê `import.meta.env.VITE_BACKEND_URL`.
  - **W4-T1** — scaffold do front referencia/tipa as envs.
  - **Onda 5** — features de links usam `VITE_FRONTEND_URL` para compor a URL curta.
