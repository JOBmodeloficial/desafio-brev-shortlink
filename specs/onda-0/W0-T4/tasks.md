# Tasks — W0-T4 · Dockerfile multi-stage do backend

Arquivos: `server/Dockerfile`, `server/.dockerignore`.

## Tarefas

- [x] **T4.1** — Multi-stage com estágios nomeados `build` e `runtime`. — FR-1
- [x] **T4.2** — Ambos os estágios em `node:22-alpine` (C1: major fixada pelo `.nvmrc` "22"). — FR-2
- [x] **T4.3** — Build: copia manifests → `npm ci` → copia fonte → `npm run build` (tsc → dist). — FR-3
- [x] **T4.4** — Runtime: base limpa, `npm ci --omit=dev` + cache clean, copia só `dist/`. — FR-4
- [x] **T4.5** — `USER node` (não-root) antes do `CMD`; `COPY --chown=node:node` do dist. — FR-5
- [x] **T4.6** — `CMD ["node", "dist/server.js"]` (forma exec). — FR-6
- [x] **T4.7** — `WORKDIR /app` + `EXPOSE 3333` (C2). — FR-7
- [x] **T4.8** — `.dockerignore` exclui node_modules, dist, .git, .env/.env.* (mantém .env.example),
      coverage, logs, IDE, Dockerfile/.dockerignore/compose. — FR-8

## Notas

- Ordem otimizada para cache (manifests antes do fonte). `NODE_ENV=production` no runtime.
- Nenhum segredo embutido; envs injetadas em runtime.
