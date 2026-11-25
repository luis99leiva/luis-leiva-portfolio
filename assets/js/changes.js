// test-2 branch only: outlines and numbers what changed, plus a list of every change.
// Delete this file (and its <script> tag) before merging into main.
(function () {
  var CHANGES = [
    { n: 1, t: 'Intro card under the headline', d: 'Your photo next to a "Hi, I\'m Luis." card on the warm gradient: your role, the redesign, the design system, and three chips (Asunción, English & Spanish, Liberty University). It replaces the three phones and the two buttons.' },
    { n: 2, t: 'Project cards show the work', d: 'Each card keeps its gradient photo and now carries real screens: app phones for Tu Financiera and FitFlex, Figma variables and text styles for the Design System.' },
    { n: 3, t: 'Headline is your title', d: '"Product & UX/UI designer", with your original sentence under it.' },
    { n: 4, t: 'Tu Financiera told once', d: 'One featured case study opens the projects: five screens, your original description and three results. The "Who I am" block, its stats band, the "Want the full story?" strip and the second teaser lower down are gone, so the work comes right after the hero.' },
    { n: 5, t: 'Filler sections cut', d: 'Services and the Don Norman quote are removed from the home page.', removed: true },
    { n: 7, t: 'Key decisions have visuals', d: 'Decision 01 shows the home that shipped. Decisions 03 and 04 get a before and after flow built from your own text.' },
    { n: 8, t: 'Flowers removed', d: 'Gone from the top of Projects, About and Contact (titles now centered) and from every footer.' },
    { n: 9, t: 'Contact options focused', d: '"Website design" and "SaaS product design" removed from the form.' },
    { n: 10, t: 'Same motion as the live site', d: 'Every reveal, headline blur, count-up, step line and hover zoom uses the live site timing, and the new hero phones rise in one after another.', removed: true },
    { n: 11, t: 'Smaller fixes', d: 'Banca Empresa "coming soon" card hidden. Every project image has alt text. Gray text contrast measured at 5.1 to 5.9:1, which passes AA, so it stays.', removed: true },
    { n: 12, t: 'Shorter Tu Financiera case study', d: 'Nine chapters became six. Results appear once, and context and problem are merged. Dashed boxes mark where your own images go.' },
    { n: 13, t: 'Strategy tabs from your Framer case study', d: 'The five pillars are tabs again, with your own titles, text and screens. Scheduled transfers moved to its own \'After launch\' chapter, so the main story is about the whole app.' },
    { n: 14, t: 'Section list on the case studies', d: 'Small dashes on the right edge mark the chapters and show where you are. Point at them to see the names and jump to a section. On phones and tablets it becomes a pill at the top that names the current chapter and opens the list on tap. On all three case studies.', removed: true },
    { n: 15, t: 'Copy from your Tu Financiera notes', d: 'New header and role (Lead Product Designer), shorter problem, the three decisions in one structure (tension or signal, what I did, trade-off), four product outcomes with one attribution line, what you delivered, and the new What\'s next. Project card copy updated on Home and Projects.' },
    { n: 16, t: 'Before and after from your Figma', d: 'A new tabbed block in Strategy shows the old app next to what shipped for Login, Home, Credit card and Transfers, with what changed in each. Your shipped transfer screen also fills the "before" box in Decision 03. Names in the old screenshots are blurred.' },
    { n: 17, t: 'New decision: confirm the recipient', d: 'Decision 02 is the step your Figma marks as new: the recipient’s name and account before the amount. The scheduled transfers decisions are now 03 and 04.' },
    { n: 18, t: 'Figures open larger', d: 'Tap or click any figure in a case study to open it in a modal. Fig 02.1 now fits tablets, and turns vertical on phones.', removed: true },
    { n: 19, t: 'Decision 03 screen', d: 'One phone, laid out like Decision 04: the savings account with "Tus agendamientos" from your Figma. The before image is gone.' },
    { n: 20, t: 'Decision 04 screen', d: 'The schedule summary from your Figma fills the empty image box: failed months marked "No se envió", a Reintentar button, and options to pause or change the schedule.' },
    { n: 21, t: 'Simpler facts and Credits', d: 'The facts under the intro are now Role, Timeline, Team and Impact, with no extra lines. Credits sit next to Impact.' }
  ];
  var TODO = [
    'Real before screenshots for Decisions 03 and 04 would beat my diagrams. Send them and I will swap them in.',
    'Status for Decisions 02, 03 and 04: shipped, in development or proposed? They show no status until you tell me.',
    'Decision 02 (confirm the recipient): check the tension and trade-off. I wrote them from your Figma screens, not from your notes.',
    'Keep "first customer interviews" only if that is accurate.',
    'Contact form vs. a plain email and LinkedIn link: your call.',
    'Credits: add the PM’s name, and the developers’ names if you want them listed.'
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
  if (store('chg-min') === '1' || (store('chg-min') === null && innerWidth < 760)) root.classList.add('chg-min');

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
  panel.setAttribute('aria-label', 'What changed in test-2');
  panel.innerHTML = '<div class="chg-head"><b>Test 2 · what changed</b><button type="button" class="ghost" data-min></button><button type="button" data-tog></button></div>' +
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
