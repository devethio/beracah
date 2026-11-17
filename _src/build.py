#!/usr/bin/env python3
"""
Builds the static HTML pages for the Beracah Impex website.

Edit the page bodies in _src/pages/*.html and the shared header/footer below,
then run:   python _src/build.py
from the project root. The generated .html files are written to the project root.
Products are NOT built here: edit assets/js/products.js directly.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_src"
SITE_URL = "https://beracahimpex.com"
WA = "971558440982"

ICONS = {
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "shield": '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    "anchor": '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 11h8"/>',
    "factory": '<path d="M3 21V10l6 4v-4l6 4V5h6v16z"/><path d="M7 17h2M12 17h2M17 17h1"/>',
    "map": '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "pin": '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "clipboard": '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    "ship": '<path d="M3 15h18l-2 5H5z"/><path d="M6 15V9h4v6M10 15V7h4v8M14 15v-5h4v5"/>',
    "bank": '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    "doc": '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
}
WA_ICON = ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/>'
           '<path d="M16.6 14.2c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/></svg>')

def icon(name):
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>'

SHIP = ('<svg viewBox="0 0 80 42" fill="currentColor" aria-hidden="true">'
        '<path d="M2 25h70l7-1-9 12H11z"/>'
        '<rect x="12" y="16.5" width="10" height="8" opacity=".85"/><rect x="23" y="16.5" width="10" height="8" opacity=".65"/>'
        '<rect x="34" y="16.5" width="10" height="8" opacity=".85"/><rect x="45" y="16.5" width="7" height="8" opacity=".6"/>'
        '<rect x="17" y="8.5" width="10" height="7.5" opacity=".6"/><rect x="28" y="8.5" width="10" height="7.5" opacity=".85"/>'
        '<path d="M55 9h10v16H55z"/><rect x="58" y="3" width="3.5" height="6"/>'
        '<path d="M0 40c6-3 10 3 16 0s10-3 16 0 10 3 16 0 10-3 16 0 10 3 16 0" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.4"/></svg>')

# ---------------------------------------------------------------- hero map
def hero_map():
    m = json.loads((SRC / "map.json").read_text())
    dots = "".join(f'<path d="{b}"/>' for b in m["bands"])
    routes, cargo = [], []
    durations = {"china": 10, "indonesia": 9, "india": 6, "uae": 6.5}
    for k in ["china", "indonesia", "india", "uae"]:
        d = m["routes"][k]
        routes.append(f'<path class="route-glow r-{k}" pathLength="1" d="{d}"/>'
                      f'<path id="rt-{k}" class="route r-{k}" pathLength="1" d="{d}"/>')
        for off in (0, durations[k] / 2):
            begin = f"{3.2 + off:.1f}s"
            cargo.append(f'<g visibility="hidden"><circle class="cargo-glow" r="7"/><circle class="cargo" r="3.2"/>'
                         f'<set attributeName="visibility" to="visible" begin="{begin}" fill="freeze"/>'
                         f'<animateMotion dur="{durations[k]}s" begin="{begin}" repeatCount="indefinite" rotate="auto"><mpath href="#rt-{k}"/></animateMotion></g>')
    inland = m["routes"]["inland"]
    routes.append(f'<g class="inland-wrap"><path class="route r-inland" d="{inland}"/><path class="inland-dash" d="{inland}"/></g>')
    ports_cfg = {
        "china": (0.9, -12, -12, "end", ""), "indonesia": (1.15, 12, 22, "start", ""),
        "india": (1.4, 12, -10, "start", ""), "uae": (1.6, 12, -10, "start", ""),
        "djibouti": (2.9, 12, -12, "start", "hub"), "addis": (3.2, 12, 24, "start", "hub"),
    }
    ports = []
    for k, (delay, tx, ty, anchor, cls) in ports_cfg.items():
        p = m["ports"][k]
        ports.append(f'<g class="port {cls}" style="animation-delay:{delay}s" transform="translate({p["x"]} {p["y"]})">'
                     f'<circle class="ring" r="6" style="animation-delay:{delay}s"/><circle class="core" r="4.5"/>'
                     f'<text x="{tx}" y="{ty}" text-anchor="{anchor}">{p["n"]}</text></g>')
    return (f'<svg viewBox="0 0 {m["W"]} {m["H"]}" focusable="false">'
            f'<g class="map-dots">{dots}</g><g>{"".join(routes)}</g><g>{"".join(cargo)}</g><g>{"".join(ports)}</g></svg>')

# ---------------------------------------------------------------- layout
NAV = [("/products", "Products"), ("/services", "Services"), ("/about", "About"), ("/suppliers", "Suppliers"), ("/contact", "Contact")]

def header(active):
    links = "".join(f'<a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a>' for h, t in NAV)
    mobile = "".join(f'<a href="{h}">{t}</a>' for h, t in [("/", "Home")] + NAV)
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="Beracah Impex, home">
      <img src="/assets/img/logo-mark-light.svg" alt="" width="52" height="30">
      <span class="brand-text"><span class="brand-name">BERACAH</span><span class="brand-sub">IMPEX FZCO, DUBAI</span></span>
    </a>
    <nav class="nav" aria-label="Main">{links}</nav>
    <div class="header-actions">
      <a class="quote-pill" href="/quote" aria-label="Your quote">{icon("clipboard")}<span class="ql">Your quote</span><span class="quote-count" data-quote-count>0</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">{mobile}<a class="btn" href="/quote">Request a quote</a></nav>'''

FOOTER = f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/assets/img/logo-full-light.svg" alt="Beracah FZCO Dubai" width="150" height="148" loading="lazy">
        <p>International sourcing, wholesale trading and supply chain management between global manufacturers and the markets of East Africa and the Middle East.</p>
        <p class="footer-arabic" lang="ar" dir="rtl">بيراكه امبكس - ش م ح</p>
      </div>
      <div><h4>Company</h4><ul><li><a href="/about">About us</a></li><li><a href="/services">Services</a></li><li><a href="/suppliers">Become a supplier</a></li><li><a href="/quote">Request a quote</a></li><li><a href="/contact">Contact</a></li></ul></div>
      <div><h4>Products</h4><ul><li><a href="/products?division=food">Food &amp; bakery</a></li><li><a href="/products?division=build">Construction</a></li><li><a href="/products?division=chem">Industrial inputs</a></li><li><a href="/products?division=auto">Automotive &amp; fleet</a></li><li><a href="/products">All products</a></li></ul></div>
      <div><h4>Get in touch</h4><ul>
        <li>IFZA Business Park, DDP<br>Dubai Silicon Oasis, Dubai, UAE<br>P.O. Box 342001</li>
        <li><a href="tel:+971558440982">+971 55 844 0982</a></li>
        <li><a href="mailto:info@beracahimpex.com">info@beracahimpex.com</a></li>
        <li><a href="https://wa.me/{WA}" target="_blank" rel="noopener">WhatsApp</a></li></ul></div>
    </div>
    <div class="footer-base">
      <span>© <span data-year>2026</span> BERACAH IMPEX – FZCO. All rights reserved.</span>
      <span>Licensed by the International Free Zone Authority (IFZA), Dubai. Registration No. 90436.</span>
    </div>
  </div>
</footer>
<a class="wa-float" href="https://wa.me/{WA}?text=Hello%20Beracah%20Impex%2C%20I%27d%20like%20to%20ask%20about%20a%20product." target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">{WA_ICON}<span class="wa-label">Chat on WhatsApp</span></a>'''

ORG_LD = json.dumps({
    "@context": "https://schema.org", "@type": "Organization", "name": "BERACAH IMPEX – FZCO",
    "url": SITE_URL, "logo": SITE_URL + "/assets/img/logo-full-navy.svg",
    "email": "info@beracahimpex.com", "telephone": "+971 55 844 0982",
    "address": {"@type": "PostalAddress", "streetAddress": "IFZA Business Park, DDP, Dubai Silicon Oasis",
                "postOfficeBoxNumber": "342001", "addressLocality": "Dubai", "addressCountry": "AE"},
}, ensure_ascii=False)

def page(meta, body):
    title, desc, path = meta["title"], meta["description"], meta.get("path", "/")
    extra = meta.get("head", "")
    if meta.get("org"):
        extra += f'\n<script type="application/ld+json">{ORG_LD}</script>'
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE_URL}{path}">
<meta name="theme-color" content="#0B1631">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Beracah Impex FZCO">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE_URL}{path}">
<meta property="og:image" content="{SITE_URL}/assets/img/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/marcellus-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css">{extra}
</head>
<body class="page-{meta["slug"]}">
{header(meta.get("active"))}
<main id="main">
{body}
</main>
{FOOTER}
<script src="/assets/js/products.js" defer></script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
'''

def render_body(text):
    text = text.replace("{{hero_map}}", hero_map()).replace("{{ship}}", SHIP).replace("{{wa_icon}}", WA_ICON)
    text = re.sub(r"\{\{icon:(\w+)\}\}", lambda m: icon(m.group(1)), text)
    for name in re.findall(r"\{\{include:([\w-]+)\}\}", text):
        text = text.replace("{{include:%s}}" % name, render_body((SRC / "partials" / f"{name}.html").read_text()))
    return text.replace("{{wa}}", WA)

def main():
    for f in sorted((SRC / "pages").glob("*.html")):
        raw = f.read_text()
        m = re.match(r"\s*<!--\s*(\{.*?\})\s*-->\s*", raw, re.S)
        meta = json.loads(m.group(1)); body = raw[m.end():]
        meta.setdefault("slug", f.stem)
        (ROOT / f.name).write_text(page(meta, render_body(body)))
        print("built", f.name)

if __name__ == "__main__":
    main()
