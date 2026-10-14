# Phase 1 change log — October 14, 2026

Platform: mindfulin.com. Prepared on a review branch; no merge or production deployment.

- Confirmed and removed malformed favicon SVG fragments from all HTML pages.
- Replaced every primary header menu with Impact, Audit, W/ME, Shop, Offers; retained the mobile toggle and added 44px menu targets.
- Fixed the cascade where `.section-ink a` overrode button text. Navy text remains readable on white and light-blue hover backgrounds.
- Added the requested `/o/*` 302 redirect. Removed the premature Mantra/Partners proxies and left a TODO pending verified upstream pages.
- Preserved all non-menu link and form destinations.

Mantra and Partners are deliberately excluded from routing because both upstream pages still return 404. Their future implementation and Airtable application connection remain outside this PR.

Validation: all-page favicon/menu checks, preserved-destination comparison, contrast calculations, desktop layout and 390px mobile menu/no-overflow checks. No purchase or form submission was performed.
