# W0-T4 — Dockerfile multi-stage do backend

> Onda 0 — Fundação & DevOps · Trilha `server/`
> Requisitos: **O5** (empacotar o backend em imagem Docker seguindo boas práticas)
> Constitution: Artigo 2 (Estrutura do Backend), Regra 9 (Dockerfile multi-stage, imagem enxuta, usuário não-root)

---

## Contexto / Por quê

O objetivo **O5** do PRD exige empacotar o backend em uma imagem Docker "seguindo boas
práticas", e a stack obrigatória (PRD §4.1) lista **Dockerfile** como item de correção.
O critério de aceite §9 do PRD ("Dockerfile do backend gera imagem funcional") só é
atendido se existir um `server/Dockerfile` que produza uma imagem executável.

Esta task entrega **apenas o empacotamento**: um `server/Dockerfile` **multi-stage**
(estágio de build com toolchain completo → estágio de runtime enxuto) e o `.dockerignore`
que reduz o contexto de build. A constitution (Art. 2, R9) fixa as boas práticas mínimas:
base `node:lts-alpine`, imagem enxuta, **usuário não-root** e `CMD node dist/server.js`.

Esta é a **Onda 0**: **sem regra de negócio**. O Dockerfile deve compilar o scaffold
produzido em W0-T2 (Fastify + TS com `/health`) e nada além disso. O container **não**
sobe banco nem depende de R2; ele apenas roda o processo Node compilado. A orquestração
de Postgres para dev é responsabilidade de W0-T3 (`docker-compose.yml`), e a decisão sobre
incluir (ou não) o serviço `app` no compose pertence àquela task — aqui produzimos somente
a imagem que ela poderia consumir.

---

## Requisitos funcionais

- **FR-1** — O arquivo `server/Dockerfile` DEVE existir e ser um build **multi-stage**
  com no mínimo dois estágios nomeados: um estágio de **build** e um estágio de **runtime**.
- **FR-2** — Ambos os estágios DEVEM usar a imagem base **`node:lts-alpine`** (Node LTS
  sobre Alpine), atendendo o requisito de imagem enxuta da constitution (Art. 2 R9).
- **FR-3** — O estágio de **build** DEVE: copiar os manifests (`package.json` +
  lockfile), instalar **todas** as dependências (incluindo `devDependencies`, necessárias
  ao `tsc`/build), copiar o código-fonte e compilar o TypeScript para `dist/`
  (via o script de build do `server/package.json`, ex.: `npm run build` → `tsc`).
- **FR-4** — O estágio de **runtime** DEVE partir de uma base limpa `node:lts-alpine`,
  instalar **somente** as dependências de produção (`npm ci --omit=dev` ou equivalente) e
  copiar do estágio de build **apenas** o artefato compilado `dist/` (e o necessário para
  produção), NÃO copiando código-fonte TS, testes nem `devDependencies`.
- **FR-5** — A imagem de runtime DEVE executar o processo como **usuário não-root**. O
  Dockerfile DEVE usar um usuário não privilegiado (ex.: o usuário `node` já presente na
  imagem oficial, ou um usuário/grupo criado no Dockerfile) via instrução `USER` antes do
  `CMD`, e os arquivos de runtime DEVEM ter dono/permissão compatíveis com esse usuário.
- **FR-6** — O comando de inicialização DEVE ser exatamente **`CMD ["node", "dist/server.js"]`**
  (forma exec / JSON array), sem shell wrapper e sem `npm start`.
- **FR-7** — O Dockerfile DEVE declarar `WORKDIR` de aplicação (ex.: `/app`) e DEVE
  expor a porta da aplicação via `EXPOSE`, coerente com a `PORT` do backend
  (PRD §5.1). O valor exato da porta é uma decisão da fundação (ver Assumptions).
- **FR-8** — O arquivo `server/.dockerignore` DEVE existir e excluir do contexto de build,
  no mínimo: `node_modules`, `dist`, `.git`, `.env`, `.env.*` (exceto `.env.example`
  se desejado), arquivos de log, `coverage`, e artefatos de teste/IDE.

---

## Requisitos não funcionais

- **NFR-1 (Imagem enxuta)** — A imagem final DEVE conter apenas runtime Node + deps de
  produção + `dist/`; o toolchain de build (código TS, `devDependencies`) NÃO permanece na
  camada final graças ao multi-stage (Art. 2 R9).
- **NFR-2 (Segurança)** — O processo NÃO roda como root em produção (FR-5). Nenhum segredo
  (`.env`, chaves R2) é embutido na imagem; envs são injetadas em runtime (PRD §5.1).
- **NFR-3 (Cacheabilidade)** — A ordem das instruções DEVE otimizar o cache de camadas:
  copiar manifests + `npm ci` **antes** de copiar o código-fonte, para que mudanças de
  código não invalidem a camada de instalação de dependências.
- **NFR-4 (Determinismo)** — A instalação DEVE usar `npm ci` (lockfile) e não `npm install`,
  garantindo builds reproduzíveis coerentes com D4 (npm, sem workspaces).
- **NFR-5 (Consistência de versão)** — A versão de Node da base DEVE ser coerente com o
  `.nvmrc` da fundação (W0-T1). "lts-alpine" satisfaz Art. 2 R9; se W0-T1 fixar uma major
  específica, a tag DEVE refletir a mesma major (ver Assumptions).
- **NFR-6 (Onda 0 — sem negócio)** — O Dockerfile NÃO instala/roda migrations, NÃO depende
  de Postgres nem de R2 no build; apenas compila e executa o scaffold.

---

## Abordagem técnica

Arquivos concretos (conforme a estrutura da constitution, Artigo 2):

```
server/
├── Dockerfile          # multi-stage: build (node:lts-alpine) -> runtime enxuto não-root
└── .dockerignore       # exclui node_modules, dist, .git, .env*, coverage, logs…
```

### `server/Dockerfile` (esboço de referência)

```dockerfile
# ---- build stage ----
FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build            # tsc -> dist/

# ---- runtime stage ----
FROM node:lts-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# usuário não-root (usuário 'node' já existe na imagem oficial)
USER node
EXPOSE 3333
CMD ["node", "dist/server.js"]
```

Notas de implementação:
- O `npm run build` referenciado DEVE existir no `server/package.json` (W0-T2) e produzir
  `dist/server.js` como entrypoint compilado. Caso o entrypoint compilado tenha outro caminho,
  o `CMD` e o `COPY` DEVEM ser ajustados para casar com o output real do `tsconfig`
  (`outDir`). O contrato desta task é `CMD ["node", "dist/server.js"]` (FR-6).
- A cópia de arquivos para runtime DEVE respeitar o dono não-root; usar `COPY --chown=node:node`
  quando necessário para que o usuário `node` tenha acesso de leitura ao `dist/`.
- `EXPOSE` é documental; a porta efetiva vem da env `PORT` em runtime (PRD §5.1).

### `server/.dockerignore` (conteúdo mínimo)

```
node_modules
dist
coverage
.git
.gitignore
.env
.env.*
!.env.example
*.log
npm-debug.log*
.vscode
.idea
Dockerfile
.dockerignore
```

---

## Critérios de aceite

- [ ] Existe `server/Dockerfile` com pelo menos dois estágios nomeados (build + runtime).
- [ ] Ambos os estágios usam base `node:lts-alpine`.
- [ ] Estágio build instala deps com `npm ci` e compila TS para `dist/` via script de build.
- [ ] Estágio runtime instala apenas produção (`npm ci --omit=dev`) e copia só `dist/`
      (mais manifests) do estágio build — sem código-fonte TS nem `devDependencies`.
- [ ] Instrução `USER` define usuário não-root antes do `CMD`; arquivos de `dist/` legíveis
      por esse usuário.
- [ ] `CMD` é exatamente `["node", "dist/server.js"]` (forma exec).
- [ ] `WORKDIR` e `EXPOSE` declarados; porta coerente com a `PORT` da fundação.
- [ ] Existe `server/.dockerignore` excluindo `node_modules`, `dist`, `.git`, `.env`/`.env.*`,
      `coverage`, logs e artefatos de IDE/teste.
- [ ] `docker build -t brevly-server ./server` conclui sem erro (assumindo scaffold W0-T2).
- [ ] `docker run --rm -p 3333:3333 -e PORT=3333 -e DATABASE_URL=... brevly-server` sobe o
      processo e `GET /health` responde `200` (smoke da fundação).
- [ ] `docker run --rm brevly-server whoami` (ou inspeção) confirma execução como não-root.
- [ ] A ordem das instruções permite cache de dependências (manifests copiados antes do fonte).

---

## Fora de escopo

- `docker-compose.yml` / orquestração de Postgres para dev (W0-T3) e a decisão de incluir
  ou não o serviço `app` no compose.
- `docker-compose.e2e.yml` e modo de storage stub/real do E2E (W3-T1 / W6-T2).
- `.env.example` do backend e validação de envs (W0-T6 / W1-T1).
- Scaffold da aplicação Fastify, `server.ts`, `/health`, `env.ts`, scripts de build/test
  (W0-T2) — esta task **consome** esse scaffold, não o cria.
- Qualquer regra de negócio, tabela `links`, migrations, CSV/R2 (Ondas 1–3).
- Pipeline CI que builda/publica a imagem (W6-T14, opcional).
- Multi-arch / push para registry / healthcheck `HEALTHCHECK` no Dockerfile (não exigidos
  pelo PRD; MAY em melhoria futura).

## Dependências

- **W0-T1** — estrutura raiz do monorepo, `.gitignore`, `.nvmrc` (define a major de Node de
  referência para a tag da base).
- **W0-T2** — scaffold backend Fastify+TS: fornece `server/package.json` (com script de
  `build`), `package-lock.json`, `tsconfig` (com `outDir: dist`) e `src/server.ts` que
  compila para `dist/server.js`. **Sem ele o `docker build` e o smoke `/health` não passam.**
- Docker instalado no ambiente de verificação (para os critérios de `docker build`/`run`).
