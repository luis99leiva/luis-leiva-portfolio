// test-1 branch only: outlines and numbers what changed, plus a list of every change.
// Delete this file (and its <script> tag) before merging into main.
(function () {
  var CHANGES = [
    { n: 1, t: 'Hero shows the app', d: 'Three real Tu Financiera screens replace the dot grid on a blurred gradient.' },
    { n: 2, t: 'Project visuals are the work', d: 'Phone screens and design system sheets replace the blurry photos on the cards and the case study teaser.' },
    { n: 3, t: 'Sharper headline', d: '"I design mobile fintech apps people can use on their own", with a shorter lead under it.' },
    { n: 4, t: 'Tu Financiera told once', d: 'Stats band and "Want the full story?" strip removed. The featured case study moved up with three stats, and the grid now shows the other projects.' },
    { n: 5, t: 'Filler sections cut', d: 'Services list and the Don Norman quote are gone from the home page.', removed: true },
    { n: 6, t: 'Case study shows the app', d: 'Phones on the Tu Financiera cover, and the "after" home screen next to Decision 01. The repeated screen strip under the cover is gone.' },
    { n: 7, t: 'Faster, gentler animations', d: 'Shorter reveals that start as soon as content enters the screen. With "reduce motion" turned on, nothing animates.', removed: true },
    { n: 8, t: 'Smaller fixes', d: 'Banca Empresa "coming soon" card hidden, footer flower removed, alt text on every project image. Gray text contrast checked: 5.1 to 5.9:1, passes AA, so no change.', removed: true },
    { n: 9, t: 'Contact options focused', d: '"Website design" and "SaaS product design" removed from the form.' }
  ];
  var TODO = [
    'Before screens for Decisions 02 and 03 (the scheduled transfers entry point and the failed payment options): I don\'t have those images.',
    'Confirm what the 97% satisfaction measured, and the case study dates.',
    'Form vs. a plain email + LinkedIn link: your call, depending on whether the site is for job applications or clients.'
  ];

  var css = document.createElement('style');
  css.textContent =
    '.chg-box{position:absolute;z-index:9998;pointer-events:none;border:2px dashed #ffd23f;border-radius:14px;box-shadow:0 0 0 4px rgb(255 210 63 / .12)}' +
    '.chg-num{position:absolute;top:-13px;left:-13px;width:26px;height:26px;border-radius:50%;background:#ffd23f;color:#1a1206;font:700 13px/26px Geist,system-ui,sans-serif;text-align:center}' +
    '.chg-panel{position:fixed;z-index:9999;left:16px;bottom:16px;width:340px;max-width:calc(100vw - 32px);max-height:70vh;display:flex;flex-direction:column;border-radius:16px;background:#1b1610;color:#f3eadf;border:1px solid #ffd23f55;box-shadow:0 20px 50px rgb(0 0 0 / .5);font:14px/20px Geist,system-ui,sans-serif}' +
    '.chg-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #ffffff14}' +
    '.chg-head b{flex:1;font-weight:600}' +
    '.chg-head button{border:0;border-radius:8px;padding:5px 9px;background:#ffd23f;color:#1a1206;font:600 12px Geist,system-ui,sans-serif;cursor:pointer}' +
    '.chg-head button.ghost{background:#ffffff14;color:#f3eadf}' +
    '.chg-list{overflow:auto;padding:6px 14px 12px}' +
    '.chg-item{display:grid;grid-template-columns:22px 1fr;gap:8px;padding:8px 0;border-bottom:1px solid #ffffff0d}' +
    '.chg-item i{font-style:normal;width:22px;height:22px;border-radius:50%;background:#ffd23f;color:#1a1206;font:700 12px/22px Geist,system-ui,sans-serif;text-align:center}' +
    '.chg-item p{margin:0}.chg-item small{display:block;color:#b9ab9d;font-size:12.5px;line-height:18px}' +
    '.chg-item a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
    '.chg-todo{margin-top:10px;padding:10px;border-radius:10px;background:#ffffff0a;color:#b9ab9d;font-size:12.5px;line-height:18px}' +
    '.chg-todo b{color:#f3eadf}.chg-todo li{margin:4px 0 0 16px}' +
    '.chg-off .chg-box{display:none}.chg-min .chg-list{display:none}';
  document.head.appendChild(css);

  var store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var root = document.documentElement;
  if (store('chg-off') === '1') root.classList.add('chg-off');
  if (store('chg-min') === '1') root.classList.add('chg-min');

  // dashed boxes drawn over each changed element (outlines would be clipped by the rounded image masks)
  var boxes = [];
  document.querySelectorAll('[data-change]').forEach(function (el) {
    var b = document.createElement('div');
    b.className = 'chg-box';
    b.innerHTML = '<span class="chg-num">' + el.getAttribute('data-change') + '</span>';
    document.body.appendChild(b);
    boxes.push([el, b]);
  });
  var place = function () {
    boxes.forEach(function (p) {
      var r = p[0].getBoundingClientRect(), b = p[1];
      var hidden = !r.width || !r.height;
      b.style.display = hidden ? 'none' : '';
      b.style.left = (r.left + scrollX - 6) + 'px'; b.style.top = (r.top + scrollY - 6) + 'px';
      b.style.width = (r.width + 12) + 'px'; b.style.height = (r.height + 12) + 'px';
    });
  };
  var queued = false;
  var schedule = function () { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; place(); }); } };
  addEventListener('resize', schedule); addEventListener('scroll', schedule, { passive: true }); addEventListener('load', schedule);
  setInterval(place, 600);   // reveal animations move things for a moment after they enter
  place();

  var here = {};
  boxes.forEach(function (p) { here[p[0].getAttribute('data-change')] = here[p[0].getAttribute('data-change')] || p[0]; });

  var panel = document.createElement('aside');
  panel.className = 'chg-panel';
  panel.setAttribute('aria-label', 'What changed in test-1');
  panel.innerHTML = '<div class="chg-head"><b>Test 1 · what changed</b><button type="button" class="ghost" data-min></button><button type="button" data-tog></button></div>' +
    '<div class="chg-list">' + CHANGES.map(function (c) {
      var link = here[c.n] ? ' <a href="#" data-go="' + c.n + '">show</a>' : (c.removed ? '' : ' <small>(on another page)</small>');
      return '<div class="chg-item"><i>' + c.n + '</i><div><p>' + c.t + link + '</p><small>' + c.d + '</small></div></div>';
    }).join('') +
    '<div class="chg-todo"><b>Still needs you</b><ul>' + TODO.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div></div>';
  document.body.appendChild(panel);

  var tog = panel.querySelector('[data-tog]'), min = panel.querySelector('[data-min]');
  var label = function () {
    tog.textContent = root.classList.contains('chg-off') ? 'Show highlights' : 'Hide highlights';
    min.textContent = root.classList.contains('chg-min') ? 'Expand' : 'Collapse';
  };
  tog.addEventListener('click', function () { store('chg-off', root.classList.toggle('chg-off') ? '1' : '0'); label(); });
  min.addEventListener('click', function () { store('chg-min', root.classList.toggle('chg-min') ? '1' : '0'); label(); });
  panel.addEventListener('click', function (e) {
    var go = e.target.getAttribute && e.target.getAttribute('data-go');
    if (!go) return;
    e.preventDefault();
    here[go].scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  label();
})();
