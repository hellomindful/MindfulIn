# Mindful Funnel

One reusable sales funnel. Every offer gets the same proven structure, generated from `funnel/offers.json`.

```
Ad / post / email (tracked link)
  → Offer page (one buyer, one promise, deadline bar, options, form, FAQ)
  → Reserve form (Netlify Forms, captures campaign source)
  → Thank-you page (pay button when a checkout link exists, otherwise invoice in 1 business day)
  → Follow-up emails (funnel/EMAILS.md)
  → Cross-sell to the next offer
Not ready to buy → free checklist (email capture) → nurture emails → offer
```

Live pages after merge: `/holiday/`, `/holiday/sensory-friendly-events.html`, `/holiday/bulk-sensory-stockings.html`, `/holiday/gift-edit.html`, `/holiday/thanks.html`, `/holiday/sensory-friendly-event-checklist.html`.

## Rebuild after any change

```
node funnel/build.mjs
```

## Turn on instant payment (recommended before ads)

1. Create a payment link for each option (Stripe Payment Links, or the Ecwid product URL once the listing is visible and test-purchased).
2. Paste it into that option's `"checkoutUrl"` in `offers.json`.
3. Run `node funnel/build.mjs`, commit and push.

With a link, buyers see a **Pay securely** button the moment they submit. Without one, the thank-you page promises a payment link or invoice within 1 business day, so the funnel still works today.

Run one real test purchase per link before promoting it.

## Get notified of every order

Netlify → Site → Forms → Form notifications → add an email notification for each form:

- `order-sensory-friendly-events`
- `order-bulk-sensory-stockings`
- `order-gift-edit`
- `holiday-checklist` (lead magnet)

Every submission includes `utm_source`, `utm_campaign`, `utm_content` and `landing_page`, so you can see which post or ad produced it.

## Tracked links

Use the same pattern everywhere, then shorten with Bitly:

```
https://mindfulin.com/holiday/bulk-sensory-stockings.html?utm_source=facebook&utm_medium=social&utm_campaign=holiday26&utm_content=packing-video
```

`utm_source`: facebook, tiktok, linkedin, email, partner-name · `utm_content`: which post, ad or message.

## Add any product (the other 250)

1. Copy one entry in `offers` and change the fields. Required: `slug`, `name`, `brand`, `audience` (`organizations` or `individuals`), `cardLabel`, `buyer`, `headline`, `lede`, `image`, `imageAlt`, `orderBy`, `payment`, `outcomes`, `steps`, `tiers`, `fields`, `faq`, `crossSell`.
2. `status`: `LIVE_TEST` publishes it; `HIDDEN` keeps it out of the build.
3. For a Figma prototype that isn't built yet, make it a pre-order: one tier named "Founding pre-order", a deposit price, and `orderBy` set to the build date. Demand is proven before you build.
4. Add the image to `assets/images/<campaign>/` and its size to `imgSize` in `build.mjs`.
5. To start a new campaign (for example, a January reset), copy `offers.json`, change `campaign.slug`, and run the build.

## Launch checklist (per offer)

- [ ] Prices, deadlines and deliverables checked
- [ ] Form notification turned on
- [ ] Test submission received with campaign fields filled in
- [ ] Payment link added and one real test purchase completed (or invoice process ready)
- [ ] Follow-up emails loaded (EMAILS.md)
- [ ] Tracked link created for each channel
