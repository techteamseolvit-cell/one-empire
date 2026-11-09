(function () {
  var cfg = window.ONE_EMPIRE_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // header + menú móvil
  var h = $("#site-header");
  var onScroll = function () { h.classList.toggle("solid", scrollY > 40); };
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  var burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", open);
  });

  // revelado al hacer scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add("in"); });

  // flechas de carruseles
  document.querySelectorAll("[data-for]").forEach(function (b) {
    b.addEventListener("click", function () {
      var r = document.getElementById(b.dataset.for);
      r.scrollBy({ left: +b.dataset.dir * (r.firstElementChild.offsetWidth + 18), behavior: "smooth" });
    });
  });

  // contadores (solo cifras con formato $600K+, $180M+)
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var m = el.dataset.count.match(/^(\$?)(\d+)(.*)$/);
    if (!m || reduce || !("IntersectionObserver" in window)) return;
    var end = +m[2], t0;
    new IntersectionObserver(function (es, o) {
      if (!es[0].isIntersecting) return; o.disconnect();
      (function step(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = m[1] + v + m[3]; if (p < 1) requestAnimationFrame(step); })(performance.now());
    }, { threshold: 0.6 }).observe(el);
  });

  // calendario de citas (Google Calendar de Lorena)
  var cal = $("#calendar");
  if (cal) {
    if (cfg.CALENDAR_URL) {
      var f = document.createElement("iframe");
      f.src = cfg.CALENDAR_URL; f.title = "Calendar"; f.loading = "lazy"; cal.appendChild(f);
    } else {
      var p = document.createElement("p"); p.className = "pending"; p.textContent = cal.dataset.pending; cal.appendChild(p);
    }
  }
})();
