const SEG_LIST = ["EI", "EF1", "EF2", "EM", "EXT"];
const TYPE_LIST = ["Estrutura", "Atividade", "Tabela", "Mídia", "Link/QR", "Estilo", "Outros"];
const BASE = location.pathname.startsWith("/Biblioteca_LD") ? "/Biblioteca_LD" : "";
// Sempre carregar do repositório para que F5 mostre os mesmos dados que foram salvos (incl. previewImage)
const SNIPPETS_RAW = "https://raw.githubusercontent.com/Luizsb/Biblioteca_LD/master/snippetsNetlify.json";
const ADMIN_KEY = "LD_ADMIN_LOGGED";
const GH_TOKEN_KEY = "LD_GH_TOKEN";
const GH_BRANCH = "master";
const GH_API = "https://api.github.com/repos/Luizsb/Biblioteca_LD/contents/snippetsNetlify.json";
const GH_REPO_CONTENTS = "https://api.github.com/repos/Luizsb/Biblioteca_LD/contents";
const PREVIEW_IMAGE_FOLDER = "geral/image/snippet";
const ONBOARDING_KEY = "LD_ONBOARDING_SEEN";

let snippets = [];
let currentItem = null;

window.onload = () => initApp();

function startOnboarding() {
    if (typeof introJs === "undefined") return;
    const tour = introJs();
    tour.setOptions({
        nextLabel: "Próximo",
        prevLabel: "Voltar",
        skipLabel: "Sair",
        doneLabel: "Concluir",
        exitOnOverlayClick: false,
        showStepNumbers: true,
        showProgress: false,
        stepNumbersOfLabel: " de ",
        tooltipClass: "ld-intro-tooltip",
        scrollTo: "tooltip",
        steps: [
            {
                intro: "Bem-vindo à <strong>Biblioteca LD</strong>! Aqui você encontra e consulta snippets de código para usar nos livros digitais. Este tour mostra como usar a plataforma.",
                title: "Bem-vindo"
            },
            {
                element: document.querySelector("#filters-col"),
                intro: "Use os <strong>filtros</strong> para encontrar o que precisa: busque por texto, escolha Segmento (EI, EF1, EF2, EM), Tipo de componente e Tags. Clique em \"Limpar Filtros\" para resetar.",
                title: "Filtros e busca"
            },
            {
                element: document.querySelector("#list-col"),
                intro: "Aqui aparece a <strong>lista de snippets</strong>. Clique em um item para ver os detalhes no painel à direita. Use o menu para ordenar por Recentes ou A–Z.",
                title: "Lista de snippets"
            },
            {
                element: document.querySelector("#details-col .empty-state"),
                intro: "No <strong>painel à direita</strong> (ao selecionar um snippet) aparecem os detalhes: <strong>Como fica no livro</strong> (preview), <strong>Código</strong> (HTML para copiar) e <strong>Notas</strong>. Use o botão \"Copiar Código\" para usar no seu material.",
                title: "Detalhes e cópia",
                position: "left"
            },
            {
                intro: "Pronto! Selecione um snippet na lista e explore. Você pode refazer este tour a qualquer momento pelo botão <strong>Como usar</strong> no canto superior direito da página.",
                title: "Tudo certo"
            }
        ]
    });
    tour.oncomplete(() => {
        document.body.classList.remove("intro-step-details");
        try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch (_) {}
    });
    tour.onafterchange(() => {
        const step = tour._currentStep;
        if (step === 3) {
            document.body.classList.add("intro-step-details");
        } else {
            document.body.classList.remove("intro-step-details");
        }
    });
    tour.start();
}

async function initApp() {
    await loadSnippets();
    renderFilters();
    renderModalSegments();
    refreshAdminUI();
    handleFilterChange();
    const listDiv = document.querySelector("#list-col .column-content");
    listDiv.onscroll = () => {
        document.getElementById("btn-up").style.display = listDiv.scrollTop > 200 ? "block" : "none";
    };
    try {
        if (!localStorage.getItem(ONBOARDING_KEY)) startOnboarding();
    } catch (_) {}
}

function refreshAdminUI() {
    const isAdmin = sessionStorage.getItem(ADMIN_KEY) === "1";
    ["btn-login", "btn-logout", "header-sep-admin", "btn-new-snippet", "btn-edit-adm", "btn-delete-adm"].forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const show = i === 0 ? !isAdmin : isAdmin;
        el.style.display = show ? (id === "header-sep-admin" ? "block" : "inline-flex") : "none";
    });
}

async function adminLogin() {
    const pw = prompt("Digite a senha de administrador:");
    if (!pw || !pw.trim()) return;
    const ok = await verifyAdminPassword(pw.trim());
    if (!ok) {
        alert("Senha incorreta.");
        return;
    }
    sessionStorage.setItem(ADMIN_KEY, "1");
    refreshAdminUI();
}

// Sem servidor: usa checagem local. Troque a senha aqui se necessario.
const ADMIN_PASSWORD = "pato";

async function verifyAdminPassword(password) {
    return password && String(password).trim() === ADMIN_PASSWORD;
}

function adminLogout() {
    sessionStorage.removeItem(ADMIN_KEY);
    refreshAdminUI();
}

async function loadSnippets() {
    try {
        if (BASE) {
            const apiUrl = GH_API + "?ref=" + encodeURIComponent(GH_BRANCH) + "&t=" + Date.now();
            console.log("[LD] loadSnippets: via API (sem cache)", apiUrl);
            const resp = await fetch(apiUrl, {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
            });
            console.log("[LD] loadSnippets: status", resp.status, resp.statusText);
            if (!resp.ok) {
                if (resp.status === 404) {
                    snippets = [];
                    console.log("[LD] loadSnippets: arquivo não existe, 0 snippets");
                    return;
                }
                throw new Error(resp.status + " " + resp.statusText);
            }
            const file = await resp.json();
            const content = file.content && file.encoding === "base64"
                ? decodeURIComponent(escape(atob(file.content.replace(/\s/g, ""))))
                : "";
            const json = content ? JSON.parse(content) : { snippets: [] };
            const raw = Array.isArray(json?.snippets) ? json.snippets : [];
            // Preservar todos os campos de cada snippet (ex.: previewImage) ao copiar
            snippets = raw.map((s) => ({ ...s }));
            console.log("[LD] loadSnippets: carregados", snippets.length, "snippets (via API)");
            return;
        }
        // Local/dev: carregar do repositório (raw) para que F5 mostre o que foi salvo no GitHub
        const url = SNIPPETS_RAW + "?t=" + Date.now();
        console.log("[LD] loadSnippets: buscando (repo)", url);
        const resp = await fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" } });
        console.log("[LD] loadSnippets: status", resp.status, resp.statusText, "url:", resp.url);
        const json = resp.ok ? await resp.json() : { snippets: [] };
        const raw = Array.isArray(json?.snippets) ? json.snippets : [];
        snippets = raw.map((s) => ({ ...s }));
        console.log("[LD] loadSnippets: carregados", snippets.length, "snippets (repo)");
        if (!resp.ok) console.warn("[LD] loadSnippets: resposta não ok, usando lista vazia");
    } catch (e) {
        console.error("[LD] loadSnippets: erro", e);
        snippets = [];
    }
}

function renderFilters() {
    document.getElementById("filter-segments").innerHTML = SEG_LIST.map((s) => `<div class="tag-item" onclick="toggleTag(this)">${s}</div>`).join("");
    document.getElementById("filter-types").innerHTML = TYPE_LIST.map((t) => {
        const c = t.toLowerCase().replace("/", "").replace("í", "i");
        return `<div class="tag-item filter-type-${c}" onclick="toggleTag(this)">${t}</div>`;
    }).join("");
    const tags = [...new Set(snippets.flatMap((s) => s.tags || []))].sort();
    document.getElementById("filter-tags").innerHTML = tags.map((t) => `<div class="tag-item" onclick="toggleTag(this)">${t}</div>`).join("");
}

function renderModalSegments() {
    document.getElementById("f-segments-container").innerHTML = SEG_LIST.map(
        (s) => `<label class="segment-check"><input type="checkbox" class="f-seg-checkbox" value="${s}">${s}</label>`
    ).join("");
}

function toggleTag(el) {
    el.classList.toggle("active");
    handleFilterChange();
}

function handleFilterChange() {
    const search = document.getElementById("global-search").value.toLowerCase();
    const sort = document.getElementById("sort-order").value;
    const discipline = document.getElementById("filter-discipline")?.value;
    const activeSegs = [...document.querySelectorAll("#filter-segments .active")].map((e) => e.innerText);
    const activeTypes = [...document.querySelectorAll("#filter-types .active")].map((e) => e.innerText);
    const activeTags = [...document.querySelectorAll("#filter-tags .active")].map((e) => e.innerText);
    document.getElementById("discipline-box").classList.toggle("hidden", !activeSegs.includes("EF2") && activeSegs.length > 0);
    let filtered = snippets.filter((s) => {
        const ms = !search || s.title.toLowerCase().includes(search) || s.code?.toLowerCase().includes(search) || (s.tags || []).some((t) => t.toLowerCase().includes(search));
        const mSeg = activeSegs.length === 0 || (s.segment || []).some((seg) => activeSegs.includes(seg));
        const mDisc = !discipline || s.discipline === discipline;
        const mType = activeTypes.length === 0 || activeTypes.includes(s.type);
        const mTag = activeTags.length === 0 || (s.tags || []).some((tag) => activeTags.includes(tag));
        return ms && mSeg && mDisc && mType && mTag;
    });
    if (sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));
    else filtered.reverse();
    renderList(filtered);
    document.getElementById("result-count").innerText = `${filtered.length} itens`;
}

function renderList(list) {
    const container = document.getElementById("snippet-list");
    if (!list.length) {
        container.innerHTML = '<div class="empty-state">Nenhum snippet encontrado.</div>';
        return;
    }
    const typeClass = (t) => (t || "").toLowerCase().replace("/", "").replace("í", "i");
    container.innerHTML = list.map((s) => `
        <div class="snippet-card ${currentItem?.id === s.id ? "selected" : ""}" onclick="viewSnippet('${s.id}')">
            <h3>${s.title}</h3>
            <p>${s.desc || ""}</p>
            <div class="card-meta">
                <span class="badge badge-${typeClass(s.type)}">${s.type}</span>
                ${(s.segment || []).map((seg) => `<span class="badge badge-segmento">${seg}</span>`).join("")}
            </div>
        </div>
    `).join("");
}

function viewSnippet(id) {
    currentItem = snippets.find((s) => s.id === id);
    if (!currentItem) return;
    document.getElementById("empty-view").classList.add("hidden");
    document.getElementById("content-view").classList.remove("hidden");
    refreshAdminUI();
    document.getElementById("view-title").innerText = currentItem.title;
    const typeClass = (currentItem.type || "").toLowerCase().replace("/", "").replace("í", "i");
    document.getElementById("view-badges").innerHTML = `
        <span class="badge badge-${typeClass}">${currentItem.type}</span>
        ${(currentItem.segment || []).map((seg) => `<span class="badge badge-segmento">${seg}</span>`).join("")}
        ${currentItem.discipline ? `<span class="badge badge-segmento">${currentItem.discipline}</span>` : ""}
        ${(currentItem.tags || []).map((t) => `<span class="badge badge-segmento" style="border-style:dashed;">#${t}</span>`).join("")}
    `;
    document.getElementById("code-view-block").textContent = currentItem.code;
    Prism.highlightElement(document.getElementById("code-view-block"));
    const hasNotes = currentItem.notes?.length > 0;
    const tabNotes = document.getElementById("tab-link-notes");
    tabNotes.classList.toggle("hidden", !hasNotes);
    if (hasNotes) {
        document.getElementById("notes-view-content").innerHTML = `<ul style="color:var(--text-light);">${currentItem.notes.map((n) => `<li>${n}</li>`).join("")}</ul>`;
    }
    showTab("preview");
    handleFilterChange();
}

function showTab(tab) {
    document.querySelectorAll(".tab-link").forEach((l) => l.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    const link = document.querySelector(`.tab-link[onclick*="'${tab}'"]`);
    if (link) link.classList.add("active");
    const panel = document.getElementById(`panel-${tab}`);
    if (panel) panel.classList.add("active");
    if (tab === "preview") updatePreview();
}

function getPreviewImageSrc(item) {
    let src = (item && item.previewImage) || "";
    src = src.trim();
    if (!src) return "";

    // URL absoluta
    if (/^https?:\/\//i.test(src)) return src;

    // Caminho absoluto (começa com /): respeita o caminho informado
    if (src.startsWith("/")) {
        return BASE ? `${BASE}${src}` : src;
    }

    // Caminho relativo com pastas (ex.: geral/image/foo.png)
    if (src.includes("/")) {
        return BASE ? `${BASE}/${src}` : src;
    }

    // Apenas nome de arquivo (ex.: glossario.png) → assume pasta padrão de previews
    const basePath = "geral/image/snippet";
    return BASE ? `${BASE}/${basePath}/${src}` : `${basePath}/${src}`;
}

function updatePreview() {
    if (!currentItem) return;

    const iframe = document.getElementById("preview-iframe");
    const img = document.getElementById("preview-image");

    // Se tiver imagem de preview configurada, usa a imagem em vez do mockup HTML
    const imgSrc = getPreviewImageSrc(currentItem);
    if (img && imgSrc) {
        img.src = imgSrc;
        img.alt = currentItem.title || "Preview do snippet";
        img.style.display = "block";
        if (iframe) iframe.style.display = "none";
        return;
    } else if (img) {
        img.style.display = "none";
    }
    if (iframe) iframe.style.display = "block";

    const seg = currentItem.segment?.[0] || "EF2";
    const discipline = currentItem.discipline || document.getElementById("filter-discipline")?.value;
    const discLink = discipline && ["EF1", "EF2", "EM", "EXT"].includes(seg)
        ? `<link rel="stylesheet" href="${BASE}/geral/css/${seg}/disciplinas/${discipline}.css">` : "";
    const code = (currentItem.code || "").replaceAll("/resources/image/", `${BASE}/geral/image/`).replaceAll("resources/image/", `${BASE}/geral/image/`);
    const customCss = currentItem.css ? `<style>${currentItem.css}</style>` : "";
    const html = `<!DOCTYPE html><html><head>
        <link rel="stylesheet" href="${BASE}/geral/css/html5reset.css">
        <link rel="stylesheet" href="${BASE}/geral/css/bootstrap.css">
        <link rel="stylesheet" href="${BASE}/geral/css/geral.css">
        <link rel="stylesheet" href="${BASE}/geral/css/geral1024.css">
        <link rel="stylesheet" href="${BASE}/geral/css/geral640.css">
        ${discLink}${customCss}
        <style>body{padding:40px;background:#fff;font-family:sans-serif;min-height:100vh;color:#333}
        body::before{content:"MOCKUP LD";position:fixed;top:0;left:0;right:0;background:#f1f5f9;color:#94a3b8;font-size:10px;padding:4px 10px;border-bottom:1px solid #e2e8f0;z-index:9999}</style>
        </head><body class="segmento-${seg.toLowerCase()}"><div class="container-fluid">${code}</div>
        <script>document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(a)e.preventDefault()})<\/script></body></html>`;
    document.getElementById("preview-iframe").srcdoc = html;
}

function copySnippetCode() {
    navigator.clipboard.writeText(currentItem.code).then(() => {
        const btn = document.querySelector('.btn-primary[onclick="copySnippetCode()"]');
        const orig = btn.innerText;
        btn.innerText = "Copiado!";
        btn.style.background = "var(--success)";
        setTimeout(() => { btn.innerText = orig; btn.style.background = "var(--accent)"; }, 2000);
    });
}

function verifyAccess() {
    closeModal("modal-password");
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function openEditorModal() {
    document.getElementById("modal-title").innerText = "Adicionar Novo Snippet";
    ["f-id", "f-title", "f-type", "f-desc", "f-discipline", "f-tags", "f-preview-image", "f-code", "f-notes", "f-css"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    document.querySelectorAll(".f-seg-checkbox").forEach((cb) => (cb.checked = false));
    openModal("modal-editor");
}

function openEditEditor() {
    if (!currentItem) return;
    document.getElementById("modal-title").innerText = "Editar Snippet Existente";
    document.getElementById("f-id").value = currentItem.id;
    document.getElementById("f-title").value = currentItem.title;
    document.getElementById("f-type").value = currentItem.type;
    document.getElementById("f-desc").value = currentItem.desc || "";
    document.getElementById("f-discipline").value = currentItem.discipline || "";
    document.getElementById("f-tags").value = (currentItem.tags || []).join(", ");
    const previewInput = document.getElementById("f-preview-image");
    if (previewInput) previewInput.value = currentItem.previewImage || "";
    document.getElementById("f-code").value = currentItem.code || "";
    document.getElementById("f-notes").value = (currentItem.notes || []).join("\n");
    document.getElementById("f-css").value = currentItem.css || "";
    document.querySelectorAll(".f-seg-checkbox").forEach((cb) => {
        cb.checked = (currentItem.segment || []).includes(cb.value);
    });
    openModal("modal-editor");
}

async function saveSnippet() {
    const typeVal = document.getElementById("f-type").value?.trim();
    if (!typeVal) {
        alert("Selecione o Tipo de Componente.");
        document.getElementById("f-type").focus();
        return;
    }
    const id = document.getElementById("f-id").value || "sn-" + Date.now();
    const segs = [...document.querySelectorAll(".f-seg-checkbox:checked")].map((cb) => cb.value);
    const tags = document.getElementById("f-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
    const notes = document.getElementById("f-notes").value.split("\n").map((n) => n.trim()).filter(Boolean);
    const existing = snippets.find((s) => s.id === id);
    const previewVal = (document.getElementById("f-preview-image")?.value ?? existing?.previewImage ?? "").trim();
    const data = {
        ...(existing || {}),
        id,
        title: document.getElementById("f-title").value || "Snippet Sem Título",
        type: typeVal,
        desc: document.getElementById("f-desc").value || "Nenhuma descrição fornecida.",
        discipline: document.getElementById("f-discipline").value || "",
        segment: segs,
        tags,
        previewImage: previewVal,
        code: document.getElementById("f-code").value || "",
        notes,
        css: (document.getElementById("f-css").value || "").trim(),
    };
    const next = [...snippets];
    const idx = next.findIndex((s) => s.id === id);
    if (idx >= 0) next[idx] = data;
    else next.push(data);
    const ok = await saveToGitHub(next);
    if (!ok) return;
    snippets = next;
    refreshUI();
    closeModal("modal-editor");
    viewSnippet(id);
}

async function deleteCurrentSnippet() {
    if (!currentItem) return;
    const next = snippets.filter((s) => s.id !== currentItem.id);
    const ok = await saveToGitHub(next);
    if (!ok) return;
    snippets = next;
    currentItem = null;
    document.getElementById("content-view").classList.add("hidden");
    document.getElementById("empty-view").classList.remove("hidden");
    refreshUI();
    alert("Snippet removido com sucesso!");
}

/** Atualiza apenas a UI a partir do estado atual em memória (sem buscar no servidor). */
function refreshUI() {
    renderFilters();
    handleFilterChange();
}

/** Recarrega do servidor e atualiza a UI (pode vir cache antigo). */
async function loadAndRefresh() {
    await loadSnippets();
    refreshUI();
}

function getGitHubToken() {
    let t = localStorage.getItem(GH_TOKEN_KEY);
    if (t) {
        console.log("[LD] getGitHubToken: usando token salvo (localStorage)");
        return t;
    }
    console.log("[LD] getGitHubToken: pedindo token ao usuário");
    t = prompt("Token GitHub (permissoes repo):");
    if (t) localStorage.setItem(GH_TOKEN_KEY, t.trim());
    return t?.trim() || null;
}

async function saveToGitHub(nextSnippets) {
    console.log("[LD] saveToGitHub: iniciando, branch=" + GH_BRANCH + ", snippets=" + nextSnippets.length);
    const token = getGitHubToken();
    if (!token) {
        console.warn("[LD] saveToGitHub: sem token, abortando");
        alert(
            "Para salvar no repositório, é necessário um token do GitHub.\n\n" +
            "1. GitHub → Settings → Developer settings → Personal access tokens\n" +
            "2. Gere um token com permissão 'repo'\n" +
            "3. Cole o token quando solicitado (ao salvar ou excluir)"
        );
        return false;
    }
    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const getUrl = GH_API + "?ref=" + encodeURIComponent(GH_BRANCH);
        console.log("[LD] saveToGitHub: GET arquivo atual", getUrl);
        const getRes = await fetch(getUrl, { headers });
        console.log("[LD] saveToGitHub: GET status", getRes.status, getRes.statusText);
        let sha = null;
        if (getRes.ok) {
            const file = await getRes.json();
            sha = file.sha;
            console.log("[LD] saveToGitHub: sha obtido, atualizando arquivo existente");
        } else {
            const getBody = await getRes.text();
            console.log("[LD] saveToGitHub: GET falhou, body:", getBody.substring(0, 200));
            if (getRes.status === 404) console.log("[LD] saveToGitHub: arquivo ainda não existe, será criado");
        }
        const content = btoa(unescape(encodeURIComponent(JSON.stringify({ snippets: nextSnippets }))));
        const putBody = {
            message: "Atualizar snippets",
            content,
            branch: GH_BRANCH,
        };
        if (sha) putBody.sha = sha;
        console.log("[LD] saveToGitHub: PUT enviando, branch=" + GH_BRANCH);
        const putRes = await fetch(GH_API, {
            method: "PUT",
            headers,
            body: JSON.stringify(putBody),
        });
        console.log("[LD] saveToGitHub: PUT status", putRes.status, putRes.statusText);
        if (putRes.status === 401) {
            localStorage.removeItem(GH_TOKEN_KEY);
            console.warn("[LD] saveToGitHub: 401 token inválido");
            alert("Token invalido. Tente novamente.");
            return false;
        }
        if (!putRes.ok) {
            const putText = await putRes.text();
            console.error("[LD] saveToGitHub: PUT falhou", putRes.status, putText);
            let msg = "Erro " + putRes.status;
            try {
                const err = JSON.parse(putText);
                msg = err?.message || msg;
            } catch (_) {}
            alert("Erro ao salvar no repositório: " + msg);
            return false;
        }
        const putJson = await putRes.json();
        console.log("[LD] saveToGitHub: sucesso! commit", putJson?.commit?.sha || putJson?.content?.sha);
        return true;
    } catch (e) {
        console.error("[LD] saveToGitHub: exceção", e);
        alert("Erro: " + (e?.message || "Rede"));
        return false;
    }
}

/**
 * Envia a imagem de preview para o repositório (geral/image/snippet/) via API do GitHub
 * e preenche o campo "Imagem de preview" com o nome do arquivo.
 * @param {HTMLInputElement} inputEl - input type="file" que disparou o evento
 */
async function uploadPreviewImage(inputEl) {
    const file = inputEl.files && inputEl.files[0];
    if (!file || !file.type.startsWith("image/")) {
        inputEl.value = "";
        return;
    }
    const token = getGitHubToken();
    if (!token) {
        alert("Informe o token do GitHub (com permissão repo) para enviar a imagem.");
        inputEl.value = "";
        return;
    }
    const rawName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    const filename = rawName || "preview-" + Date.now() + ".png";
    const path = PREVIEW_IMAGE_FOLDER + "/" + filename;

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
            let base64 = reader.result;
            if (typeof base64 === "string" && base64.indexOf("base64,") >= 0) {
                base64 = base64.split("base64,")[1];
            }
            if (!base64) {
                alert("Não foi possível ler a imagem.");
                inputEl.value = "";
                resolve();
                return;
            }
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
                const getUrl = GH_REPO_CONTENTS + "/" + path.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(GH_BRANCH);
                const getRes = await fetch(getUrl, { headers });
                let sha = null;
                if (getRes.ok) {
                    const data = await getRes.json();
                    sha = data.sha;
                }
                const putBody = {
                    message: "Adicionar imagem de preview: " + filename,
                    content: base64,
                    branch: GH_BRANCH,
                };
                if (sha) putBody.sha = sha;
                const putRes = await fetch(GH_REPO_CONTENTS + "/" + path.split("/").map(encodeURIComponent).join("/"), {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(putBody),
                });
                if (putRes.status === 401) {
                    localStorage.removeItem(GH_TOKEN_KEY);
                    alert("Token inválido. Tente novamente.");
                    inputEl.value = "";
                    resolve();
                    return;
                }
                if (!putRes.ok) {
                    const errText = await putRes.text();
                    let msg = "Erro " + putRes.status;
                    try {
                        const err = JSON.parse(errText);
                        msg = err?.message || msg;
                    } catch (_) {}
                    alert("Erro ao enviar imagem: " + msg);
                    inputEl.value = "";
                    resolve();
                    return;
                }
                document.getElementById("f-preview-image").value = filename;
                alert("Imagem enviada. Nome preenchido: " + filename + ". Salve o snippet para aplicar.");
            } catch (e) {
                console.error("[LD] uploadPreviewImage:", e);
                alert("Erro: " + (e?.message || "Rede"));
            }
            inputEl.value = "";
            resolve();
        };
        reader.readAsDataURL(file);
    });
}

function clearSearch() {
    const el = document.getElementById("global-search");
    el.value = "";
    el.focus();
    handleFilterChange();
}

function clearFilters() {
    document.getElementById("global-search").value = "";
    document.querySelectorAll(".tag-item.active").forEach((el) => el.classList.remove("active"));
    handleFilterChange();
}

function goUp() {
    document.querySelector("#list-col .column-content").scrollTo({ top: 0, behavior: "smooth" });
}

// Expor funções usadas por onclick/oninput/onchange no HTML (necessário com type="module")
window.viewSnippet = viewSnippet;
window.toggleTag = toggleTag;
window.handleFilterChange = handleFilterChange;
window.clearSearch = clearSearch;
window.clearFilters = clearFilters;
window.goUp = goUp;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.openEditorModal = openEditorModal;
window.openEditEditor = openEditEditor;
window.copySnippetCode = copySnippetCode;
window.deleteCurrentSnippet = deleteCurrentSnippet;
window.showTab = showTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.verifyAccess = verifyAccess;
window.saveSnippet = saveSnippet;
window.uploadPreviewImage = uploadPreviewImage;
window.startOnboarding = startOnboarding;
