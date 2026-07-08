# Tasks — W0-T11 · `.env.example` do Frontend

> Trilha: FRONTEND · Diretório: `web/` · Onda 0
> Status: implementado.

## Tarefas

- [x] **T11.1** — Criar `web/.env.example` versionado com **exatamente** duas chaves, nesta ordem: `VITE_FRONTEND_URL` e `VITE_BACKEND_URL`, valores vazios (template).
- [x] **T11.2** — Comentários curtos (`#`) opcionais por chave, sem alterar os nomes.

## Critérios de aceite

- [x] `grep -E '^VITE_' web/.env.example` retorna exatamente as 2 linhas.
- [x] `VITE_FRONTEND_URL` antes de `VITE_BACKEND_URL`; ambas com prefixo `VITE_`.
- [x] Sem valores reais/segredos; sem chaves extras (nada de `PORT`/`CLOUDFLARE_*`).
- [x] `VITE_BACKEND_URL` bate 1:1 com o consumo em `src/lib/http.ts` (`import.meta.env.VITE_BACKEND_URL`).
- [ ] Arquivo rastreado pelo git — o `git add`/commit é feito depois pelo orquestrador.

## Notas

- `.env` real permanece ignorado pelo `.gitignore` (W0-T1).
