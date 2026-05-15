// api/clickup-pages.js
const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;

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
    const results = await Promise.all(
      ids.map(async (pageId) => {
        const url = "https://api.clickup.com/api/v2/doc/" + docId + "/page/" + pageId + "?content_format=text/md";
        const r = await fetch(url, {
          headers: { Authorization: CLICKUP_TOKEN },
        });
        if (!r.ok) {
          console.error("ClickUp error " + r.status + " for page " + pageId);
          return null;
        }
        return r.json();
      })
    );

    const pages = results.filter(Boolean);
    return res.status(200).json({ pages });
  } catch (err) {
    console.error("clickup-pages error:", err);
    return res.status(500).json({ error: err.message });
  }
};
