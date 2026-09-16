# Mindful:In — mindfulin.com

Static site (no build step) generated for Netlify. Built to the Mindful:In
website implementation brief (AIRRI / ALLIND / ACTIVATE / ACCESS Mindful
Media / MindfulSPC / Mindful:In X architecture), Sept 2026 authoritative lock.

## 1. Deploy to Netlify

**Fastest path (no account setup beyond Netlify login):**
1. Go to https://app.netlify.com/drop
2. Drag the whole folder you downloaded (containing `index.html`, `css/`, `js/`, etc.) onto the page.
3. Netlify gives you a temporary `*.netlify.app` URL immediately.
4. In Site settings -> Domain management -> Add a custom domain, add `mindfulin.com` and `www.mindfulin.com`, and follow Netlify's DNS instructions (either point your registrar's nameservers to Netlify, or add the specific A/CNAME records Netlify shows you).
5. Netlify provisions HTTPS automatically once DNS is verified (Let's Encrypt, usually a few minutes).

**Recommended path for ongoing edits:** push this folder to a GitHub repo and connect that repo in Netlify (Add new site -> Import an existing project) so future edits auto-deploy on push, instead of re-dragging the folder each time.

`netlify.toml` is already included (build publish dir, security headers, 404 handling). `_redirects` handles a couple of convenience redirects.

## 2. Pages created (Phase 1-4 of the brief)
- `/index.html` — Home (hero, Start With What You Need, capability directory, Sensory Regulation feature, org + assessment CTAs)
- `/assess.html` — AIRRI (free Readiness Check form + $197 AIRRI Assessment checkout)
- `/learn.html` — ALLIND
- `/solutions.html` — ACTIVATE (Assessment-to-Action Mini/Funnel/Signature Assessment Engine)
- `/media.html` — ACCESS Mindful Media
- `/shop.html` — MindfulSPC gateway (links out to mindfulspc.com)
- `/organizations.html` — Mindful:In X / B2B (Opportunity Brief intake)
- `/about.html`
- `/needs.html` — Explore by Need directory
- `/needs/sensory-regulation.html` — first fully-connected micro-need
- `/contact.html`
- `/404.html`, `/privacy.html`, `/terms.html`, `/accessibility.html` (legal stubs — see review items below)

## 3. Integrations connected
- **MindfulSPC** — linked directly (`https://www.mindfulspc.com`) from Home, Shop, Assess, Solutions, Media, and the Sensory Regulation page.
- **AIRRI $197 checkout** — linked directly to the one verified live Stripe Payment Link on record. **Confirm this is still correct** (see review list below).
- **Netlify Forms** — used as a working, zero-backend async intake for everything that doesn't yet have a confirmed live Kit/Tally URL: AIRRI Readiness Check, ALLIND interest, ACTIVATE/Assessment-to-Action inquiry, ACCESS Mindful Media signup, Organizations Opportunity Brief, and general Contact. These work immediately on Netlify with no setup — submissions appear in Site settings -> Forms in your Netlify dashboard. Swap any of these for the real Kit/Tally embed or link once you have it; the form field names were chosen to make that mapping easy (e.g. `what_are_you_trying_to_understand_or_find_help_with` matches the existing Kit custom field key from prior AIRRI builds).

## 4. Items requiring manual configuration
- Add the custom domain + DNS in Netlify (step 4 above).
- Turn on Netlify Forms notifications (Site settings -> Forms -> Form notifications) so submissions email you or post to Slack/Zapier — otherwise you'll only see them in the dashboard.
- Add a real analytics snippet if wanted (GA4, Plausible, Fathom, etc.) — `js/main.js` already pushes `cta_click` events to `window.dataLayer` on every tracked CTA, so a GA4/GTM snippet will pick those up with no other code changes.
- Replace the placeholder legal pages (`privacy.html`, `terms.html`, `accessibility.html`) with reviewed text before linking them publicly or letting them get indexed.

## 5. Owner review required (do not treat these as final)
- **ALLIND course/training catalog** — No confirmed live catalog of specific ALLIND courses/trainings under the current architecture — page uses a general interest form until specific offers/links are provided.
- **ACCESS Mindful Media destinations (Kit newsletter, audio/video, social channels)** — No confirmed live Kit newsletter URL or social/media channel links under the current architecture — page uses a general email-capture form and leaves channel links unlisted rather than fabricating them.
- **AIRRI B2B Opportunity Brief (Tally)** — No Tally form specifically named/branded 'AIRRI B2B Opportunity Brief' exists. The real, live, working B2B intake is Kit's 'Integrated Partner Projects — Inquiry Form' (mindfulin.kit.com/b90435bcf4), now linked as the primary CTA on this page. Confirm whether that's acceptable as-is or whether a dedicated Tally form should replace it.
- **Privacy Policy — full legal text** — This page is a structural placeholder. Replace with reviewed legal language before public launch (privacy/consent, terms, and accessibility statement should reflect actual data handling, assessment disclaimers, and clinical-boundary language).
- **Terms of Use — full legal text** — This page is a structural placeholder. Replace with reviewed legal language before public launch (privacy/consent, terms, and accessibility statement should reflect actual data handling, assessment disclaimers, and clinical-boundary language).
- **Accessibility Statement — full legal text** — This page is a structural placeholder. Replace with reviewed legal language before public launch (privacy/consent, terms, and accessibility statement should reflect actual data handling, assessment disclaimers, and clinical-boundary language).

## 6. Technical limitations
- No build step / JS framework — deliberately, for speed, reliability, and zero dependency risk. If you later want a CMS-editable version, this can be ported to a static-site generator (Eleventy, Astro) without changing the design.
- Kit/Tally/Stripe are **linked to, not embedded** — embedding would require each tool's own embed script and defeats some of the performance/simplicity goals; direct links keep this site fast and keep each specialized tool doing its own job, per the brief's own instruction not to duplicate Ecwid/Tally/Stripe functionality.
- No live founder-side testing has been done on this build (Stripe checkout flow, Netlify Forms delivery, DNS) — do a full test purchase and test form submission after deploy, per the brief's own QA checklist (section 40).

## 7. Recommended immediate post-launch fixes
1. Confirm/replace the AIRRI $197 Stripe link and the AIRRI Readiness Check destination (both flagged above).
2. Wire real Kit/Tally URLs into Solutions, Organizations, Learn, and Media as they become available, replacing the Netlify Forms stopgaps.
3. Add real legal text to Privacy/Terms/Accessibility before those pages are linked from anywhere public-facing beyond the footer.
4. Add a GA4/analytics snippet to start capturing the `cta_click` events already being fired.
5. Populate `/needs.html` with a second need pathway once one is genuinely ready — the page and its card grid pattern are reusable as-is.

## 8. Conversion opportunities noticed during build
- The AIRRI free Readiness Check and the $197 paid Assessment currently look like two disconnected offers on `/assess.html` — once the Readiness Check has a real delivery mechanism, consider an explicit "you got X, here's what the full Assessment adds" upsell line.
- `/solutions.html`'s three Assessment-to-Action tiers have no comparison framing (what makes someone choose Mini vs. Funnel vs. Signature) — worth a short comparison table once real client examples exist.
- Only one need pathway (`Sensory Regulation`) is built; `/needs.html` is functional but thin — it's the highest-leverage page to expand next since it's the literal "problem-first" entry point the brief prioritizes.
