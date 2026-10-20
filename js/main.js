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

  /* ---- Hero shape float + rotate + pulse + cursor parallax -------------- */
  /* A bubbly idle loop — each shape bobs (sine), rotates gently around its
     resting angle, and softly pulses in scale — layered with a smoothed
     parallax toward/away from the cursor. Matches the live site's looping
     MOUSE_MOVE + TRANSFORM_MOVE / ROTATE / SCALE feel.
     Uses the CSS individual transform properties (`translate`, `rotate`,
     `scale`) so they compose with each shape's base `transform: rotate()`
     without overwriting it. Disabled entirely under reduced-motion. */
  if (!reduce) {
    document.querySelectorAll(".hero .shapes").forEach(function (layer) {
      var shapes = Array.prototype.slice.call(layer.children);
      if (!shapes.length || !("requestAnimationFrame" in window)) return;
      var hero = layer.closest(".hero");
      var cfg = shapes.map(function (el, i) {
        // Resting angle set in CSS (e.g. `transform: rotate(3deg)`), so the
        // wobble oscillates around it rather than snapping to 0.
        var baseRot = 0;
        try {
          var tr = getComputedStyle(el).transform;
          if (tr && tr !== "none") {
            var p = tr.match(/matrix\(([^)]+)\)/);
            if (p) {
              var v = p[1].split(",");
              baseRot = Math.round(Math.atan2(parseFloat(v[1]), parseFloat(v[0])) * 180 / Math.PI);
            }
          }
        } catch (err) { baseRot = 0; }
        return {
          el: el,
          baseRot: baseRot,
          depth: 0.016 + (i % 4) * 0.012,        // parallax strength
          amp: 10 + (i % 3) * 7,                 // idle drift (px) — bubblier
          speed: 0.00024 + (i % 5) * 0.00007,    // idle float speed
          phase: i * 1.7,
          rotAmp: 5 + (i % 3) * 3,               // rotation wobble (deg)
          rotSpeed: 0.00017 + (i % 4) * 0.00005, // rotation speed
          rotPhase: i * 2.3,
          sclAmp: 0.035 + (i % 3) * 0.015,       // scale pulse (±)
          sclSpeed: 0.0003 + (i % 3) * 0.0001,   // pulse speed
          sclPhase: i * 1.1,
          cx: 0, cy: 0                           // smoothed cursor offset
        };
      });
      var tx = 0, ty = 0;
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
      });
      hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; });
      requestAnimationFrame(function frame(now) {
        var w = hero.clientWidth;
        cfg.forEach(function (c) {
          c.cx += (tx - c.cx) * 0.06;
          c.cy += (ty - c.cy) * 0.06;
          var px = -c.cx * w * c.depth + Math.sin(now * c.speed + c.phase) * c.amp;
          var py = -c.cy * w * c.depth + Math.cos(now * c.speed * 0.9 + c.phase) * c.amp;
          var rot = c.baseRot + Math.sin(now * c.rotSpeed + c.rotPhase) * c.rotAmp;
          var scl = 1 + Math.sin(now * c.sclSpeed + c.sclPhase) * c.sclAmp;
          c.el.style.translate = px.toFixed(2) + "px " + py.toFixed(2) + "px";
          c.el.style.rotate = rot.toFixed(2) + "deg";
          c.el.style.scale = scl.toFixed(3);
        });
        requestAnimationFrame(frame);
      });
    });
  }

  /* ---- Equal-height project cards (sticky stack releases as one unit) ---- */
  /* The project cards stack with pure CSS `position: sticky`. Sticky cards of
     different heights un-pin from their pinned positions at different scroll
     points, so the tallest card would let go first and briefly reopen a gap
     above the last card as the stack scrolls away. Giving every card the same
     height makes them un-pin together, so the connected stack scrolls up and
     off as a single block. Motion stays 100% CSS; this only matches heights,
     responsively. Skipped under reduced motion (no sticky stacking there). */
  if (!reduce) {
    var stacks = document.querySelectorAll(".project-stack");
    if (stacks.length) {
      var equalize = function () {
        // On mobile the stack isn't sticky (plain scroll), so equal heights
        // would only add whitespace — clear them and bail.
        var mobile = window.innerWidth <= 760;
        stacks.forEach(function (stack) {
          var cards = Array.prototype.slice.call(
            stack.querySelectorAll(".project-link .project")
          );
          if (cards.length < 2) return;
          cards.forEach(function (c) { c.style.minHeight = ""; });
          if (mobile) return;
          var max = 0;
          cards.forEach(function (c) {
            max = Math.max(max, c.getBoundingClientRect().height);
          });
          cards.forEach(function (c) { c.style.minHeight = max + "px"; });
        });
      };
      equalize();
      // Re-measure once images finish (they change card heights).
      window.addEventListener("load", equalize);
      var rt;
      window.addEventListener("resize", function () {
        clearTimeout(rt);
        rt = setTimeout(equalize, 150);
      });
    }
  }

})();
