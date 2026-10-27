// Mindful:In — minimal site JS. No dependencies.
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Lightweight CTA click tracking (console + dataLayer hook; wire to
  // real analytics once GA4/Plausible snippet is added — see README).
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      var label = el.getAttribute("data-track");
      if (window.dataLayer) {
        window.dataLayer.push({ event: "cta_click", cta_label: label });
      }
    });
  });
});

// Only non-personal campaign labels are retained in the existing brief.
(function(){var p=new URLSearchParams(location.search),f=document.forms['org-opportunity-brief'];if(!f)return;var clean=function(v){return (v||'').replace(/[^a-zA-Z0-9_. -]/g,'').slice(0,80)};if(f.elements.offer&&['development-sprint','organizational-review','media-commission','private-workshop','other'].includes(p.get('offer')))f.elements.offer.value=p.get('offer');if(f.elements.source)f.elements.source.value=clean(p.get('utm_source'))||'mindfulin.com';if(f.elements.campaign)f.elements.campaign.value=clean(p.get('utm_campaign'));})();
