// Luis Leiva · Portfolio
(function () {
  document.documentElement.classList.remove('no-js');

  // Paragraphs: a no-break space between the last two words, so no line ends up with one word alone
  var glue = function (p) {
    var tw = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n, last = null;
    while ((n = tw.nextNode())) if (/\S/.test(n.data)) last = n;
    if (last) last.data = last.data.replace(/(\S)[ \t\n\r]+(\S+\s*)$/, '$1 $2');
  };
  document.querySelectorAll('p').forEach(glue);

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
    // the last two words travel together, so a title never ends with one word alone on its line
    var ws = el.querySelectorAll('.w'), a = ws[ws.length - 2], b = ws[ws.length - 1];
    if (a && a.parentNode === b.parentNode) {
      var keep = document.createElement('span');
      keep.className = 'keep';
      a.parentNode.insertBefore(keep, a);
      while (keep.nextSibling !== b) keep.appendChild(keep.nextSibling);
      keep.appendChild(b);
    }
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
      // one unbroken stroke through every circle's center; the circles sit on top of it
      var d = pts.length ? 'M' + pts[0].x + ' ' + pts[0].y : '';
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1], h = b.y - a.y, sw = 14;
        d += 'C' + (a.x + sw) + ' ' + (a.y + h * .45) + ' ' + (b.x - sw) + ' ' + (b.y - h * .45) + ' ' + b.x + ' ' + b.y;
      }
      path.setAttribute('d', d);
      path.style.setProperty('--len', d ? Math.ceil(path.getTotalLength()) + 'px' : '0');
    };
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(ol);
    else window.addEventListener('resize', draw);
    // the line draws only once the list is well into view, not when its top edge first peeks in
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { ol.classList.add('drawn'); seen.disconnect(); }
      }, { rootMargin: '0px 0px -35% 0px' });
      seen.observe(ol);
    } else ol.classList.add('drawn');
  });

  // Reveal on scroll; blocks that enter together are staggered top to bottom, left to right
  var startReveals = function () {
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
  };

  // Intro loader: the name writes itself in, holds, then the panel lifts off the page.
  // Plays once per browser session; the inline head script decides (and skips it for reduced motion).
  var root = document.documentElement;
  var loader = document.querySelector('.loader');
  if (loader && root.classList.contains('is-loading')) {
    var nameEl = loader.querySelector('.loader-name');
    nameEl.innerHTML = nameEl.textContent.split('').map(function (ch, k) {
      return ch === ' ' ? '<span class="sp"> </span>' : '<span style="--i:' + k + '">' + ch + '</span>';
    }).join('');
    try { sessionStorage.setItem('ll-intro', '1'); } catch (e) {}
    var t0 = performance.now();
    var MIN = 1900;           // letters (~1.1s) plus a short hold
    var loaded = document.readyState === 'complete';
    var done = false;
    var exit = function () {
      if (done) return; done = true;
      loader.classList.add('out');
      setTimeout(startReveals, 350);          // hero animates in while the panel is still lifting
      setTimeout(function () { root.classList.remove('is-loading'); loader.remove(); }, 1150);
    };
    var tryExit = function () {
      var wait = Math.max(0, MIN - (performance.now() - t0));
      setTimeout(exit, wait);
    };
    requestAnimationFrame(function () { loader.classList.add('play'); });
    if (loaded) tryExit(); else window.addEventListener('load', tryExit);
    setTimeout(exit, 4500);                  // never hold the page longer than this
  } else {
    if (loader) loader.remove();
    startReveals();
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
        glue(desc);
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
  // Contact form: sends through Web3Forms straight to the inbox.
  // Paste the access key from web3forms.com here; while it is empty the form falls back to opening the email app.
  var W3F_KEY = '48c4807e-c582-4b98-981a-0196c48a3b49';
  var MAIL = '<a href="mailto:luis99leiva@gmail.com">luis99leiva@gmail.com</a>';
  document.querySelectorAll('[data-mailto]').forEach(function (form) {
    var note = form.querySelector('.form-note');
    var btn = form.querySelector('.submit');
    var label = btn && btn.firstChild;          // the "Send message" text before the arrow icon
    var say = function (html) { if (note) note.innerHTML = html; };
    if (W3F_KEY) {
      say('Goes straight to my inbox, or write to ' + MAIL);
      if (note) note.setAttribute('aria-live', 'polite');
      // hidden spam trap: people never see or tick it, bots do
      var trap = document.createElement('input');
      trap.type = 'checkbox'; trap.name = 'botcheck'; trap.tabIndex = -1;
      trap.setAttribute('aria-hidden', 'true'); trap.style.display = 'none';
      form.appendChild(trap);
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var topic = form.querySelector('[name="topic"]:checked');
      var subject = 'Portfolio inquiry' + (topic ? ': ' + topic.value : '') + (v('name') ? ' from ' + v('name') : '');
      if (!W3F_KEY) {
        var body = v('message') + '\n\n' + v('name') + (v('email') ? '\n' + v('email') : '');
        window.location.href = 'mailto:luis99leiva@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.trim());
        return;
      }
      if (btn.disabled) return;
      btn.disabled = true;
      label.data = 'Sending… ';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY, subject: subject, from_name: 'Portfolio: ' + v('name'),
          name: v('name'), email: v('email'), topic: topic ? topic.value : '', message: v('message'),
          botcheck: form.querySelector('[name="botcheck"]').checked
        })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (!res.success) throw new Error(res.message);
        form.reset();
        label.data = 'Message sent ';
        say('Thanks, it&rsquo;s in my inbox. I usually reply within a couple of working days.');
        setTimeout(function () { label.data = 'Send message '; btn.disabled = false; }, 4000);
      }).catch(function () {
        label.data = 'Send message ';
        btn.disabled = false;
        say('That didn&rsquo;t go through. Please try again, or write to ' + MAIL);
      });
    });
  });

  // Case study tabs: one panel at a time, arrow keys move between tabs
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = box.querySelectorAll('[role="tab"]');
    var pick = function (t) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', String(on)); o.tabIndex = on ? 0 : -1;
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        ev.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); pick(n);
      });
    });
  });

  // Case studies: section list on the right edge. Dashes mark the chapters, the current one
  // is longer and brighter, and hovering (or tabbing in) opens the names.
  var chapters = document.querySelectorAll('.row.chapter');
  if (chapters.length > 2) {
    var toc = document.createElement('nav');
    toc.className = 'toc';
    toc.setAttribute('aria-label', 'Case study sections');
    var tocList = document.createElement('ol');
    var tocLinks = [], tocNames = [];
    chapters.forEach(function (ch, i) {
      var lab = ch.querySelector('.row-label'), num = lab && lab.querySelector('b');
      var name = lab ? lab.textContent.replace(num ? num.textContent : '', '').trim() : 'Section ' + (i + 1);
      if (!ch.id) ch.id = 'section-' + (i + 1);
      tocNames.push((num ? num.textContent + ' \u00b7 ' : '') + name);
      var li = document.createElement('li'), link = document.createElement('a'), text = document.createElement('span');
      link.href = '#' + ch.id;
      text.textContent = name;
      link.appendChild(text);
      link.appendChild(document.createElement('i'));
      link.addEventListener('click', function (ev) {
        ev.preventDefault();
        tocClose();
        window.scrollTo({ top: ch.getBoundingClientRect().top + window.scrollY + 40, behavior: 'smooth' });
        if (history.replaceState) history.replaceState(null, '', '#' + ch.id);
      });
      li.appendChild(link); tocList.appendChild(li); tocLinks.push(link);
    });
    // phones and tablets: a pill at the top names the current chapter and opens the list on tap
    var tocBtn = document.createElement('button');
    tocBtn.type = 'button';
    tocBtn.className = 'toc-toggle';
    tocBtn.setAttribute('aria-expanded', 'false');
    tocBtn.setAttribute('aria-label', 'Case study sections');
    var tocNow = document.createElement('span');
    tocBtn.appendChild(tocNow);
    tocBtn.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    var tocClose = function () { toc.classList.remove('open'); tocBtn.setAttribute('aria-expanded', 'false'); };
    tocBtn.addEventListener('click', function () {
      tocBtn.setAttribute('aria-expanded', String(toc.classList.toggle('open')));
    });
    document.addEventListener('click', function (ev) { if (!toc.contains(ev.target)) tocClose(); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') tocClose(); });
    toc.appendChild(tocBtn);
    toc.appendChild(tocList);
    document.body.appendChild(toc);
    var tocUpdate = function () {
      var mark = window.innerHeight * 0.45, cur = -1;
      chapters.forEach(function (ch, i) { if (ch.getBoundingClientRect().top <= mark) cur = i; });
      var last = chapters[chapters.length - 1].getBoundingClientRect();
      var shown = cur > -1 && last.bottom > window.innerHeight * 0.3;
      toc.classList.toggle('show', shown);
      if (!shown) tocClose();
      if (cur > -1) tocNow.textContent = tocNames[cur];
      tocLinks.forEach(function (l, i) {
        l.classList.toggle('on', i === cur);
        if (i === cur) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', tocUpdate, { passive: true });
    window.addEventListener('resize', tocUpdate);
    tocUpdate();
  }

  // Case study figures open larger in a modal when tapped or clicked
  var figs = document.querySelectorAll('.fig .frame');
  if (figs.length && window.HTMLDialogElement) {
    var lb = document.createElement('dialog');
    lb.className = 'lightbox';
    lb.setAttribute('aria-label', 'Figure, enlarged');
    lb.innerHTML = '<div class="lb-inner"><button type="button" class="lb-close" aria-label="Close"><svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button><div class="lb-body"></div><div class="lb-cap"></div></div>';
    document.body.appendChild(lb);
    var lbBody = lb.querySelector('.lb-body'), lbCap = lb.querySelector('.lb-cap'), lbFrom = null;
    var lbClose = function () { if (lb.open) lb.close(); };
    lb.addEventListener('close', function () {
      document.documentElement.classList.remove('lb-open');
      lbBody.innerHTML = ''; lbCap.innerHTML = '';
      if (lbFrom) lbFrom.focus();
    });
    lb.querySelector('.lb-close').addEventListener('click', lbClose);
    lb.addEventListener('click', function (ev) { if (ev.target === lb) lbClose(); });
    var lbOpen = function (frame) {
      lbFrom = frame;
      var copy = frame.cloneNode(true);
      copy.removeAttribute('role'); copy.removeAttribute('tabindex'); copy.removeAttribute('aria-label');
      var hint = copy.querySelector('.zoom-hint'); if (hint) hint.remove();
      // SVG ids must stay unique, or arrowheads point at the hidden original
      copy.querySelectorAll('[id]').forEach(function (el) {
        var old = el.id, neu = old + '-lb';
        el.id = neu;
        copy.querySelectorAll('[marker-end="url(#' + old + ')"]').forEach(function (m) { m.setAttribute('marker-end', 'url(#' + neu + ')'); });
      });
      copy.querySelectorAll('img').forEach(function (i) { i.loading = 'eager'; });
      lbBody.appendChild(copy);
      var cap = frame.parentNode.querySelector('figcaption');
      if (cap) lbCap.innerHTML = cap.innerHTML;
      document.documentElement.classList.add('lb-open');
      lb.showModal();
    };
    figs.forEach(function (frame) {
      frame.classList.add('zoomable');
      frame.setAttribute('role', 'button');
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('aria-label', 'Open this figure larger');
      frame.addEventListener('click', function () { lbOpen(frame); });
      frame.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); lbOpen(frame); }
      });
    });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
