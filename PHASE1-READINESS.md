# Phase 1 change log — October 14, 2026

Platform: mindfulin.com. Prepared on a review branch; no merge or production deployment.

- Confirmed and removed malformed favicon SVG fragments from all HTML pages.
- Replaced every primary header menu with Impact, Audit, W/ME, Shop, Offers; retained the mobile toggle and added 44px menu targets.
- Fixed the cascade where `.section-ink a` overrode button text. Navy text remains readable on white and light-blue hover backgrounds.
- Added the requested `/o/*` 302 redirect and `/mantra` and `/partners` proxies, including slash and nested-path variants.
- Preserved all non-menu link and form destinations.

Dependencies before release: Claude must provide the Mantra and Partners hub pages in the offers app. Airtable destination verified October 14: Engine-to-Market OS base appXVconJN0xkLX5J, CRM & Opportunities table tbl8sGtIrPZAu1ZAT. No Partners table or application form existed. Created an unpublished Partner Application draft at https://airtable.com/appXVconJN0xkLX5J/pagkVwM0sZaXVsOkF/edit connected directly to the existing CRM. Michelle must approve publication, then Claude can connect the actual public share URL in the Partners hub. Do not use the editor URL as a public application destination. Routing is prepared; the public form connection is not complete.

Validation: all-page favicon/menu checks, preserved-destination comparison, contrast calculations, desktop layout and 390px mobile menu/no-overflow checks. No purchase or form submission was performed.
