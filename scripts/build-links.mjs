import { readFileSync, writeFileSync } from 'node:fs';
const about = "<section class=\"mi-about\" aria-label=\"About Michelle\"><img src=\"/brand/michelle-swerin.jpg\" alt=\"Michelle Swerin smiling outdoors\" width=\"112\" height=\"144\" loading=\"lazy\"><div><h2>About Michelle</h2><p>Michelle Swerin, MA, LPCC \u00b7 Instructional designer \u00b7 Minnesota</p><p>Practical design, curation and education, with no calls needed.</p><a href=\"mailto:hello@mindfulempowered.com\">hello@mindfulempowered.com</a></div></section>";
const root = new URL('../', import.meta.url);
const { socials } = JSON.parse(readFileSync(new URL('site-config.json', root), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const featured = [
  ['MESH Snapshot founding offer', '/o/org-starter-snapshot'],
  ['ADHD W/Me Club', '/o/adhd-with-me-club'],
  ['Finds Edit', '/o/finds-edit']
];
const hubs = [['Sensory Accessibility', '/audit/'], ['Impact', '/impact/'], ['W/ME', '/withme/'], ['Shop', '/shop/']];
const icons = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1"/>',
  linkedin: '<path d="M4 8h4v13H4zM10 8h4v2c1-2 6-3 6 3v8h-4v-7c0-3-2-3-2 0v7h-4z"/><circle cx="6" cy="4" r="2"/>',
  youtube: '<path d="M21 7c0-2-2-3-4-3H7C5 4 3 5 3 7v10c0 2 2 3 4 3h10c2 0 4-1 4-3z"/><path d="m10 8 6 4-6 4z" fill="white"/>',
  pinterest: '<path d="M12 2a10 10 0 0 0-3 19l2-9c-2-5 3-8 6-5 3 4-1 10-4 7l-1 6A10 10 0 1 0 12 2zm0 5c4-1 5 5 2 6-2 1-3-1-2-3z"/>',
  substack: '<path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v11l-9-5-9 5z"/>',
  threads: '<path d="M17 8c-1-5-10-5-11 1-3 12 10 15 13 7 2-5-9-9-9-3 0 5 8 3 7-5" fill="none" stroke="currentColor" stroke-width="2"/>'
};
const social = Object.entries(socials || {}).filter(([name,url]) => icons[name] && /^https:\/\//.test(url)).map(([name,url]) => `<a href="${esc(url)}" aria-label="${esc(name)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg></a>`).join('');
let html = readFileSync(new URL('index.html', root), 'utf8');
html = html.replace(/<title>.*?<\/title>/, '<title>Links | Mindful Innovations</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Current offers, free ADHD reset and the four Mindful Innovations hubs. No calls needed.">')
  .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="https://www.mindfulin.com/links/">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="Links | Mindful Innovations">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Current offers, the four hubs and the free Starting Reset.">')
  .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://www.mindfulin.com/links/">')
  .replace(/<main id="main">[\s\S]*?<\/main>/, `<main id="main"><section class="hero"><div class="wrap center"><h1>Mindful Innovations</h1><p class="lede">Choose what fits your next step. No calls needed.</p><div class="bio-links">${featured.map(([title,url])=>`<a class="btn btn-primary" href="${url}">${esc(title)}</a>`).join('')}</div><h2>Explore the hubs</h2><div class="bio-links">${hubs.map(([title,url])=>`<a class="btn btn-secondary" href="${url}">${esc(title)}</a>`).join('')}<a class="btn btn-secondary" href="/withme/reset/">Get the free Starting Reset</a></div>${social ? `<nav class="bio-socials" aria-label="Social profiles">${social}</nav>` : ''}</div></section>${about}</main>`);
writeFileSync(new URL('links.html', root), html);
console.log('Link-in-bio built; empty social URLs stay hidden.');
