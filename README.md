# Portfolio — Robert Lindomar

Portfólio com **duas versões visuais** e **conteúdo único**.

| URL | Versão |
|-----|--------|
| `/` | **v2** — design atual (Contract Surface) |
| `/v1/` | **v1** — arquivo visual (Tailwind emerald) |

## Editar conteúdo (textos, projetos, contato)

Altere apenas [`content/site.json`](content/site.json) e rode:

```bash
npm run build
```

Isso regenera `index.html` (v2) e `v1/index.html` com os mesmos dados.

## Editar design

| O que mudar | Onde |
|-------------|------|
| Visual da v2 | [`versions/v2/template.html`](versions/v2/template.html) e [`versions/v2/assets/`](versions/v2/assets/) |
| Visual da v1 | [`versions/v1/template.html`](versions/v1/template.html) e [`versions/v1/assets/`](versions/v1/assets/) |

Depois: `npm run build`

## Publicar no GitHub / Vercel

```bash
npm run build
git add .
git commit -m "sua mensagem"
git push origin main
```

A Vercel executa `npm run build` automaticamente no deploy.

## Estrutura

```
content/site.json       ← edite aqui (textos, projetos, contato)
versions/v1/            ← design arquivo (Tailwind)
versions/v2/            ← design atual
scripts/build.mjs       ← gera o site
index.html + css/ + js/ ← v2 publicada (gerado)
v1/                     ← v1 publicada (gerado)
img/ + fonts/           ← compartilhados
```

**Não edite** `index.html`, `v1/` ou `css/portfolio.css` na raiz — são gerados pelo build.

## Desenvolvimento local

```bash
npm install
npm run build
# Abra index.html ou use Live Server na raiz do projeto
```
