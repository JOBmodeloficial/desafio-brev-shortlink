# Brev.ly — Mockups & Detalhamento das Seções

Mockups estáticos (HTML/CSS) das páginas do frontend, baseados no layout do Figma e nas
[decisões do PRD](../PRD.md). Servem de referência visual e de contrato de UI para a
implementação em React + Vite + Tailwind.

## Como visualizar

Abra os arquivos diretamente no navegador:

| Página | Rota | Arquivo |
|--------|------|---------|
| Home / Listagem | `/` | [`home.html`](./home.html) |
| Redirecionamento | `/:url-encurtada` | [`redirect.html`](./redirect.html) |
| Não encontrado (404) | `*` | [`not-found.html`](./not-found.html) |

> As faixas amarelas ("mock-note") e os blocos comentados no HTML são apenas didáticos —
> não fazem parte da UI final. As variações de estado (empty, loading, erro) estão comentadas
> dentro do próprio HTML para referência.

---

## Design tokens (`styles.css`)

Tema **dark** inspirado no **Dracula Theme (VS Code)**. São a fonte da verdade para o `tailwind.config` na implementação.

**Cores (Dracula)**

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#21222C` | Fundo da página |
| `--surface` | `#282A36` | Cards |
| `--surface-2` | `#343746` | Inputs, botão secundário, botão de ícone |
| `--border` | `#44475A` | Bordas e divisórias (current line) |
| `--fg` | `#F8F8F2` | Texto principal / títulos |
| `--subtle` | `#C3C8E0` | Texto de apoio |
| `--muted` | `#6272A4` | Auxiliar / placeholder (comment) |
| `--purple` | `#BD93F9` | Marca, link curto, botão primário, foco |
| `--purple-soft` | `#CAA9FA` | Hover do botão primário |
| `--cyan` | `#8BE9FD` | Links inline |
| `--red` | `#FF5555` | Erros de validação (danger) |
| `--green` | `#50FA7B` | Sucesso (reservado) |
| `--yellow` | `#F1FA8C` | Avisos (reservado) |

**Tipografia:** Open Sans (400/600/700). Escala: `xs 10px` (labels uppercase), `sm 12px`,
`md 14px` (corpo/inputs), `lg 18px` (títulos de card), `xl 24px` (títulos de página).

**Outros:** raio `8px`; sombra de card sutil; espaçamento base de `24px` nos cards.

---

## Página 1 — Home / Listagem (`/`)

Layout de duas colunas no desktop (`380px` + fluido) e empilhado no mobile (mobile-first).
Cobre os requisitos **FE-01 a FE-08**.

### Seção 0 — Logo
- Logo oficial **brev.ly** (`assets/brev.ly-logo.png`, versão dark: "brev" claro, "." verde, "ly" ciano, ícone roxo), no topo do container, alinhada à esquerda.
- Clicável, retorna para `/`.
- Existe também o **ícone isolado** (`assets/brev.ly-logo-alone.png`), usado na página de redirecionamento e disponível para favicon.

### Seção 1 — Formulário "Novo link" (card esquerdo)
Requisitos: **FE-01** (criar), **FE-02** (URL mal formatada), **FE-03** (já existente).

| Elemento | Detalhe |
|----------|---------|
| Título | "Novo link" (`text-lg`) |
| Campo **Link original** | Label uppercase; placeholder `www.exemplo.com.br`; validação de URL (Zod) |
| Campo **Link encurtado** | Prefixo fixo `brev.ly/` + input; valida formato (minúsculas, sem espaço/caractere especial) |
| Botão **Salvar link** | Primário, largura total, `48px` |

**Estados:**
- **Erro de validação** — borda `--danger` + mensagem abaixo do campo (ex.: URL mal formatada, ou "essa URL encurtada já existe" vinda da API 409). *(variação comentada no HTML)*
- **Enviando** — botão desabilitado com texto "Salvando…" e bloqueio de novo submit.
- **Sucesso** — limpa o formulário e a lista é revalidada (React Query invalida a query).

### Seção 2 — Card "Meus links" (card direito)
Requisitos: **FE-04** (deletar), **FE-06** (listar), **FE-07** (acessos), **FE-08** (CSV).

#### 2.1 Cabeçalho
- Título "Meus links" (`text-lg`).
- Botão secundário **Baixar CSV** com ícone de download → chama o endpoint de export e baixa/abre a URL da CDN (R2).
- Divisória (`1px`, `--gray-200`) separando header da lista.

#### 2.2 Lista de links
Cada linha (`link-row`) contém:
- **Info** (esquerda): URL encurtada em azul (`brev.ly/slug`, clicável) + URL original em cinza, truncada com reticências.
- **Ações** (direita): contador "N acessos" · botão **copiar** (ícone) · botão **deletar** (ícone).
- Divisória superior entre linhas.

**Estados do card:**
- **Populado** — estado principal exibido no mockup (3 exemplos).
- **Empty state** — ícone de link + "Ainda não existem links cadastrados". *(variação comentada no HTML)*
- **Loading** — spinner + "Carregando links…" enquanto busca a lista. *(variação comentada no HTML)*
- **Ações por estado** — botões **Baixar CSV** e **copiar/deletar** ficam desabilitados quando a lista está vazia ou durante operações em andamento.

**Interações:**
- **Copiar** → copia a URL curta completa para a área de transferência (feedback de "copiado").
- **Deletar** → remove o link (confirmação/optimistic a critério) e revalida a lista.
- **Clique na URL curta** → abre a rota de redirecionamento, incrementando o contador (**FE-07**).

---

## Página 2 — Redirecionamento (`/:url-encurtada`)

Requisito: **FE-05** (obter URL original pelo encurtamento) + **FE-07** (incrementar acessos).
Card único centralizado vertical e horizontalmente.

### Seção 1 — Card de redirecionamento
- **1.1 Marca/ilustração** — logo Brev.ly ampliada.
- **1.2 Título + spinner** — "Redirecionando..." com indicador de carregamento.
- **1.3 Mensagem** — "O link será aberto automaticamente em alguns instantes. Não foi redirecionado? **Acesse aqui**." (fallback manual com link direto para a URL original).

**Fluxo:** ao montar, consulta a API pela URL encurtada → se existir, incrementa acessos e faz `window.location`/redirect para a URL original → se **não** existir, navega para a página 404.

**Estados:**
- **Buscando** — spinner ativo (estado do mockup).
- **Não encontrado** — redireciona para `not-found`.

---

## Página 3 — Não encontrado / 404 (`*`)

Card único centralizado. Exibida para rotas inválidas **ou** quando a URL encurtada não existe.

### Seção 1 — Card de recurso não encontrado
- **1.1 Ilustração** — bloco "404" em destaque (azul).
- **1.2 Título** — "Link não encontrado".
- **1.3 Mensagem + CTA** — explicação de que o link não existe/foi removido/é inválido, com link **brev.ly** para voltar à home.

---

## Responsividade (mobile-first)

- **Desktop (> 768px):** Home em duas colunas (form `380px` + lista fluida).
- **Mobile (≤ 768px):** colunas empilham em uma só; paddings reduzidos; URL original com truncamento mais curto; cards centrais com padding menor.
- Todos os alvos de toque respeitam `≥ 32px`; inputs e botão primário com `48px`.

---

## Rastreabilidade (mockup → requisitos)

| Requisito | Onde aparece |
|-----------|--------------|
| FE-01 Criar link | Home · Seção 1 |
| FE-02 URL mal formatada | Home · Seção 1 (estado de erro) |
| FE-03 Encurtamento já existente | Home · Seção 1 (erro 409) |
| FE-04 Deletar link | Home · Seção 2.2 (ícone lixeira) |
| FE-05 Obter URL original | Página 2 (redirect) |
| FE-06 Listar URLs | Home · Seção 2.2 |
| FE-07 Incrementar acessos | Home · Seção 2.2 (contador) + Página 2 |
| FE-08 Baixar CSV | Home · Seção 2.1 (botão Baixar CSV) |
| Empty state / loaders / bloqueio | Home · Seção 2 (estados) |
| 3 páginas (raiz, redirect, 404) | home / redirect / not-found |
| Responsividade | Todas (breakpoint 768px) |
