/* Renders a MindfulSPC collection page from /js/spc-collections.json.
   Add or change products in the JSON, not here. See docs/SPC-COLLECTIONS.md. */
(function spcRender() {
  'use strict';
  var root = document.getElementById('spc-root');
  if (!root || !window.fetch) return;
  var slug = root.getAttribute('data-collection');
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  // Adds the site's UTM convention to outbound links; internal links stay relative.
  function track(url) {
    try {
      var u = new URL(url, window.location.origin);
      if (u.origin === window.location.origin) return u.pathname + u.search + u.hash;
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'mindfulin');
        u.searchParams.set('utm_medium', 'website');
        u.searchParams.set('utm_campaign', slug);
      }
      return u.toString();
    } catch (e) { return url; }
  }

  function link(url, label, cls) {
    return '<a' + (cls ? ' class="' + esc(cls) + '"' : '') + ' href="' + esc(track(url)) + '">' + esc(label) + '</a>';
  }

  function niceDate(iso) {
    var p = String(iso).split('-');
    return p.length === 3 ? MONTHS[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0] : iso;
  }

  // Only LIVE items get a price and a buy button. PREVIEW items are labeled and never linked to a checkout.
  function card(it) {
    var preview = it.status === 'PREVIEW';
    var h = '<article class="spc-card' + (preview ? ' is-preview' : '') + '">';
    if (it.image) h += '<img src="' + esc(it.image) + '" alt="' + esc(it.imageAlt || '') + '" loading="lazy">';
    h += '<p class="spc-kind">' + esc(it.kind) + (preview ? ' · Preview, not for sale' : '') + '</p>';
    h += '<h3>' + esc(it.name) + '</h3>';
    h += '<p>' + esc(it.blurb) + '</p>';
    if (!preview) {
      h += '<p class="spc-meta"><strong>' + esc(it.price) + '</strong>' + (it.priceNote ? ' · ' + esc(it.priceNote) : '') + '</p>';
      h += '<p class="spc-meta spc-where">' + esc(it.where) + '</p>';
      h += link(it.url, it.cta, 'btn btn-secondary');
    }
    return h + '</article>';
  }

  function render(data) {
    var c = null, bySlug = {};
    data.collections.forEach(function (x) { bySlug[x.slug] = x; if (x.slug === slug) c = x; });
    if (!c) return;
    var out = '<section><div class="wrap spc-intro"><h2>Who this collection is for</h2><p>' + esc(c.audience) + '</p></div></section>';

    // Each group is a reserved module: it renders only when a LIVE or PREVIEW item is placed in it.
    c.groups.forEach(function (g) {
      var list = data.items.filter(function (it) {
        return it.placements && it.placements[slug] === g.key && (it.status === 'LIVE' || it.status === 'PREVIEW');
      });
      if (!list.length) return;
      out += '<section class="spc-group" id="' + esc(g.key) + '"><div class="wrap"><h2>' + esc(g.title) + '</h2>' +
        (g.note ? '<p class="text-soft">' + esc(g.note) + '</p>' : '') +
        '<div class="spc-grid">' + list.map(card).join('') + '</div></div></section>';
    });

    if (c.areas && c.areas.length) {
      out += '<section class="section-alt"><div class="wrap"><h2>What this collection covers</h2>' +
        '<p class="text-soft">Areas marked “In development” have nothing for sale yet.</p><ul class="spc-areas">' +
        c.areas.map(function (a) {
          var live = a.status === 'available';
          return '<li><span>' + esc(a.name) + '</span><span class="spc-chip' + (live ? ' is-live' : '') + '">' + (live ? 'Available now' : 'In development') + '</span></li>';
        }).join('') + '</ul></div></section>';
    }

    out += '<section class="section-ink"><div class="wrap spc-cta"><h2>' + esc(c.primary.heading) + '</h2>' +
      (c.primary.text ? '<p>' + esc(c.primary.text) + '</p>' : '') +
      '<div class="btn-row">' + link(c.primary.url, c.primary.label, 'btn btn-on-dark') + '</div>' +
      (c.secondary ? '<p class="spc-secondary">' + esc(c.secondary.text) + ' ' + link(c.secondary.url, c.secondary.label) + '</p>' : '') +
      '</div></section>';

    if (c.related && c.related.length) {
      out += '<section><div class="wrap"><h2>Related collections</h2><ul class="spc-related">' +
        c.related.map(function (s) {
          var r = bySlug[s];
          return r ? '<li><a href="/' + esc(r.slug) + '"><strong>' + esc(r.name) + '</strong><span>' + esc(r.tagline) + '</span></a></li>' : '';
        }).join('') + '</ul></div></section>';
    }

    out += '<section><div class="wrap spc-info"><p class="small">Each item is sold and delivered by the destination named on its card. Prices are as listed there on ' +
      esc(niceDate(data.lastVerified)) + '. Questions or an access need? Email <a href="mailto:hello@mindfulin.com">hello@mindfulin.com</a>.</p>' +
      (c.careNote ? '<p class="small">These are practical, educational resources, not therapy, diagnosis or crisis care. In an emergency call 911, or call or text 988.</p>' : '') +
      '</div></section>';

    root.innerHTML = out;
  }

  fetch('/js/spc-collections.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(render)
    .catch(function () { /* the static fallback already in the page stays visible */ });
})();
