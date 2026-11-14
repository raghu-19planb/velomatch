// Extra selection criteria: things a shopper may say that the quiz never asks ("must have disc brakes", "under 12 kg",
// "steel frame", "Canadian brand", "not carbon", "in green", "I like Surly"). Each one is checked against what the catalog
// actually records for a bike, so it can change the ranking on the fly.
//
// Honest by construction:
//  - a criterion is tested only on a field the catalog really has; when a bike's record lacks the field the answer is
//    "unknown", never yes or no. Unknown never boosts a bike, and for a must-have it is reported as "not listed";
//  - a criterion is only offered for a category whose catalog has that field (available()), so it cannot quietly do nothing;
//  - every criterion has a visible label, so the results can show exactly what was added and let the shopper remove it.
//
// Used by describe.js (to find criteria in the shopper's words), by match-ui.js (to score and explain) and by the tests.
(function (root) {
  'use strict';
  var norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’`]/g, "'"); };

  // brands that appear in the catalogs (kept in sync by scripts/check-site.mjs)
  var BRANDS = ['3T', 'All-City', 'Aventon', 'BMC', 'Batch Bicycles', 'Bombtrack', 'Brompton', 'Cannondale', 'Canyon', 'Cervélo', 'Co-op Cycles', 'Colnago', 'Costway', 'Decathlon', 'Devinci', 'ENVO', 'Evo', 'Fairlight', 'Frog Bikes', 'Genesis', 'Giant', 'Guardian', 'Huffy', 'Hyper Bicycles', 'JOYSTAR', 'KFFKFF', 'Kinesis', 'Kona', 'MEC', 'Madd Gear', 'Marin', 'Mason', 'Miele', 'Mongoose', 'Norco', 'Opus', 'Otso', 'Panorama Cycles', 'Pinarello', 'Polygon', 'Priority', 'Quintana Roo', 'REI Co-op', 'Rad Power Bikes', 'Ride1Up', 'Ritchey', 'Rocky Mountain', 'Salsa', 'Schwinn', 'Scott', 'Specialized', 'State Bicycle Co.', 'Supercycle', 'Surly', 'Tern', 'Thorn', 'Trek', 'Tumbleweed', 'VEVOR', 'Woom'];
  // everyday words that are also brand names: only taken as a brand with a clear cue ("I like a Trek", "from Giant", "Trek bike")
  var AMBIGUOUS = { Trek: 1, Giant: 1, Genesis: 1, Mason: 1, Thorn: 1, Scott: 1, Marin: 1, Evo: 1, Priority: 1, Guardian: 1, Evo_: 1 };
  var COLOURS = { black: 'Black', noir: 'Black', white: 'White', blanc: 'White', red: 'Red', rouge: 'Red', blue: 'Blue', bleu: 'Blue', green: 'Green', vert: 'Green', orange: 'Orange', silver: 'Silver', argent: 'Silver', grey: 'Grey', gray: 'Grey', gris: 'Grey', charcoal: 'Charcoal', teal: 'Teal', pink: 'Pink', rose: 'Pink', purple: 'Purple', violet: 'Purple', brown: 'Brown', brun: 'Brown', yellow: 'Yellow', jaune: 'Yellow' };
  var FRAMES = { steel: 'steel', acier: 'steel', carbon: 'carbon', carbone: 'carbon', aluminum: 'aluminum', aluminium: 'aluminum', alu: 'aluminum', titanium: 'titanium', titane: 'titanium' };

  // which catalogs record which field (checked by scripts/check-site.mjs against the data files)
  var HAS = {
    brakeType: ['commute', 'casual', 'racing'],
    fendersIncluded: ['commute', 'casual'],
    rackMounts: ['bikepacking', 'casual'],
    weight: ['commute', 'casual', 'bikepacking', 'racing'],
    frameMaterial: ['commute', 'casual', 'bikepacking', 'mountainbiking', 'racing'],
    origin: ['kids', 'commute', 'casual', 'bikepacking', 'mountainbiking', 'racing'],
    electronicShifting: ['bikepacking', 'casual', 'racing'],
    brand: ['kids', 'commute', 'casual', 'bikepacking', 'mountainbiking', 'racing'],
    colors: ['commute', 'casual', 'bikepacking', 'mountainbiking', 'racing'],
    foldable: ['commute', 'casual'],
    frontSuspension: ['commute', 'casual', 'bikepacking', 'mountainbiking'],
    groupset: ['commute', 'casual', 'bikepacking', 'mountainbiking', 'racing'],
  };

  var has = function (b, k) { return b[k] !== undefined && b[k] !== null && b[k] !== ''; };
  var ok = function (v) { return v === true ? true : v === false ? false : null; };

  // ---- the criteria. test(x, b) returns true / false / null (null = this bike's record does not say)
  var DEFS = {
    disc_brakes: { label: 'Disc brakes', field: 'brakeType', test: function (x, b) { return has(b, 'brakeType') ? b.brakeType === 'disc' : null; } },
    fenders: { label: 'Fenders included', field: 'fendersIncluded', test: function (x, b) { return has(b, 'fendersIncluded') ? !!b.fendersIncluded : null; } },
    rack_mounts: { label: 'Rack mounts', field: 'rackMounts', test: function (x, b) { return has(b, 'rackMounts') ? !!b.rackMounts : null; } },
    light: { label: 'Lighter than {n} kg', field: 'weight', test: function (x, b) { return has(b, 'weight') ? b.weight <= x.p.n : null; } },
    frame: { label: '{m} frame', field: 'frameMaterial', test: function (x, b) { return has(b, 'frameMaterial') ? b.frameMaterial === x.p.m : null; } },
    canadian: { label: 'Canadian brand', field: 'origin', test: function (x, b) { return has(b, 'origin') ? b.origin === 'Canada' : null; } },
    electronic: { label: 'Electronic shifting', field: 'electronicShifting', test: function (x, b) { return has(b, 'electronicShifting') ? !!b.electronicShifting : null; } },
    brand: { label: 'Brand: {x}', field: 'brand', test: function (x, b) { return has(b, 'brand') ? norm(b.brand) === norm(x.p.x) : null; } },
    color: { label: 'Colour: {c}', field: 'colors', test: function (x, b) { return Array.isArray(b.colors) && b.colors.length ? b.colors.some(function (c) { return norm(c).indexOf(norm(x.p.c)) !== -1; }) : null; } },
    foldable: { label: 'Folds', field: 'foldable', test: function (x, b) { return has(b, 'foldable') ? !!b.foldable : null; } },
    front_suspension: { label: 'Front suspension', field: 'frontSuspension', test: function (x, b) { if (has(b, 'suspensionFork')) return !!b.suspensionFork; if (has(b, 'suspensionType')) return b.suspensionType !== 'rigid' && b.suspensionType !== 'none'; return null; } },
    belt_or_hub: { label: 'Belt drive or internal gears', field: 'groupset', test: function (x, b) { if (!has(b, 'groupset')) return null; return b.gearing === 'internal' || /belt|gates|nexus|alfine|rohloff|enviolo|internal/i.test(b.groupset); } },
  };
  var PARAMS = {
    light: function (p) { var n = Number(p && p.n); return n > 3 && n < 40 ? { n: Math.round(n * 10) / 10 } : null; },
    frame: function (p) { return p && ['steel', 'carbon', 'aluminum', 'titanium'].indexOf(p.m) !== -1 ? { m: p.m } : null; },
    brand: function (p) { var f = BRANDS.filter(function (b) { return norm(b) === norm(p && p.x); })[0]; return f ? { x: f } : null; },
    color: function (p) { var c = p && Object.keys(COLOURS).map(function (k) { return COLOURS[k]; }).filter(function (v, i, a) { return a.indexOf(v) === i && v === p.c; })[0]; return c ? { c: c } : null; },
  };
  var MODES = ['prefer', 'must', 'avoid'];

  function available(x, category) { var d = DEFS[x.id]; return !!d && (HAS[d.field] || []).indexOf(category) !== -1; }
  function labelOf(x) { var d = DEFS[x.id]; if (!d) return ''; return d.label.replace(/\{(\w+)\}/g, function (m, k) { return x.p && x.p[k] != null ? (k === 'm' ? x.p[k].charAt(0).toUpperCase() + x.p[k].slice(1) : x.p[k]) : m; }); }

  // true / false / null for "does this bike satisfy this criterion"; for 'avoid' the answer is turned round
  function evalOne(x, b) {
    var d = DEFS[x.id]; if (!d) return null;
    var v = ok(d.test(x, b)); if (v === null) return null;
    return x.m === 'avoid' ? !v : v;
  }
  // how much a criterion moves a bike's score. Unknown never boosts; a must-have that fails is a heavy penalty.
  function deltaOne(x, b) {
    var v = evalOne(x, b);
    if (x.m === 'must') return v === true ? 10 : v === false ? -30 : -4;
    if (x.m === 'avoid') return v === true ? 4 : v === false ? -12 : 0;
    return v === true ? 8 : v === false ? -5 : 0;
  }
  function delta(list, b) { var s = 0; (list || []).forEach(function (x) { s += deltaOne(x, b); }); return s; }

  // the label as shown to the shopper, in their language: T translates the template and the values (steel, carbon, colours...)
  function display(x, T) {
    var d = DEFS[x.id], p = {}, k;
    for (k in x.p) p[k] = (k === 'm' || k === 'c') ? T(String(x.p[k])) : x.p[k];
    var s = T(d.label, p);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // sentences for a result card (T translates a template and its values, so French can reorder the words)
  function notes(list, b, T) {
    var why = [], watch = [];
    (list || []).forEach(function (x) {
      var v = evalOne(x, b), l = display(x, T);
      if (v === true) why.push(T(x.m === 'avoid' ? 'Avoids what you wanted to avoid: {l}' : 'Meets your extra: {l}', { l: l }));
      else if (v === false) watch.push(T(x.m === 'avoid' ? 'Has something you wanted to avoid: {l}' : 'Misses your extra: {l}', { l: l }));
      else watch.push(T('Not listed for this bike, so we cannot check: {l}', { l: l }));
    });
    return { why: why, watch: watch };
  }

  // accept only what the engine knows; used for links and anything coming from outside
  function sanitize(raw) {
    var out = [];
    (Array.isArray(raw) ? raw : []).slice(0, 8).forEach(function (r) {
      if (!r || !DEFS[r.id]) return;
      var p = r.p || {};
      if (PARAMS[r.id]) { p = PARAMS[r.id](p); if (!p) return; } else p = {};
      var x = { id: r.id, p: p, m: MODES.indexOf(r.m) !== -1 ? r.m : 'prefer' };
      if (!out.some(function (y) { return y.id === x.id && JSON.stringify(y.p) === JSON.stringify(x.p); })) out.push(x);
    });
    return out;
  }

  // ---- finding criteria in a shopper's words (English and French). t is the accent-free lower-case text, orig the original.
  var MUST = /\b(must|should|needs?|have to|has to|require\w*|essential|non-?negotiable|got to|il faut|doit|doivent|obligatoire|indispensable|il me faut|besoin d|devrait|devraient)\b/;
  var SOFT = /\b(would like|prefer\w*|ideally|nice to have|if possible|j'aimerais|de preference|idealement|serait bien)\b/;
  var NEG = /\b(no|not|without|avoid|sans|pas de|pas en|eviter|jamais)\s*(?:a |an |any |de |d')?$/;
  function modeAt(t, idx) {
    var near = t.slice(Math.max(0, idx - 34), idx);
    if (NEG.test(near.trim() + ' ') || NEG.test(near)) return 'avoid';
    // the nearest requirement phrase earlier in the SAME sentence rules the whole list ("I must have A and B, C"), until a softer phrase takes over
    var start = Math.max(t.lastIndexOf('.', idx), t.lastIndexOf('!', idx), t.lastIndexOf('?', idx), t.lastIndexOf(';', idx)) + 1;
    var sentence = t.slice(start, idx), lastMust = -1, lastSoft = -1, m;
    var mu = new RegExp(MUST.source, 'g'), so = new RegExp(SOFT.source, 'g');
    while ((m = mu.exec(sentence))) lastMust = m.index;
    while ((m = so.exec(sentence))) lastSoft = m.index;
    // "...a Canadian brand if possible": a softener inside the item's own clause makes just that item a nice-to-have
    var rest = t.slice(idx).split(/[,.;!?]/)[0];
    if (/\b(if possible|if you can|si possible|preferably|de preference|ideally|idealement)\b/.test(rest)) return 'prefer';
    if (lastMust >= 0 && lastMust > lastSoft) return 'must';
    return 'prefer';
  }
  function extract(orig) {
    var t = norm(orig), out = [];
    var push = function (id, p, m, ev) { if (!out.some(function (o) { return o.id === id && JSON.stringify(o.p) === JSON.stringify(p); })) out.push({ id: id, p: p || {}, m: m, ev: ev }); };
    var at = function (re, id, modeOnly) { var m = re.exec(t); if (m) { var mode = modeAt(t, m.index); if (mode === 'avoid' && id !== 'frame' && id !== 'brand') return; push(id, {}, mode, m[0].trim()); } };
    at(/\bdisc brakes?\b|\bfreins? a disque\b|\bhydraulic brakes?\b/, 'disc_brakes');
    at(/\bfenders?\b|\bmudguards?\b|\bgarde-?boues?\b/, 'fenders');
    at(/\brack mounts?\b|\beyelets\b|\bpannier mounts?\b|\bracks? (?:and|&|or) panniers?\b|\b(?:support|carry|take|fit|mount|handle)\w* (?:a |the |front |rear )?(?:racks?|panniers?)\b|\brack[- ](?:compatible|ready)\b/, 'rack_mounts');
    at(/\bcanadian[- ]?(?:made|brand|company|owned)\b|\bmade in canada\b|\bbuy canadian\b|\bmarque canadienne\b|\bfabrique au canada\b|\bentreprise canadienne\b/, 'canadian');
    at(/\belectronic (?:shifting|gears?|groupset)\b|\bdi2\b|\baxs\b|\bchangement (?:de vitesses )?electronique\b/, 'electronic');
    at(/\bfold(?:ing|able|s)?\b|\bpliant\w*|\bpliable\b/, 'foldable');
    at(/\bfront suspension\b|\bsuspension fork\b|\bfourche (?:a )?suspension\b/, 'front_suspension');
    at(/\bbelt (?:drive|driven)\b|\bcarbon drive\b|\bcourroie\b|\binternal (?:gear|hub)s?\b|\bmoyeu a vitesses internes\b/, 'belt_or_hub');
    // weight: "under 12 kg", "lighter than 25 lbs", "moins de 12 kg"
    var w = /(?:under|below|less than|lighter than|max(?:imum)?|no more than|moins de|sous|pas plus de)\s*(\d+(?:[.,]\d+)?)\s*(kg|kilos?|kilograms?|lbs?|pounds?|livres?)\b/.exec(t);
    if (w) { var n = parseFloat(w[1].replace(',', '.')); if (/lb|pound|livre/.test(w[2])) n = n * 0.4536; var pp = PARAMS.light({ n: n }); if (pp) push('light', pp, modeAt(t, w.index) === 'must' ? 'must' : 'prefer', w[0].trim()); }
    // frame material, with "not carbon" / "no carbon" read as avoid
    Object.keys(FRAMES).forEach(function (k) { var re = new RegExp('\\b' + k + '\\b(?:\\s+frame|\\s+bike|\\s+cadre)?'); var m = re.exec(t); if (m && !/\balumin\w*\s+(?:bike|frame)\s+is\b/.test(t)) push('frame', { m: FRAMES[k] }, modeAt(t, m.index), m[0].trim()); });
    // colour: only with a cue ("in green", "colour: black", "a black bike"), so "Black Friday" and "blue-collar" are not taken
    Object.keys(COLOURS).forEach(function (k) {
      var re = new RegExp('\\b(?:colou?rs?|couleurs?|in|en)\\s*:?\\s*' + k + '\\b|\\b' + k + '\\s+(?:bike|velo|frame|cadre)\\b');
      var m = re.exec(t); if (m) { var md = modeAt(t, m.index); if (md !== 'avoid') push('color', { c: COLOURS[k] }, md, m[0].trim()); }
    });
    // brands: the name as written (capital letter), and for everyday words a clear cue
    BRANDS.forEach(function (name) {
      var esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(^|[^A-Za-z])' + esc + '(?![A-Za-z])');
      var m = re.exec(String(orig)); if (!m) return;
      var idx = m.index + m[1].length;
      var around = norm(String(orig).slice(Math.max(0, idx - 24), idx + name.length + 14));
      var cue = /\b(prefer\w*|like|love|want|only|brand|marque|from|by|j'aime|je veux|chez|a|an|the)\s+(?:an?\s+)?$/.test(norm(String(orig).slice(Math.max(0, idx - 18), idx))) || /^\s*(?:bikes?|velos?|brand|marque)\b/.test(norm(String(orig).slice(idx + name.length, idx + name.length + 12)));
      if (AMBIGUOUS[name] && !cue) return;
      var md = modeAt(norm(orig), norm(String(orig).slice(0, idx)).length);
      push('brand', { x: name }, md, name);
    });
    return out;
  }

  var api = { DEFS: DEFS, BRANDS: BRANDS, HAS: HAS, extract: extract, evalOne: evalOne, delta: delta, notes: notes, display: display, sanitize: sanitize, available: available, labelOf: labelOf, norm: norm };
  root.SVCriteria = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
