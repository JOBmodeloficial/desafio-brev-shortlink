# W0-T9 — Tailwind + tokens Dracula (fonte da verdade dos hexes)

> Onda 0 — Fundação & DevOps · Trilha web · Requisitos: **D3**, **O4**
> Depende de: **W0-T8** (scaffold Vite+React+TS com `src/` e `index.html`)

---

## Contexto / Por quê

O frontend (`web/`) é um SPA **React + Vite + TypeScript** cuja identidade visual é o tema
**Dracula** (dark). A [constitution](../../../constitution.md) (Artigo 1, Regra 5) exige que
"paleta e tipografia derivem dos tokens do design system (tema Dracula); **sem hex mágico
espalhado**". O [mockup SECOES.md](../../../mockups/SECOES.md) declara explicitamente que os
design tokens são "a **fonte da verdade** para o `tailwind.config` na implementação".

Esta task é o **ponto de verdade dos hexes** de todo o frontend: configura o TailwindCSS,
o pipeline PostCSS e o `globals.css` com a paleta Dracula, a tipografia Open Sans, a escala
tipográfica e o raio de 8px. Nenhuma regra de negócio, componente ou página é implementado
aqui — apenas a fundação de estilo que W4/W5 consomem.

Esta é a **Onda 0** (fundação): a saída precisa apenas **compilar/buildar** e aplicar o
fundo dark. A materialização final e a verificação 1:1 dos tokens contra o SECOES ocorrem
em **W4-T2/T3** (que evoluem estes mesmos arquivos). Portanto, o entregável de W0-T9 é o
esqueleto correto e compilável dos três artefatos de estilo.

---

## Requisitos funcionais (FR)

### Tokens de cor (Dracula) — fonte da verdade

- **FR-1** — O `tailwind.config.ts` **MUST** estender `theme.extend.colors` com **exatamente**
  os 13 tokens Dracula do SECOES.md, com os hexes literais abaixo (fonte da verdade; nenhum
  outro lugar do frontend define esses hexes):

  | Token Tailwind | Hex | Papel |
  |----------------|-----|-------|
  | `bg` | `#21222C` | Fundo da página |
  | `surface` | `#282A36` | Cards |
  | `surface-2` | `#343746` | Inputs, botão secundário, botão de ícone |
  | `border` | `#44475A` | Bordas e divisórias |
  | `fg` | `#F8F8F2` | Texto principal / títulos |
  | `subtle` | `#C3C8E0` | Texto de apoio |
  | `muted` | `#6272A4` | Auxiliar / placeholder |
  | `purple` | `#BD93F9` | Marca, link curto, botão primário, foco |
  | `purple-soft` | `#CAA9FA` | Hover do botão primário |
  | `cyan` | `#8BE9FD` | Links inline |
  | `red` | `#FF5555` | Erros de validação (danger) |
  | `green` | `#50FA7B` | Sucesso (reservado) |
  | `yellow` | `#F1FA8C` | Avisos (reservado) |

- **FR-2** — Os hexes **MUST** ser bit-a-bit idênticos aos do SECOES.md. Não é permitido
  arredondar, converter para `rgb()`/`hsl()`, nem renomear tokens.

### Tipografia

- **FR-3** — A família de fonte padrão **MUST** ser **Open Sans** (com fallback sans-serif do
  sistema), registrada em `theme.extend.fontFamily.sans` e aplicada ao `body` no `globals.css`.
- **FR-4** — A escala tipográfica **MUST** ser estendida em `theme.extend.fontSize` com os 5
  tamanhos do SECOES:

  | Chave | Tamanho | Uso |
  |-------|---------|-----|
  | `xs` | `10px` | labels uppercase |
  | `sm` | `12px` | textos pequenos |
  | `md` | `14px` | corpo / inputs |
  | `lg` | `18px` | títulos de card |
  | `xl` | `24px` | títulos de página |

- **FR-5** — Os pesos de Open Sans a disponibilizar **MUST** ser 400, 600 e 700.

### Raio e globals

- **FR-6** — O raio padrão **MUST** ser `8px`, exposto em `theme.extend.borderRadius` (chave
  `DEFAULT` = `8px`).
- **FR-7** — O `styles/globals.css` **MUST** incluir as três diretivas Tailwind
  (`@tailwind base; @tailwind components; @tailwind utilities;`).
- **FR-8** — O `globals.css` **MUST** aplicar o **fundo dark**: `body` com background `bg`
  (`#21222C`) e cor de texto `fg` (`#F8F8F2`).

### Pipeline de build

- **FR-9** — O `content` do `tailwind.config.ts` **MUST** cobrir `./index.html` e
  `./src/**/*.{ts,tsx}` para que o purge/JIT detecte as classes usadas.
- **FR-10** — O pipeline PostCSS **MUST** estar configurado (`postcss.config.js`) com os
  plugins `tailwindcss` e `autoprefixer`.
- **FR-11** — O `globals.css` **MUST** ser importado uma única vez no bootstrap da aplicação
  (`src/main.tsx`) para que os estilos sejam aplicados; a build **MUST** resolver esse import.

---

## Requisitos não funcionais

- **NFR-1 (Onda 0 — compila/builda)** — `npm run build` (`tsc` + `vite build`) e
  `npm run dev` **MUST** completar sem erro com estes arquivos presentes. As classes Tailwind
  de cor/tipografia/raio **MUST** ser geradas (ex.: `bg-bg`, `text-fg`, `text-purple`,
  `rounded`, `text-xl` disponíveis).
- **NFR-2 (sem regra de negócio)** — Nenhum componente, página, hook ou chamada de API é
  criado nesta task. Somente config de estilo.
- **NFR-3 (única fonte de hex)** — Após esta task, nenhum outro arquivo do frontend
  **SHOULD** conter hexes de cor Dracula literais; consumidores usam os tokens/classes.
- **NFR-4 (Tailwind v3)** — A configuração adota TailwindCSS **v3** (config em `tailwind.config.ts`
  com `export default satisfies Config`, `@tailwind` directives e `postcss.config.js`), coerente
  com o formato `tailwind.config.ts` citado na constitution.
- **NFR-5 (tipagem)** — O `tailwind.config.ts` **MUST** ser tipado com `import type { Config }`
  do pacote `tailwindcss` e satisfazer esse tipo.

---

## Abordagem técnica (arquivos concretos)

Estrutura conforme Artigo 1 da constitution (`web/`). Arquivos desta task:

```
web/
├── index.html                 # (de W0-T8) — carrega Open Sans (link Google Fonts) [ajuste]
├── postcss.config.js          # [novo] plugins tailwindcss + autoprefixer
├── tailwind.config.ts         # [novo] content + tokens Dracula + fontFamily/fontSize/radius
└── src/
    ├── main.tsx               # (de W0-T8) — import "./styles/globals.css" [ajuste]
    └── styles/
        └── globals.css        # [novo] @tailwind directives + body dark (bg/fg) + font
```

### `web/tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#21222C",
        surface: "#282A36",
        "surface-2": "#343746",
        border: "#44475A",
        fg: "#F8F8F2",
        subtle: "#C3C8E0",
        muted: "#6272A4",
        purple: "#BD93F9",
        "purple-soft": "#CAA9FA",
        cyan: "#8BE9FD",
        red: "#FF5555",
        green: "#50FA7B",
        yellow: "#F1FA8C",
      },
      fontFamily: {
        sans: ["'Open Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        md: "14px",
        lg: "18px",
        xl: "24px",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### `web/postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### `web/src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-fg font-sans;
    -webkit-font-smoothing: antialiased;
  }
}
```

### Ajuste em `web/src/main.tsx` (arquivo de W0-T8)

Adicionar (uma vez): `import "./styles/globals.css";`

### Ajuste em `web/index.html` (arquivo de W0-T8)

Adicionar no `<head>` o carregamento do **Open Sans** (pesos 400/600/700) via `<link>` do
Google Fonts (preconnect + stylesheet). Alternativa: self-host via `@fontsource/open-sans`
importado no `globals.css` — ver clarificação de método de fonte.

### Dependências de pacote (declaradas/consumidas)

`tailwindcss@^3`, `postcss`, `autoprefixer` como devDependencies do `web/package.json`.
A instalação canônica das deps do front é de W0-T8/W4-T1; esta task apenas **assume** que
`tailwindcss/postcss/autoprefixer` estão presentes (adiciona-os se ausentes).

---

## Critérios de aceite (checklist verificável)

- [ ] Existe `web/tailwind.config.ts` tipado com `satisfies Config`.
- [ ] `theme.extend.colors` contém **exatamente** os 13 tokens da FR-1 com os hexes literais,
      idênticos ao SECOES.md (verificação 1:1 dos 13 pares chave→hex).
- [ ] `theme.extend.fontFamily.sans` inicia com `Open Sans`.
- [ ] `theme.extend.fontSize` contém `xs=10px, sm=12px, md=14px, lg=18px, xl=24px`.
- [ ] `theme.extend.borderRadius.DEFAULT === "8px"`.
- [ ] `content` cobre `./index.html` e `./src/**/*.{ts,tsx}`.
- [ ] Existe `web/postcss.config.js` com plugins `tailwindcss` e `autoprefixer`.
- [ ] Existe `web/src/styles/globals.css` com as 3 diretivas `@tailwind` e regra de `body`
      aplicando fundo `bg` (#21222C) e texto `fg` (#F8F8F2).
- [ ] `globals.css` é importado em `src/main.tsx`.
- [ ] Open Sans (400/600/700) é carregada (via `index.html` ou self-host).
- [ ] `npm run build` no `web/` conclui sem erro.
- [ ] `npm run dev` no `web/` conclui sem erro e a página renderiza com fundo dark.
- [ ] As classes `bg-bg`, `text-fg`, `text-purple`, `rounded` e `text-xl` são geradas no CSS
      final quando usadas em `src/`.
- [ ] Nenhum hex Dracula literal aparece fora do `tailwind.config.ts`/`globals.css`.

---

## Fora de escopo

- Componentes de UI (`Button`, `Input`, `IconButton`, `Logo`) — **W4-T10…T12**.
- Assets da logo e favicon — **W4-T9**.
- Router, páginas e stubs — **W0-T8 / W4-T4/T5**.
- Verificação final 1:1 dos tokens e materialização visual completa — **W4-T2/T3** (evoluem
  estes arquivos).
- HTTP client, React Query, schemas Zod — outras tasks.
- Sombra de card, tokens de espaçamento adicional, dark/light toggle (tema é fixo dark).
- Testes automatizados de estilo (setup de teste é W0-T10).

---

## Dependências

- **W0-T8** (bloqueante) — scaffold Vite+React+TS que provê `web/package.json`, `index.html`,
  `src/main.tsx` e a árvore `src/`. Esta task adiciona/edita `tailwind.config.ts`,
  `postcss.config.js`, `src/styles/globals.css` e ajusta `main.tsx`/`index.html`.
- **Insumo de dados:** `mockups/SECOES.md` (fonte dos hexes, escala e raio).
- **Consumidores:** **W4-T2/T3** (evoluem estes arquivos) e todos os componentes/páginas de
  **W4/W5** (consomem os tokens/classes).
- **Requisitos:** **D3** (stack TailwindCSS no front), **O4** (UX fiel ao layout do Figma).
