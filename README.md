# Biblioteca LD

Biblioteca de códigos e snippets para a Plataforma LD (Arco Educação).

- **Repositório:** [https://github.com/Luizsb/Biblioteca_LD](https://github.com/Luizsb/Biblioteca_LD)
- **Site (GitHub Pages):** [https://luizsb.github.io/Biblioteca_LD/](https://luizsb.github.io/Biblioteca_LD/)

## Rodar localmente

**Requisito:** Node.js (v18+)

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build para produção

```bash
npm run build
```

A pasta `dist/` conterá os arquivos estáticos (usados pelo GitHub Pages).

## Publicar no GitHub e ativar GitHub Pages

### 1. Enviar o projeto para o repositório

Se o repositório já existir e estiver vazio ou você quiser atualizar:

```bash
git init
git add .
git commit -m "Estrutura simplificada para GitHub Pages"
git remote add origin https://github.com/Luizsb/Biblioteca_LD.git
git branch -M master
git push -u origin master
```

Se já tiver outro `remote` ou branch, ajuste conforme seu caso.

### 2. Ativar GitHub Pages

1. No GitHub: **Settings** → **Pages**
2. Em **Build and deployment**:
   - **Source:** **GitHub Actions**
3. Ao dar push na branch `master`, o workflow **Deploy GitHub Pages** roda, faz o build e publica o site.

O site ficará em: **https://luizsb.github.io/Biblioteca_LD/**

## Snippets (dados)

O arquivo **snippetsNetlify.json** é a base de snippets. Ele é **atualizado pela própria plataforma** (cadastro/edição/exclusão via app, que grava no repositório pela API do GitHub). A versão que “vale” é a do repositório.

- Para **não sobrescrever** as alterações feitas na plataforma quando você fizer `git push`, rode **uma vez** no seu clone:
  ```bash
  git update-index --assume-unchanged snippetsNetlify.json
  ```
  Assim o Git passa a ignorar alterações locais nesse arquivo e você não o envia por engano no push.

- Sempre que for fazer push de outro código, dê **`git pull`** antes, para trazer as alterações de snippets feitas pela plataforma.

## Estrutura do projeto

- `index.html` – Página principal
- `app.js` – Lógica da aplicação (filtros, lista, preview, admin)
- `styles.css` – Estilos da interface
- `snippetsNetlify.json` – Dados dos snippets (atualizado pelo app via API; ver seção acima)
- `geral/` – CSS e imagens usados no preview dos snippets
- `.github/workflows/deploy-pages.yml` – Publicação automática no GitHub Pages

## Tecnologias

- Vite (build e dev server)
- HTML, CSS, JavaScript
- Prism (destaque de código)
