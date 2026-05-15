// api/clickup-pages.js
const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
const WORKSPACE_ID = "9017068887";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!CLICKUP_TOKEN) {
    return res.status(500).json({ error: "CLICKUP_TOKEN nao configurado" });
  }

  const { docId, pageIds } = req.query;
  if (!docId || !pageIds) {
    return res.status(400).json({ error: "docId e pageIds sao obrigatorios" });
  }

  const ids = pageIds.split(",").filter(Boolean);

  try {
    // ClickUp v3 API — correct endpoint
    const url = "https://api.clickup.com/api/v3/workspaces/" + WORKSPACE_ID + "/docs/" + docId + "/pages?content_format=text/md&max_page_depth=-1";
    
    const r = await fetch(url, {
      headers: { Authorization: CLICKUP_TOKEN },
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("ClickUp error:", r.status, text);
      return res.status(r.status).json({ error: text });
    }

    const data = await r.json();
    
    // Filter only the requested page IDs
    const pages = (data.pages || []).filter(p => ids.includes(p.id));
    
    return res.status(200).json({ pages });
  } catch (err) {
    console.error("clickup-pages error:", err);
    return res.status(500).json({ error: err.message });
  }
};
