/* Meg Garcia portfolio — shared interactions.
   Progressive enhancement: every page works with this file absent. */
(function () {
  "use strict";

  /* ---- Mobile menu ------------------------------------------------------ */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    var closeBtn = menu.querySelector(".mobile-menu__close");
    var open = function () {
      menu.classList.add("open");
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
    };
    var close = function () {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    };
    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) close();
    });
  }

  /* ---- Animated page title (letter stagger) ----------------------------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-stagger]").forEach(function (el) {
    var text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    var i = 0;
    text.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "ltr";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      if (!reduce) span.style.animationDelay = (i * 0.045).toFixed(3) + "s";
      el.appendChild(span);
      i++;
    });
  });

  /* ---- Scroll reveal ---------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- About page tabs (At Work / Off The Clock) ------------------------ */
  var tablist = document.querySelector("[data-tabs]");
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[role=tab]"));
    var select = function (tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    };
    tablist.addEventListener("click", function (e) {
      var tab = e.target.closest("[role=tab]");
      if (tab) select(tab);
    });
    tablist.addEventListener("keydown", function (e) {
      var idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      var next;
      if (e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (next) { next.focus(); select(next); e.preventDefault(); }
    });
  }
})();
