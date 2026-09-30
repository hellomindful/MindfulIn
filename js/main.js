// Mindful:In — minimal site JS. No dependencies.
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    var navList = nav.querySelector("ul");
    if (navList) {
      navList.innerHTML =
        '<li><a href="/organizations.html">For organizations</a></li>' +
        '<li><a href="/shop.html">Shop resources</a></li>' +
        '<li><a href="/media.html">Explore the work</a></li>' +
        '<li><a href="/assess.html">For individuals</a></li>' +
        '<li><a href="/about.html">About</a></li>' +
        '<li><a href="/contact.html">Contact</a></li>';
    }
    var navCta = nav.querySelector(".nav-cta a");
    if (navCta) {
      navCta.href = "/organizations.html";
      navCta.textContent = "For organizations";
      navCta.setAttribute("data-track", "header-cta-organizations");
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      if (isOpen) {
        var firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        toggle.focus();
      }
    });
  }

  document.querySelectorAll('a[href="https://www.mindfulspc.com/sensory-selfie"]').forEach(function (link) {
    link.href = "https://www.mindfulspc.com/products";
    link.textContent = "Browse MindfulSPC catalog";
  });

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
