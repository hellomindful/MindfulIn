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
