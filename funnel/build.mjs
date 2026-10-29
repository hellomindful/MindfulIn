// Mindful funnel generator.
// Reads funnel/offers.json and writes static, Netlify-Forms-ready pages to /<campaign.slug>/.
// Usage: node funnel/build.mjs
// To add a product: add an entry to "offers" in offers.json, then rerun. See funnel/README.md.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "funnel/offers.json"), "utf8"));
const { campaign } = data;
const offers = data.offers.filter((o) => o.status !== "HIDDEN");
const outDir = path.join(root, campaign.slug);
fs.mkdirSync(outDir, { recursive: true });

const header = fs.readFileSync(path.join(root, "organizations.html"), "utf8").match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
const footer = fs.readFileSync(path.join(root, "organizations.html"), "utf8").match(/<footer[\s\S]*?<\/footer>/)[0];

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sentence = (s = "") => esc(/[.!?”]$/.test(s) ? s : s + ".");
const money = (n) => (typeof n === "number" ? "$" + n.toLocaleString("en-US") : esc(n));
const imgSize = (src) => {
  const known = { "holiday-quiet-space": [733, 1100], "desk-reset-stocking": [733, 1100], "gift-edit": [1100, 733], "office-calm-room": [620, 420] };
  const k = Object.keys(known).find((x) => src.includes(x));
  return k ? known[k] : [1000, 750];
};
const img = (src, alt, cls = "", lazy = true) => {
  const [w, h] = imgSize(src);
  return `<img class="${cls}" src="${src}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async">`;
};

function page({ title, description, canonical, body, noindex = false, ogImage }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="https://mindfulin.com${canonical}">`}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://mindfulin.com${canonical}">
<meta property="og:site_name" content="Mindful:In">
<meta property="og:image" content="https://mindfulin.com${ogImage || "/assets/brand/og-mindfulin.jpg"}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png"><link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&amp;family=Karla:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/${campaign.slug}/funnel.css">
<script>function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"2d6470b3e141a357dde3eb9d417505d2"})});</script>
</head>
<body class="funnel">
<a class="skip-link" href="#main">Skip to content</a>
${header}
<main id="main">
${body}
</main>
${footer}
<script src="/js/main.js"></script>
<script src="/${campaign.slug}/offers-data.js"></script>
<script src="/${campaign.slug}/funnel.js"></script>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body>
</html>
`;
}

const trackingFields = `<input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_content"><input type="hidden" name="landing_page"><input type="hidden" name="referrer">`;

function field(f, prefix) {
  const id = `${prefix}-${f.name}`;
  const req = f.required ? " required" : "";
  const ac = f.autocomplete ? ` autocomplete="${f.autocomplete}"` : "";
  const label = `<label for="${id}">${esc(f.label)}${f.required ? "" : ' <span class="optional">(optional)</span>'}</label>`;
  if (f.type === "textarea") return `<div class="f-field f-wide">${label}<textarea id="${id}" name="${f.name}" rows="3"${req}${ac}></textarea></div>`;
  if (f.type === "select") return `<div class="f-field">${label}<select id="${id}" name="${f.name}"${req}><option value="">Choose one</option>${f.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select></div>`;
  return `<div class="f-field">${label}<input id="${id}" type="${f.type}" name="${f.name}"${req}${ac}></div>`;
}

function orderForm(o) {
  const formName = `order-${o.slug}`;
  const p = o.slug;
  return `<form class="f-form" name="${formName}" method="POST" action="/${campaign.slug}/thanks.html" data-netlify="true" netlify-honeypot="bot-field" data-funnel-form data-offer="${o.slug}">
  <input type="hidden" name="form-name" value="${formName}">
  <p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  ${trackingFields}
  <fieldset class="f-tiers">
    <legend>Choose your option</legend>
    ${o.tiers.map((t) => `<label class="f-tier-pick"><input type="radio" name="tier" value="${t.id}" required${t.featured ? " checked" : ""}><span><strong>${esc(t.name)}</strong> ${money(t.price)} <small>${esc(t.priceNote)}</small></span></label>`).join("")}
  </fieldset>
  <div class="f-grid">
    <div class="f-field"><label for="${p}-name">Your name</label><input id="${p}-name" name="name" required autocomplete="name"></div>
    <div class="f-field"><label for="${p}-email">Email</label><input id="${p}-email" type="email" name="email" required autocomplete="email"></div>
    ${o.fields.map((f) => field(f, p)).join("\n    ")}
  </div>
  <div class="f-field f-consent"><label><input type="checkbox" name="updates" value="yes"> Send me occasional updates and new releases (you can unsubscribe anytime)</label></div>
  <button class="btn btn-primary f-submit" type="submit" data-track="${o.slug}-submit">Reserve my order</button>
  <p class="f-after small">${esc(o.payment)} No payment is taken on this form. You’ll get your secure payment link ${esc(campaign.responseTime)}, or right away on the next page when one is available.</p>
  <p class="f-error" role="alert" hidden>Something went wrong sending your order. Please try again, or email <a href="mailto:${campaign.contactEmail}">${campaign.contactEmail}</a>.</p>
</form>`;
}

function leadForm(context) {
  const lm = campaign.leadMagnet;
  return `<form class="f-lead" name="${lm.formName}" method="POST" action="/${campaign.slug}/${lm.slug}.html" data-netlify="true" netlify-honeypot="bot-field" data-lead-form>
  <input type="hidden" name="form-name" value="${lm.formName}">
  <input type="hidden" name="context" value="${context}">
  <p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  ${trackingFields}
  <div class="f-lead-row">
    <div class="f-field"><label for="lead-${context}-email">Email</label><input id="lead-${context}-email" type="email" name="email" required autocomplete="email" placeholder="you@organization.org"></div>
    <button class="btn btn-on-dark" type="submit" data-track="lead-${context}">Send me the checklist</button>
  </div>
  <p class="small">Free. You’ll also get a few short emails with holiday sensory tips. Unsubscribe anytime.</p>
  <p class="f-error" role="alert" hidden>That didn’t send. Please try again.</p>
</form>`;
}

const deadlineBar = (o) => `<div class="f-deadline" role="note"><div class="wrap"><strong>${esc(o.orderBy)}</strong>${o.scarcity ? `<span>${esc(o.scarcity)}</span>` : ""}${o.bonus ? `<span class="f-bonus">${esc(o.bonus)}</span>` : ""}</div></div>`;

function tierCards(o) {
  return `<div class="f-tiers-grid f-cols-${o.tiers.length}">${o.tiers
    .map(
      (t) => `<article class="f-tier${t.featured ? " is-featured" : ""}">
    ${t.featured ? '<span class="f-flag">Most chosen</span>' : ""}
    <h3>${esc(t.name)}</h3>
    <p class="f-price">${money(t.price)} <small>${esc(t.priceNote)}</small></p>
    <p class="f-delivery">${esc(t.delivery)}</p>
    <ul class="f-checks">${t.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    <a class="btn ${t.featured ? "btn-primary" : "btn-secondary"}" href="#order" data-pick-tier="${t.id}" data-track="${o.slug}-${t.id}">Choose ${esc(t.name)}</a>
  </article>`
    )
    .join("")}</div>${o.addOns ? `<p class="f-addons">Add-on: ${o.addOns.map((a) => `${esc(a.name)}, ${esc(a.price)}`).join(" · ")}</p>` : ""}`;
}

function offerPage(o) {
  const cross = offers.find((x) => x.slug === o.crossSell);
  const startPrice = Math.min(...o.tiers.map((t) => t.price));
  const body = `
${deadlineBar(o)}
<section class="f-hero">
  <div class="wrap f-hero-grid">
    <div>
      <span class="eyebrow">${esc(o.brand)} · ${esc(o.cardLabel)}</span>
      <h1>${esc(o.headline)}</h1>
      <p class="lede">${esc(o.lede)}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#options" data-track="${o.slug}-hero-cta">See options from ${money(startPrice)}</a>
        <a class="btn btn-ghost" href="#how">How it works</a>
      </div>
      <p class="f-cred small">Designed by Michelle Swerin, MA, LPCC, ADHD-CCSP, Autism-CCSP, Certified Instructional Designer.</p>
    </div>
    <figure class="f-hero-media">${img(o.image, o.imageAlt, "f-photo", false)}${o.imageCaption ? `<figcaption>${esc(o.imageCaption)}</figcaption>` : ""}</figure>
  </div>
</section>

<section class="tight">
  <div class="wrap f-two">
    <div>
      <span class="eyebrow">Made for</span>
      <h2>${esc(o.buyer)}</h2>
    </div>
    <ul class="f-checks f-outcomes">${o.outcomes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
  </div>
</section>

${o.inside ? `<section class="section-alt tight"><div class="wrap f-two"><div><span class="eyebrow">Inside every stocking</span><h2>Six item types, packed the same way every time</h2><p>Brands vary with supply, so we describe items by type rather than promising a specific brand.</p></div><ul class="f-inside">${o.inside.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></section>` : ""}

<section id="how">
  <div class="wrap">
    <span class="eyebrow">How it works</span>
    <h2>Four steps, all in writing</h2>
    <ol class="f-steps">${o.steps.map(([h, p], i) => `<li><span class="f-step-n">${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join("")}</ol>
  </div>
</section>

<section id="options" class="section-alt">
  <div class="wrap">
    <span class="eyebrow">Options</span>
    <h2>Choose what fits</h2>
    ${tierCards(o)}
    ${o.waitlist ? `<p class="f-note">${esc(o.waitlist)}</p>` : ""}
  </div>
</section>

<section id="order">
  <div class="wrap f-order-grid">
    <div>
      <span class="eyebrow">Reserve</span>
      <h2>Reserve your order</h2>
      <p>Takes about two minutes. ${esc(o.orderBy)}.</p>
      <ul class="f-checks small"><li>No payment taken on this form</li><li>Invoices and purchase orders welcome</li><li>Questions? <a href="mailto:${campaign.contactEmail}">${campaign.contactEmail}</a></li></ul>
      ${o.boundary ? `<p class="small f-boundary">${esc(o.boundary)}</p>` : ""}
    </div>
    ${orderForm(o)}
  </div>
</section>

<section class="section-alt tight">
  <div class="wrap f-faq">
    <h2>Questions</h2>
    ${o.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
  </div>
</section>

${o.audience === "organizations" ? `<section class="section-ink">
  <div class="wrap f-two">
    <div><span class="eyebrow">Not ready to book?</span><h2>Get the free ${esc(campaign.leadMagnet.name)}</h2><p>${esc(campaign.leadMagnet.promise)}</p></div>
    ${leadForm(o.slug)}
  </div>
</section>` : ""}

${cross ? `<section class="tight"><div class="wrap f-cross">${img(cross.image, "", "f-cross-img", false).replace(" fetchpriority=\"high\"", "")}<div><span class="eyebrow">Also this season</span><h3>${esc(cross.name)}</h3><p>${sentence(cross.headline)}</p><a class="btn btn-secondary" href="/${campaign.slug}/${cross.slug}.html" data-track="${o.slug}-cross-${cross.slug}">See ${esc(cross.name)}</a></div></div></section>` : ""}

<div class="f-sticky" aria-hidden="false"><span>${esc(o.name)} from ${money(startPrice)}</span><a class="btn btn-primary" href="#order" data-track="${o.slug}-sticky">Reserve</a></div>
`;
  return page({ title: `${o.name} | ${o.brand}`, description: o.lede, canonical: `/${campaign.slug}/${o.slug}`, body, ogImage: o.image });
}

function hubPage() {
  const body = `
<div class="f-deadline" role="note"><div class="wrap"><strong>Holiday ordering is open.</strong><span>Organization orders by November 20 · Gift Plans by December 15</span></div></div>
<section class="f-hero">
  <div class="wrap f-hero-grid">
    <div>
      <span class="eyebrow">${esc(campaign.name)} · Mindful:In · MindfulSPC · Mindful Edits</span>
      <h1>${esc(campaign.hubTitle)}</h1>
      <p class="lede">${esc(campaign.hubLede)}</p>
      <div class="btn-row"><a class="btn btn-primary" href="#offers" data-track="hub-hero-offers">See holiday offers</a><a class="btn btn-ghost" href="#checklist">Free event checklist</a></div>
    </div>
    <div class="f-collage">${offers.map((o, i) => img(o.image, o.imageAlt, `f-collage-${i}`, i > 0)).join("")}</div>
  </div>
</section>
<section id="offers">
  <div class="wrap">
    <span class="eyebrow">Choose your path</span>
    <h2>Three ways to make the season calmer</h2>
    <div class="f-offer-grid">${offers
      .map(
        (o) => `<article class="f-offer-card">
      <span class="f-kicker">${esc(o.cardLabel)}</span>
      <h3>${esc(o.name)}</h3>
      <p>${sentence(o.headline)}</p>
      <p class="f-price">From ${money(Math.min(...o.tiers.map((t) => t.price)))}</p>
      <p class="small f-by">${esc(o.orderBy)}</p>
      <a class="btn btn-primary" href="/${campaign.slug}/${o.slug}.html" data-track="hub-${o.slug}">See ${esc(o.name)}</a>
    </article>`
      )
      .join("")}</div>
  </div>
</section>
<section class="section-alt tight">
  <div class="wrap f-two">
    <div><span class="eyebrow">Why Mindful:In</span><h2>Practical support from a clinician and instructional designer</h2></div>
    <div><p>Michelle Swerin, MA, LPCC, ADHD-CCSP, Autism-CCSP, Certified Instructional Designer, builds every kit, plan and gift edit. The focus is simple: fewer overwhelming moments, clearer expectations and things people actually use.</p><p class="small">Mindful:In is not a substitute for psychotherapy or clinical treatment.</p></div>
  </div>
</section>
<section id="checklist" class="section-ink">
  <div class="wrap f-two">
    <div><span class="eyebrow">Free download</span><h2>${esc(campaign.leadMagnet.name)}</h2><p>${esc(campaign.leadMagnet.promise)}</p></div>
    ${leadForm("hub")}
  </div>
</section>`;
  return page({ title: `${campaign.name} Offers | Mindful:In`, description: campaign.hubLede, canonical: `/${campaign.slug}/`, body, ogImage: offers[0].image });
}

function thanksPage() {
  const body = `
<section class="f-hero f-thanks">
  <div class="wrap f-thanks-box" data-thanks>
    <span class="eyebrow">Order received</span>
    <h1 data-t-title>Thank you. Your order is reserved.</h1>
    <p class="lede" data-t-summary>We have your details and will confirm ${esc(campaign.responseTime)}.</p>
    <div data-t-pay hidden><p><strong>Complete your payment now to lock in your spot.</strong></p><a class="btn btn-primary" data-t-pay-link href="#" data-track="thanks-pay">Pay securely</a></div>
    <div data-t-invoice><p><strong>What happens next</strong></p><ol class="f-next"><li>You’ll get a confirmation email with your secure payment link or invoice ${esc(campaign.responseTime)}.</li><li>Once payment or the deposit is in, your order is scheduled.</li><li>Your materials or delivery arrive by the dates on the offer page.</li></ol></div>
    <p class="small">Questions or changes? Email <a href="mailto:${campaign.contactEmail}">${campaign.contactEmail}</a>.</p>
  </div>
</section>
<section class="section-alt tight" data-t-cross hidden>
  <div class="wrap f-cross"><img class="f-cross-img" data-t-cross-img alt="" width="1000" height="750" loading="lazy"><div><span class="eyebrow">Add to your order</span><h3 data-t-cross-name></h3><p data-t-cross-copy></p><a class="btn btn-secondary" data-t-cross-link href="#" data-track="thanks-cross">Take a look</a></div></div>
</section>`;
  return page({ title: "Thank you | Mindful:In", description: "Your holiday order is reserved.", canonical: `/${campaign.slug}/thanks`, body, noindex: true });
}

function checklistPage() {
  const groups = [
    ["Before the event", ["Name the event’s busiest moments (arrival, food line, gifts, performances) and plan a calmer option for each", "Pick a quiet room or corner away from speakers and the main entrance", "Send a short “what to expect” note: schedule, noise level, lighting, food, where to take a break", "Share photos of the entrance and quiet space ahead of time", "Offer a quieter arrival window or a sensory-friendly first 30 minutes"]],
    ["The quiet space", ["Soft seating, low or warm lighting, no music", "A small basket of fidgets and a few pairs of noise-reducing earmuffs", "A clear sign at eye level, plus arrows from the main room", "Water and a simple, familiar snack", "A staff member or volunteer who knows where it is and checks in quietly"]],
    ["The main room", ["Keep music below conversation volume and away from food and seating", "Turn off strobe or flashing lights; avoid heavy fragrance", "Mark a clear path from the entrance to the quiet space and restrooms", "Post a simple visual schedule near the door", "Keep one exit route uncluttered and easy to find"]],
    ["Your team", ["Brief staff on three phrases: “Would you like a quieter spot?”, “Take your time”, and “You can come back anytime”", "Let guests skip lines, games or photos without explanation", "Name one point person for access questions", "Have a plan for a guest who is overwhelmed: space, calm voice, no crowding", "Ask for feedback afterward with one simple question: “What would make this easier next time?”"]]
  ];
  const body = `
<section class="f-hero f-check">
  <div class="wrap">
    <span class="eyebrow">Free resource · Mindful:In</span>
    <h1>${esc(campaign.leadMagnet.name)}</h1>
    <p class="lede">20 practical steps for a holiday party, open house or program that is easier for guests who get overwhelmed. Print this page or save it as a PDF.</p>
    <div class="btn-row no-print"><button class="btn btn-primary" type="button" onclick="window.print()" data-track="checklist-print">Print or save as PDF</button></div>
  </div>
</section>
<section class="tight"><div class="wrap f-checklist">${groups.map(([h, items]) => `<div><h2>${esc(h)}</h2><ul class="f-boxes">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div></section>
<section class="section-alt no-print">
  <div class="wrap f-two">
    <div><span class="eyebrow">Want it done for you?</span><h2>Get a ready-made kit for your event</h2><p>The Quick Kit gives you the quiet-space guide, signage with your event name, a guest “what to expect” page and a staff tip sheet in 3 business days.</p></div>
    <div class="btn-row"><a class="btn btn-primary" href="/${campaign.slug}/sensory-friendly-events.html#options" data-track="checklist-upsell">See event packages from $297</a></div>
  </div>
</section>`;
  return page({ title: `${campaign.leadMagnet.name} | Mindful:In`, description: campaign.leadMagnet.promise, canonical: `/${campaign.slug}/${campaign.leadMagnet.slug}`, body, noindex: true });
}

// Client-side data: only what the thank-you page needs.
const clientData = {
  responseTime: campaign.responseTime,
  offers: Object.fromEntries(offers.map((o) => [o.slug, { name: o.name, image: o.image, headline: o.headline, crossSell: o.crossSell, tiers: Object.fromEntries(o.tiers.map((t) => [t.id, { name: t.name, price: t.price, checkoutUrl: t.checkoutUrl }])) }]))
};

const write = (f, s) => fs.writeFileSync(path.join(outDir, f), s);
write("index.html", hubPage());
for (const o of offers) write(`${o.slug}.html`, offerPage(o));
write("thanks.html", thanksPage());
write(`${campaign.leadMagnet.slug}.html`, checklistPage());
write("offers-data.js", `window.FUNNEL = ${JSON.stringify(clientData, null, 2)};\n`);
console.log(`Built ${offers.length} offer pages + hub, thanks and checklist in /${campaign.slug}/`);
