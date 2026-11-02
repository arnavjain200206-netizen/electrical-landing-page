const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// attribute-safe JSON
const jsonAttr = (o) => esc(JSON.stringify(o));

function makeT(dict, lang) {
  const get = (path) => {
    let cur = dict;
    for (const k of path.split('.')) {
      if (cur == null || typeof cur !== 'object' || !(k in cur)) throw new Error(`Missing i18n key "${path}" (${lang})`);
      cur = cur[k];
    }
    return cur;
  };
  const t = (p) => esc(get(p));
  t.raw = get;
  // t.fmt('a.b', { n: 3 }) fills {n}; values are inserted as given (callers escape / pass trusted html)
  t.fmt = (p, vars) => esc(get(p)).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return t;
}

// Throws if the two dictionaries do not have exactly the same shape.
function compareShape(a, b, path, errors) {
  const ta = Array.isArray(a) ? 'array' : typeof a, tb = Array.isArray(b) ? 'array' : typeof b;
  if (ta !== tb) { errors.push(`${path}: type ${ta} vs ${tb}`); return; }
  if (ta === 'array') {
    if (a.length !== b.length) errors.push(`${path}: array length ${a.length} vs ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) compareShape(a[i], b[i], `${path}[${i}]`, errors);
  } else if (ta === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    ka.filter((k) => !kb.includes(k)).forEach((k) => errors.push(`${path}.${k}: missing in second`));
    kb.filter((k) => !ka.includes(k)).forEach((k) => errors.push(`${path}.${k}: missing in first`));
    ka.filter((k) => kb.includes(k)).forEach((k) => compareShape(a[k], b[k], `${path}.${k}`, errors));
  } else if (ta === 'string' && b === '' && a !== '') {
    // empty strings are only allowed where intended (e.g. hero.forWord in Hindi)
    if (!/forWord$/.test(path)) errors.push(`${path}: empty string`);
  }
}

module.exports = { esc, jsonAttr, makeT, compareShape };
