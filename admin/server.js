#!/usr/bin/env node
/* Control panel for the website.   npm run admin
   Opens a page on YOUR computer (127.0.0.1, nobody else can reach it) where you tick which products, sections,
   tools, guides and extras are shown. "Save and rebuild" writes site-config.json and regenerates every page.
   No dependencies. This panel is a tool for you: it is not part of the published website. */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const CFG = require('../build/config');
const CAT = require('../build/catalog');
const en = require('../build/i18n/en');
const hi = require('../build/i18n/hi');
const productsEn = require('../build/data/products.en');
const productsHi = require('../build/data/products.hi');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = path.join(ROOT, 'site-config.json');
const BACKUP = path.join(__dirname, '.last-config.json');
const HELP = 'Switches for the website. true = shown, false = hidden. Easiest way to change them: run  npm run admin  (a control panel opens in your browser). You can also edit this file and run  node build/build.js  - the whole site is rebuilt to match. Things that depend on a hidden product (its page, tools, guides, FAQ answers, links) hide themselves.';
const info = CFG.buildInfo();

const argv = (n) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : undefined; };
const PORT0 = parseInt(argv('port') || '4173', 10);

const readRaw = () => { try { return JSON.parse(fs.readFileSync(CONFIG, 'utf8')); } catch (e) { return null; } };
const getPath = (o, p) => p.split('.').reduce((c, k) => (c == null ? undefined : c[k]), o);
const names = (list) => list.map((s) => productsEn[s].name);

function effectiveOf(cfg) {
  const e = CFG.resolve(cfg, info);
  return { productsOn: e.productsOn, tools: e.tools, guides: e.guides, faq: e.faq, industries: e.industries, sections: e.sections, langs: e.langs, auto: e.auto, warnings: e.warnings, toolsAny: e.toolsAny, guidesAny: e.guidesAny };
}

function catalog() {
  const dependents = (slug) => ({
    tools: Object.keys(CAT.tools).filter((id) => CAT.tools[id].every((s) => s === slug) && CAT.tools[id].includes(slug)).map((id) => en.home.toolsTeaser.cards.find((c) => c.id === id).title),
    guides: Object.keys(CAT.guides).filter((g) => CAT.guides[g].requires.length === 1 && CAT.guides[g].requires[0] === slug).map((g) => en.guides.articles[g].h1),
    faq: Object.keys(CAT.faqRequires).filter((i) => CAT.faqRequires[i].length === 1 && CAT.faqRequires[i][0] === slug).map((i) => en.home.faq.items[i].q),
    industries: Object.keys(require('../build/data/industries')).filter((id) => require('../build/data/industries')[id].every((it) => it.slug === slug)).map((id) => id)
  });
  return {
    products: CAT.productOrder.map((slug) => ({ slug, name: productsEn[slug].name, nameHi: productsHi[slug].name, group: CAT.productGroup[slug], tagline: productsEn[slug].tagline, image: `assets/products/${slug}.svg`, dependents: dependents(slug) })),
    sections: [
      { id: 'industries', label: 'Industries', help: 'Who you supply, with "add starter list" buttons.' },
      { id: 'tools', label: 'Tools (calculators)', help: 'Removes the Tools page, its menu link and the home cards.' },
      { id: 'process', label: 'How to order', help: 'The four steps from enquiry to delivery.' },
      { id: 'about', label: 'About us', help: 'About text and the "at a glance" box.' },
      { id: 'guides', label: 'Buying guides', help: 'Removes the Guides pages, menu link and home cards.' },
      { id: 'faq', label: 'FAQ on the home page', help: 'Common questions.' },
      { id: 'contactMap', label: 'Map in the contact area', help: 'The Google map under the contact details.' }
    ],
    industries: en.home.industries.cards.map((c) => ({ id: c.id, title: c.title, items: (require('../build/data/industries')[c.id] || []).map((it) => it.slug) })),
    tools: en.home.toolsTeaser.cards.map((c) => ({ id: c.id, title: c.title, requires: names(CAT.tools[c.id]) })),
    guides: Object.keys(en.guides.articles).map((g) => ({ slug: g, title: en.guides.articles[g].h1, requires: names(CAT.guides[g].requires) })),
    faq: en.home.faq.items.map((f, i) => ({ index: i, q: f.q, requires: CAT.faqRequires[i] ? names(CAT.faqRequires[i]) : [] })),
    features: [
      { id: 'hindi', label: 'Hindi version', help: 'Off = the whole /hi/ site and the language button are removed.' },
      { id: 'threeD', label: '3D product models', help: 'Off = flat pictures only, and the 3D file is never loaded.' },
      { id: 'floatingWhatsApp', label: 'Floating WhatsApp button', help: 'The green button at the bottom right.' },
      { id: 'ticker', label: 'Scrolling product strip', help: 'The yellow strip under the hero.' },
      { id: 'themeSwitch', label: 'Light / dark switch', help: 'The moon button in the menu bar.' }
    ],
    texts: CAT.homeTexts.map((t) => ({ key: t.key, label: t.label, en: getPath(en, t.key), hi: getPath(hi, t.key) }))
  };
}

function state() {
  const raw = readRaw(), { cfg, errors } = CFG.normalize(raw, info);
  return { config: cfg, errors, effective: effectiveOf(cfg), catalog: catalog(), hasBackup: fs.existsSync(BACKUP), isNew: raw == null };
}

function tidy(cfg) {            // what gets written to site-config.json
  const out = { _help: HELP, version: 1, products: cfg.products, order: cfg.order, sections: cfg.sections, industries: cfg.industries, tools: cfg.tools, guides: cfg.guides, faq: { hidden: [...cfg.faq.hidden].sort((a, b) => a - b) }, features: cfg.features, announcement: cfg.announcement, texts: { en: {}, hi: {} }, siteUrl: cfg.siteUrl, analytics: cfg.analytics, googleReviewUrl: cfg.googleReviewUrl, googleBusinessUrl: cfg.googleBusinessUrl };
  ['en', 'hi'].forEach((l) => Object.keys(cfg.texts[l] || {}).forEach((k) => { if (String(cfg.texts[l][k]).trim() !== '') out.texts[l][k] = cfg.texts[l][k]; }));
  return JSON.stringify(out, null, 2) + '\n';
}

function runBuild(args) {
  const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'build', 'build.js')].concat(args || []), { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const m = /@@summary (.*)/.exec(out);
  return { ok: r.status === 0, log: out.replace(/@@summary .*\n?/, '').trim(), summary: m ? JSON.parse(m[1]) : null };
}

function plan(body) {
  const { cfg, errors } = CFG.normalize(body, info);
  if (errors.length) return { errors };
  const tmp = path.join(os.tmpdir(), `eii-plan-${process.pid}.json`);
  fs.writeFileSync(tmp, JSON.stringify(cfg));
  const b = runBuild(['--dry', '--config', tmp]);
  try { fs.unlinkSync(tmp); } catch (e) { /* ignore */ }
  if (!b.ok) return { errors: [b.log.split('\n').slice(0, 6).join(' ')] };
  const pages = (b.summary.written || []).filter((f) => /(^|\/)index\.html$/.test(f) && !f.startsWith('single/'));
  return { errors: [], effective: effectiveOf(cfg), plan: { files: b.summary.files, pages: b.summary.pages, added: b.summary.added, removed: b.summary.removed, pageList: pages } };
}

// ---------- live preview: the settings as they are right now (saved or not), built into a temporary folder ----------
const PREVIEW = path.join(os.tmpdir(), `eii-preview-${process.pid}`);
let previewPrepared = false;
function preparePreview() {
  fs.mkdirSync(PREVIEW, { recursive: true });
  if (!previewPrepared) { fs.cpSync(path.join(ROOT, 'assets'), path.join(PREVIEW, 'assets'), { recursive: true }); previewPrepared = true; }
  fs.readdirSync(ROOT).filter((f) => /\.(js|css)$/.test(f)).forEach((f) => fs.copyFileSync(path.join(ROOT, f), path.join(PREVIEW, f)));
}
function preview(body, port) {
  const { cfg, errors } = CFG.normalize(body, info);
  if (errors.length) return { ok: false, errors };
  preparePreview();
  const tmp = path.join(os.tmpdir(), `eii-prev-${process.pid}.json`);
  fs.writeFileSync(tmp, JSON.stringify(cfg));
  const b = runBuild(['--out', PREVIEW, '--config', tmp, '--url', `http://localhost:${port}/preview/`]);
  try { fs.unlinkSync(tmp); } catch (e) { /* ignore */ }
  return b.ok ? { ok: true, version: Date.now() } : { ok: false, errors: [b.log.split('\n').slice(0, 4).join(' ')] };
}
process.on('exit', () => { try { fs.rmSync(PREVIEW, { recursive: true, force: true }); } catch (e) { /* ignore */ } });

// ---------- publishing with git (only when the owner presses the button) ----------
function git(args) {
  const r = cp.spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', timeout: 120000, env: Object.assign({}, process.env, { GIT_TERMINAL_PROMPT: '0' }) });
  return { ok: r.status === 0, out: ((r.stdout || '') + (r.stderr || '')).trim(), status: r.status, missing: r.error && r.error.code === 'ENOENT' };
}
function gitState() {
  const inside = git(['rev-parse', '--is-inside-work-tree']);
  if (inside.missing) return { isRepo: false, reason: 'Git is not installed on this computer.' };
  if (!inside.ok || inside.out !== 'true') return { isRepo: false, reason: 'This folder is not a git project.' };
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).out;
  const remote = git(['remote', 'get-url', 'origin']);
  const changed = git(['status', '--porcelain']).out.split('\n').filter(Boolean);
  return { isRepo: true, branch, remote: remote.ok ? remote.out.replace(/\/\/[^@/]*@/, '//') : '', changed };
}
function publish(message) {
  const st = gitState();
  if (!st.isRepo) return { status: 400, body: { ok: false, errors: [st.reason] } };
  if (!st.remote) return { status: 400, body: { ok: false, errors: ['This project has no GitHub address ("origin") to publish to.'] } };
  const msg = String(message || 'Update website').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 120) || 'Update website';
  const log = [];
  const run = (label, args) => { const r = git(args); log.push(`$ git ${args.join(' ')}\n${r.out}`.trim()); return r; };
  run('add', ['add', '-A']);
  const nothing = git(['diff', '--cached', '--quiet']).ok;
  let committed = false;
  if (!nothing) {
    const c = run('commit', ['commit', '-m', msg]);
    if (!c.ok) return { status: 500, body: { ok: false, errors: ['Could not save the change in git. If it says "Please tell me who you are", run: git config user.email "you@example.com" and git config user.name "Your Name"'], log: log.join('\n\n') } };
    committed = true;
  }
  let p = run('push', ['push']);
  if (!p.ok && /no upstream|set-upstream/i.test(p.out)) p = run('push', ['push', '-u', 'origin', st.branch]);
  if (!p.ok) return { status: 500, body: { ok: false, errors: [committed ? 'The change was saved in git but could not be sent. Check your internet and GitHub login, then press Publish again.' : 'Could not send to GitHub. Check your internet and GitHub login.'], log: log.join('\n\n') } };
  return { status: 200, body: { ok: true, committed, upToDate: !committed && /Everything up-to-date/i.test(p.out), log: log.join('\n\n'), git: gitState() } };
}

function apply(body) {
  const { cfg, errors } = CFG.normalize(body, info);
  if (errors.length) return { status: 400, body: { ok: false, errors } };
  const previous = fs.existsSync(CONFIG) ? fs.readFileSync(CONFIG, 'utf8') : null;
  const next = tidy(cfg);
  if (previous != null && previous !== next) fs.writeFileSync(BACKUP, previous);
  fs.writeFileSync(CONFIG, next);
  const b = runBuild();
  if (!b.ok) {                          // never leave the site half-built with settings that do not work
    if (previous != null) fs.writeFileSync(CONFIG, previous); else fs.unlinkSync(CONFIG);
    runBuild();
    return { status: 500, body: { ok: false, errors: ['The build stopped, so nothing was changed.'], log: b.log } };
  }
  return { status: 200, body: Object.assign({ ok: true }, b, state()) };
}

function undo() {
  if (!fs.existsSync(BACKUP)) return { status: 400, body: { ok: false, errors: ['There is no earlier version to go back to.'] } };
  const current = fs.existsSync(CONFIG) ? fs.readFileSync(CONFIG, 'utf8') : null, old = fs.readFileSync(BACKUP, 'utf8');
  fs.writeFileSync(CONFIG, old);
  const b = runBuild();
  if (!b.ok) { if (current != null) fs.writeFileSync(CONFIG, current); runBuild(); return { status: 500, body: { ok: false, errors: ['Could not go back: the earlier settings do not build any more.'], log: b.log } }; }
  if (current != null) fs.writeFileSync(BACKUP, current);
  return { status: 200, body: Object.assign({ ok: true }, b, state()) };
}

// ---------- tiny web server ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };
const HIDE = /(^|\/)(node_modules|build|admin|models3d|\.git)(\/|$)/;

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function serve(port) {
  const server = http.createServer((req, res) => {
    const host = (req.headers.host || '').toLowerCase();
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) return send(res, 403, { error: 'Only reachable from this computer.' });
    const url = new URL(req.url, 'http://x'), p = decodeURIComponent(url.pathname);

    if (p.startsWith('/api/')) {
      if (req.headers['x-eii-admin'] !== '1') return send(res, 403, { error: 'Missing header.' });
      if (req.method === 'GET' && p === '/api/state') return send(res, 200, state());
      if (req.method === 'GET' && p === '/api/git') return send(res, 200, gitState());
      if (req.method !== 'POST') return send(res, 405, { error: 'POST only.' });
      let data = '';
      req.on('data', (c) => { data += c; if (data.length > 300000) req.destroy(); });
      req.on('end', () => {
        try {
          const body = data ? JSON.parse(data) : {};
          if (p === '/api/plan') return send(res, 200, plan(body.config));
          if (p === '/api/preview') return send(res, 200, preview(body.config, port));
          if (p === '/api/publish') { if (body.confirm !== true) return send(res, 400, { ok: false, errors: ['Please confirm first.'] }); const r = publish(body.message); return send(res, r.status, r.body); }
          if (p === '/api/apply') { const r = apply(body.config); return send(res, r.status, r.body); }
          if (p === '/api/undo') { const r = undo(); return send(res, r.status, r.body); }
          return send(res, 404, { error: 'Unknown request.' });
        } catch (e) { return send(res, 400, { error: 'Bad request: ' + e.message }); }
      });
      return;
    }

    if (req.method !== 'GET') return send(res, 405, 'Method not allowed', 'text/plain');
    let file;
    if (p === '/' || p === '/index.html') file = path.join(__dirname, 'index.html');
    else if (p.startsWith('/preview/')) {           // the unsaved draft
      const rel = p.slice(9) || 'index.html';
      file = path.join(PREVIEW, rel.endsWith('/') ? rel + 'index.html' : rel);
      if (!file.startsWith(PREVIEW + path.sep) || path.basename(file).startsWith('.')) return send(res, 404, 'Not found', 'text/plain');
    } else if (p.startsWith('/site/')) {            // preview of the built website
      const rel = p.slice(6) || 'index.html';
      file = path.join(ROOT, rel.endsWith('/') ? rel + 'index.html' : rel);
      if (!file.startsWith(ROOT + path.sep) || HIDE.test(path.relative(ROOT, file).split(path.sep).join('/')) || path.basename(file).startsWith('.')) return send(res, 404, 'Not found', 'text/plain');
    } else return send(res, 404, 'Not found', 'text/plain');
    fs.readFile(file, (err, buf) => {
      if (err) return send(res, 404, 'Not found', 'text/plain');
      send(res, 200, buf, MIME[path.extname(file)] || 'application/octet-stream');
    });
  });
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE' && port < PORT0 + 10) return serve(port + 1);
    console.error('Could not start the control panel: ' + e.message); process.exit(1);
  });
  server.listen(port, '127.0.0.1', () => {
    const addr = `http://localhost:${port}/`;
    console.log(`\nWebsite control panel is running:  ${addr}\nKeep this window open while you use it. Press Ctrl+C to stop.\n`);
    if (!process.argv.includes('--no-open')) {
      const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
      try { cp.spawn(cmd, process.platform === 'win32' ? ['/c', 'start', '', addr] : [addr], { stdio: 'ignore', detached: true }).on('error', () => {}).unref(); } catch (e) { /* open it by hand */ }
    }
  });
}
serve(PORT0);
