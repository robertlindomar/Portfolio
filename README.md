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

## Publicar na VPS (Coolify)

Deploy **não** usa GitHub Pages nem Vercel. O fluxo é:

1. Push no GitHub (`main`)
2. Webhook do Coolify dispara o deploy
3. Coolify builda com Docker (`Dockerfile` na raiz)

### Configuração no Coolify

| Campo | Valor |
|-------|--------|
| Repositório | `git@github.com:robertlindomar/Portfolio.git` |
| Branch | `main` |
| Build pack | **Dockerfile** |
| Porta do container | `80` |
| Domínio | o seu (ex.: `robertlindomar.dev`) |

O `Dockerfile` roda `npm run build` e serve com **nginx** (`deploy/nginx.conf`), incluindo `/v1/`.

### Webhook

No Coolify: ative **Automatic Deployment** no recurso e copie a URL do webhook.  
No GitHub: **Settings → Webhooks → Add webhook** → cole a URL do Coolify (evento: `push` na branch `main`).

### Deploy manual (sem webhook)

```bash
npm run build
git add .
git commit -m "sua mensagem"
git push origin main
```

O Coolify só precisa receber o push — não configure GitHub Pages no repositório.

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
