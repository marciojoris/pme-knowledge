import { useState, useRef, useEffect, useCallback } from "react";

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = {
  orange: "#E8860A", orangeLt: "#FDF3E3", orangeMd: "#F5A623",
  green: "#27AE60", greenLt: "#E9F7EF", greenDk: "#1e8449",
  red: "#e74c3c", redLt: "#fdedec",
  gray900: "#1A1A2E", gray700: "#3D3D5C", gray500: "#6B6B8A",
  gray300: "#C8C8D8", gray200: "#E8E8F0", gray100: "#F4F4F8",
  white: "#FFFFFF", sidebar: "#1E1E2F", sidebarHover: "#2A2A42",
};

// ─── Doc/Page map ─────────────────────────────────────────────────────────────
const DOCS = {
  "8cqb3aq-212717": { name: "Federal", folder: "Tributário" },
  "8cqb3aq-212737": { name: "Estadual", folder: "Tributário" },
  "8cqb3aq-212757": { name: "Reforma Tributária", folder: "Tributário" },
  "8cqb3aq-212797": { name: "Valuation", folder: "Financeiro" },
  "8cqb3aq-212817": { name: "Prestação de contas", folder: "Legal e Jurídico" },
  "8cqb3aq-212837": { name: "Piso mínimo do frete", folder: "Operacional do Transporte" },
  "8cqb3aq-217277": { name: "Casos reais", folder: "Perguntas e Respostas" },
};

const TREE = [
  { folder: "Tributário", icon: "📊", id: "f-trib", docs: [
    { id: "8cqb3aq-212717", name: "Federal", pages: [
      { pageId: "8cqb3aq-13417", name: "IRPJ e CSLL" },
      { pageId: "8cqb3aq-13397", name: "PIS e COFINS", children: [
        { pageId: "8cqb3aq-13437", name: "Imunidade na cadeia de exportação", children: [
          { pageId: "8cqb3aq-13737", name: "Conceitos básicos e legais" }
        ]},
        { pageId: "8cqb3aq-13457", name: "Insumos", children: [
          { pageId: "8cqb3aq-14497", name: "Créditos sobre combustíveis (Refinaria)" }
        ]},
        { pageId: "8cqb3aq-13617", name: "Exclusão ICMS ST da Base de Cálculo" },
      ]},
    ]},
    { id: "8cqb3aq-212737", name: "Estadual", pages: [
      { pageId: "8cqb3aq-13517", name: "ICMS", children: [
        { pageId: "8cqb3aq-13537", name: "PR", children: [{ pageId: "8cqb3aq-13577", name: "Resumo Operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13757", name: "SP", children: [{ pageId: "8cqb3aq-13777", name: "Resumo Operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-14017", name: "SC", children: [{ pageId: "8cqb3aq-14037", name: "Resumo operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13977", name: "RS", children: [{ pageId: "8cqb3aq-13997", name: "Resumo operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13937", name: "GO", children: [{ pageId: "8cqb3aq-13957", name: "Resumo operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13897", name: "PA", children: [{ pageId: "8cqb3aq-13917", name: "Resumo operacional ICMS no Transporte" }] },
      ]},
      { pageId: "8cqb3aq-13657", name: "IPVA", children: [
        { pageId: "8cqb3aq-13677", name: "TO", children: [{ pageId: "8cqb3aq-13717", name: "Isenção" }] }
      ]},
    ]},
    { id: "8cqb3aq-212757", name: "Reforma Tributária", pages: [{ pageId: "8cqb3aq-13637", name: "Reforma Tributária" }] },
  ]},
  { folder: "Financeiro", icon: "💰", id: "f-fin", docs: [
    { id: "8cqb3aq-212797", name: "Valuation", pages: [
      { pageId: "8cqb3aq-14057", name: "Valuation" },
      { pageId: "8cqb3aq-14097", name: "Conceitos" },
      { pageId: "8cqb3aq-14157", name: "Metodologias de Valuations" },
    ]},
  ]},
  { folder: "Legal e Jurídico", icon: "⚖️", id: "f-legal", docs: [
    { id: "8cqb3aq-212817", name: "Prestação de contas", pages: [{ pageId: "8cqb3aq-14117", name: "Prestação de contas" }] },
  ]},
  { folder: "Operacional do Transporte", icon: "🚛", id: "f-oper", docs: [
    { id: "8cqb3aq-212837", name: "Piso mínimo do frete", pages: [{ pageId: "8cqb3aq-14137", name: "Piso mínimo do frete" }] },
  ]},
  { folder: "Perguntas e Respostas", icon: "💬", id: "f-qa", docs: [
    { id: "8cqb3aq-217277", name: "Casos reais", pages: [{ pageId: "8cqb3aq-14397", name: "Perguntas e respostas de casos reais" }] },
  ]},
];

const ALL_DOCS = TREE.flatMap(f => f.docs);
function flattenPages(pages) { return pages.flatMap(p => [p, ...(p.children ? flattenPages(p.children) : [])]); }
function findDocForPage(pageId) { return ALL_DOCS.find(d => flattenPages(d.pages).some(p => p.pageId === pageId)); }
function cuUrl(docId, pageId) { return `https://app.clickup.com/9017068887/docs/${docId}/${pageId}`; }

// ─── API calls ────────────────────────────────────────────────────────────────
async function fetchPages(docId, pageIds) {
  const res = await fetch(`/api/clickup-pages?docId=${docId}&pageIds=${pageIds.join(",")}`);
  if (!res.ok) throw new Error(`ClickUp error ${res.status}`);
  return res.json();
}

async function askAI(body) {
  const res = await fetch("/api/ask", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  return res.json();
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function MdBlock({ text }) {
  const html = (text || "")
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:#1A1A2E">$1</strong>`)
    .replace(/\*(.+?)\*/g, `<em>$1</em>`)
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" target="_blank" style="color:#E8860A">$1</a>`);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function RenderMd({ content }) {
  if (!content?.trim()) return <p style={{ color: B.gray500, fontSize: 13 }}>Sem conteúdo para esta página.</p>;
  return (
    <div>
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 17, fontWeight: 700, color: B.gray900, margin: "22px 0 10px", paddingBottom: 8, borderBottom: `2px solid ${B.orange}` }}><MdBlock text={line.slice(3)} /></h2>;
        if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: B.gray900, margin: "18px 0 7px", display: "flex", alignItems: "center", gap: 6 }}><MdBlock text={line.slice(4)} /></h3>;
        if (line.startsWith("# ")) return <h1 key={i} style={{ fontSize: 19, fontWeight: 700, color: B.gray900, margin: "24px 0 12px" }}><MdBlock text={line.slice(2)} /></h1>;
        if (line.match(/^[-*]\s+/) && !line.startsWith("* * *")) {
          const indent = (line.match(/^(\s*)/)[1].length / 2);
          return <div key={i} style={{ display: "flex", gap: 8, padding: "2px 0", paddingLeft: indent * 14 }}><span style={{ color: B.orange, flexShrink: 0, marginTop: 3 }}>•</span><span style={{ fontSize: 13, lineHeight: 1.75, color: B.gray700 }}><MdBlock text={line.replace(/^[\s\-*]+/, "")} /></span></div>;
        }
        if (line.match(/^\d+\.\s/)) return <div key={i} style={{ display: "flex", gap: 8, padding: "2px 0" }}><span style={{ color: B.orange, flexShrink: 0, fontWeight: 600, fontSize: 13 }}>{line.match(/^(\d+)\./)[1]}.</span><span style={{ fontSize: 13, lineHeight: 1.75, color: B.gray700 }}><MdBlock text={line.replace(/^\d+\.\s+/, "")} /></span></div>;
        if (line.match(/^---+$/) || line === "* * *") return <hr key={i} style={{ border: "none", borderTop: `1px solid ${B.gray200}`, margin: "16px 0" }} />;
        if (line.match(/^\|.+\|$/)) return <div key={i} style={{ overflowX: "auto", margin: "2px 0" }}><p style={{ fontSize: 12, color: B.gray700, fontFamily: "monospace", background: B.gray100, padding: "5px 10px", borderRadius: 4, whiteSpace: "pre" }}><MdBlock text={line} /></p></div>;
        if (line.trim() === "") return <div key={i} style={{ height: 5 }} />;
        return <p key={i} style={{ fontSize: 13, lineHeight: 1.8, color: B.gray700, margin: "3px 0" }}><MdBlock text={line} /></p>;
      })}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function PageNode({ page, depth, onSelect, selectedId }) {
  const [open, setOpen] = useState(depth < 1);
  const has = page.children?.length > 0;
  const sel = selectedId === page.pageId;
  return (
    <div>
      <div onClick={() => { onSelect(page); if (has) setOpen(o => !o); }}
        style={{ display: "flex", alignItems: "center", gap: 5, padding: `5px 10px 5px ${14 + depth * 12}px`, borderRadius: 4, cursor: "pointer", background: sel ? B.orange : "transparent", color: sel ? B.white : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: sel ? 600 : 400, borderLeft: sel ? `3px solid ${B.orangeMd}` : "3px solid transparent", transition: "all .12s" }}
        onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = B.sidebarHover; e.currentTarget.style.color = B.white; } }}
        onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; } }}>
        {has ? <span style={{ fontSize: 8, opacity: .7, transform: open ? "rotate(90deg)" : "rotate(0)", display: "inline-block", transition: "transform .15s", flexShrink: 0 }}>▶</span> : <span style={{ width: 10, flexShrink: 0 }} />}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.name}</span>
      </div>
      {has && open && page.children.map(c => <PageNode key={c.pageId} page={c} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />)}
    </div>
  );
}

function Sidebar({ onSelectPage, selectedPage, visible }) {
  const [openFolders, setOpenFolders] = useState(Object.fromEntries(TREE.map(f => [f.id, true])));
  const [openDocs, setOpenDocs] = useState({});
  const [search, setSearch] = useState("");
  if (!visible) return null;
  const match = n => !search || n.toLowerCase().includes(search.toLowerCase());
  return (
    <div style={{ width: 235, minWidth: 235, background: B.sidebar, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.orange }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Base de Conhecimento</span>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar na base..."
            style={{ width: "100%", padding: "7px 10px 7px 28px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: B.white, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
        </div>
      </div>
      <div style={{ padding: "8px 6px", flex: 1 }}>
        {TREE.map(folder => {
          const filteredDocs = folder.docs.filter(doc => match(doc.name) || flattenPages(doc.pages).some(p => match(p.name)));
          if (search && !filteredDocs.length) return null;
          return (
            <div key={folder.id} style={{ marginBottom: 3 }}>
              <div onClick={() => setOpenFolders(p => ({ ...p, [folder.id]: !p[folder.id] }))}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 5, cursor: "pointer", color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.background = B.sidebarHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 13 }}>{folder.icon}</span>
                <span style={{ flex: 1 }}>{folder.folder}</span>
                <span style={{ fontSize: 8, opacity: .45, transform: openFolders[folder.id] ? "rotate(90deg)" : "rotate(0)", display: "inline-block", transition: "transform .15s" }}>▶</span>
              </div>
              {(openFolders[folder.id] || search) && filteredDocs.map(doc => (
                <div key={doc.id} style={{ marginLeft: 6 }}>
                  <div onClick={() => setOpenDocs(p => ({ ...p, [doc.id]: p[doc.id] === false ? true : false }))}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 4, cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 12 }}
                    onMouseEnter={e => { e.currentTarget.style.background = B.sidebarHover; e.currentTarget.style.color = B.white; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
                    <span style={{ fontSize: 10 }}>📄</span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{doc.name}</span>
                    <span style={{ fontSize: 8, opacity: .4, transform: openDocs[doc.id] !== false ? "rotate(90deg)" : "rotate(0)", display: "inline-block", transition: "transform .15s" }}>▶</span>
                  </div>
                  {openDocs[doc.id] !== false && doc.pages.map(p => <PageNode key={p.pageId} page={p} depth={2} onSelect={onSelectPage} selectedId={selectedPage?.pageId} />)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
        PME · {ALL_DOCS.length} documentos
      </div>
    </div>
  );
}

// ─── Content Viewer ───────────────────────────────────────────────────────────
function ContentViewer({ page, onAskAboutPage }) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const prevId = useRef(null);

  const load = useCallback(async (p) => {
    const doc = findDocForPage(p.pageId);
    if (!doc) { setStatus("error"); return; }
    setStatus("loading"); setContent(null);
    try {
      const data = await fetchPages(doc.id, [p.pageId]);
      const pg = data?.pages?.[0];
      setContent(pg || null);
      setStatus(pg ? "ok" : "empty");
    } catch { setStatus("error"); }
  }, []);

  useEffect(() => {
    if (!page || page.pageId === prevId.current) return;
    prevId.current = page.pageId;
    load(page);
  }, [page, load]);

  if (!page) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: B.gray100, gap: 14 }}>
      <div style={{ fontSize: 48 }}>📚</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: B.gray700 }}>Base de Estudos e Conhecimento</div>
      <div style={{ fontSize: 13, color: B.gray500, textAlign: "center", maxWidth: 300, lineHeight: 1.7 }}>Selecione uma página na barra lateral ou use o <strong>Assistente IA</strong> para buscar em toda a base</div>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {["ICMS no PR", "Valuation", "Piso mínimo do frete"].map(t => (
          <span key={t} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 99, background: B.orangeLt, color: B.orange, border: `1px solid ${B.orangeMd}`, fontWeight: 500 }}>{t}</span>
        ))}
      </div>
    </div>
  );

  const doc = findDocForPage(page.pageId);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: B.white }}>
      {/* Header */}
      <div style={{ padding: "13px 24px", borderBottom: `3px solid ${B.orange}`, background: B.white, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: B.gray900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.name}</div>
          <div style={{ fontSize: 11, color: B.gray500, marginTop: 2 }}>{doc?.name} · Base de Conhecimento PME</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onAskAboutPage(page)}
            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 5, border: `1px solid ${B.orange}`, color: B.orange, background: B.orangeLt, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
            ✦ Perguntar sobre esta página
          </button>
          <a href={cuUrl(doc?.id, page.pageId)} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 5, border: `1px solid ${B.gray300}`, color: B.gray700, background: B.gray100, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            Abrir no ClickUp ↗
          </a>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        {status === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, gap: 14 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[0, .2, .4].map((d, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: B.orange, display: "inline-block", animation: `pulse 1.1s ${d}s infinite` }} />)}
            </div>
            <div style={{ fontSize: 13, color: B.gray500 }}>Carregando do ClickUp...</div>
          </div>
        )}
        {status === "error" && (
          <div style={{ padding: 16, borderRadius: 6, background: B.redLt, border: `1px solid ${B.red}`, color: B.red, fontSize: 13 }}>
            ⚠️ Erro ao carregar o conteúdo. Verifique a configuração do servidor.
          </div>
        )}
        {status === "ok" && content && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 14, borderBottom: `1px solid ${B.gray200}` }}>
              <div style={{ width: 4, height: 18, background: B.orange, borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: B.gray500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Conteúdo · {content.name || page.name}</span>
              {content.date_updated && (
                <span style={{ marginLeft: "auto", fontSize: 10, color: B.gray300 }}>
                  Atualizado {new Date(content.date_updated).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
            <RenderMd content={content.content} />
          </>
        )}
        {status === "empty" && (
          <div style={{ padding: 20, borderRadius: 8, background: B.gray100, border: `1px solid ${B.gray300}`, color: B.gray500, fontSize: 13, textAlign: "center" }}>
            Esta página ainda não tem conteúdo no ClickUp.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: "📊", text: "Como funciona o ICMS no transporte no PR?" },
  { icon: "💰", text: "Quais créditos de PIS/COFINS sobre insumos?" },
  { icon: "🌍", text: "O que é imunidade na cadeia de exportação?" },
  { icon: "📈", text: "Quais metodologias de valuation existem?" },
  { icon: "🚛", text: "Como funciona o piso mínimo do frete?" },
  { icon: "⚖️", text: "O que é aprovação anual de contas?" },
];

function ChatPanel({ selectedPage, onSelectPage }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Olá! Sou o assistente da base de conhecimento PME. Posso responder perguntas sobre tributário, ICMS por estado, valuation, frete e mais — sempre com base nos documentos da base.",
    sources: []
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBase, setLoadingBase] = useState(false);
  const bottomRef = useRef(null);
  const prevPageId = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (selectedPage && selectedPage.pageId !== prevPageId.current) {
      prevPageId.current = selectedPage.pageId;
      setMessages(prev => [...prev, {
        role: "assistant", isNav: true,
        content: `Contexto definido: "${selectedPage.name}". Suas próximas perguntas serão respondidas com prioridade nesta página.`,
        sources: [{ name: selectedPage.name, pageId: selectedPage.pageId }]
      }]);
    }
  }, [selectedPage]);

  async function loadAllContent() {
    setLoadingBase(true);
    const allPages = [];
    for (const doc of ALL_DOCS) {
      try {
        const pageIds = flattenPages(doc.pages).map(p => p.pageId);
        const data = await fetchPages(doc.id, pageIds);
        if (data?.pages) {
          allPages.push(...data.pages.map(p => ({ ...p, docName: doc.name })));
        }
      } catch { /* skip */ }
    }
    setLoadingBase(false);
    return allPages;
  }

  async function send(overrideQ) {
    const q = (overrideQ || input).trim();
    if (!q || loading) return;
    setInput(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: q }, { role: "loading", content: "Buscando na base de conhecimento..." }]);

    try {
      // Load all docs content fresh from ClickUp
      setMessages(prev => prev.map(m => m.role === "loading" ? { ...m, content: "Carregando documentos do ClickUp..." } : m));
      const allPages = await loadAllContent();

      setMessages(prev => prev.map(m => m.role === "loading" ? { ...m, content: "Analisando conteúdo relevante..." } : m));

      // Build context
      const context = allPages
        .filter(p => p.content?.trim())
        .map(p => `### ${p.docName} › ${p.name}\n${p.content}`)
        .join("\n\n---\n\n");

      setMessages(prev => prev.map(m => m.role === "loading" ? { ...m, content: "Elaborando resposta..." } : m));

      const data = await askAI({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `Você é o assistente da base de estudos e conhecimento PME da RumoBrasil, especializado em tributário, transporte e finanças.

Responda EXCLUSIVAMENTE com base no conteúdo dos documentos fornecidos.
Se a informação não estiver nos documentos, diga claramente que não encontrou.
Seja objetivo, claro e profissional em português brasileiro.
Quando citar uma fonte específica, mencione o nome da seção.
Não use headings markdown (##) na resposta — use parágrafos e listas simples.
${selectedPage ? `\nO usuário está com foco na página: "${selectedPage.name}".` : ""}`,
        messages: [{ role: "user", content: `BASE DE CONHECIMENTO PME:\n\n${context}\n\n---\n\nPergunta: ${q}` }]
      });

      const answer = data.content?.find(b => b.type === "text")?.text || "Não consegui gerar uma resposta.";

      // Find relevant sources
      const relevant = allPages
        .filter(p => p.content?.trim() && answer.toLowerCase().includes(p.name.toLowerCase().slice(0, 8)))
        .slice(0, 4)
        .map(p => ({ name: p.name, pageId: p.id, docId: p.doc_id }));

      setMessages(prev => prev.filter(m => m.role !== "loading").concat({ role: "assistant", content: answer, sources: relevant }));
    } catch (err) {
      setMessages(prev => prev.filter(m => m.role !== "loading").concat({
        role: "assistant", content: `Erro ao consultar: ${err.message}. Verifique a configuração do servidor.`, sources: []
      }));
    }
    setLoading(false);
  }

  return (
    <div style={{ width: 380, minWidth: 320, display: "flex", flexDirection: "column", borderLeft: `1px solid ${B.gray200}`, background: B.gray100 }}>
      {/* Header */}
      <div style={{ padding: "13px 16px", borderBottom: `3px solid ${B.orange}`, background: B.white, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: B.orangeLt, border: `1px solid ${B.orangeMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.gray900 }}>Assistente <span style={{ color: B.orange }}>PME</span></div>
          <div style={{ fontSize: 10, color: B.gray500 }}>
            {selectedPage
              ? <><span style={{ color: B.green }}>●</span> Contexto: {selectedPage.name}</>
              : "Busca em toda a base de conhecimento"}
          </div>
        </div>
        {loadingBase && <div style={{ fontSize: 10, color: B.orange, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> atualizando
        </div>}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px", display: "flex", flexDirection: "column" }}>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.gray500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 3, height: 10, background: B.orange, borderRadius: 2 }} /> Perguntas frequentes
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {SUGGESTIONS.map(({ icon, text }) => (
                <button key={text} onClick={() => send(text)}
                  style={{ textAlign: "left", fontSize: 11, padding: "9px 10px", borderRadius: 6, border: `1px solid ${B.gray200}`, background: B.white, color: B.gray700, cursor: "pointer", lineHeight: 1.45, fontFamily: "inherit", display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <span>{text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => {
          if (msg.role === "user") return (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <div style={{ background: B.orange, color: B.white, borderRadius: "12px 12px 3px 12px", padding: "9px 14px", maxWidth: "82%", fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>{msg.content}</div>
            </div>
          );
          if (msg.role === "loading") return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: 5, background: B.orangeLt, border: `1px solid ${B.orangeMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>✦</div>
              <div style={{ background: B.white, border: `1px solid ${B.gray300}`, borderRadius: "3px 12px 12px 12px", padding: "9px 14px", fontSize: 12, color: B.gray500, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", gap: 3 }}>{[0, .18, .36].map((d, idx) => <span key={idx} style={{ animation: `pulse 1.1s ${d}s infinite`, fontSize: 7, color: B.orange }}>●</span>)}</span>
                {msg.content}
              </div>
            </div>
          );
          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 5, background: msg.isNav ? B.greenLt : B.orangeLt, border: `1px solid ${msg.isNav ? B.green : B.orangeMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                {msg.isNav ? "📄" : "✦"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ background: B.white, border: `1px solid ${B.gray200}`, borderLeft: `3px solid ${msg.isNav ? B.green : B.orange}`, borderRadius: "0 10px 10px 10px", padding: "10px 14px", fontSize: 13, lineHeight: 1.75, color: B.gray900 }}>
                  {msg.content}
                </div>
                {msg.sources?.length > 0 && (
                  <div style={{ marginTop: 7, display: "flex", flexWrap: "wrap", gap: 5 }}>
                    <span style={{ fontSize: 10, color: B.gray400, alignSelf: "center", fontWeight: 600, textTransform: "uppercase" }}>Fonte:</span>
                    {msg.sources.map((s, idx) => (
                      <button key={idx} onClick={() => { const p = flattenPages(ALL_DOCS.flatMap(d => d.pages)).find(x => x.pageId === s.pageId); if (p) onSelectPage(p); }}
                        style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, border: `1px solid ${B.orangeMd}`, color: B.orange, background: B.orangeLt, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                        📄 {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px 16px", borderTop: `1px solid ${B.gray200}`, background: B.white }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={selectedPage ? `Pergunte sobre "${selectedPage.name}" ou qualquer tema da base...` : "Faça uma pergunta para toda a base..."}
            rows={2}
            style={{ flex: 1, padding: "9px 12px", borderRadius: 7, border: `1px solid ${B.gray300}`, fontSize: 13, lineHeight: 1.5, fontFamily: "inherit", color: B.gray900, background: B.gray100, resize: "none", outline: "none" }} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ height: 44, padding: "0 16px", borderRadius: 7, border: "none", background: loading || !input.trim() ? B.gray300 : B.orange, color: B.white, fontSize: 14, fontWeight: 700, cursor: loading || !input.trim() ? "default" : "pointer", fontFamily: "inherit", transition: "background .15s" }}>
            {loading ? "..." : "↑"}
          </button>
        </div>
        <div style={{ fontSize: 10, color: B.gray300, marginTop: 6, textAlign: "center" }}>
          Busca em tempo real em todos os documentos do ClickUp
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedPage, setSelectedPage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  function handleSelectPage(p) { setSelectedPage(p); setActiveTab("content"); }
  function handleAskAbout(p) { setSelectedPage(p); setActiveTab("chat"); }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { border-color: ${B.orange} !important; box-shadow: 0 0 0 2px ${B.orangeLt}; }
        input:focus { border-color: ${B.orange} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${B.gray300}; border-radius: 2px; }
      `}</style>

      {/* Top bar */}
      <div style={{ height: 50, background: B.gray900, display: "flex", alignItems: "center", padding: "0 18px", gap: 12, flexShrink: 0, borderBottom: `2px solid ${B.orange}` }}>
        <button onClick={() => setSidebarOpen(o => !o)}
          style={{ width: 32, height: 32, borderRadius: 5, border: "1px solid rgba(255,255,255,0.15)", background: sidebarOpen ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "rgba(255,255,255,0.7)" }}>
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: B.orange }}>PME</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 5 }}>Base de Estudos e Conhecimento</span>
        </div>
        {selectedPage && (
          <>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedPage.name}</span>
          </>
        )}
        {/* Tab switcher */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: "rgba(255,255,255,0.08)", borderRadius: 7, padding: 3 }}>
          {[{ id: "content", label: "📄 Conteúdo" }, { id: "chat", label: "✦ Assistente IA" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ fontSize: 11, padding: "5px 14px", borderRadius: 5, border: "none", background: activeTab === tab.id ? B.orange : "transparent", color: activeTab === tab.id ? B.white : "rgba(255,255,255,0.55)", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all .15s" }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: 8 }}>RumoBrasil</div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Sidebar onSelectPage={handleSelectPage} selectedPage={selectedPage} visible={sidebarOpen} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, display: activeTab === "content" ? "flex" : "none", overflow: "hidden" }}>
            <ContentViewer page={selectedPage} onAskAboutPage={handleAskAbout} />
          </div>
          <div style={{ flex: 1, display: activeTab === "chat" ? "flex" : "none", overflow: "hidden" }}>
            <ChatPanel selectedPage={selectedPage} onSelectPage={handleSelectPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
