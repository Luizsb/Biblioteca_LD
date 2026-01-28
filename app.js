const SEG_LIST = ["EI", "EF1", "EF2", "EM", "EXT"];
const TYPE_LIST = ["Estrutura", "Atividade", "Tabela", "Mídia", "Link/QR", "Estilo", "Outros"];
const ACCESS_PASSWORD = "PATO";

const SEED_JSON_URL = "./snippets.json";
const NETLIFY_GET_URL = "/.netlify/functions/snippets-get";
const NETLIFY_PUT_URL = "/.netlify/functions/snippets-put";

let snippets = [];
let currentItem = null;
let currentAction = null;

window.onload = () => {
    initApp();
};

async function initApp() {
    await loadSnippets();
    renderFilters();
    renderModalSegments(); // Inicializa o seletor no modal
    handleFilterChange();

    const listDiv = document.querySelector("#list-col .column-content");
    listDiv.onscroll = () => {
        document.getElementById("btn-up").style.display = listDiv.scrollTop > 200 ? "block" : "none";
    };
}

async function loadSnippets() {
    try {
        const netlifySnippets = await fetchNetlifySnippets();
        if (netlifySnippets) {
            snippets = netlifySnippets;
            return;
        }
        if (snippets.length > 0) {
            return;
        }
        const seedResponse = await fetch(SEED_JSON_URL, { cache: "no-store" });
        const seedJson = seedResponse.ok ? await seedResponse.json() : { snippets: [] };
        const seedSnippets = Array.isArray(seedJson.snippets) ? seedJson.snippets : [];
        snippets = seedSnippets;
    } catch (e) {
        if (snippets.length === 0) {
            snippets = [];
        }
    }
}

function renderFilters() {
    document.getElementById("filter-segments").innerHTML = SEG_LIST.map(
        (s) => `<div class="tag-item" onclick="toggleTag(this)">${s}</div>`
    ).join("");

    document.getElementById("filter-types").innerHTML = TYPE_LIST.map((t) => {
        const typeClass = t.toLowerCase().replace("/", "").replace("í", "i");
        return `<div class="tag-item filter-type-${typeClass}" onclick="toggleTag(this)">${t}</div>`;
    }).join("");

    const allTags = new Set();
    snippets.forEach((s) => s.tags.forEach((t) => allTags.add(t)));
    document.getElementById("filter-tags").innerHTML = Array.from(allTags)
        .sort()
        .map((t) => `<div class="tag-item" onclick="toggleTag(this)">${t}</div>`)
        .join("");
}

function renderModalSegments() {
    const container = document.getElementById("f-segments-container");
    container.innerHTML = SEG_LIST.map(
        (s) => `
            <label class="segment-check">
                <input type="checkbox" class="f-seg-checkbox" value="${s}">
                ${s}
            </label>
        `
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
    const activeSegs = Array.from(document.querySelectorAll("#filter-segments .active")).map(
        (el) => el.innerText
    );
    const activeTypes = Array.from(document.querySelectorAll("#filter-types .active")).map((el) => el.innerText);
    const activeTags = Array.from(document.querySelectorAll("#filter-tags .active")).map((el) => el.innerText);
    document
        .getElementById("discipline-box")
        .classList.toggle("hidden", !activeSegs.includes("EF2") && activeSegs.length > 0);
    let filtered = snippets.filter((s) => {
        const matchesSearch =
            !search ||
            s.title.toLowerCase().includes(search) ||
            s.code.toLowerCase().includes(search) ||
            s.tags.some((t) => t.toLowerCase().includes(search));
        const matchesSeg = activeSegs.length === 0 || s.segment.some((seg) => activeSegs.includes(seg));
        const matchesDiscipline = !discipline || s.discipline === discipline;
        const matchesType = activeTypes.length === 0 || activeTypes.includes(s.type);
        const matchesTag = activeTags.length === 0 || s.tags.some((tag) => activeTags.includes(tag));
        return matchesSearch && matchesSeg && matchesDiscipline && matchesType && matchesTag;
    });
    if (sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));
    else filtered.reverse();
    renderList(filtered);
    document.getElementById("result-count").innerText = `${filtered.length} itens`;
}

function renderList(list) {
    const container = document.getElementById("snippet-list");
    if (list.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum snippet encontrado.</div>';
        return;
    }
    container.innerHTML = list
        .map(
            (s) => `
            <div class="snippet-card ${currentItem?.id === s.id ? "selected" : ""}" onclick="viewSnippet('${s.id}')">
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
                <div class="card-meta">
                    <span class="badge badge-${s.type.toLowerCase().replace("/", "").replace("í", "i")}">${s.type}</span>
                    ${s.segment.map((seg) => `<span class="badge badge-segmento">${seg}</span>`).join("")}
                </div>
            </div>
        `
        )
        .join("");
}

function viewSnippet(id) {
    currentItem = snippets.find((s) => s.id === id);
    if (!currentItem) return;

    document.getElementById("empty-view").classList.add("hidden");
    document.getElementById("content-view").classList.remove("hidden");

    document.getElementById("view-title").innerText = currentItem.title;
    document.getElementById("view-badges").innerHTML = `
        <span class="badge badge-${currentItem.type.toLowerCase().replace("/", "").replace("í", "i")}">${currentItem.type}</span>
        ${currentItem.segment.map((seg) => `<span class="badge badge-segmento">${seg}</span>`).join("")}
        ${currentItem.discipline ? `<span class="badge badge-segmento">${currentItem.discipline}</span>` : ""}
        ${currentItem.tags.map((t) => `<span class="badge badge-segmento" style="border-style:dashed;">#${t}</span>`).join("")}
    `;

    document.getElementById("code-view-block").textContent = currentItem.code;
    Prism.highlightElement(document.getElementById("code-view-block"));

    // Lógica para aba de notas
    const hasNotes = currentItem.notes && currentItem.notes.length > 0;
    const tabLinkNotes = document.getElementById("tab-link-notes");

    if (hasNotes) {
        tabLinkNotes.classList.remove("hidden");
        const notes = document.getElementById("notes-view-content");
        notes.innerHTML = `<ul style="color:var(--text-light);">${currentItem.notes
            .map((n) => `<li>${n}</li>`)
            .join("")}</ul>`;
    } else {
        tabLinkNotes.classList.add("hidden");
    }

    // Sempre abre na aba 'preview' ao clicar num novo item
    showTab("preview");
    handleFilterChange();
}

function showTab(tab) {
    document.querySelectorAll(".tab-link").forEach((l) => l.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));

    // Ativa o link da aba
    const activeTab = document.querySelector(`.tab-link[onclick*="'${tab}'"]`);
    if (activeTab) activeTab.classList.add("active");

    // Ativa o painel correspondente
    const panel = document.getElementById(`panel-${tab}`);
    if (panel) panel.classList.add("active");

    if (tab === "preview") updatePreview();
}

function updatePreview() {
    if (!currentItem) return;
    const iframe = document.getElementById("preview-iframe");
    const seg = currentItem.segment[0] || "EF2";
    const discipline = currentItem.discipline || document.getElementById("filter-discipline")?.value;
    const disciplineLink =
        discipline && ["EF1", "EF2", "EM", "EXT"].includes(seg)
            ? `<link rel="stylesheet" href="/geral/css/${seg}/disciplinas/${discipline}.css">`
            : "";
    const previewCode = currentItem.code
        .replaceAll("/resources/image/", "/geral/image/")
        .replaceAll("resources/image/", "/geral/image/");
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="/geral/css/html5reset.css">
            <link rel="stylesheet" href="/geral/css/bootstrap.css">
            <link rel="stylesheet" href="/geral/css/geral.css">
            <link rel="stylesheet" href="/geral/css/geral1024.css">
            <link rel="stylesheet" href="/geral/css/geral640.css">
            ${disciplineLink}
            <style>
                body { padding: 40px; background: white; font-family: sans-serif; min-height: 100vh; color: #333; }
                body::before {
                    content: "MOCKUP LD - SEGMENTO: ${seg}";
                    position: fixed; top: 0; left:0; right:0;
                    background: #f1f5f9; color: #94a3b8;
                    font-size: 10px; padding: 4px 10px;
                    border-bottom: 1px solid #e2e8f0;
                    z-index: 9999;
                    letter-spacing: 1px;
                }
            </style>
        </head>
        <body class="segmento-${seg.toLowerCase()}">
            <div class="container-fluid">
                ${previewCode}
            </div>
        </body>
        </html>
    `;
    iframe.srcdoc = html;
}

function copySnippetCode() {
    navigator.clipboard.writeText(currentItem.code).then(() => {
        const btn = document.querySelector('.btn-primary[onclick="copySnippetCode()"]');
        const origText = btn.innerText;
        btn.innerText = "Copiado!";
        btn.style.background = "var(--success)";
        setTimeout(() => {
            btn.innerText = origText;
            btn.style.background = "var(--accent)";
        }, 2000);
    });
}

function requestAccess(action) {
    currentAction = action;
    if (sessionStorage.getItem("LD_ADMIN_AUTH") === "true") {
        executeAdminAction(action);
    } else {
        document.getElementById("access-pw-input").value = "";
        openModal("modal-password");
        setTimeout(() => document.getElementById("access-pw-input").focus(), 100);
    }
}

function executeAdminAction(action) {
    if (action === "create") openEditorModal();
    else if (action === "edit") openEditEditor();
    else if (action === "delete") deleteCurrentSnippet();
}

function verifyAccess() {
    const pw = document.getElementById("access-pw-input").value.trim();
    if (pw.toUpperCase() === ACCESS_PASSWORD) {
        sessionStorage.setItem("LD_ADMIN_AUTH", "true");
        closeModal("modal-password");
        const action = currentAction;
        currentAction = null;
        executeAdminAction(action);
    } else {
        alert("Acesso negado. Senha incorreta!");
        document.getElementById("access-pw-input").value = "";
        document.getElementById("access-pw-input").focus();
    }
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function openEditorModal() {
    document.getElementById("modal-title").innerText = "Adicionar Novo Snippet";
    document.getElementById("f-id").value = "";
    document.getElementById("f-title").value = "";
    document.getElementById("f-type").value = "Estrutura";
    document.getElementById("f-desc").value = "";
    document.getElementById("f-discipline").value = "";
    document.getElementById("f-tags").value = "";
    document.getElementById("f-code").value = "";
    document.getElementById("f-notes").value = "";

    // Reseta segmentos
    document.querySelectorAll(".f-seg-checkbox").forEach((cb) => (cb.checked = false));

    openModal("modal-editor");
}

function openEditEditor() {
    if (!currentItem) return;
    document.getElementById("modal-title").innerText = "Editar Snippet Existente";
    document.getElementById("f-id").value = currentItem.id;
    document.getElementById("f-title").value = currentItem.title;
    document.getElementById("f-type").value = currentItem.type;
    document.getElementById("f-desc").value = currentItem.desc;
    document.getElementById("f-discipline").value = currentItem.discipline || "";
    document.getElementById("f-tags").value = currentItem.tags.join(", ");
    document.getElementById("f-code").value = currentItem.code;
    document.getElementById("f-notes").value = currentItem.notes.join("\n");

    // Marca os segmentos salvos
    document.querySelectorAll(".f-seg-checkbox").forEach((cb) => {
        cb.checked = currentItem.segment.includes(cb.value);
    });

    openModal("modal-editor");
}

async function saveSnippet() {
    const id = document.getElementById("f-id").value || "sn-" + Date.now();

    // Captura segmentos selecionados
    const selectedSegs = Array.from(document.querySelectorAll(".f-seg-checkbox:checked")).map((cb) => cb.value);

    const data = {
        id,
        title: document.getElementById("f-title").value || "Snippet Sem Título",
        type: document.getElementById("f-type").value,
        desc: document.getElementById("f-desc").value || "Nenhuma descrição fornecida.",
        discipline: document.getElementById("f-discipline").value || "",
        segment: selectedSegs,
        tags: document
            .getElementById("f-tags")
            .value.split(",")
            .map((t) => t.trim())
            .filter((t) => t),
        code: document.getElementById("f-code").value,
        notes: document
            .getElementById("f-notes")
            .value.split("\n")
            .map((n) => n.trim())
            .filter((n) => n),
    };
    const nextSnippets = [...snippets];
    const idx = nextSnippets.findIndex((s) => s.id === id);
    if (idx > -1) nextSnippets[idx] = data;
    else nextSnippets.push(data);
    const saved = await publishDataToNetlify(nextSnippets);
    if (!saved) return;
    snippets = nextSnippets;
    loadAndRefresh();
    closeModal("modal-editor");
    viewSnippet(id);
}

async function deleteCurrentSnippet() {
    if (!currentItem) return;
    const targetId = currentItem.id;
    const nextSnippets = snippets.filter((s) => s.id !== targetId);
    const saved = await publishDataToNetlify(nextSnippets);
    if (!saved) return;
    snippets = nextSnippets;
    currentItem = null;
    document.getElementById("content-view").classList.add("hidden");
    document.getElementById("empty-view").classList.remove("hidden");
    loadAndRefresh();
    alert("Snippet removido com sucesso!");
}

async function loadAndRefresh() {
    await loadSnippets();
    renderFilters();
    handleFilterChange();
}

async function publishDataToNetlify(nextSnippets = snippets) {
    const token = getNetlifyToken();
    if (!token) return false;

    try {
        const response = await fetch(NETLIFY_PUT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ snippets: nextSnippets }),
        });

        if (!response.ok) {
            const detail = await response.text();
            alert(`Falha ao publicar no Netlify (${response.status}). ${detail || ""}`);
            return false;
        }
        return true;
    } catch (error) {
        alert("Erro ao publicar no Netlify.");
        return false;
    }
}

async function fetchNetlifySnippets() {
    try {
        const response = await fetch(NETLIFY_GET_URL, { cache: "no-store" });
        if (!response.ok) {
            const detail = await response.text();
            console.error("Netlify GET error", response.status, detail);
            return null;
        }
        const payload = await response.json();
        if (!payload || !Array.isArray(payload.snippets)) return null;
        if (payload.snippets.length === 0) return null;
        return payload.snippets;
    } catch (error) {
        return null;
    }
}

function getNetlifyToken() {
    const cached = sessionStorage.getItem("LD_NETLIFY_TOKEN");
    if (cached) return cached;
    const token = prompt("Token Netlify (ADMIN_TOKEN):");
    if (!token) return null;
    sessionStorage.setItem("LD_NETLIFY_TOKEN", token);
    return token;
}

window.publishDataToNetlify = publishDataToNetlify;
window.requestAccess = requestAccess;

function clearFilters() {
    document.getElementById("global-search").value = "";
    document.querySelectorAll(".tag-item.active").forEach((el) => el.classList.remove("active"));
    handleFilterChange();
}

function goUp() {
    document.querySelector("#list-col .column-content").scrollTo({ top: 0, behavior: "smooth" });
}
