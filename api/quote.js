/*
  Vercel serverless function: receives quote requests, contact messages and
  supplier registrations from the website and emails them to the team.

  Uses Resend (https://resend.com) through its HTTP API, so no packages are needed.
  Set these Environment Variables in your Vercel project settings:

    RESEND_API_KEY   your Resend API key (required)
    MAIL_TO          where submissions go       (default: info@beracahimpex.com)
    MAIL_FROM        a sender on a domain you verified in Resend,
                     e.g. "Beracah Impex Website <website@beracahimpex.com>"

  Without RESEND_API_KEY the function answers 503 and the website automatically
  offers the visitor a WhatsApp or email button with their details pre-filled.
*/

const TITLES = {
  quote: "New quote request",
  contact: "New website message",
  supplier: "New supplier registration",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const label = (k) => k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  // Spam trap: real visitors never fill the hidden field.
  if (body.honeypot) return res.status(200).json({ ok: true });

  const type = TITLES[body.type] ? body.type : "contact";
  const fields = typeof body.fields === "object" && body.fields ? body.fields : {};
  const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];

  const email = String(fields.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "invalid_email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "not_configured" });

  const to = process.env.MAIL_TO || "info@beracahimpex.com";
  const from = process.env.MAIL_FROM || "Beracah Impex Website <onboarding@resend.dev>";

  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && String(v).trim() !== "")
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#5C6782;vertical-align:top">${esc(label(k))}</td><td style="padding:6px 0;color:#111E3C">${esc([].concat(v).join(", ")).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");

  const itemRows = items
    .map((i) => `<tr><td style="padding:6px 16px 6px 0;color:#111E3C">${esc(i.name)}</td><td style="padding:6px 0;color:#111E3C">${esc(i.qty || "–")} ${esc(i.qty ? i.unit : "")}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;max-width:640px">
      <h2 style="color:#111E3C;font-weight:normal;margin:0 0 16px">${TITLES[type]}</h2>
      ${items.length ? `<h3 style="color:#111E3C;margin:20px 0 8px;font-size:15px">Products</h3><table style="border-collapse:collapse">${itemRows}</table>` : ""}
      <h3 style="color:#111E3C;margin:20px 0 8px;font-size:15px">Details</h3>
      <table style="border-collapse:collapse">${rows}</table>
      <p style="color:#5C6782;font-size:12px;margin-top:24px">Sent from the website page ${esc(body.page || "")}. Reply to this email to answer the sender directly.</p>
    </div>`;

  const subjectName = fields.company || fields.name || email;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: email,
        subject: `${TITLES[type]}: ${String(subjectName).slice(0, 80)}`,
        html,
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error("Resend error", r.status, detail);
      return res.status(502).json({ error: "send_failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: "send_failed" });
  }
};
