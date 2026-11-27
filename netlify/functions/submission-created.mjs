// Runs automatically on every Netlify Forms submission for this site.
// Adds the person to the matching Kit form so every inquiry and signup
// lands on the email list (and starts that form's welcome sequence).
// Needs one environment variable in Netlify: KIT_API_KEY (Kit v4 API key).
const FORM_TO_KIT = {
  "contact": 9794883,               // Mindful:In Consulting — Inquiry Form
  "org-opportunity-brief": 9794883,
  "activate-inquiry": 9794883,
  "airri-package-inquiry": 10199136, // AIRRI — Custom & Personalized Interest
  "calm-corner-check": 10208416,     // Calm Corner Quick Check
  "holiday-checklist": 10200453,     // Merry Edits — Holiday list
  "creative-workshop-interest": 10199137,
  "access-media-signup": 10199137,
  "allind-interest": 10199135,
};

export default async (req) => {
  const key = process.env.KIT_API_KEY;
  if (!key) return new Response("no key", { status: 200 });
  const { payload } = await req.json();
  const formId = FORM_TO_KIT[payload?.form_name];
  const data = payload?.data || {};
  const email = (data.email || "").trim();
  const NEEDS_OPT_IN = ["contact", "org-opportunity-brief", "activate-inquiry", "airri-package-inquiry"];
  const optedIn = ["on", "yes", "true"].includes(String(data.updates || "").toLowerCase());
  const consent = NEEDS_OPT_IN.includes(payload?.form_name) ? optedIn : true;
  if (!formId || !email || !consent) return new Response("skip", { status: 200 });
  const first = (data.first_name || data.name || "").trim().split(" ")[0];
  const h = { "X-Kit-Api-Key": key, "Content-Type": "application/json", Accept: "application/json" };
  try {
    await fetch("https://api.kit.com/v4/subscribers", { method: "POST", headers: h, body: JSON.stringify({ email_address: email, first_name: first || undefined }) });
    await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, { method: "POST", headers: h, body: JSON.stringify({ email_address: email, referrer: `https://mindfulin.com (${payload.form_name})` }) });
  } catch (e) { console.log("kit sync failed", e.message); }
  return new Response("ok", { status: 200 });
};
