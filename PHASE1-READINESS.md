# Phase 1 change log — October 14, 2026

Platform: mindfulin.com. Prepared on a review branch; no merge or production deployment.

- Confirmed and removed malformed favicon SVG fragments from all HTML pages.
- Replaced every primary header menu with Impact, Audit, W/ME, Shop, Offers; retained the mobile toggle and added 44px menu targets.
- Fixed the cascade where `.section-ink a` overrode button text. Navy text remains readable on white and light-blue hover backgrounds.
- Added the requested `/o/*` 302 redirect and `/mantra` and `/partners` proxies, including slash and nested-path variants.
- Preserved all non-menu link and form destinations.

Dependencies before release: Claude must provide the Mantra and Partners hub pages in the offers app. The Partners Airtable form destination/integration has not been supplied or found in this repository. Routing is prepared; the form connection is not complete.

Validation: all-page favicon/menu checks, preserved-destination comparison, contrast calculations, desktop layout and 390px mobile menu/no-overflow checks. No purchase or form submission was performed.
