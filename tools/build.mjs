// Genera el sitio estático bilingüe: ES en la raíz, EN en /en/. Uso: node tools/build.mjs
import fs from "node:fs";
import path from "node:path";
import { C } from "./content.mjs";
import { SEO, SITE } from "./seo.mjs";

const root = path.resolve(import.meta.dirname, "..");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const PAGES = ["home","about","programs","events","results","book","thanks","privacy","terms"];
const SOCIAL = [["Instagram","https://instagram.com/"],["YouTube","https://youtube.com/"],["Facebook","https://facebook.com/"],["TikTok","https://tiktok.com/"]]; // TODO: URLs reales
const WHATSAPP = "https://wa.me/"; // TODO: número
const CONTACT = { email: "info@oneempire.com", phone: "" }; // TODO

const slug = (l, p) => SEO[l][p].slug;
const hasVideo = (f) => fs.existsSync(path.join(root, "assets/video", f));

function head(l, p, extra = "") {
  const c = C[l], s = SEO[l][p], o = l === "es" ? "en" : "es";
  const url = `${SITE}/${l === "en" ? "en/" : ""}${s.slug === "index.html" ? "" : s.slug}`;
  const alt = (lang) => `${SITE}/${lang === "en" ? "en/" : ""}${SEO[lang][p].slug === "index.html" ? "" : SEO[lang][p].slug}`;
  const up = l === "en" ? "../" : "";
  return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.title)}</title><meta name="description" content="${esc(s.desc)}">
<meta name="robots" content="${s.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"}">
<link rel="canonical" href="${url}"><link rel="alternate" hreflang="${l}" href="${url}"><link rel="alternate" hreflang="${o}" href="${alt(o)}"><link rel="alternate" hreflang="x-default" href="${alt("es")}">
<meta property="og:type" content="website"><meta property="og:site_name" content="ONE EMPIRE"><meta property="og:title" content="${esc(s.title)}"><meta property="og:description" content="${esc(s.desc)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${l === "es" ? "es_US" : "en_US"}"><meta property="og:image" content="${SITE}/assets/img/og-one-empire.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#050505">
<link rel="icon" href="${up}assets/img/one-empire-isotipo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}assets/css/styles.css">${extra}</head>`;
}

function chrome(l, p) {
  const c = C[l], up = l === "en" ? "../" : "", n = c.nav, o = l === "es" ? "en" : "es";
  const href = (k) => slug(l, k);
  const otherHref = (l === "es" ? "en/" : "../") + slug(o, p);
  const drop = (label, key, items, anchors) => `<div class="dd"><a href="${href(key)}">${label}<i></i></a><div class="dd-menu">${items.map((t, i) => `<a href="${href(key)}${anchors ? "#" + anchors[i] : ""}">${esc(t)}</a>`).join("")}</div></div>`;
  const header = `<header id="site-header"><div class="bar">
<a class="brand" href="${href("home")}" aria-label="ONE EMPIRE"><img src="${up}assets/img/one-empire-isotipo.png" alt="ONE EMPIRE" width="44" height="34"><span>ONE EMPIRE</span></a>
<nav class="nav" id="nav"><a href="${href("home")}"${p === "home" ? ' aria-current="page"' : ""}>${n.home}</a>
${drop(n.programs, "programs", n.progItems, n.progItems.map((_, i) => "p" + (i + 1)))}
<div class="dd"><a href="${href("events")}">${n.events}<i></i></a><div class="dd-menu"><b>${n.online}</b>${n.online_items.map((t) => `<a href="${href("events")}#online">${esc(t)}</a>`).join("")}<b>${n.inperson}</b>${n.inperson_items.map((t) => `<a href="${href("events")}#presencial">${esc(t)}</a>`).join("")}</div></div>
<a href="${href("about")}"${p === "about" ? ' aria-current="page"' : ""}>${n.about}</a><a href="${href("results")}"${p === "results" ? ' aria-current="page"' : ""}>${n.results}</a>
<a class="btn btn-sm" href="${href("book")}">${n.cta}</a></nav>
<a class="lang" href="${otherHref}" hreflang="${o}" lang="${o}" aria-label="${o === "en" ? "English" : "Español"}"><span class="${l === "es" ? "on" : ""}">ES</span><span class="${l === "en" ? "on" : ""}">EN</span></a>
<button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button></div></header>`;
  const f = c.footer;
  const footer = `<footer id="site-footer"><div class="foot-big"><img src="${up}assets/img/one-empire-logo.png" alt="ONE EMPIRE" width="260" height="114" loading="lazy"></div>
<div class="foot-grid"><div><h4>${f.menu}</h4><a href="${href("home")}">${n.home}</a><a href="${href("programs")}">${n.programs}</a><a href="${href("events")}">${n.events}</a><a href="${href("about")}">${n.about}</a><a href="${href("results")}">${n.results}</a><a href="${href("book")}">${n.cta}</a></div>
<div><h4>${f.social}</h4>${SOCIAL.map(([t, u]) => `<a href="${u}" rel="noopener" target="_blank">${t}</a>`).join("")}</div>
<div><h4>${f.contact}</h4><a href="mailto:${CONTACT.email}">${CONTACT.email}</a><a href="${WHATSAPP}" rel="noopener" target="_blank">WhatsApp</a></div>
<div><h4>${f.legal}</h4><a href="${href("privacy")}">${f.privacy}</a><a href="${href("terms")}">${f.terms}</a></div></div>
<p class="disclaimer">${f.disclaimer}</p><div class="foot-bottom"><span>© ${new Date().getFullYear()} ONE EMPIRE. ${f.rights}</span><a href="${otherHref}">${l === "es" ? "English" : "Español"}</a></div></footer>`;
  return { header, footer };
}

const wrap = (l, p, main, extraHead = "") => {
  const { header, footer } = chrome(l, p), up = l === "en" ? "../" : "";
  return `${head(l, p, extraHead)}<body data-page="${p}"><div class="grain" aria-hidden="true"></div><div class="glow" aria-hidden="true"></div>${header}<main>${main}</main>${footer}
<script>window.ONE_EMPIRE=${JSON.stringify({ lang: l })}</script><script src="${up}assets/js/config.js"></script><script src="${up}assets/js/main.js"></script></body></html>`;
};

const bg = (name) => `style="--img:url(${name})"`;
const split = (s) => s.replace(/\n/g, "<br>");
const btn = (t, h, cls = "") => `<a class="btn ${cls}" href="${h}">${esc(t)}</a>`;
const num = (i) => String(i + 1).padStart(2, "0");
const playBtn = `<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`;

function video(file, label, cls = "") {
  return hasVideo(file)
    ? `<div class="vid ${cls}"><video src="${esc(file)}" controls playsinline preload="none"></video></div>`
    : `<div class="vid ${cls} ph">${playBtn}<small>${esc(label)}</small></div>`;
}

function home(l) {
  const c = C[l], up = l === "en" ? "../" : "", H = (k) => slug(l, k), s = SEO[l].home;
  const img = (n) => `${up}assets/img/${n}`;
  const cred = [...c.cred, ...c.cred].map((t) => `<span>${esc(t)}</span><i></i>`).join("");
  return `
<section class="hero media" ${bg(img(s.img))} role="img" aria-label="${esc(c.hero.alt)}">
 <div class="hero-in"><span class="eyebrow">${esc(c.hero.eyebrow)}</span>
 <h1 class="mega">${esc(c.hero.h1).replace(/#1/, '<em class="gold">#1</em>')}</h1>
 <p class="lead">${esc(c.hero.sub)}</p>
 <div class="row">${btn(c.hero.b1, H("book"), "btn-solid")}${btn(c.hero.b2, H("programs"))}</div>
 <p class="proof">${esc(c.hero.proof)}</p></div><span class="scroll-cue" aria-hidden="true"></span>
</section>
<div class="marquee" aria-label="${esc(c.cred.join(" · "))}"><div class="track">${cred}</div></div>

<section class="event"><div class="split reveal"><div><span class="eyebrow">${esc(c.event.label)}</span><h2 class="big">${esc(c.event.h2)}</h2></div>
 <div class="ticket"><small>${esc(c.event.tag)}</small><p>${esc(c.event.line)}</p><strong>${esc(c.event.when)}</strong>${btn(c.event.btn, H("events") + "#presencial", "btn-solid")}</div></div></section>

<section class="pain"><div class="pain-grid"><div class="sticky reveal"><h2 class="big">${esc(c.pain.h2)}</h2><p class="lead muted">${esc(c.pain.intro)}</p></div>
 <ol class="pain-list">${c.pain.items.map((t, i) => `<li class="reveal"><b>${num(i)}</b><span>${esc(t)}</span></li>`).join("")}</ol></div></section>

<section class="reality"><div class="reveal"><h2 class="big center">${esc(c.reality.h2)}</h2>
 <div class="cols">${c.reality.p.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
 <blockquote class="quote gold-text">${esc(c.reality.quote)}</blockquote></div></section>

<section class="proof-sec"><div class="split"><div class="reveal"><span class="six gold-text" aria-hidden="true">6×</span><h2 class="big">${esc(c.proof.h2)}</h2>${c.proof.p.map((t) => `<p class="lead">${esc(t)}</p>`).join("")}${btn(c.proof.btn, H("book"), "btn-solid")}</div>
 <div class="reveal">${video("hugo-potros.mp4", c.proof.video, "tall")}</div></div></section>

<section class="pillars"><div class="reveal"><span class="eyebrow">${esc(c.pillars.label)}</span><h2 class="big">${esc(c.pillars.h2)}</h2></div>
 <div class="pillar-grid">${c.pillars.items.map(([t, d], i) => `<article class="pillar reveal"><b class="gold-text">${num(i)}</b><h3>${esc(t)}</h3><p>${esc(d[0].toUpperCase() + d.slice(1))}</p></article>`).join("")}</div></section>

<section class="programs" id="programs-home"><div class="reveal"><span class="eyebrow">${esc(c.programs.label)}</span><h2 class="big">${esc(c.programs.h2)}</h2><p class="lead muted">${esc(c.programs.intro)}</p></div>
 <div class="prog">${c.programs.cards.map(([tag, name, line], i) => `<a class="prog-row reveal${i === 1 ? " flagship" : ""}" href="${H("programs")}#p${i + 1}"><span class="tag">${esc(tag)}</span><h3>${esc(name)}</h3><p>${esc(line)}</p><span class="go">${esc(c.programs.btn)} →</span></a>`).join("")}</div>
 <p class="quote gold-text reveal">${esc(c.programs.quote)}</p></section>

<section class="testi"><div class="reveal"><h2 class="big">${esc(c.testi.h2)}</h2><p class="lead muted">${esc(c.testi.intro)}</p></div>
 <div class="rail">${c.testi.items.map((t) => `<article class="vcard">${video(t.file, t.name)}<div class="vmeta"><h3>${esc(t.name)}</h3><small>${esc(t.meta)}</small><strong class="gold-text">${esc(t.res)}</strong></div></article>`).join("")}</div>
 <div class="center">${btn(c.testi.btn, H("results"))}</div></section>

<section class="mentors"><div class="reveal"><h2 class="big">${esc(c.mentors.h2)}</h2><p class="lead muted">${esc(c.mentors.intro)}</p></div>
 <div class="mentor-grid"><article class="mentor big-m reveal"><div class="portrait" ${bg(img("hugo-perez-mentor-empresas-construccion.jpg"))} role="img" aria-label="Hugo Pérez, mentor de empresas de construcción"></div><h3>${esc(c.mentors.hugo[0])}</h3><p>${esc(c.mentors.hugo[1])}</p></article>
 <article class="mentor reveal"><div class="portrait" ${bg(img("monica-tuccella-seolvit-marketing-contratistas.jpg"))} role="img" aria-label="Mónica Tuccella, fundadora de SEOLVIT"></div><h3>${esc(c.mentors.monica[0])}</h3><p>${esc(c.mentors.monica[1])}</p></article></div>
 <p class="quote gold-text reveal">${esc(c.mentors.quote)}</p>
 <div class="stats reveal">${c.mentors.stats.map(([n, t]) => `<div><b class="gold-text" data-count="${esc(n)}">${esc(n)}</b><span>${esc(t)}</span></div>`).join("")}</div>
 <div class="center">${btn(c.mentors.btn, H("about"))}</div></section>

<section class="events-home"><div class="reveal"><span class="eyebrow">${esc(c.events.label)}</span><h2 class="big">${esc(c.events.h2)}</h2></div>
 <div class="ev-grid">${c.events.items.map(([t, d, b, a], i) => `<a class="ev media reveal" ${bg(img(i ? "evento-online-contratistas.jpg" : "evento-presencial-contratistas.jpg"))} href="${H("events")}#${a}"><div><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="go">${esc(b)} →</span></div></a>`).join("")}</div></section>

<section class="free"><div class="free-in reveal"><div><h2 class="big dark">${esc(c.free.h2)}</h2><p>${esc(c.free.p)}</p></div>${btn(c.free.btn, "#", "btn-dark")}</div></section>

<section class="fit"><div class="reveal"><h2 class="big">${esc(c.fit.h2)}</h2><p class="lead muted">${esc(c.fit.intro)}</p></div>
 <div class="fit-grid"><div class="yes reveal"><h3>${esc(c.fit.yes)}</h3><ul>${c.fit.yesItems.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
 <div class="no reveal"><h3>${esc(c.fit.no)}</h3><ul>${c.fit.noItems.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div></div></section>

<section class="steps"><div class="reveal"><h2 class="big">${esc(c.steps.h2)}</h2></div>
 <div class="step-grid">${c.steps.items.map(([t, d], i) => `<article class="step reveal"><b class="gold-text">${i + 1}</b><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
 <div class="center">${btn(c.steps.btn, H("book"), "btn-solid")}</div></section>

<section class="faq"><div class="reveal"><h2 class="big">${esc(c.faq.h2)}</h2></div>
 <div class="faq-list">${c.faq.items.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>

<section class="closing media" ${bg(img("cierre-imperio-contratista.jpg"))}><div class="reveal center"><h2 class="mega">${esc(c.close.h2)}</h2><p class="lead">${esc(c.close.sub)}</p><p class="muted narrow">${esc(c.close.p)}</p>
 <div class="row center-row">${btn(c.close.b1, H("book"), "btn-solid")}${btn(c.close.b2, WHATSAPP)}</div></div></section>`;
}

function homeSchema(l) {
  const c = C[l];
  const org = { "@context": "https://schema.org", "@type": "Organization", name: "ONE EMPIRE", url: SITE, logo: `${SITE}/assets/img/one-empire-logo.png`, founder: [{ "@type": "Person", name: "Hugo Pérez" }, { "@type": "Person", name: "Mónica Tuccella" }], inLanguage: l };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return `<script type="application/ld+json">${JSON.stringify([org, faq])}</script>`;
}

const pageHero = (l, p, h1, sub) => {
  const up = l === "en" ? "../" : "", s = SEO[l][p];
  return `<section class="page-hero media" ${bg(`${up}assets/img/${s.img}`)}><div class="reveal"><span class="eyebrow">ONE EMPIRE</span><h1 class="mega">${esc(h1)}</h1><p class="lead">${esc(sub)}</p></div></section>`;
};

function about(l) {
  const c = C[l], a = c.about, H = (k) => slug(l, k);
  return `${pageHero(l, "about", a.h1, a.sub)}<section class="story"><div class="story-in">${a.p.map((t, i) => `<p class="${i === 0 ? "dropcap " : ""}reveal">${esc(t)}</p>`).join("")}<div class="center">${btn(a.btn, H("book"), "btn-solid")}</div></div></section>`;
}
function programs(l) {
  const c = C[l], pg = c.pages.programs, H = (k) => slug(l, k);
  return `${pageHero(l, "programs", pg.h1, pg.sub)}<section class="programs"><div class="prog">${c.programs.cards.map(([tag, name, line], i) => `<article class="prog-row reveal${i === 1 ? " flagship" : ""}" id="p${i + 1}"><span class="tag">${esc(tag)}</span><h3>${esc(name)}</h3><p>${esc(line)}</p>${btn(c.hero.b1, H("book"))}</article>`).join("")}</div><p class="quote gold-text reveal">${esc(c.programs.quote)}</p></section>`;
}
function events(l) {
  const c = C[l], pg = c.pages.events, H = (k) => slug(l, k);
  const grp = (id, title, items) => `<div class="ev-group reveal" id="${id}"><h2 class="big">${esc(title)}</h2><div class="prog">${items.map((t) => `<div class="prog-row"><h3>${esc(t)}</h3><p>${esc(pg.soon)}</p>${btn(c.event.btn, H("book"), "btn-solid")}</div>`).join("")}</div></div>`;
  return `${pageHero(l, "events", pg.h1, pg.sub)}<section>${grp("presencial", pg.inperson, c.nav.inperson_items)}${grp("online", pg.online, c.nav.online_items)}</section>`;
}
function results(l) {
  const c = C[l], pg = c.pages.results, H = (k) => slug(l, k);
  return `${pageHero(l, "results", pg.h1, pg.sub)}<section class="testi"><div class="rail wrap">${c.testi.items.map((t) => `<article class="vcard">${video(t.file, t.name)}<div class="vmeta"><h3>${esc(t.name)}</h3><small>${esc(t.meta)}</small><strong class="gold-text">${esc(t.res)}</strong></div></article>`).join("")}</div><div class="center">${btn(c.hero.b1, H("book"), "btn-solid")}</div></section>`;
}
function book(l) {
  const c = C[l], pg = c.pages.book;
  return `<section class="book"><div class="reveal"><span class="eyebrow">ONE EMPIRE</span><h1 class="mega">${esc(pg.h1)}</h1><p class="lead">${esc(pg.sub)}</p></div>
<div class="book-grid"><div>${video("vsl.mp4", pg.vsl, "wide")}<p class="muted">${esc(pg.q)}</p></div><div id="calendar" data-pending="${esc(pg.pending)}"></div></div></section>`;
}
function thanks(l) {
  const pg = C[l].pages.thanks;
  return `<section class="book"><div class="reveal"><span class="eyebrow">ONE EMPIRE</span><h1 class="mega">${esc(pg.h1)}</h1><p class="lead">${esc(pg.sub)}</p></div><div class="thanks-vid">${video("bienvenida.mp4", pg.video, "wide")}</div></section>`;
}
function legal(l, key) {
  const pg = C[l].pages[key];
  return `<section class="legal"><h1 class="mega">${esc(pg.h1)}</h1><p class="muted">${esc(pg.draft)}</p>${pg.s.map(([h, t]) => `<h2>${esc(h)}</h2><p>${esc(t)}</p>`).join("")}</section>`;
}

const bodies = { home, about, programs, events, results, book, thanks, privacy: (l) => legal(l, "privacy"), terms: (l) => legal(l, "terms") };

// limpia HTML generado previo
for (const f of fs.readdirSync(root)) if (f.endsWith(".html")) fs.rmSync(path.join(root, f));
fs.rmSync(path.join(root, "en"), { recursive: true, force: true });
fs.mkdirSync(path.join(root, "en"), { recursive: true });

for (const l of ["es", "en"]) {
  for (const p of PAGES) {
    const out = path.join(root, l === "en" ? "en" : "", slug(l, p));
    fs.writeFileSync(out, wrap(l, p, bodies[p](l), p === "home" ? homeSchema(l) : ""));
  }
}

// Ficha SEO (HTML interactivo, noindex)
fs.mkdirSync(path.join(root, "seo"), { recursive: true });
fs.writeFileSync(path.join(root, "seo/ficha-seo.html"), fichaHtml());
fs.writeFileSync(path.join(root, "seo/ficha-seo.md"), fichaMd());
console.log("Sitio generado.");

function checks(x) {
  const k = x.kw.toLowerCase();
  return [
    ["Keyword al inicio del meta título", x.title.toLowerCase().startsWith(k)],
    ["Meta título ≤ 60 caracteres", x.title.length <= 60],
    ["Keyword al inicio de la meta descripción", x.desc.toLowerCase().startsWith(k)],
    ["Meta descripción ≤ 155 caracteres", x.desc.length <= 155],
    ["Keyword en la URL/slug", x.slug === "index.html" || x.slug.includes(k.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-"))],
  ];
}
function fichaMd() {
  let m = "# Ficha SEO · ONE EMPIRE (criterios Yoast SEO)\n\n";
  for (const l of ["es", "en"]) {
    m += `## ${l === "es" ? "Español" : "English"}\n\n`;
    for (const p of PAGES) {
      const x = SEO[l][p];
      m += `### ${p} (${l === "en" ? "/en/" : "/"}${x.slug === "index.html" ? "" : x.slug})\n- **Keyword principal:** ${x.kw}\n- **Keywords secundarias:** ${x.sec || "—"}\n- **Meta título (${x.title.length}/60):** ${x.title}\n- **Meta descripción (${x.desc.length}/155):** ${x.desc}\n- **Imagen:** ${x.img || "—"}\n- **Alt:** ${x.alt || "—"}\n- **Schema:** ${x.schema}\n- **Indexar:** ${x.noindex ? "No" : "Sí"}\n\n`;
    }
  }
  return m;
}
function fichaHtml() {
  const rows = (l) => PAGES.map((p) => {
    const x = SEO[l][p], ch = checks(x);
    const bar = (n, max) => `<div class="bar2"><i style="width:${Math.min(100, (n / max) * 100)}%" class="${n > max ? "bad" : "ok"}"></i></div>`;
    return `<article class="card"><header><span class="pill">${l.toUpperCase()}</span><h3>${p}</h3><code>${l === "en" ? "/en/" : "/"}${x.slug === "index.html" ? "" : x.slug}</code>${x.noindex ? '<span class="pill warn">noindex</span>' : ""}</header>
<dl><dt>Keyword principal</dt><dd><mark>${esc(x.kw)}</mark></dd>
<dt>Meta título <small>${x.title.length}/60</small></dt><dd><div class="serp-t">${esc(x.title)}</div>${bar(x.title.length, 60)}</dd>
<dt>Meta descripción <small>${x.desc.length}/155</small></dt><dd><div class="serp-d">${esc(x.desc)}</div>${bar(x.desc.length, 155)}</dd>
<dt>Keywords secundarias</dt><dd>${esc(x.sec || "—")}</dd><dt>Imagen principal · alt</dt><dd><code>${esc(x.img || "—")}</code><br>${esc(x.alt || "—")}</dd><dt>Schema</dt><dd>${esc(x.schema)}</dd></dl>
<ul class="checks">${ch.map(([t, ok]) => `<li class="${ok ? "ok" : "bad"}">${ok ? "✓" : "✕"} ${t}</li>`).join("")}</ul></article>`;
  }).join("");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Ficha SEO · ONE EMPIRE</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>
:root{--bg:#050505;--card:#0e0e0e;--line:rgba(212,175,55,.25);--gold:#d4af37;--fg:#f2ede2;--mut:#9a9488;--ok:#4ade80;--bad:#f87171}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 Inter,system-ui,sans-serif;padding:clamp(20px,5vw,64px)}
h1{font:400 clamp(44px,8vw,110px)/.95 Anton,sans-serif;text-transform:uppercase;margin:0 0 8px;background:linear-gradient(90deg,#f3d77a,#d4af37 50%,#8f6b1f);-webkit-background-clip:text;color:transparent}
.sub{color:var(--mut);max-width:680px;margin-bottom:32px}h2{font:400 32px Anton;text-transform:uppercase;letter-spacing:.04em;margin:56px 0 20px;color:var(--gold)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px}@media(max-width:520px){.grid{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px}.card header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.card h3{margin:0;text-transform:capitalize}
.pill{background:var(--gold);color:#000;border-radius:99px;padding:2px 10px;font-size:11px;font-weight:600}.pill.warn{background:var(--bad)}code{color:var(--gold);font-size:12px}
dt{font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:var(--mut);margin-top:14px}dt small{color:var(--gold)}dd{margin:4px 0 0}
mark{background:rgba(212,175,55,.18);color:var(--gold);padding:2px 8px;border-radius:6px}
.serp-t{color:#8ab4f8;font-size:18px}.serp-d{color:#bdc1c6;font-size:13px}
.bar2{height:4px;background:#222;border-radius:4px;margin-top:6px}.bar2 i{display:block;height:100%;border-radius:4px}.bar2 .ok{background:var(--ok)}.bar2 .bad{background:var(--bad)}
.checks{list-style:none;padding:0;margin:16px 0 0;display:grid;gap:4px;font-size:13px}.checks .ok{color:var(--ok)}.checks .bad{color:var(--bad)}
</style></head><body><h1>Ficha SEO</h1><p class="sub">ONE EMPIRE · Criterios Yoast SEO: la keyword principal abre el meta título (≤ 60) y la meta descripción (≤ 155), aparece en el slug, el H1/primer párrafo y el alt de la imagen. Generado automáticamente desde <code>tools/seo.mjs</code>.</p>
<h2>Español</h2><div class="grid">${rows("es")}</div><h2>English</h2><div class="grid">${rows("en")}</div></body></html>`;
}
