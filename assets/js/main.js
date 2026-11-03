// Luis Leiva · Portfolio
(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  if (btn) btn.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Headline words blur in, one after another
  document.querySelectorAll('.split').forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            s.style.transitionDelay = (i++ * 0.06) + 's';
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    })(el);
  });

  // Quotes rise in letter by letter (words stay unbroken)
  document.querySelectorAll('.quote blockquote').forEach(function (el) {
    var i = 0;
    el.setAttribute('aria-label', el.textContent);
    el.classList.add('chars');
    var frag = document.createDocumentFragment();
    el.textContent.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
      var w = document.createElement('span');
      w.className = 'cw';
      w.setAttribute('aria-hidden', 'true');
      Array.from(part).forEach(function (ch) {
        var c = document.createElement('span');
        c.className = 'c';
        c.textContent = ch;
        c.style.transitionDelay = (0.3 + i++ * 0.012) + 's';
        w.appendChild(c);
      });
      frag.appendChild(w);
    });
    el.textContent = '';
    el.appendChild(frag);
  });

  // List items follow one another
  document.querySelectorAll('.steps, .numbered').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (li, i) {
      li.style.transitionDelay = (0.1 + i * 0.12) + 's';
    });
  });

  // Stats count up from zero, keeping their prefix, suffix and separators
  var countUp = function (el) {
    var m = el.textContent.trim().match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return;
    var end = parseFloat(m[2].replace(/,/g, ''));
    var decimals = (m[2].split('.')[1] || '').length;
    var commas = m[2].indexOf(',') > -1;
    var start = null;
    var step = function (t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 1600, 1);
      var v = end * (1 - Math.pow(2, -10 * p));
      if (p === 1) v = end;
      var s = v.toFixed(decimals);
      if (commas) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals });
      el.textContent = m[1] + s + m[3];
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Steps: a wavy line joins the numbers, swinging right then left like a hand-drawn stroke
  document.querySelectorAll('.steps').forEach(function (ol) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    var path = document.createElementNS(NS, 'path');
    svg.setAttribute('class', 'steps-path');
    svg.setAttribute('aria-hidden', 'true');
    svg.appendChild(path);
    ol.insertBefore(svg, ol.firstChild);
    ol.classList.add('has-path');
    var draw = function () {
      // layout offsets, not screen rects, so the steps' slide-in transform doesn't shift the line
      var pts = Array.prototype.map.call(ol.querySelectorAll('.circle'), function (c) {
        var s = c.offsetParent;
        return { x: s.offsetLeft + c.offsetLeft + c.offsetWidth / 2, y: s.offsetTop + c.offsetTop + c.offsetHeight / 2, r: c.offsetHeight / 2 };
      });
      var d = '';
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1], y0 = a.y + a.r, y1 = b.y - b.r, h = y1 - y0;
        var sw = (i % 2 ? -1 : 1) * 14;
        d += 'M' + a.x + ' ' + y0 + 'C' + (a.x + sw) + ' ' + (y0 + h * .45) + ' ' + (b.x - sw) + ' ' + (y1 - h * .45) + ' ' + b.x + ' ' + y1;
      }
      path.setAttribute('d', d);
      path.style.setProperty('--len', d ? Math.ceil(path.getTotalLength()) + 'px' : '0');
    };
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(ol);
    else window.addEventListener('resize', draw);
  });

  // Reveal on scroll; blocks that enter together are staggered top to bottom, left to right
  var targets = document.querySelectorAll('.reveal, .split, .num');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left); })
        .forEach(function (e, i) {
          var el = e.target;
          io.unobserve(el);
          if (el.classList.contains('num')) { countUp(el); return; }
          if (i && el.classList.contains('reveal')) {
            el.style.transitionDelay = (i * 0.1) + 's';
            setTimeout(function () { el.style.transitionDelay = ''; }, i * 100 + 1200);
          }
          el.classList.add('in');
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // Services list: switch the panel text
  var list = document.querySelector('[data-services]');
  if (list) {
    var items = list.querySelectorAll('.svc');
    var title = document.querySelector('[data-svc-title]');
    var desc = document.querySelector('[data-svc-desc]');
    var swap = document.querySelector('.svc-panel .fade-swap');
    var select = function (it) {
      if (it.getAttribute('aria-selected') === 'true') return;
      items.forEach(function (o) { o.setAttribute('aria-selected', 'false'); o.tabIndex = -1; });
      it.setAttribute('aria-selected', 'true'); it.tabIndex = 0;
      swap.classList.add('out');
      setTimeout(function () {
        title.textContent = it.getAttribute('data-title');
        desc.textContent = it.getAttribute('data-desc');
        swap.classList.remove('out');
      }, 200);
    };
    items.forEach(function (it, idx) {
      it.addEventListener('click', function () { select(it); });
      it.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) select(it); });
      it.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        ev.preventDefault();
        var n = items[(idx + d + items.length) % items.length];
        n.focus(); select(n);
      });
    });
  }

  // Prototype videos: play only while visible
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (vids.length && 'IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { v.muted = true; v.loop = true; v.playsInline = true; vo.observe(v); });
  }

  // Contact form opens the visitor's email app (GitHub Pages has no server)
  document.querySelectorAll('[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var topic = form.querySelector('[name="topic"]:checked');
      var subject = 'Portfolio inquiry' + (topic ? ': ' + topic.value : '') + (v('name') ? ' from ' + v('name') : '');
      var body = v('message') + '\n\n' + v('name') + (v('email') ? '\n' + v('email') : '');
      window.location.href = 'mailto:luis99leiva@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.trim());
    });
  });

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
