// Mindful funnel behavior: campaign tracking, tier picking, Netlify form submit, thank-you routing.
(function () {
  var KEY = "mi_first_touch";
  var params = new URLSearchParams(location.search);
  var clean = function (v) { return (v || "").replace(/[^a-zA-Z0-9_.:\/ -]/g, "").slice(0, 120); };

  // First-touch attribution: keep the first campaign that brought this visitor in.
  var touch = {};
  try { touch = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  if (!touch.landing_page) {
    touch = {
      utm_source: clean(params.get("utm_source")) || (document.referrer ? clean(new URL(document.referrer).hostname) : "direct"),
      utm_medium: clean(params.get("utm_medium")),
      utm_campaign: clean(params.get("utm_campaign")),
      utm_content: clean(params.get("utm_content")),
      landing_page: clean(location.pathname),
      referrer: clean(document.referrer)
    };
    try { localStorage.setItem(KEY, JSON.stringify(touch)); } catch (e) {}
  }
  document.querySelectorAll("form [name^='utm_'], form [name='landing_page'], form [name='referrer']").forEach(function (el) {
    if (touch[el.name]) el.value = touch[el.name];
  });

  var track = function (event, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, detail || {}));
    if (window.fbq) { try { window.fbq("track", event === "generate_lead" ? "Lead" : event === "reserve_order" ? "InitiateCheckout" : "ViewContent", detail || {}); } catch (e) {} }
  };

  // "Choose X" buttons preselect the tier in the order form.
  document.querySelectorAll("[data-pick-tier]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var radio = document.querySelector("input[name='tier'][value='" + btn.getAttribute("data-pick-tier") + "']");
      if (radio) radio.checked = true;
    });
  });

  var encode = function (form) { return new URLSearchParams(new FormData(form)).toString(); };
  var submit = function (form, onOk) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type='submit']");
      var err = form.querySelector(".f-error");
      if (err) err.hidden = true;
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: encode(form) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); onOk(form); })
        .catch(function () {
          if (err) err.hidden = false;
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
        });
    });
  };

  document.querySelectorAll("[data-funnel-form]").forEach(function (form) {
    submit(form, function (f) {
      var offer = f.getAttribute("data-offer");
      var tier = (f.querySelector("input[name='tier']:checked") || {}).value || "";
      track("reserve_order", { offer: offer, tier: tier });
      location.href = f.getAttribute("action") + "?o=" + encodeURIComponent(offer) + "&t=" + encodeURIComponent(tier);
    });
  });
  document.querySelectorAll("[data-lead-form]").forEach(function (form) {
    submit(form, function (f) {
      track("generate_lead", { lead_magnet: "holiday-checklist" });
      location.href = f.getAttribute("action");
    });
  });

  // Thank-you page: show the right offer, a pay button when a checkout link exists, and a cross-sell.
  var box = document.querySelector("[data-thanks]");
  if (box && window.FUNNEL) {
    var o = window.FUNNEL.offers[params.get("o")];
    var t = o && o.tiers[params.get("t")];
    if (o && t) {
      box.querySelector("[data-t-title]").textContent = "Thank you. Your " + o.name + " (" + t.name + ") is reserved.";
      box.querySelector("[data-t-summary]").textContent = "We have your details. You’ll get a confirmation " + window.FUNNEL.responseTime + ".";
      if (t.checkoutUrl) {
        box.querySelector("[data-t-pay]").hidden = false;
        box.querySelector("[data-t-pay-link]").href = t.checkoutUrl;
        box.querySelector("[data-t-invoice] li").textContent = "If you pay above, you’ll get a receipt right away; if not, we’ll email your payment link " + window.FUNNEL.responseTime + ".";
      }
      var c = window.FUNNEL.offers[o.crossSell];
      var cs = document.querySelector("[data-t-cross]");
      if (c && cs) {
        cs.hidden = false;
        cs.querySelector("[data-t-cross-name]").textContent = c.name;
        cs.querySelector("[data-t-cross-copy]").textContent = (/[.!?”]$/.test(c.headline) ? c.headline : c.headline + ".");
        var im = cs.querySelector("[data-t-cross-img]"); im.src = c.image; im.alt = "";
        cs.querySelector("[data-t-cross-link]").href = "/holiday/" + o.crossSell + ".html";
      }
      track("order_reserved", { offer: params.get("o"), tier: params.get("t"), value: t.price });
    }
  }
})();
