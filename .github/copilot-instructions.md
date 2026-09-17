# Mindful:In — Repository Instructions for Copilot

These are standing rules for any Copilot change to this repository. They apply
to every task unless a specific prompt explicitly overrides one of them.

## Architecture — locked, do not change

- Public-facing pathways: AIRRI, ALLIND, ACCESS/ME Media, RESOURCES, IMPACT,
  SHOP/MindfulSPC, CREATE, PRACTICE/MESH, PARTNER/SCALE/Mindful:In X.
- Do not create new brands, divisions, engines, frameworks, or navigation
  systems. Do not rename existing capabilities.
- Do not turn the site into a mandatory linear funnel. Visitors may enter
  anywhere.
- MindfulSPC (mindfulspc.com) is the dedicated commerce destination. Do not
  rebuild commerce functionality inside this site.

## Never change without an explicit, separate instruction

- Any Stripe payment link.
- Any Tally form link.
- Any Kit landing page / form URL.
- Pricing, offer names, or business claims.
- Existing Netlify form field names or submission behavior.
- Page URLs / routes.

## Brand assets

- Logo files: `/assets/brand/mindfulin-logomark.png` (circular rings + face —
  use for favicon and compact/mobile nav) and
  `/assets/brand/mindfulin-lockup-navy.png` (full lockup with wordmark — use
  in header/footer where it fits). Do not create new logo variants or
  recolor these files. Do not invent additional brand imagery.

## Color palette — locked, sampled directly from the brand assets

- Navy: #160A37
- Primary sky blue: #4CAEE5
- Light sky blue: #81CBFF
- Periwinkle/lavender: #A8AAFF
- Pink/magenta (use sparingly): #ED72C2
- Coral/red (use sparingly — not as a primary CTA color): #FF6262
- Pale blue: #A7DAEE
- White: #FFFFFF
Do not introduce colors outside this palette. Where a palette color fails
WCAG AA contrast in a specific use, adjust that one instance (darken/lighten)
rather than changing the color site-wide.

## Accessibility — non-negotiable on every change

- WCAG AA contrast: 4.5:1 for body text, 3:1 for large text/UI components.
- Every interactive element needs a visible focus state.
- Every meaningful image needs alt text; decorative images get alt="".
- Touch targets ≥44x44px on mobile.
- Respect prefers-reduced-motion.

## Before committing any change

- Verify every existing link/form/payment destination still resolves
  correctly — do not just assume markup changes didn't break them.
- Verify mobile layout: no horizontal scroll, nav collapses cleanly.
- Make the smallest coherent set of changes needed — do not refactor or
  restyle pages/sections outside the scope of the current task.
- Commit with a descriptive message; push to main so Netlify can deploy.

## When in doubt

If a task seems to require breaking one of these rules, stop and flag it
rather than proceeding — do not silently override a standing instruction.
