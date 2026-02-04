# Biblioteca LD

Biblioteca de códigos e snippets para a **Plataforma LD** (Arco Educação). Permite consultar, cadastrar, editar e excluir componentes reutilizáveis (HTML/CSS) usados nos livros digitais.

- **Repositório:** [github.com/Luizsb/Biblioteca_LD](https://github.com/Luizsb/Biblioteca_LD)
- **Site (GitHub Pages):** [luizsb.github.io/Biblioteca_LD](https://luizsb.github.io/Biblioteca_LD/)

---

## Linguagens e tecnologias

| Camada        | Tecnologia |
|---------------|------------|
| Interface    | HTML5, CSS3 |
| Lógica       | JavaScript (ES módulos) |
| Build        | [Vite](https://vitejs.dev/) |
| Deploy       | GitHub Pages + GitHub Actions |
| Dados        | JSON (`snippetsNetlify.json`) |
| Persistência | GitHub API (arquivo no repositório) |
| Destaque de código | [Prism.js](https://prismjs.com/) (CDN) |

---

## Como funciona o fluxo

1. **Leitura dos snippets**  
   No site publicado (GitHub Pages), a lista é carregada pela **API do GitHub** (`/repos/.../contents/snippetsNetlify.json?ref=master`). Assim sempre se vê o conteúdo atual do repositório, sem depender do cache do “raw”.

2. **Cadastro / edição / exclusão**  
   Quem tem acesso de administrador faz **Login (Adm)** e usa os botões **Novo Snippet**, **Editar** e **Excluir**. Ao salvar ou excluir, o app chama a **API do GitHub** (PUT no mesmo arquivo) e grava direto no repositório, no branch `master`.

3. **Token do GitHub**  
   Para gravar no repositório é necessário um **Personal Access Token** com permissão `repo`. Na primeira vez que salvar ou excluir, o app pede o token e guarda na sessão (não é enviado para nenhum servidor além da API do GitHub).

4. **Resumo**  
   Os dados “oficiais” são os do arquivo **snippetsNetlify.json** no GitHub. A plataforma só **lê e escreve** esse arquivo via API; não há banco de dados separado. Qualquer pessoa que abrir o site vê os mesmos dados após atualizar a página.

---

## Rodar localmente

**Requisito:** Node.js (v18+)

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Em desenvolvimento os snippets vêm do arquivo local `snippetsNetlify.json`.

---

## Build e deploy

**Build:**

```bash
npm run build
```

A pasta `dist/` contém os arquivos estáticos.

**Deploy (GitHub Pages):**

1. Envie o código para o repositório (ex.: `git push origin master`).
2. No GitHub: **Settings** → **Pages** → **Build and deployment** → **Source:** **GitHub Actions**.
3. O workflow `.github/workflows/deploy-pages.yml` roda a cada push em `master`: instala dependências, roda `npm run build` e publica o conteúdo de `dist/` no Pages.

O site fica em **https://luizsb.github.io/Biblioteca_LD/**.

---

## Snippets (arquivo de dados)

O arquivo **snippetsNetlify.json** é atualizado **pela própria plataforma** (via API). Evite sobrescrevê-lo ao fazer push de código:

- Rode **uma vez** no clone:  
  `git update-index --assume-unchanged snippetsNetlify.json`
- Antes de qualquer push, faça **`git pull`** para trazer alterações feitas pelo site.

---

## Estrutura do projeto

```
├── index.html          # Página principal
├── app.js              # Lógica (filtros, lista, preview, admin, API GitHub)
├── styles.css          # Estilos da interface
├── snippetsNetlify.json # Dados dos snippets (atualizado pelo app)
├── geral/              # CSS e imagens do preview “como fica no livro”
├── .github/workflows/
│   └── deploy-pages.yml # Deploy automático no GitHub Pages
├── vite.config.ts      # Configuração do Vite (base, plugins)
└── package.json
```
