// api/clickup-pages.js
// Vercel Serverless Function — proxy seguro para o ClickUp
// O token fica no servidor, nunca exposto ao browser

const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
const WORKSPACE_ID = "9017068887";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (!CLICKUP_TOKEN) return res.status(500).json({ error: "CLICKUP_TOKEN não configurado" });

  const { docId, pageIds } = req.query;
  if (!docId || !pageIds) return res.status(400).json({ error: "docId e pageIds são obrigatórios" });

  const ids = pageIds.split(",").filter(Boolean);

  try {
    const url = `https://api.clickup.com/api/v3/workspaces/${WORKSPACE_ID}/docs/${docId}/pages?` +
      `page_ids=${ids.join(",")}&content_format=text/md&max_page_depth=-1`;

    const response = await fetch(url, {
      headers: { Authorization: CLICKUP_TOKEN }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
