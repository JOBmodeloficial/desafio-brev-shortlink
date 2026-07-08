# Tasks — W0-T9 · Tailwind + tokens Dracula (fonte da verdade dos hexes)

> Trilha: FRONTEND · Diretório: `web/` · Onda 0
> Status: implementado (arquivos criados; build verificado pelo orquestrador).

## Tarefas

- [x] **T9.1** — `web/tailwind.config.ts` tipado com `satisfies Config`; `content` cobre `./index.html` e `./src/**/*.{ts,tsx}`.
- [x] **T9.2** — `theme.extend.colors` com **exatamente** os 13 tokens Dracula (hexes literais idênticos ao SECOES): `bg #21222C`, `surface #282A36`, `surface-2 #343746`, `border #44475A`, `fg #F8F8F2`, `subtle #C3C8E0`, `muted #6272A4`, `purple #BD93F9`, `purple-soft #CAA9FA`, `cyan #8BE9FD`, `red #FF5555`, `green #50FA7B`, `yellow #F1FA8C`.
- [x] **T9.3** — `theme.extend.fontFamily.sans` iniciando com `Open Sans`; `fontSize` `xs=10px, sm=12px, md=14px, lg=18px, xl=24px`; `borderRadius.DEFAULT = "8px"`.
- [x] **T9.4** — `web/postcss.config.js` com plugins `tailwindcss` e `autoprefixer`.
- [x] **T9.5** — `web/src/styles/globals.css`: import de `@fontsource/open-sans/{400,600,700}.css` (C6), 3 diretivas `@tailwind` e `body` com `@apply bg-bg text-fg font-sans`.
- [x] **T9.6** — `globals.css` importado uma única vez em `src/main.tsx` (feito em W0-T8).

## Critérios de aceite

- [x] 13 tokens 1:1 com o SECOES, sem renomear/converter.
- [x] Fonte Open Sans via `@fontsource` (self-host, C6) — não via Google Fonts `<link>`.
- [x] `body` aplica fundo `bg` (#21222C) e texto `fg` (#F8F8F2).
- [x] Nenhum hex Dracula literal fora de `tailwind.config.ts`.
- [ ] Classes `bg-bg`, `text-fg`, `text-purple`, `rounded`, `text-xl` geradas — **verificado pelo orquestrador** no build.

## Notas

- Tailwind v3 (C5): config em `.ts`, PostCSS + `@tailwind` directives.
- `tailwindcss/postcss/autoprefixer` declarados nos devDeps do `web/package.json` (W0-T8).
