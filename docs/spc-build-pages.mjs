// Regenerates the MindfulSPC collection page shells (sensoryspc.html, editspc.html, ...) from the manifest.
// The shells hold the shared header, footer and SEO metadata; /js/spc-render.js fills in the products.
// Run from the repo root after adding or renaming a collection:  node docs/spc-build-pages.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('js/spc-collections.json', 'utf8'));
const template = readFileSync('media.html', 'utf8');

function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function escAttr(s) { return escHtml(s).replace(/"/g, '&quot;'); }

function buildSpcPage(template, c) {
  var mainStart = template.indexOf('<main');
  var mainEnd = template.indexOf('</main>') + '</main>'.length;
  var head = template.slice(0, mainStart);
  var tail = template.slice(mainEnd);
  var title = c.name + ' — ' + c.tagline.replace(/\.$/, '') + ' | Mindful:In';
  var url = 'https://www.mindfulin.com/' + c.slug;
  head = head
    .replace(/<title>[\s\S]*?<\/title>/, '<title>' + escHtml(title) + '</title>')
    .replace(/(<meta name="description" content=")[^"]*(")/, '$1' + escAttr(c.metaDescription) + '$2')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + url + '$2')
    .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + escAttr(title) + '$2')
    .replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + escAttr(c.metaDescription) + '$2')
    .replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + url + '$2');
  if (c.hero.image && !c.hero.decorative) {
    head = head.replace(/(<meta property="og:image" content=")[^"]*(")/, '$1https://www.mindfulin.com' + c.hero.image + '$2');
  }
  head = head.replace('</head>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap">\n' +
    '<link rel="stylesheet" href="/css/spc.css">\n</head>');
  var img = c.hero.image
    ? '<img class="' + (c.hero.decorative ? 'spc-mark' : 'spc-photo') + '" src="' + c.hero.image + '" alt="' + escAttr(c.hero.decorative ? '' : c.hero.alt) +
      '" width="' + c.hero.width + '" height="' + c.hero.height + '">'
    : '';
  var main =
    '<main id="main" class="spc-page">\n\n' +
    '<section class="spc-hero">\n  <div class="wrap spc-hero-grid">\n    <div>\n' +
    '      <span class="eyebrow">Shop &amp; Design · ' + escHtml(c.name) + '</span>\n' +
    '      <h1>' + escHtml(c.hero.title) + '</h1>\n' +
    '      <p class="lede">' + escHtml(c.hero.lede) + '</p>\n' +
    '    </div>\n    ' + img + '\n  </div>\n</section>\n\n' +
    '<!-- Rendered from /js/spc-collections.json by /js/spc-render.js. The content below is the no-script fallback. -->\n' +
    '<div id="spc-root" data-collection="' + c.slug + '">\n<section>\n  <div class="wrap">\n' +
    '    <p>' + escHtml(c.audience) + '</p>\n' +
    '    <p><a class="btn btn-primary" href="' + escAttr(c.primary.url) + '">' + escHtml(c.primary.label) + '</a></p>\n' +
    '  </div>\n</section>\n</div>\n\n</main>\n<script src="/js/spc-render.js" defer></script>';
  return head + main + tail;
}

for (const c of data.collections) {
  writeFileSync(c.slug + '.html', buildSpcPage(template, c));
  console.log('wrote ' + c.slug + '.html');
}
