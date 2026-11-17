/* Beracah Impex FZCO — site behaviour */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const WA_NUMBER = "971558440982";
  const EMAIL = "info@beracahimpex.com";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PRODUCTS = window.PRODUCTS || [];
  const DIVISIONS = window.DIVISIONS || {};
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const UNITS = ["MT", "20ft containers", "40ft containers", "Cartons", "Pieces", "Litres"];
  const DEFAULT_UNIT = { food: "MT", build: "20ft containers", chem: "MT", auto: "Pieces" };

  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------------- Header & menu ---------------- */
  const header = $("[data-header]");
  const onScrollHeader = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  const toggle = $(".menu-toggle");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  };
  if (toggle) toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$(".mobile-nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------------- Quote basket (stored in the browser) ---------------- */
  const KEY = "beracah-quote-v1";
  let memory = [];
  const readItems = () => {
    try { const v = JSON.parse(window.localStorage.getItem(KEY)); return Array.isArray(v) ? v.filter((i) => byId[i.id]) : []; }
    catch (_) { return memory; }
  };
  let lastCount = readItems().length;
  const writeItems = (items) => {
    memory = items;
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (_) { /* storage unavailable */ }
    updateCount(true);
  };
  const Quote = {
    items: readItems,
    has: (id) => readItems().some((i) => i.id === id),
    add(id, qty = "", unit) {
      const items = readItems();
      const p = byId[id];
      if (!p) return;
      const existing = items.find((i) => i.id === id);
      if (existing) { if (qty) existing.qty = qty; if (unit) existing.unit = unit; }
      else items.push({ id, qty, unit: unit || DEFAULT_UNIT[p.division] || "MT" });
      writeItems(items);
    },
    update(id, patch) { writeItems(readItems().map((i) => (i.id === id ? { ...i, ...patch } : i))); },
    remove(id) { writeItems(readItems().filter((i) => i.id !== id)); },
    clear() { writeItems([]); }
  };
  function updateCount(animate) {
    const n = readItems().length;
    $$("[data-quote-count]").forEach((el) => {
      el.textContent = n;
      if (animate && n !== lastCount) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    lastCount = n;
  }
  updateCount(false);
  window.addEventListener("storage", (e) => { if (e.key === KEY) updateCount(false); });

  function fly(fromEl) {
    if (reduceMotion || !fromEl) return;
    const target = $$(".quote-pill").find((el) => el.offsetParent !== null);
    if (!target || !fromEl.getBoundingClientRect) return;
    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "fly-dot";
    dot.style.left = a.left + a.width / 2 - 7 + "px";
    dot.style.top = a.top + a.height / 2 - 7 + "px";
    document.body.appendChild(dot);
    const dx = b.left + b.width - 18 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = dot.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 90}px) scale(1.25)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.5)`, opacity: 0.2 }
    ], { duration: 780, easing: "cubic-bezier(.5,0,.3,1)" });
    anim.onfinish = () => dot.remove();
  }

  const tileHTML = (p) =>
    `<span class="tile" data-division="${p.division}" aria-hidden="true"><span class="tile-hs">${esc(p.hs)}</span><span class="tile-sym">${esc(p.sym)}</span></span>`;

  const addLabel = (id) => (Quote.has(id) ? `${ICON_CHECK}<span>In your quote</span>` : `${ICON_PLUS}<span>Add to quote</span>`);
  const refreshAddButtons = () => {
    $$("[data-add]").forEach((btn) => {
      const has = Quote.has(btn.dataset.add);
      btn.classList.toggle("added", has);
      btn.innerHTML = addLabel(btn.dataset.add);
    });
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.add;
    if (Quote.has(id)) { window.location.href = "/quote"; return; }
    Quote.add(id);
    fly(btn);
    refreshAddButtons();
  });

  /* ---------------- Home: division tiles & ticker ---------------- */
  $$("[data-division-tiles]").forEach((el) => {
    el.innerHTML = PRODUCTS.filter((p) => p.division === el.dataset.divisionTiles).map(tileHTML).join("");
  });

  const ticker = $("[data-ticker]");
  if (ticker) {
    const one = PRODUCTS.map((p) => `<span class="ticker-item"><b>${esc(p.sym)}</b>${esc(p.name)}<small>${esc(p.origin)}</small></span>`).join("");
    ticker.innerHTML = one + one;
  }

  /* ---------------- Voyage (scroll-linked process) ---------------- */
  const voyage = $("[data-voyage]");
  if (voyage) {
    const track = $(".voyage-track", voyage);
    const stops = $$(".voyage-stop", voyage);
    let ticking = false;
    const vertical = () => window.matchMedia("(max-width: 760px)").matches;
    const update = () => {
      ticking = false;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      let p = reduceMotion ? 1 : (vh * 0.78 - r.top) / (r.height + vh * 0.25);
      p = Math.max(0, Math.min(1, p));
      voyage.style.setProperty("--p", p.toFixed(4));
      stops.forEach((s) => {
        const pos = vertical() ? (s.offsetTop + 12) / track.offsetHeight : s.offsetLeft / track.offsetWidth;
        s.classList.toggle("reached", p >= pos - 0.005);
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    update();
  }

  /* ---------------- Products catalogue ---------------- */
  const catalogue = $("#catalogue");
  const cardHTML = (p, i = 0) => `
    <article class="product-card" data-division="${p.division}" style="animation-delay:${Math.min(i, 12) * 45}ms">
      <div class="pc-top">${tileHTML(p)}<span class="pc-division">${esc(DIVISIONS[p.division]?.short)}</span></div>
      <h3><a href="/product?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>
      <p class="pc-summary">${esc(p.summary)}</p>
      <dl class="pc-meta">
        <dt>Origin</dt><dd>${esc(p.origin)}</dd>
        <dt>Packing</dt><dd>${esc(p.packaging)}</dd>
        <dt>HS code</dt><dd>${esc(p.hs)}</dd>
      </dl>
      <div class="pc-actions"><button type="button" class="btn btn-small btn-outline add-btn" data-add="${p.id}">${addLabel(p.id)}</button></div>
    </article>`;

  if (catalogue) {
    const params = new URLSearchParams(window.location.search);
    let division = DIVISIONS[params.get("division")] ? params.get("division") : "all";
    let query = "";
    const filterBtns = $$("[data-filter]");
    const search = $("#product-search");
    const countEl = $("[data-result-count]");
    const render = () => {
      const q = query.trim().toLowerCase();
      const list = PRODUCTS.filter((p) => (division === "all" || p.division === division) &&
        (!q || [p.name, p.summary, p.origin, p.hs, ...(p.uses || [])].join(" ").toLowerCase().includes(q)));
      catalogue.innerHTML = list.length ? list.map(cardHTML).join("") :
        `<div class="empty-state"><h3>No products match “${esc(query)}”</h3><p>Try another word, or tell us what you need and we will source it for you.</p><a class="btn btn-navy" href="/quote">Describe what you need</a></div>`;
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === division)));
      if (countEl) countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
      refreshAddButtons();
    };
    filterBtns.forEach((b) => b.addEventListener("click", () => {
      division = b.dataset.filter;
      const url = new URL(window.location.href);
      if (division === "all") url.searchParams.delete("division"); else url.searchParams.set("division", division);
      history.replaceState(null, "", url);
      render();
    }));
    if (search) search.addEventListener("input", () => {
      query = search.value;
      if (query.trim() && division !== "all") {
        division = "all";
        const url = new URL(window.location.href); url.searchParams.delete("division"); history.replaceState(null, "", url);
      }
      render();
    });
    render();
  }

  /* ---------------- Product detail ---------------- */
  const detail = $("#product-detail");
  if (detail) {
    const id = new URLSearchParams(window.location.search).get("id");
    const p = byId[id];
    const set = (key, html) => $$(`[data-pd="${key}"]`).forEach((el) => (el.innerHTML = html));
    if (!p) {
      set("name", "Product not found");
      set("crumb", "Not found");
      set("summary", "This product may have been renamed or removed.");
      detail.innerHTML = `<div class="empty-state"><h3>We couldn't find that product</h3><p>Browse the full catalogue, or tell us what you need.</p><a class="btn btn-navy" href="/products">Browse products</a></div>`;
    } else {
      const div = DIVISIONS[p.division] || {};
      const accent = `var(--div-${p.division})`;
      document.title = `${p.name} | Beracah Impex FZCO`;
      const md = $('meta[name="description"]'); if (md) md.setAttribute("content", p.summary);
      set("name", esc(p.name));
      set("crumb", esc(p.name));
      set("summary", esc(p.summary));
      const divLink = $('[data-pd="division-link"]');
      if (divLink) { divLink.textContent = div.short || ""; divLink.href = `/products?division=${p.division}`; }
      const rows = [["Origin", p.origin], ["Packaging", p.packaging], ["Minimum order", p.moq], ["HS code (indicative)", p.hs], ...Object.entries(p.specs || {})];
      const waText = encodeURIComponent(`Hello Beracah Impex, I'd like a quotation for ${p.name}.`);
      const unitOpts = UNITS.map((u) => `<option${u === (DEFAULT_UNIT[p.division] || "MT") ? " selected" : ""}>${u}</option>`).join("");
      detail.innerHTML = `
        <div class="pd-grid">
          <div class="pd-visual" style="--accent:${accent}">
            <div class="pd-tile"><span class="hs">HS ${esc(p.hs)}</span><span class="sym">${esc(p.sym)}</span><span class="nm">${esc(div.short || "")}</span></div>
          </div>
          <div class="pd-body" style="--accent:${accent}">
            <div class="print-only print-head"><img src="/assets/img/logo-full-navy.svg" alt="Beracah Impex FZCO"><div>BERACAH IMPEX – FZCO<br>IFZA Business Park, Dubai Silicon Oasis, Dubai, UAE<br>+971 55 844 0982 · ${EMAIL}</div></div>
            <span class="pd-division"><i></i>${esc(div.name || "")}</span>
            <h2 class="print-only">${esc(p.name)}</h2>
            <p class="lead">${esc(p.description)}</p>
            <table class="spec-table"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>
            <p class="spec-note">${p.note ? esc(p.note) + " " : ""}Specifications shown are typical values. Final specifications are confirmed on the proforma invoice.</p>
            <h3 style="font-size:1.2rem;margin:28px 0 12px">Common uses</h3>
            <ul class="pd-uses">${(p.uses || []).map((u) => `<li>${esc(u)}</li>`).join("")}</ul>
            <div class="pd-order">
              <div class="field"><label for="pd-qty">Quantity</label><input id="pd-qty" type="number" min="0" step="any" inputmode="decimal" placeholder="e.g. 20"></div>
              <div class="field"><label for="pd-unit">Unit</label><select id="pd-unit">${unitOpts}</select></div>
              <button type="button" class="btn add-btn" id="pd-add">${Quote.has(p.id) ? ICON_CHECK + "<span>Update quote</span>" : ICON_PLUS + "<span>Add to quote</span>"}</button>
            </div>
            <div class="pd-secondary">
              <a class="text-link" href="https://wa.me/${WA_NUMBER}?text=${waText}" target="_blank" rel="noopener">Ask on WhatsApp</a>
              <button type="button" class="text-link" data-print>Print spec sheet</button>
            </div>
          </div>
        </div>`;
      const existing = Quote.items().find((i) => i.id === p.id);
      if (existing) { $("#pd-qty").value = existing.qty || ""; $("#pd-unit").value = existing.unit || $("#pd-unit").value; }
      $("#pd-add").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        Quote.add(p.id, $("#pd-qty").value, $("#pd-unit").value);
        fly(btn);
        btn.innerHTML = `${ICON_CHECK}<span>Added. View quote</span>`;
        btn.classList.add("added");
        btn.onclick = () => (window.location.href = "/quote");
      });
      const related = $("#related");
      if (related) {
        const others = PRODUCTS.filter((x) => x.division === p.division && x.id !== p.id).slice(0, 3);
        related.innerHTML = others.map(cardHTML).join("");
        refreshAddButtons();
      }
    }
  }

  document.addEventListener("click", (e) => { if (e.target.closest("[data-print]")) window.print(); });

  /* ---------------- Forms ---------------- */
  const fieldLabel = (form, name) => {
    const el = form.querySelector(`[name="${name}"]`);
    const lab = el && (form.querySelector(`label[for="${el.id}"]`) || el.closest(".field")?.querySelector(".label"));
    return lab ? lab.childNodes[0].textContent.trim() : name;
  };
  const collect = (form) => {
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (k === "website_url") return;
      if (data[k]) data[k] = [].concat(data[k], v); else data[k] = v;
    });
    return data;
  };
  const summaryText = (title, form, fields, items) => {
    const lines = [title, ""];
    Object.entries(fields).forEach(([k, v]) => { if (v && String(v).trim()) lines.push(`${fieldLabel(form, k)}: ${[].concat(v).join(", ")}`); });
    if (items && items.length) {
      lines.push("", "Products:");
      items.forEach((i) => lines.push(`- ${i.name}${i.qty ? `: ${i.qty} ${i.unit}` : ""}`));
    }
    return lines.join("\n");
  };
  const showStatus = (el, kind, html) => { el.className = `form-status show ${kind}`; el.innerHTML = html; el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); };

  async function submitForm(form, type, title, items) {
    const status = form.querySelector(".form-status");
    const btn = form.querySelector('button[type="submit"]');
    const fields = collect(form);
    const payload = { type, fields, items: items || [], page: window.location.pathname, honeypot: form.querySelector('[name="website_url"]')?.value || "" };
    const original = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = "<span>Sending…</span>";
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("send failed");
      return { ok: true, status };
    } catch (_) {
      const text = summaryText(title, form, fields, items);
      showStatus(status, "fail",
        `<strong>We couldn't send this online right now.</strong> Your details are still here. Send them to us directly instead:<br>
         <a class="btn btn-small" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Send by WhatsApp</a>
         <a class="btn btn-small btn-outline" href="mailto:${EMAIL}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}">Send by email</a>`);
      return { ok: false, status };
    } finally {
      btn.disabled = false; btn.innerHTML = original;
    }
  }

  /* Quote page */
  const quoteApp = $("#quote-app");
  if (quoteApp) {
    const list = $("#qi-list");
    const form = $("#quote-form");
    const renderItems = () => {
      const items = Quote.items();
      $$("[data-items-count]").forEach((el) => (el.textContent = items.length ? `${items.length} product${items.length === 1 ? "" : "s"} selected` : "No products selected yet"));
      if (!items.length) {
        list.innerHTML = `<li class="qi-empty"><p>Your quote is empty. Add products from the catalogue, or describe what you need in the form.</p><a class="btn btn-small btn-navy" href="/products">Browse products</a></li>`;
        return;
      }
      list.innerHTML = items.map((i) => {
        const p = byId[i.id];
        return `<li class="qi" data-id="${p.id}">
          ${tileHTML(p)}
          <div><a class="qi-name" href="/product?id=${encodeURIComponent(p.id)}" style="text-decoration:none">${esc(p.name)}</a>
            <div class="qi-controls">
              <input type="number" min="0" step="any" inputmode="decimal" placeholder="Qty" value="${esc(i.qty)}" aria-label="Quantity for ${esc(p.name)}" data-qty>
              <select aria-label="Unit for ${esc(p.name)}" data-unit>${UNITS.map((u) => `<option${u === i.unit ? " selected" : ""}>${u}</option>`).join("")}</select>
            </div></div>
          <button type="button" class="qi-remove" aria-label="Remove ${esc(p.name)}" data-remove>${ICON_X}</button>
        </li>`;
      }).join("");
    };
    list.addEventListener("input", (e) => {
      const li = e.target.closest(".qi"); if (!li) return;
      if (e.target.matches("[data-qty]")) Quote.update(li.dataset.id, { qty: e.target.value });
    });
    list.addEventListener("change", (e) => {
      const li = e.target.closest(".qi"); if (!li) return;
      if (e.target.matches("[data-unit]")) Quote.update(li.dataset.id, { unit: e.target.value });
    });
    list.addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove]"); if (!rm) return;
      const li = rm.closest(".qi");
      const done = () => { Quote.remove(li.dataset.id); renderItems(); };
      if (reduceMotion) done(); else li.animate([{ opacity: 1 }, { opacity: 0, transform: "translateX(20px)" }], { duration: 220 }).onfinish = done;
    });
    renderItems();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      const items = Quote.items().map((i) => ({ id: i.id, name: byId[i.id].name, qty: i.qty, unit: i.unit }));
      if (!items.length && !form.notes.value.trim()) {
        showStatus(status, "fail", "Add at least one product from the catalogue, or describe what you need in <strong>Notes</strong>.");
        form.notes.focus();
        return;
      }
      if (!form.reportValidity()) return;
      const r = await submitForm(form, "quote", "Quote request – Beracah Impex", items);
      if (r.ok) {
        showStatus(status, "ok", `<strong>Quote request sent.</strong> Thank you, ${esc(form.name.value.split(" ")[0])}. Our team will reply by email or WhatsApp, usually within one business day.`);
        Quote.clear(); renderItems(); form.reset();
      }
    });
  }

  /* Contact & supplier forms */
  $$("[data-api-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const type = form.dataset.apiForm;
      const title = type === "supplier" ? "Supplier registration – Beracah Impex" : "Website enquiry – Beracah Impex";
      const r = await submitForm(form, type, title, []);
      if (r.ok) {
        showStatus(r.status, "ok", type === "supplier"
          ? "<strong>Registration received.</strong> Our sourcing team will review your details and contact you if there is a fit."
          : "<strong>Message sent.</strong> We will reply by email or WhatsApp, usually within one business day.");
        form.reset();
      }
    });
  });
})();
