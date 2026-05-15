// api/ask.js
// Vercel Serverless Function — proxy para Anthropic API
// A chave da Anthropic fica no servidor, nunca exposta ao browser

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY não configurado" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// api/clickup-pages.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
  if (!CLICKUP_TOKEN) return res.status(500).json({ error: "CLICKUP_TOKEN não configurado" });

  const { docId, pageIds } = req.query;
  if (!docId || !pageIds) return res.status(400).json({ error: "docId e pageIds são obrigatórios" });

  const ids = pageIds.split(",").filter(Boolean);

  try {
    // ClickUp v2 API — fetch each page individually and combine
    const results = await Promise.all(ids.map(async (pageId) => {
      const url = `https://api.clickup.com/api/v2/doc/${docId}/page/${pageId}?content_format=text/md`;
      const r = await fetch(url, { headers: { Authorization: CLICKUP_TOKEN } });
      if (!r.ok) return null;
      return r.json();
    }));

    const pages = results.filter(Boolean);
    return res.status(200).json({ pages });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
