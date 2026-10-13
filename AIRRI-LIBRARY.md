# Airri hub

Public home: https://mindfulin.com/airri

The hub uses the existing Mindful:In header, footer, Lora/Karla typography, and blue/lavender palette. `airri.html` contains the full catalogue in static HTML; it remains readable without JavaScript. `css/airri.css` styles only the hub. `js/airri.js` adds search, collection filtering, and inquiry prefilling.

## Offer status

- Free AIRRI Readiness Check: https://tally.so/r/gDBDoK
- AIRRI — Snapshot, $197: https://buy.stripe.com/4gMdRaclx4992jZc4s7kc0J
- All ten topical collections: explore by request. No separate downloads, prices, fulfilment promises, or checkout links have been invented.
- Self-guided, facilitated, combined, and group packages: inquiry and quote before purchase.

The Tally form and Stripe product name/price were checked on October 13, 2026. No purchase was made. The Tally form currently links onward to a Back-to-School Kit experience; its content was not changed.

## Add a package

Add a static `article.airri-collection` in `airri.html`, with a unique `data-collection` key, matching collection option in `#airri-category`, topic list, honest availability status, and verified destination. Search reads rendered text. Update the initial result count if adding a collection.

For a sellable standalone package, include its actual scope, deliverables, format, price, and verified checkout. Replace the request link only once the offer and delivery are ready. Keep the custom-package path for mixed topics.

MESH means Mental, Emotional, Social, and Health.

## Inquiry form

Netlify detects the static form `airri-package-inquiry` at deploy time. Fields: name, email, audience, format, topics, goal, timing_or_group_size, contact_permission; hidden form-name and honeypot bot-field. The success route is `/airri-thank-you`. Submissions appear under this form in the mindfulin Netlify project. No newsletter enrollment is connected.

No sensitive client data was used in validation. Form detection should be verified after deploy; notification delivery and assessment fulfilment require separate owner configuration and testing.
