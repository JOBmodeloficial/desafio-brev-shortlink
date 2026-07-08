# W0-T8 — Scaffold do Frontend (Vite + React + TypeScript)

> Onda 0 — Fundação & DevOps · Requisitos: **D3, D4, FE-01**
> Fonte da verdade: [PRD](../../../PRD.md) · [Constitution](../../../constitution.md) · [WAVES](../../../WAVES.md)

---

## Contexto / Por quê

O Brev.ly é um monorepo com duas aplicações (`web/` + `server/`) usando **npm sem
workspaces** (D4). Esta task cria o **scaffold do frontend**: uma SPA em
**Vite + React + TypeScript** cuja árvore de diretórios já reflete 1:1 a estrutura
definida no **Artigo 1 da constitution** (organização por tipo + feature), com as
3 rotas do PRD (`/`, `/:shortUrl`, `*`) renderizando **placeholders**.

Esta é a **Onda 0**: o objetivo é entregar um esqueleto **compilável e executável**
(`dev`/`build`/`preview` limpos), com as dependências de runtime instaladas
(react, react-dom, react-router-dom, @tanstack/react-query, react-hook-form, zod)
e os arquivos-chave criados como **stubs**. **Não há regra de negócio**: sem chamadas
de API, sem validação Zod real, sem componentes de domínio implementados.

Esta task **estabelece os stubs** que a **Onda 4 (Frontend: Fundação & Design System)**
irá evoluir. Para evitar retrabalho e conflito de propriedade:

- **W0-T8 (esta task)** é dona do *scaffold estrutural*: existência dos arquivos,
  árvore de pastas, rotas montadas com placeholder, deps instaladas, `tsc`/`build` verdes.
- **W0-T9 / W0-T10 / W0-T11** (mesma onda) são donas de: Tailwind + tokens Dracula
  (`tailwind.config.ts`, `styles/globals.css`), toolchain de teste (`vitest`, MSW, jsdom)
  e `.env.example`. Esta task **não** implementa esses itens — apenas garante os
  pontos de extensão (ex.: `main.tsx` importando `styles/globals.css`, se aplicável a T9).
- **W4** é dona do *conteúdo* dos stubs (design system, http client real, query client
  configurado, schemas Zod com regras, componentes UI, páginas completas).

> **Nota:** a linha "Arquivos-chave" do WAVES para W0-T8 cita `web/package.json` e
> `src/app/router.tsx`; W4-T1 volta a citar `web/package.json`/`vite.config.ts`. A
> convenção adotada: **W0-T8 cria o scaffold inicial; W4-T1 evolui** deps de teste e
> configurações finas. Esta task não instala as libs exclusivas de teste (Vitest/RTL/MSW),
> que pertencem a W0-T10/W4.

---

## Requisitos funcionais (FR)

- **FR-1** — O diretório `web/` MUST conter um projeto **Vite + React + TypeScript**
  gerado a partir do template `react-ts` (equivalente a `npm create vite@latest web -- --template react-ts`).
- **FR-2** — A árvore `web/src/` MUST corresponder ao **Artigo 1 da constitution**:
  - `app/router.tsx` — definição das rotas (`/`, `/:shortUrl`, `*`).
  - `app/providers.tsx` — `QueryClientProvider` (e ponto de extensão para outros providers).
  - `pages/home/`, `pages/redirect/`, `pages/not-found/` — uma pasta por página, cada uma com um componente **stub** que renderiza um placeholder identificável.
  - `features/links/api/`, `features/links/hooks/`, `features/links/components/` — pastas criadas (podem conter apenas um `.gitkeep` ou stub mínimo).
  - `features/links/schemas.ts` — arquivo **stub** (sem regra de validação real; W4 preenche).
  - `components/` — pasta para UI reutilizável agnóstica de domínio (stub/vazia).
  - `lib/` — com `http.ts` e `query-client.ts` como **stubs** exportando um placeholder.
  - `styles/` — pasta criada (conteúdo do tema é de W0-T9).
  - `main.tsx` — bootstrap da aplicação.
- **FR-3** — O `main.tsx` MUST montar a aplicação React envolvendo o router
  (`app/router.tsx`) com os providers (`app/providers.tsx`), usando `React.StrictMode`.
- **FR-4** — O `app/router.tsx` MUST declarar exatamente **3 rotas** usando
  `react-router-dom` (BrowserRouter):
  - `/` → `pages/home` (placeholder).
  - `/:shortUrl` → `pages/redirect` (placeholder). O parâmetro dinâmico MUST se chamar
    exatamente **`shortUrl`** (alinhado a D7/W4-T4).
  - `*` (catch-all) → `pages/not-found` (placeholder).
- **FR-5** — Cada uma das 3 páginas MUST renderizar um placeholder textual distinto
  e identificável (ex.: `Home`, `Redirect`, `404 - Not Found`), sem lógica de negócio.
- **FR-6** — As dependências de **runtime** MUST estar instaladas e declaradas em
  `web/package.json` (`dependencies`): `react`, `react-dom`, `react-router-dom`,
  `@tanstack/react-query`, `react-hook-form`, `zod`.
- **FR-7** — O `app/providers.tsx` MUST instanciar um `QueryClient` (importado de
  `lib/query-client.ts` stub ou criado inline como stub) e prover via
  `QueryClientProvider`, deixando o app pronto para React Query (D3), **sem** queries reais.
- **FR-8** — `web/package.json` MUST expor os scripts padrão do Vite: `dev`, `build`,
  `preview` (e o `lint` do template, quando presente).
- **FR-9** — O `lib/http.ts` MUST existir como **stub** (ponto de extensão para o cliente
  HTTP de W4-T6), sem implementar chamadas reais nesta task.
- **FR-10** — O alias `@` → `web/src` MAY ser configurado em `vite.config.ts` +
  `tsconfig` para uso futuro (recomendado; W4-T1 depende dele). Se configurado nesta
  task, MUST resolver corretamente em `dev`/`build`.

---

## Requisitos não funcionais (NFR)

- **NFR-1** — **Compilável**: `npm run build` (que roda `tsc` + `vite build`) MUST
  concluir sem erros.
- **NFR-2** — **Executável**: `npm run dev` MUST subir o servidor de desenvolvimento
  e servir as 3 rotas (placeholders) sem erro em console.
- **NFR-3** — **TypeScript estrito**: manter `strict: true` do template `react-ts`.
- **NFR-4** — **SPA sem framework** (Art.1 R1): apenas React + Vite + React Router;
  nada de Next/Remix.
- **NFR-5** — **Sem regra de negócio**: nenhuma chamada `fetch`/axios, nenhuma validação
  Zod ativa, nenhum componente de domínio funcional — apenas stubs e placeholders.
- **NFR-6** — **Isolamento de propriedade**: não criar/definir tokens Dracula
  (`tailwind.config.ts`, `globals.css` de tema), config de teste (Vitest/MSW/jsdom) nem
  `.env.example` — pertencem a W0-T9/W0-T10/W0-T11.
- **NFR-7** — **Gerenciador**: usar **npm** (D4); não introduzir workspaces, pnpm ou yarn.
- **NFR-8** — Node alinhado ao `.nvmrc` da raiz (W0-T1) — usar Node LTS (linha
  compatível com Vite atual; ex.: Node 20 LTS).

---

## Abordagem técnica (arquivos concretos)

Gerar via template e ajustar a árvore para bater com o Artigo 1:

```
web/
├── public/
├── src/
│   ├── app/
│   │   ├── router.tsx          # BrowserRouter + 3 rotas (/, /:shortUrl, *) → placeholders
│   │   └── providers.tsx       # QueryClientProvider (+ ponto p/ outros providers)
│   ├── pages/
│   │   ├── home/
│   │   │   └── HomePage.tsx     # stub "Home"
│   │   ├── redirect/
│   │   │   └── RedirectPage.tsx # stub "Redirect" (usa useParams<'shortUrl'> só p/ exibir)
│   │   └── not-found/
│   │       └── NotFoundPage.tsx # stub "404 - Not Found"
│   ├── features/
│   │   └── links/
│   │       ├── api/.gitkeep
│   │       ├── hooks/.gitkeep
│   │       ├── components/.gitkeep
│   │       └── schemas.ts       # stub (export placeholder; sem regra Zod)
│   ├── components/.gitkeep      # UI agnóstica (vazio nesta task)
│   ├── lib/
│   │   ├── http.ts             # stub (ponto de extensão W4-T6)
│   │   └── query-client.ts     # stub: exporta QueryClient (config default)
│   ├── styles/.gitkeep         # tema é de W0-T9
│   └── main.tsx                # StrictMode + Providers + Router
├── index.html
├── tsconfig.json               # (+ tsconfig.app.json / tsconfig.node.json do template)
├── vite.config.ts             # plugin react (+ alias @ opcional)
└── package.json               # scripts dev/build/preview + deps runtime
```

**Detalhes de implementação:**

1. **Geração:** `npm create vite@latest web -- --template react-ts` na raiz do monorepo,
   depois `npm install` dentro de `web/`. Remover boilerplate desnecessário do template
   (ex.: `App.css`, contadores de exemplo, `assets/react.svg`) conforme necessário para
   deixar o placeholder limpo.
2. **Instalar deps runtime:**
   `npm install react-router-dom @tanstack/react-query react-hook-form zod`
   (react/react-dom já vêm do template).
3. **`main.tsx`:** `createRoot(...).render(<StrictMode><Providers><Router/></Providers></StrictMode>)`.
4. **`app/providers.tsx`:** cria/importa `QueryClient` e envolve `children` em
   `QueryClientProvider`.
5. **`app/router.tsx`:** `BrowserRouter` + `Routes`/`Route` com os 3 caminhos apontando
   para os stubs de página.
6. **Stubs de página:** componentes funcionais que retornam um `<div>`/`<h1>` com o
   placeholder. `RedirectPage` MAY usar `useParams()` apenas para exibir o `shortUrl`.
7. **`lib/query-client.ts`:** `export const queryClient = new QueryClient()` (config
   default; W4-T7 refina).
8. **`lib/http.ts`:** stub mínimo (ex.: `export const http = {}` ou função placeholder),
   documentado como ponto de extensão de W4-T6. **Sem** baseURL/env nesta task.
9. **`features/links/schemas.ts`:** stub (ex.: comentário + export vazio); as regras
   `http/https` (D13) e slug (D8) são de W4-T8.

---

## Critérios de aceite (checklist verificável)

- [ ] Existe `web/package.json` com scripts `dev`, `build`, `preview`.
- [ ] `dependencies` contém: `react`, `react-dom`, `react-router-dom`,
      `@tanstack/react-query`, `react-hook-form`, `zod`.
- [ ] `web/src/app/router.tsx` existe e define exatamente as 3 rotas
      (`/`, `/:shortUrl`, `*`), com o parâmetro nomeado **`shortUrl`**.
- [ ] `web/src/app/providers.tsx` existe e provê `QueryClientProvider`.
- [ ] Existem as pastas/arquivos: `pages/{home,redirect,not-found}`,
      `features/links/{api,hooks,components}`, `features/links/schemas.ts`,
      `components/`, `lib/http.ts`, `lib/query-client.ts`, `styles/`, `main.tsx`.
- [ ] Navegar para `/` renderiza o placeholder da Home.
- [ ] Navegar para `/qualquer-slug` renderiza o placeholder de Redirect.
- [ ] Navegar para uma rota inexistente (`/x/y/z`) renderiza o placeholder 404.
- [ ] `npm run build` conclui sem erros de TypeScript (`tsc`) nem de Vite.
- [ ] `npm run dev` sobe sem erros no console do navegador.
- [ ] Nenhum `fetch`/axios, validação Zod ativa ou componente de domínio funcional
      (apenas stubs).
- [ ] Nenhum token Dracula, config de teste ou `.env.example` introduzido por esta task.

---

## Fora de escopo

- **Tailwind + tokens Dracula** (`tailwind.config.ts`, `styles/globals.css`) → **W0-T9**.
- **Toolchain de teste** (Vitest, jsdom, MSW, RTL, smoke render) → **W0-T10**.
- **`.env.example`** (`VITE_FRONTEND_URL`, `VITE_BACKEND_URL`) → **W0-T11**.
- **ESLint/Prettier** dedicados do front (além do que o template traz) → **W0-T10**.
- Cliente HTTP real com baseURL/erro tipado → **W4-T6**.
- QueryClient configurado (retries/staleTime) + `providers.tsx` final → **W4-T7**.
- Schemas Zod com regras (URL http/https D13, slug D8) → **W4-T8 / W5-T1**.
- Componentes UI (`Button`, `Input`, `IconButton`, `Logo`) → **W4-T10…T13**.
- Páginas completas, api, hooks e estados de UX → **Onda 5**.
- Qualquer regra de negócio (BE/FE funcionais além da existência do scaffold).

---

## Dependências

- **Depende de:** **W0-T1** (estrutura raiz do monorepo, `.gitignore`, `.nvmrc`).
- **Habilita (é evoluída por):** **W0-T9** (Tailwind/tokens), **W0-T10** (testes),
  **W0-T11** (`.env.example`), e a **Onda 4** inteira (que preenche os stubs).
- **Decisões aplicadas:** **D3** (stack front: React Query, RHF, Zod, Tailwind — deps
  instaladas aqui, Tailwind em T9), **D4** (monorepo `web/` + `server/` com npm sem
  workspaces), **FE-01** (base para "criar link" — form/rota da Home existirá como stub).
- **Referências de estrutura:** Artigo 1 da constitution (árvore `web/`), PRD §3.2
  (as 3 páginas) e §4.2 (stack front).
