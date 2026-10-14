# Design audit review — October 14, 2026

This branch builds on PR #5 (`codex/phase1-readiness`). Review and merge that prerequisite first, then retarget this PR to main. No merge or production deployment was performed.

- Home: replace the abstract H1 with the requested buyer headline, retain the previous H1 as the supporting sentence, add Organizations / You & your family / Shop buttons, and remove both coming-soon mentions.
- Links: replace the offers proxy with a generated, static link-in-bio page: three current offers, four hubs and the free reset. `node scripts/build-links.mjs` reads `site-config.json`; social icons appear only for nonempty HTTPS URLs. No social URLs were supplied by an existing site config, so the new fields are empty and no icons appear publicly.
- Brand: reuse the offers app's sky-face mark in every existing header/footer logo, with alt text "Mindful Innovations".
- Accessibility: 44px link targets on the home page and link-in-bio, visible focus rings on light and dark backgrounds, and reduced-motion support.

## Badge: Michelle's account setting

The badge is not in the repository HTML, scripts or styles. The live browser receives `/.netlify/scripts/hud?variant=public`, which renders iframe `nl-badge-frame` titled "Powered by Netlify". Netlify injects it outside the build.

October 14: user authorized badge removal; the mindfulin project setting was saved off in Chrome and verified. All ten owned projects were checked and are off. The setting applies on the next request without a redeploy. [Netlify's official instructions](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/).

Validation: link-page generation, source/routing assertions, unchanged offer/payment destinations, no remaining old logo references, no horizontal overflow at 375px, 44px touch targets, and mobile primary-navigation behavior. Review only; no form or checkout submissions.
