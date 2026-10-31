// n8n Code node: "Parse AI"
// Mode: Run Once for Each Item | Language: JavaScript
// Turns the Gemini text reply into real fields and merges the original account row.

const j = $json;

const raw =
  j.content?.parts?.[0]?.text ||
  j.candidates?.[0]?.content?.parts?.[0]?.text ||
  j.output ||
  j.text ||
  "{}";

let ai;
try {
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  ai = JSON.parse(text.replace(/```json|```/g, "").trim());
} catch (e) {
  // Safe fallback so one unreadable reply cannot stop the whole run
  ai = { score: 60, risk_summary: "Parse error", retention_playbook: "", upsell_angle: "" };
}

const row = $('Mock Data').item.json;

return { json: { ...row, ...ai, score: Number(ai.score) } };
