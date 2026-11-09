/* Felix Manu portfolio: shared script for every page. */
(function () {
  window.dataLayer = window.dataLayer || [];

  // Header gets a border once the page scrolls
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu
  var burger = document.getElementById('burger');
  var panel = document.getElementById('mobilePanel');
  if (burger && panel) {
    var setMenu = function (open) {
      burger.classList.toggle('open', open);
      panel.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () { setMenu(!panel.classList.contains('open')); });
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // GTM: any element with data-track sends an event.
  // <a data-track="contact_click" data-track-location="hero">
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    window.dataLayer.push({
      event: el.dataset.track,
      link_location: el.dataset.trackLocation || '',
      link_type: el.dataset.trackType || '',
      page_path: location.pathname
    });
  });

  // Highlight the nav link for the section in view (only on pages with #anchors)
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var s = document.querySelector(l.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }
})();

/* ---------- Motion v2 ---------- */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // Scroll progress line
  if (!reduce) {
    var bar = document.createElement('div');
    bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }

  // Nav tucks away on scroll down, returns on scroll up
  var nav = document.querySelector('.site-nav');
  var panel = document.getElementById('mobilePanel');
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = root.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (nav && !reduce) {
      var menuOpen = panel && panel.classList.contains('open');
      nav.classList.toggle('tucked', !menuOpen && y > 400 && y > lastY + 4);
      if (y < lastY - 4 || y < 400) nav.classList.remove('tucked');
    }
    lastY = y; ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // Keyboard users: never hide the nav while focus is inside it
  if (nav) nav.addEventListener('focusin', function () { nav.classList.remove('tucked'); });

  if (reduce || !('IntersectionObserver' in window)) {
    root.classList.remove('js');
    return;
  }

  // Split headings into words
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(/\s+/).forEach(function (word, i) {
      var outer = document.createElement('span'), inner = document.createElement('span');
      outer.className = 'w'; outer.setAttribute('aria-hidden', 'true');
      inner.style.setProperty('--i', i); inner.textContent = word;
      outer.appendChild(inner); el.appendChild(outer);
      el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('split');
  });

  // Tag elements to reveal. Siblings in a group get a small stagger.
  var groups = [
    '.proof > *', '.section-head > *', '.group-head', '.group-note', '.case-filter',
    '.case-feature .body > *', '.case-row', '.about .lede', '.about .body p', '.facts > div',
    '.contact .lede', '.contact-email', '.contact .actions',
    '.block > h2', '.block > p', '.block > .callout', '.block > .stat-row',
    '.block > .figure', '.block > .table-wrap', '.block > .panel', '.block > .grid-2', '.block > .grid-3',
    '.block > .flow-steps', '.block > .post', '.block > .paper', '.block > .actions', '.block > .source-list',
    '.block > .file-list', '.block > .metrics', '.case-next'
  ];
  groups.forEach(function (sel) {
    var seen = new Map();
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.hasAttribute('data-split') || el.closest('.hero')) return;
      var parent = el.parentElement, n = seen.get(parent) || 0;
      seen.set(parent, n + 1);
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', Math.min(n * 0.07, 0.42) + 's');
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('in'); io.unobserve(el);
      // Hand the element back to its own hover transitions once it has arrived
      if (el.hasAttribute('data-reveal')) {
        var d = parseFloat(el.style.getPropertyValue('--d')) || 0;
        setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('in'); }, 1400 + d * 1000);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-reveal], .split').forEach(function (el) { io.observe(el); });

  // Printing or saving as PDF: show everything at once
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('[data-reveal], .split').forEach(function (el) { el.classList.add('in'); });
  });

  // Cursor spotlight on case cards
  document.querySelectorAll('.case-feature, .case-row, .card').forEach(function (el) {
    el.classList.add('spot');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
