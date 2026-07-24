/* ============================================================================
   Criminal Procedure Study Guide — Broadsheet
   Data-driven shell: left-rail taxonomy, per-page plate header, right-rail TOC
   and cluster guide, collapsible case briefs, and print/PDF export.
   ============================================================================ */

/* ---- Mascots (cluster guides) ------------------------------------------- */
const MASCOTS = {
  felipe: { img: 'assets/felipe.png', name: 'Felipe the Fourth Amendment Fox',
    desc: 'Guardian of privacy rights and protection against unreasonable searches & seizures.' },
  waru:   { img: 'assets/waru.png', name: 'Waru the Warrant Exception Quokka',
    desc: 'Navigator of the complex maze of warrant exceptions.' },
  tulio:  { img: 'assets/tulio.png', name: 'Tulio the Terry Stop Tapir',
    desc: 'Overseer of brief investigative detentions and protective pat-downs.' },
  etana:  { img: 'assets/Etana.png', name: 'Etana the Exclusionary Rule Elephant',
    desc: 'Gatekeeper who blocks improperly obtained evidence.' },
  miguel: { img: 'assets/miguel.png', name: 'Miguel the Miranda Macaw',
    desc: 'Communicator of rights and protector against self-incrimination.' },
  // Proposed guides — art pending; the guide block hides itself until the
  // portrait file exists (see buildGuide).
  jada:   { img: 'assets/jada.png', name: 'Jada the Jury-Trial Jaguar',
    desc: 'Steward of guilty pleas and the right to a fair trial by an impartial jury.' },
  deja:   { img: 'assets/deja.png', name: 'Deja the Double-Jeopardy Deer',
    desc: 'Keeper of the bar against a second prosecution and of proportional punishment.' },
  harlan: { img: 'assets/harlan.png', name: 'Harlan the Habeas Owl',
    desc: 'Reviewer of error on appeal and of the habeas corpus writ.' },
};

/* ---- Taxonomy: 7 groups / 19 topics ------------------------------------- */
/* track: 'accent' (cyan) or 'accent-2' (magenta) — a CONTENT signal only
   (plate numeral colour), never a left-rail signal. The rail stays neutral,
   cyan on the active topic alone. */
const GROUPS = [
  { num: '01', phase: '4th Am. — Coverage & Thresholds', track: 'accent',
    kickerTop: 'Fourth Amendment', kickerBottom: 'Coverage & Thresholds', items: [
      { id: 'fourth-amendment-applicability', label: 'To Whom the 4th Am. Applies', title: 'To Whom the 4th Amendment Applies', mascot: 'felipe' },
      { id: 'search-seizure', label: 'Search & Seizure', title: 'Search & Seizure', mascot: 'felipe' },
      { id: 'technology-searches', label: 'Technology & the 4th Am.', title: 'Technology & the Fourth Amendment', mascot: 'felipe' },
      { id: 'third-party-doctrine', label: 'Third-Party Doctrine', title: 'Third-Party Doctrine', mascot: 'felipe' },
      { id: 'fourth-amendment-standing', label: 'Standing', title: 'Fourth Amendment Standing', mascot: 'felipe' },
  ]},
  { num: '02', phase: '4th Am. — Warrants, Exceptions & Stops', track: 'accent',
    kickerTop: 'Fourth Amendment', kickerBottom: 'Warrants, Exceptions & Stops', items: [
      { id: 'warrant-requirements', label: 'Warrant Requirements', title: 'Warrant Requirements', mascot: 'felipe' },
      { id: 'warrant-exceptions', label: 'Warrant Exceptions', title: 'Warrant Exceptions', mascot: 'waru' },
      { id: 'terry-stops', label: 'Terry Stops', title: 'Terry Stops', mascot: 'tulio' },
      { id: 'special-needs', label: 'Special Needs & Admin. Searches', title: 'Special Needs & Administrative Searches', mascot: 'waru' },
  ]},
  { num: '03', phase: 'Exclusionary Rule & Remedies', track: 'accent-2',
    kickerTop: 'Remedies', kickerBottom: 'Exclusionary Rule', items: [
      { id: 'exclusionary-rule', label: 'Exclusionary Rule', title: 'The Exclusionary Rule', mascot: 'etana' },
  ]},
  { num: '04', phase: 'Confessions & Right to Counsel', track: 'accent-2',
    kickerTop: 'Fifth & Sixth Amendments', kickerBottom: 'Confessions & Counsel', items: [
      { id: 'interrogations', label: 'Interrogations & Confessions', title: 'Interrogations & Confessions', mascot: 'miguel' },
      { id: 'right-to-counsel', label: 'Right to Counsel', title: 'Right to Counsel', mascot: 'miguel' },
  ]},
  { num: '05', phase: 'Pleas, Trial & Jury', track: 'accent-2',
    kickerTop: 'Sixth Amendment', kickerBottom: 'Pleas, Trial & Jury', items: [
      { id: 'guilty-pleas', label: 'Guilty Pleas', title: 'Guilty Pleas', mascot: 'jada' },
      { id: 'fair-trial', label: 'Fair Trial & Jury', title: 'Fair Trial & Jury', mascot: 'jada' },
  ]},
  { num: '06', phase: 'Double Jeopardy & Punishment', track: 'accent-2',
    kickerTop: 'Fifth & Eighth Amendments', kickerBottom: 'Double Jeopardy & Punishment', items: [
      { id: 'double-jeopardy', label: 'Double Jeopardy', title: 'Double Jeopardy', mascot: 'deja' },
      { id: 'cruel-unusual-punishment', label: 'Cruel & Unusual Punishment', title: 'Cruel & Unusual Punishment', mascot: 'deja' },
  ]},
  { num: '07', phase: 'Post-Conviction Review', track: 'accent-2',
    kickerTop: 'Post-Conviction', kickerBottom: 'Review', items: [
      { id: 'appeals-and-error', label: 'Appeal & Error', title: 'Appeal & Error', mascot: 'harlan' },
      { id: 'habeas-corpus', label: 'Habeas Corpus', title: 'Habeas Corpus', mascot: 'harlan' },
  ]},
];

/* Flatten to id -> {group, item} for quick lookup. */
const TOPICS = {};
GROUPS.forEach((g, gi) => g.items.forEach((it) => { TOPICS[it.id] = { group: g, groupIndex: gi, item: it }; }));

const OVERVIEW = { id: 'overview', num: '00', title: 'Overview',
  kickerTop: 'The Guide', kickerBottom: 'Orientation & Mascots' };

/* Flowchart palette remap: retint the legacy green/rust mermaid classDefs to
   the Broadsheet cyan/magenta/neutral scale without editing 19 section files. */
const MERMAID_RECOLOR = {
  '#E6F2EE': '#e9f8ff', '#83BCA9': '#0088b0', '#5A7A5F': '#605d5d',
  '#EEF2EF': '#f8f4f4', '#FBEFEB': '#fff1f4', '#D36135': '#d6006c',
  '#ECF5F2': '#e9f8ff', '#F3F8F6': '#f8f4f4', '#FBEEE8': '#fff1f4',
  '#E48B66': '#aa0b56', '#F5B596': '#ffc0d0', '#A24936': '#aa0b56',
};

let tocObserver = null;

/* ---- Boot --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initMermaid();
  buildNav();
  setupControls();
  setupSearch();
  routeFromHash();
  window.addEventListener('hashchange', routeFromHash);
});

function initMermaid() {
  if (typeof mermaid === 'undefined') return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    fontFamily: '"Source Serif 4", Georgia, serif',
    fontSize: 14,
    flowchart: { htmlLabels: true, useMaxWidth: true, curve: 'basis', nodeSpacing: 55, rankSpacing: 70 },
    themeVariables: {
      primaryColor: '#e9f8ff', primaryTextColor: '#201e1d', primaryBorderColor: '#0088b0',
      lineColor: '#605d5d', secondaryColor: '#fff1f4', tertiaryColor: '#f8f4f4',
      fontFamily: '"Source Serif 4", Georgia, serif',
    },
    securityLevel: 'loose',
  });
}

/* ---- Left-rail navigation ----------------------------------------------- */
function buildNav() {
  const nav = document.getElementById('bs-nav');
  if (!nav) return;
  let html = '';

  // Overview link (single, above the groups).
  html += navLink('overview', 'Overview', 'bs-overview');

  GROUPS.forEach((g) => {
    let items = '';
    g.items.forEach((it) => { items += navLink(it.id, it.label); });
    html +=
      '<details class="bs-grp" data-group="' + g.num + '">' +
        '<summary>' +
          '<svg class="navcaret" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-600)" stroke-width="2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>' +
          '<span class="bs-grp-label">' + g.num + ' · ' + esc(g.phase) + '</span>' +
        '</summary>' +
        '<div>' + items + '</div>' +
      '</details>';
  });

  nav.innerHTML = html;

  nav.querySelectorAll('a[data-section]').forEach((a) => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      navigateTo(this.getAttribute('data-section'));
    });
  });
}

function navLink(id, label, extra) {
  return '<a class="bs-navlink ' + (extra || '') + '" href="#' + id + '" data-section="' + id + '">' +
           '<span class="dot"></span>' + esc(label) +
         '</a>';
}

/* ---- Routing ------------------------------------------------------------ */
function routeFromHash() {
  const hash = (window.location.hash || '').replace(/^#/, '');
  const id = (hash && (TOPICS[hash] || hash === 'overview')) ? hash : 'overview';
  loadSection(id);
}

function navigateTo(id) {
  if (('#' + id) === window.location.hash) { loadSection(id); }
  else { window.location.hash = id; } // triggers routeFromHash
}

function setActiveNav(id) {
  document.querySelectorAll('#bs-nav .bs-navlink').forEach((l) => l.classList.remove('active'));
  const link = document.querySelector('#bs-nav .bs-navlink[data-section="' + id + '"]');
  if (link) link.classList.add('active');

  // Open the active topic's group; collapse the others.
  const meta = TOPICS[id];
  document.querySelectorAll('#bs-nav .bs-grp').forEach((d) => { d.open = false; });
  if (meta) {
    const grp = document.querySelector('#bs-nav .bs-grp[data-group="' + meta.group.num + '"]');
    if (grp) grp.open = true;
  }
}

/* ---- Section loading ---------------------------------------------------- */
function loadSection(id) {
  const container = document.getElementById('content-container');
  if (!container) return;
  setActiveNav(id);
  buildPageHead(id);
  buildGuide(id);
  container.innerHTML = '<div class="loading">Loading content…</div>';

  fetch('./sections/' + id + '.html')
    .then((r) => { if (!r.ok) throw new Error('Section not found'); return r.text(); })
    .then((html) => {
      container.innerHTML = html;
      enhanceContent(container);
      buildToc(container);
      renderMermaid(container);
      window.scrollTo(0, 0);
    })
    .catch((err) => {
      console.error('Error loading section:', err);
      container.innerHTML =
        '<div class="warning"><h4>Content unavailable</h4><p>Sorry, we couldn’t load the ' +
        esc(id) + ' section. Please try again.</p></div>';
    });
}

/* Build the plate numeral + kicker + headline for the active topic. */
function buildPageHead(id) {
  const head = document.getElementById('bs-pagehead');
  if (!head) return;
  let num, title, kTop, kBottom, track;
  if (id === 'overview') {
    num = OVERVIEW.num; title = OVERVIEW.title;
    kTop = OVERVIEW.kickerTop; kBottom = OVERVIEW.kickerBottom; track = 'accent';
  } else {
    const meta = TOPICS[id];
    if (!meta) { head.innerHTML = ''; return; }
    num = meta.group.num; title = meta.item.title;
    kTop = meta.group.kickerTop; kBottom = meta.group.kickerBottom; track = meta.group.track;
  }
  head.innerHTML =
    '<div class="bs-pagehead-top">' +
      plateNum(num, track) +
      '<div class="bs-kicker">' + esc(kTop) + '<br>' + esc(kBottom) + '</div>' +
    '</div>' +
    '<h2 class="bs-headline cmyk-head"><span class="line">' +
      plateText(title) +
    '</span></h2>';
}

/* Plate numeral: paper union + 3 offset process plates. The active track
   decides which plate reads dominant, but all three ship (misregistration). */
function plateNum(num, track) {
  const cls = (track === 'accent-2') ? 'bs-track-m' : 'bs-track-c';
  return '<span class="cmyk-num ' + cls + '" aria-label="Section ' + esc(num) + '">' +
    '<span class="paper">' + esc(num) + '</span>' +
    '<span class="plate plate-c" aria-hidden="true">' + esc(num) + '</span>' +
    '<span class="plate plate-m" aria-hidden="true">' + esc(num) + '</span>' +
    '<span class="plate plate-y" aria-hidden="true">' + esc(num) + '</span>' +
  '</span>';
}

function plateText(text) {
  const t = esc(text);
  return '<span class="paper">' + t + '</span>' +
    '<span class="plate plate-c" aria-hidden="true">' + t + '</span>' +
    '<span class="plate plate-m" aria-hidden="true">' + t + '</span>' +
    '<span class="plate plate-y" aria-hidden="true">' + t + '</span>';
}

/* ---- Right-rail cluster guide ------------------------------------------- */
function buildGuide(id) {
  const wrap = document.getElementById('bs-guide');
  if (!wrap) return;
  const meta = TOPICS[id];
  const mascotKey = meta && meta.item.mascot;
  if (!mascotKey || !MASCOTS[mascotKey]) { wrap.innerHTML = ''; return; }
  const m = MASCOTS[mascotKey];
  wrap.innerHTML =
    '<div class="bs-guide">' +
      '<div class="bs-guide-eyebrow">Your guide for this cluster</div>' +
      '<div class="bs-guide-row">' +
        '<div class="bs-guide-portrait halftone"><img src="' + m.img + '" alt="' + esc(m.name) + '"></div>' +
        '<div class="bs-guide-name">' + esc(m.name) + '</div>' +
      '</div>' +
      '<p class="bs-guide-desc">' + esc(m.desc) + '</p>' +
      '<a class="btn btn-primary btn-block" href="#" id="bs-test-yourself">Test yourself</a>' +
    '</div>';
  // If the portrait art doesn't exist yet, hide the whole guide block rather
  // than show a broken image (lets proposed mascots be wired up before art).
  const portrait = wrap.querySelector('.bs-guide-portrait img');
  if (portrait) portrait.addEventListener('error', function () {
    const block = wrap.querySelector('.bs-guide');
    if (block) block.style.display = 'none';
  });

  const btn = document.getElementById('bs-test-yourself');
  if (btn) btn.addEventListener('click', function (e) {
    e.preventDefault();
    // Reveal all case briefs so the reader can quiz themselves on the reasoning.
    document.querySelectorAll('#content-container .bs-case').forEach((d) => { d.open = true; });
    const first = document.querySelector('#content-container .bs-cases-header');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ---- Content enhancement ------------------------------------------------ */
function enhanceContent(container) {
  // Lede: the opening body paragraph (direct child of the first .explanation,
  // so mascot captions and callout text are skipped).
  const firstP = container.querySelector('.explanation > p') || container.querySelector('p');
  if (firstP && firstP.textContent.trim().length > 40) firstP.classList.add('bs-lede');

  // Transform legacy .case-box blocks into collapsible Broadsheet case briefs.
  const boxes = container.querySelectorAll('.case-box');
  boxes.forEach((box, i) => {
    const details = caseBoxToDetails(box, i === 0);
    if (details) box.replaceWith(details);
  });
}

function caseBoxToDetails(box, isFirst) {
  const name = text(box.querySelector('.case-name'));
  const cite = text(box.querySelector('.case-citation'));
  const rule = text(box.querySelector('.case-rule'));

  // Gather the disclosure blocks (facts, reasoning, implications, etc.).
  const blocks = [];
  box.querySelectorAll('.case-facts, .case-reasoning, .case-implications').forEach((el) => {
    const h = el.querySelector('h4');
    let label = h ? h.textContent.trim() : '';
    if (!label && el.classList.contains('case-implications')) label = 'Significance';
    const paras = [];
    el.querySelectorAll('p').forEach((p) => paras.push(p.innerHTML));
    if (!label && paras.length) label = 'Notes';
    if (paras.length) blocks.push({ label: label, html: paras.join('</p><p>') });
  });

  const details = document.createElement('details');
  details.className = 'bs-case';
  details.open = isFirst;

  let body = '';
  blocks.forEach((b) => {
    body += '<div class="bs-case-block">' +
      (b.label ? '<div class="bs-case-label">' + esc(b.label) + '</div>' : '') +
      '<p>' + b.html + '</p></div>';
  });

  details.innerHTML =
    '<summary>' +
      '<svg class="caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>' +
      '<div class="bs-case-head">' +
        '<div class="bs-case-titlerow">' +
          '<span class="bs-case-name">' + esc(name) + '</span>' +
          (cite ? '<span class="bs-case-cite">' + esc(cite) + '</span>' : '') +
        '</div>' +
        (rule ? '<p class="bs-case-rule"><strong>Rule.</strong> ' + esc(rule) + '</p>' : '') +
      '</div>' +
    '</summary>' +
    '<div class="bs-case-body">' + body + '</div>';

  // Insert a "Key cases" section header before the first brief.
  if (isFirst) {
    const header = document.createElement('div');
    header.className = 'bs-cases-header';
    header.id = 'bs-key-cases';
    header.innerHTML = '<span class="bs-cases-title">Key cases</span>' +
      '<span class="bs-cases-note">rule shown; open for facts &amp; reasoning</span>';
    const frag = document.createDocumentFragment();
    frag.appendChild(header);
    frag.appendChild(details);
    return frag;
  }
  return details;
}

/* ---- On-this-page TOC + scroll-spy -------------------------------------- */
function buildToc(container) {
  const toc = document.getElementById('bs-toc');
  if (!toc) return;
  if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }

  // Prefer the section's own anchor nav; fall back to h3 headings.
  const targets = [];
  const legacyNav = container.querySelector('.section-navigation');
  if (legacyNav) {
    legacyNav.querySelectorAll('a[href^="#"]').forEach((a) => {
      const anchor = a.getAttribute('href').slice(1);
      const el = anchor && container.querySelector('#' + cssEscape(anchor));
      if (el) targets.push({ id: anchor, label: a.textContent.trim(), el: el });
    });
  }
  if (!targets.length) {
    container.querySelectorAll('h3').forEach((h, i) => {
      if (!h.id) h.id = 'sec-' + i;
      targets.push({ id: h.id, label: h.textContent.trim(), el: h });
    });
  }
  // Append the generated "Key cases" section if present.
  const keyCases = container.querySelector('#bs-key-cases');
  if (keyCases) targets.push({ id: 'bs-key-cases', label: 'Key cases', el: keyCases });

  if (!targets.length) { toc.innerHTML = ''; return; }

  toc.innerHTML = targets.map((t) =>
    '<a class="bs-toc" href="#' + t.id + '" data-anchor="' + t.id + '">' + esc(t.label) + '</a>'
  ).join('');

  toc.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const el = document.getElementById(this.getAttribute('data-anchor'));
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' });
    });
  });

  // Scroll-spy via IntersectionObserver (no scrollIntoView).
  tocObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        toc.querySelectorAll('a').forEach((l) => l.classList.remove('active'));
        const active = toc.querySelector('a[data-anchor="' + cssEscape(entry.target.id) + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 });

  targets.forEach((t) => { if (t.el.id) tocObserver.observe(t.el); });
  const firstLink = toc.querySelector('a');
  if (firstLink) firstLink.classList.add('active');
}

/* ---- Mermaid ------------------------------------------------------------ */
function renderMermaid(container) {
  if (typeof mermaid === 'undefined') return;
  const diagrams = container.querySelectorAll('.mermaid');
  diagrams.forEach((d) => {
    if (d.dataset.processed) return;
    // Retint the legacy palette to the Broadsheet scale before rendering.
    let src = d.textContent;
    Object.keys(MERMAID_RECOLOR).forEach((from) => {
      src = src.split(from).join(MERMAID_RECOLOR[from]);
      src = src.split(from.toLowerCase()).join(MERMAID_RECOLOR[from]);
    });
    d.textContent = src;
  });
  try { mermaid.init(undefined, diagrams); }
  catch (e) { console.error('Mermaid render error:', e); }
}

/* ---- Controls: PDF export + search -------------------------------------- */
function setupControls() {
  const exportBtn = document.getElementById('export-pdf');
  if (exportBtn) exportBtn.addEventListener('click', function () {
    // Open every case brief so the PDF captures full reasoning, then print.
    document.querySelectorAll('#content-container .bs-case').forEach((d) => { d.open = true; });
    setTimeout(() => window.print(), 60);
  });
}

function setupSearch() {
  const input = document.getElementById('bs-search-input');
  if (!input) return;
  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('#bs-nav .bs-grp').forEach((grp) => {
      let anyVisible = false;
      grp.querySelectorAll('.bs-navlink').forEach((link) => {
        const match = !q || link.textContent.toLowerCase().indexOf(q) !== -1;
        link.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      grp.style.display = anyVisible ? '' : 'none';
      if (q && anyVisible) grp.open = true;
    });
    const overview = document.querySelector('#bs-nav .bs-overview');
    if (overview) overview.style.display = (!q || 'overview'.indexOf(q) !== -1) ? '' : 'none';
  });
}

/* ---- Small helpers ------------------------------------------------------ */
function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function cssEscape(s) {
  return (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/[^\w-]/g, '\\$&');
}
