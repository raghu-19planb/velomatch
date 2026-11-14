// "Describe your ride": a PREVIEW of an AI-style front door, built with a mock interpreter you can replace later.
//
// The visitor writes a sentence or two ("first overnight trip in Gaspésie, about $1,500, I'm 172 cm, must have fenders, under 12 kg").
// What happens next is always something useful:
//   1. the interpreter picks the quiz and fills in the quiz's own answers (option values and sliders);
//   2. wishes the quiz has no question for (disc brakes, fenders, a weight limit, frame material, Canadian brand, a colour, a
//      brand) become extra selection criteria that are scored against what the catalog records (see criteria.js);
//   3. if everything the quiz needs is known, the visitor goes straight to the matches (after a short, cancellable countdown);
//      if not, they land on the first question still open, with everything else already filled in;
//   4. if nothing could be understood, they are asked one thing (which kind of bike?) and their words and wishes still carry over.
// Nothing is guessed: what the text does not say stays blank, and what the catalog does not record shows as "not listed".
//
// This interpreter runs on the device with simple rules, in English and French, and sends nothing anywhere. A language model can
// replace interpret() later: it must return the same shape (docs/ai-matching-design.md), and validate() rejects anything outside
// the quizzes' vocabulary, so a model could never invent an answer or a criterion the engine does not have.
(function () {
  'use strict';
  const T = (s, v) => (window.I18N ? window.I18N.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m)) : s));
  const FR = () => !!(window.I18N && window.I18N.lang === 'fr');
  const CR = () => window.SVCriteria;

  // ------------------------------------------------------------------ the vocabulary: exactly what each quiz understands
  const VOCAB = {
    kids: {
      name: "Kids' first bike", page: 'kids.html', flow: ['height', 'exp', 'terrain', 'budget'],
      ranges: { height: { label: "Child's height", min: 100, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 80, max: 600, step: 10, unit: 'C$' } },
      groups: {
        exp: { label: 'Riding experience', values: { none: 'Never ridden', balance: 'Balance bike', training: 'Training wheels', confident: 'Confident, no training wheels' } },
        terrain: { label: 'Where they ride', values: { pavement: 'Pavement / driveway', road_gravel: 'Road and gravel', park: 'Neighborhood paths', trail_road_gravel: 'Trail, road and gravel', trail: 'Light dirt trails' } },
        brake: { label: 'Brake preference', values: { coaster: 'Coaster', hand: 'Hand brakes' } },
      },
      need: { groups: ['exp', 'terrain'], ranges: ['height', 'budget'] },
    },
    commute: {
      name: 'Commuting', page: 'commute.html', flow: ['distance', 'route', 'cargo', 'power', 'weather', 'riderHeight', 'budget'],
      ranges: { distance: { label: 'Commute distance (one-way)', min: 1, max: 40, step: 1, unit: 'km' }, riderHeight: { label: 'Your height', min: 145, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 300, max: 3000, step: 50, unit: 'C$' } },
      groups: {
        route: { label: "What's your route like?", multi: true, values: { city_streets: 'City streets & bike lanes', mixed_paths: 'Mixed paved & gravel paths', long_flat: 'Long, flat roads', hilly_assist: 'Hilly — could use assist' } },
        cargo: { label: 'What do you need to carry?', values: { none: 'Just me', light: 'Backpack or light bag', rack: 'Rack or panniers', heavy: 'Heavy loads (groceries, gear)' } },
        power: { label: 'Power preference', values: { pedal_only: 'Pedal only', open: 'Open to e-assist', want_ebike: 'Want e-assist' } },
        weather: { label: 'Will you ride in the rain or snow?', values: { rarely: 'Rarely', sometimes: 'Sometimes', always: 'Rain or shine', winter: 'Through winter: snow, ice and road salt' } },
        storage: { label: 'Where will you keep it?', values: { garage: 'Garage or shed', apartment: 'Apartment or office', stairs: 'Stairs or transit' } },
        experience: { label: 'How experienced a cyclist are you?', values: { new: 'New to regular riding', some: 'Ride sometimes', experienced: 'Very experienced' } },
        frame: { label: 'Frame material', values: { aluminum: 'Aluminum', steel: 'Steel', carbon: 'Carbon' } },
        brakepower: { label: 'Want the extra stopping power of disc brakes?', values: { disc: 'Yes, disc brakes' } },
      },
      need: { groups: ['route', 'cargo', 'power', 'weather'], ranges: ['distance', 'riderHeight', 'budget'] },
    },
    bikepacking: {
      name: 'Bikepacking / bike touring', page: 'bikepacking.html', flow: ['terrain', 'triplength', 'purpose', 'sizemode', 'budget', 'experience'],
      ranges: { riderHeight: { label: 'Your height', min: 150, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 1200, max: 6000, step: 50, unit: 'C$' } },
      groups: {
        terrain: { label: "What's the terrain?", multi: true, values: { road_paved: 'Fully paved', gravel: 'Dedicated gravel', mixed: 'Mixed paved & gravel', trail_mountain: 'Rough trail / singletrack' } },
        triplength: { label: 'How long is the trip?', values: { overnight: 'Overnight or a weekend', week: 'About a week', multiweek: 'Several weeks', expedition: 'Months / continent-crossing' } },
        purpose: { label: "What's the goal of the trip?", values: { touring: 'Comfortable multi-week touring', adventure: 'A proper adventure ride', ultra_race: 'Self-supported ultra-racing' } },
        experience: { label: 'How experienced a bikepacker are you?', values: { new: 'First trip', some: 'Done a few trips', experienced: 'Very experienced' } },
        carrystyle: { label: 'How do you want to carry your gear?', multi: true, values: { minimalist: 'Frame bag, seat pack, bar roll', rack_panniers: 'Rack and panniers' } },
        frame: { label: 'Frame material', values: { aluminum: 'Aluminum', steel: 'Steel', titanium: 'Titanium', carbon: 'Carbon' } },
        shifting: { label: 'Shifting preference', values: { electronic: 'Electronic (Di2 / AXS)', mechanical: 'Mechanical is fine' } },
        tires: { label: 'How much do flat tires worry you out there?', values: { reliable: 'A lot — give me tough, reliable tires' } },
      },
      need: { groups: ['terrain', 'triplength', 'purpose', 'experience'], ranges: ['riderHeight', 'budget'], height: 'riderHeight' },
    },
    mountainbiking: {
      name: 'Mountain biking', page: 'mountainbiking.html', flow: ['discipline', 'experience', 'sizemode', 'budget'],
      ranges: { height: { label: 'Your height', min: 145, max: 205, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 700, max: 6000, step: 50, unit: 'C$' } },
      groups: {
        discipline: { label: 'What kind of riding do you do most?', values: { xc: 'Cross-country', trail: 'Trail', enduro: 'Enduro', downhill: 'Downhill', dirt_jump: 'Dirt jump / park' } },
        experience: { label: 'How experienced a mountain biker are you?', values: { new: 'New to it', some: 'Ride sometimes', experienced: 'Very experienced' } },
        suspensionType: { label: 'Hardtail or full suspension?', values: { hardtail: 'Hardtail', full_suspension: 'Full suspension' } },
        dropper: { label: 'Want a dropper post?', values: { want_it: 'Yes, want it', dont_need: "Don't need it" } },
      },
      need: { groups: ['discipline', 'experience'], ranges: ['height', 'budget'], height: 'height' },
    },
    casual: {
      name: 'Casual riding', page: 'casual.html', flow: ['surface', 'feel', 'distance', 'power', 'riderHeight', 'budget'],
      ranges: { distance: { label: 'How far from home do you usually ride?', min: 2, max: 60, step: 1, unit: 'km' }, riderHeight: { label: 'Your height', min: 145, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 400, max: 3500, step: 50, unit: 'C$' } },
      groups: {
        surface: { label: 'Where will you mostly ride?', multi: true, values: { paved: 'Paved paths and roads', mixed: 'A mix of road and gravel', gravel: 'Packed gravel and rail trails' } },
        power: { label: 'Power preference', values: { pedal_only: 'Pedal only', open: 'Open to e-assist', want_ebike: 'Want e-assist' } },
        feel: { label: 'How should the ride feel?', values: { comfort: 'Comfortable and easy: upright, simple controls', balanced: 'A bit of both', fast: 'Quicker and farther: leaning forward, more efficient' } },
      },
      need: { groups: ['surface', 'feel', 'power'], ranges: ['distance', 'riderHeight', 'budget'] },
    },
    racing: {
      name: 'Racing', page: 'racing.html', flow: ['discipline', 'sizemode', 'budget'],
      ranges: { riderHeight: { label: 'Your height', min: 150, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 1200, max: 13000, step: 100, unit: 'C$' } },
      groups: {
        discipline: { label: 'What are you training or buying for?', multi: true, values: { road_race: 'Road racing', triathlon: 'Triathlon or Ironman', audax: 'Audax / randonneuring', ultra_distance: 'Ultra-distance racing' } },
        character: { label: 'What matters more for your racing?', values: { aero: 'Aero', climbing: 'Climbing', all_rounder: 'All-rounder' } },
        dynamo: { label: 'Dynamo lighting or overnight support?', values: { want_it: 'Yes, I ride through the night', dont_need: 'No, daytime only' } },
      },
      need: { groups: ['discipline'], ranges: ['riderHeight', 'budget'], height: 'riderHeight', characterIfRoad: true },
    },
  };
  // which wizard step holds a given question (the quizzes ask height as part of "sizemode"; the racing "what matters more" sits with the discipline)
  const stepKey = (cat, kind, id) => (kind === 'range' ? (VOCAB[cat].need.height === id ? 'sizemode' : id) : (id === 'character' ? 'discipline' : id));

  // ------------------------------------------------------------------ the mock interpreter (rules, English + French)
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’`]/g, "'");
  const LEX = {
    kids: /\b(child|children|kid|kids|son|daughter|boy|girl|toddler|enfant|enfants|fils|fille|garcon|bambin|balance bike|draisienne|training wheels|stabilisat\w*|years? old|ans)\b/g,
    commute: /\b(commut\w*|to work|work|office|bureau|travail|travailler|boulot|navett\w*|trajet|daily|quotidien\w*|errands?|groceries|epicerie|school run|city|ville|urban\w*|every day|tous les jours|velotaf)\b/g,
    bikepacking: /\b(\d{1,3}\s?(?:days?|jours?|nights?|nuits?)|week-?long|bikepack\w*|cyclocamp\w*|camping|camp|overnight|multi-?day|touring|tour|voyage|panniers?|sacoches?|trip|gaspesie|route verte|gravel trip|nuit|tente|tent|iceland|islande|ring road|patagonia|patagonie|tour divide)\b/g,
    mountainbiking: /\b(mountain|mtb|trail|trails|singletrack|enduro|downhill|vtt|sentiers?|montagne|forest|foret|jump|bike park|xc|cross-?country|hardtail|semi-?rigide|dropper|telescopique|full[- ]?sus\w*|suspension)\b/g,
    racing: /\b(race|races|racing|crit|criterium|triathlon|ironman|audax|randonneu\w*|gran fondo|pbp|lel|course|competition|competitive|time trial|contre-la-montre)\b/g,
    // relaxed riding that is not a commute, a trip or a race: weekend rides, fitness, leisure
    casual: /\b(casual\w*|occasional\w*|leisure\w*|recreation\w*|fitness|weekend (?:rides?|riding)|relaxed (?:rides?|riding)|joyrides?|for fun|exercise|loisirs?|balades?|promenades?|sorties? (?:du dimanche|tranquilles?)|hybrid|hybride|cruiser|rail trails?|keep fit|mise en forme)\b/g,
  };
  // typo tolerance: a word close to a distinctive keyword is read as that keyword ("backpicking" -> "bikepacking").
  // Kept narrow on purpose: only long, distinctive words, and one edit at most, so ordinary words ("overweight", "facing") are never rewritten.
  const FUZZY_LONG = ['bikepacking', 'bikepacker', 'cyclocamping', 'cyclotourisme'];   // long enough to allow several slips
  const FUZZY = ['commuting', 'commuter', 'mountain', 'triathlon', 'downhill', 'overnight', 'panniers', 'touring', 'bikepack', 'singletrack', 'randonneur', 'experienced', 'beginner', 'weekend', 'neighbourhood', 'groceries', 'hardtail', 'training'];
  const dist = (a, b) => {   // Damerau-Levenshtein (adjacent swaps count as one slip)
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[a.length][b.length];
  };
  const SKIP = new Set(['overweight', 'mountains', 'trainer', 'trainers']);
  function fixTypos(t) {
    return t.replace(/[a-z]{7,}/g, w => {
      if (FUZZY_LONG.includes(w) || FUZZY.includes(w) || SKIP.has(w)) return w;
      let best = null;
      FUZZY_LONG.forEach(k => { if (!best && Math.abs(k.length - w.length) <= 3 && w[0] === k[0] && dist(w, k) <= Math.floor(k.length * 0.4)) best = k; });
      if (best) return best;
      FUZZY.forEach(k => { if (!best && Math.abs(k.length - w.length) <= 1 && dist(w, k) === 1) best = k; });
      return best || w;
    });
  }
  // weaker hints, used only when no strong word names a quiz. Road-and-gravel recreation fits our gravel/touring catalog best
  // (it holds the gravel and road-touring bikes); fast/training words point to racing, dirt and forest to mountain biking.
  const WEAK = {
    casual: /\b(gravel|gravier|paved|asphalt|asphalte|roads?|routes?|paths?|pistes?|weekends?|week-?ends?|scenic|countryside|campagne|rides?|riding|sunny|afternoons?|sunday|dimanche|relaxing|relax)\b/g,
    bikepacking: /\b(explor\w*|adventure|aventure|cyclotourisme)\b/g,
    racing: /\b(fast|speed|training|train|club|fitness|sportive|performance|vitesse|entrainement|aero|climb\w*)\b/g,
    mountainbiking: /\b(dirt|rocky|rocks|roots|forests?|woods|off-?road|terre|rocheux)\b/g,
    commute: /\b(hybrid|hybride|city|errands?|flat|bike lanes?|ville)\b/g,
  };
  const count = (t, re) => (t.match(re) || []).length;
  const first = (t, re) => { const m = t.match(re); return m ? m[0].trim() : null; };
  const num = s => { s = String(s).replace(/\s/g, ''); if (/,\d{1,2}$/.test(s) && !/,\d{3}/.test(s)) s = s.replace(',', '.'); return parseFloat(s.replace(/,(?=\d{3})/g, '')); };

  function parseBudget(t) {
    const rx = [
      /(?:between|entre)\s*(?:c?\$)?\s*(\d[\d\s,.]*\d|\d)(\s?k)?\s*(?:and|et|to|-|a)\s*(?:c?\$)?\s*(\d[\d\s,.]*\d|\d)(\s?k)?/,
      /(?:budget|under|below|max(?:imum)?|up to|moins de|jusqu'a|environ|about|around|roughly|approx\w*)\s*(?:of|de|est|is|:)?\s*(?:c?\$)?\s*(\d[\d\s,.]*\d|\d)(\s?k)?\b/,
      /(?:c?\$)\s?(\d[\d\s,.]*\d|\d)(\s?k)?\b/,
      /(\d[\d\s,.]*\d|\d)(\s?k)?\s?(?:\$|dollars?|cad|bucks|piasses)/,
    ];
    for (let i = 0; i < rx.length; i++) {
      const m = t.match(rx[i]); if (!m) continue;
      // "between 1000 and 1500": the upper figure is the budget
      const pick = i === 0 ? [m[3], m[4]] : [m[1], m[2]];
      let v = num(pick[0]); if (pick[1]) v = v * 1000;
      if (v >= 50 && v <= 50000) return { value: Math.round(v), evidence: m[0].trim() };
    }
    return null;
  }
  function parseHeight(t) {
    let m = t.match(/\b(1[0-9]{2}|2[01][0-9])\s?cm\b/); if (m) return { value: +m[1], evidence: m[0] };
    m = t.match(/\b([4-7])\s?(?:'|ft|feet|foot|pieds?)\s?(\d{1,2})?\s?(?:"|in|inches|po|pouces?)?/);
    if (m && (m[2] || /ft|feet|foot|pied/.test(m[0]))) return { value: Math.round((+m[1] * 12 + (+m[2] || 0)) * 2.54), evidence: m[0].trim() };
    return null;
  }

  function interpret(text) {
    const orig = String(text || '').trim();
    const t = fixTypos(norm(orig));
    const out = { category: null, confidence: 'low', scores: {}, answers: [], ranges: {}, extras: [], unusable: [], unused: [], missing: [], missingKeys: [], notes: [], alternatives: [], original: orig };
    if (t.length < 3) return out;
    for (const c of Object.keys(LEX)) out.scores[c] = count(t, LEX[c]);
    const ranked = Object.entries(out.scores).sort((a, b) => b[1] - a[1]);
    if (ranked[0][1] > 0) {
      out.category = ranked[0][0];
      out.confidence = ranked[0][1] >= 3 && ranked[0][1] - ranked[1][1] >= 2 ? 'high' : ranked[0][1] >= 2 ? 'medium' : 'low';
      out.alternatives = ranked.filter(([c, n]) => n > 0 && c !== out.category).map(([c]) => c);
    }
    // no word names a quiz ("occasional weekend rides on road and gravel path"): rather than a dead end, offer the closest fit,
    // clearly marked as a guess (never auto-continued), with the answers the text does give already filled in
    if (!out.category) {
      const weak = Object.entries(WEAK).map(([c, re]) => [c, count(t, re)]).sort((a, b) => b[1] - a[1]);
      if (weak[0][1] > 0) { out.category = weak[0][0]; out.confidence = 'guess'; out.alternatives = weak.filter(([c, n]) => n > 0 && c !== out.category).map(([c]) => c); }
    }
    fillFor(out, out.category);
    // one category word, no rival, and plenty of answers that only make sense for that quiz: that is enough to be fairly sure
    if (out.category && out.confidence === 'low' && ranked[1][1] === 0 && out.answers.filter(a => !a.derived).length + Object.keys(out.ranges).length >= 5) out.confidence = 'medium';
    return out;
  }

  // read the text as a given quiz (also used when the visitor picks a different quiz)
  function fillFor(out, cat) {
    const orig = out.original, t = fixTypos(norm(orig));
    out.category = cat; out.answers = []; out.ranges = {}; out.extras = []; out.unusable = []; out.notes = out.notes.filter(n => /age/.test(n) === false ? false : false);
    const evidence = [];
    // wishes the quiz has no question for: criteria scored against the catalog
    if (CR()) CR().extract(orig).forEach(x => {
      if (!cat) { out.extras.push(x); return; }
      if (CR().available(x, cat)) out.extras.push(x); else out.unusable.push(x);
    });
    out.extras.forEach(x => evidence.push(norm(x.ev)));
    out.unusable.forEach(x => evidence.push(norm(x.ev)));
    if (!cat) { finish(out, t, evidence); return; }
    const V = VOCAB[cat];
    const add = (group, value, ev) => { if (V.groups[group] && V.groups[group].values[value] && !out.answers.some(a => a.group === group && a.value === value)) { if (!V.groups[group].multi) out.answers = out.answers.filter(a => a.group !== group); out.answers.push({ group, value, evidence: ev }); evidence.push(norm(ev)); } };
    const rule = (group, value, re) => { const e = first(t, re); if (e) add(group, value, e); };
    const FOLD = {
      bikepacking: { frame: x => ['frame', x.p.m], electronic: () => ['shifting', 'electronic'], rack_mounts: () => ['carrystyle', 'rack_panniers'] },
      commute: { frame: x => ['frame', x.p.m], disc_brakes: () => ['brakepower', 'disc'] },
    }[cat] || {};
    out.extras = out.extras.filter(x => {
      const f = FOLD[x.id]; if (!f || x.m === 'avoid') return true;
      const [g, v] = f(x); if (!V.groups[g] || !V.groups[g].values[v]) return true;
      add(g, v, x.ev); return false;
    });

    // numbers
    const b = parseBudget(t);
    if (b && V.ranges.budget) { const r = V.ranges.budget; const v = Math.min(r.max, Math.max(r.min, Math.round(b.value / r.step) * r.step)); out.ranges.budget = { value: v, evidence: b.evidence }; evidence.push(norm(b.evidence)); if (v !== b.value) out.notes.push(T('Your budget of {a} is outside this quiz’s slider, so it was set to {b}.', { a: b.value, b: v })); }
    const hKey = Object.keys(V.ranges).find(k => /height/i.test(k));
    const h = parseHeight(t);
    if (h && hKey) { const r = V.ranges[hKey]; evidence.push(norm(h.evidence)); if (h.value >= r.min && h.value <= r.max) out.ranges[hKey] = { value: h.value, evidence: h.evidence }; else out.notes.push(T('A height of {a} cm is outside this quiz’s range ({b}–{c} cm).', { a: h.value, b: r.min, c: r.max })); }

    if (cat === 'kids') {
      // "never ridden without training wheels" means training wheels: a negation must not turn into "confident"
      const neverWithout = /(?:never|not yet|n'a jamais|jamais) (?:ridden|rode|roule|pedale)? ?(?:without|sans) (?:training wheels|stabilisat\w*|petites roues)/;
      rule('exp', 'balance', /balance bike|draisienne|strider/);
      rule('exp', 'training', /training wheels|stabilisat\w*|petites roues/);
      if (!neverWithout.test(t)) rule('exp', 'confident', /(?:without|no) training wheels|rides? (?:well|confidently)|sans roues|sans stabilisat\w*|roule bien/);
      if (!out.answers.some(a => a.group === 'exp')) rule('exp', 'none', /never (?:ridden|rode)|first bike|has never|jamais (?:fait|roule)|premier velo/);
      rule('terrain', 'pavement', /driveway|pavement|sidewalk|entree de garage|trottoir/);
      rule('terrain', 'park', /neighbou?rhood|park\b|paths?\b|quartier|parc|piste cyclable/);
      rule('terrain', 'trail', /dirt|trails?\b|sentiers?|terre/);
      rule('terrain', 'road_gravel', /gravel|gravier/);
      rule('brake', 'coaster', /coaster|pedal(?:s)? back|retropedalage/);
      rule('brake', 'hand', /hand brakes?|freins? a main/);
      if (/\b\d{1,2}\s?(?:-|\s)?(?:years?|yrs?|ans)\b/.test(t) && !out.ranges.height) out.notes.push('You mentioned an age. We do not convert ages to heights, because children of the same age differ a lot: please enter their height in cm.');
    }
    // power preference (commuting and casual riding ask the same question)
    const powerRules = () => {
      rule('power', 'want_ebike', /e-?bike|electric|assist\w*|electrique|assistance|moteur/);
      // "e-bike welcome / okay / acceptable" is openness, not a requirement
      const openRe = /(?:e-?bike|electric\w*|assist\w*|velo electrique)[^.,;]{0,20}(?:welcome|okay|\bok\b|fine|acceptable|accepte\w*|bienvenu\w*)|(?:welcome|open to|ok with|okay with|fine with|accepte\w*)[^.,;]{0,12}(?:e-?bike|electric\w*|assist\w*)/;
      const openEv = first(t, openRe);
      if (openEv) { out.answers = out.answers.filter(x => x.group !== 'power'); add('power', 'open', openEv); }
      rule('power', 'pedal_only', /pedal only|no (?:e-?bike|motor|assist\w*)|sans (?:assistance|moteur)|pas electrique|pedalage seulement/);
      rule('power', 'open', /open to (?:an? )?(?:e-?bike|electric|assist)|ouvert a (?:l'?)?assistance/);
    };
    if (cat === 'casual') {
      // surface: naming road AND gravel is the quiz's own "a mix of road and gravel"; it must not also tick gravel-only
      const combo = first(t, /(?:road|roads|paved|pavement|asphalt) (?:and|&|\/|\+) gravel|gravel (?:and|&|\/|\+) (?:road|roads|paved|pavement|asphalt)|(?:route|routes|asphalte) et gravier|gravier et (?:route|routes|asphalte)|\bmixed\b|\bmixte\b/);
      if (combo) add('surface', 'mixed', combo);
      else {
        rule('surface', 'gravel', /gravel|gravier|rail trails?|packed|voie ferree/);
        rule('surface', 'paved', /paved|asphalt|bike paths?|bike lanes?|pistes? cyclables?|sidewalks?|\broads?\b|\broutes?\b|pavement|pavee?s?\b/);
      }
      // the quiz asks for the farthest point from home, one way: only a figure said that way is used (an out-and-back total is not halved for them)
      const dm = t.match(/(\d+(?:[.,]\d+)?)\s?(km|kilomet\w*|miles?|mi)\b/);
      if (dm) {
        let v = num(dm[1]); const miles = /^mi/.test(dm[2]); if (miles) v *= 1.609; v = Math.round(v); const r = V.ranges.distance;
        const oneWay = /one way|each way|from home|away from home|de chez moi|a l'aller|loin de chez/.test(t);
        if (oneWay && v >= r.min && v <= r.max) { out.ranges.distance = { value: v, evidence: dm[0] }; evidence.push(norm(dm[0])); if (miles) out.notes.push(T('Converted {a} to about {b} km.', { a: dm[0], b: v })); }
        else if (!oneWay) out.notes.push('You gave a ride length. This quiz asks for the farthest point from home, one way (half of an out-and-back ride): please set it yourself.');
      }
      powerRules();
      // how the ride should feel, inferred from the words used (shown with them, and editable): "occasional", "relaxed", "easy" point to comfort,
      // "fast", "longer rides", "training" to quicker and farther
      rule('feel', 'comfort', /occasional\w*|relaxed|leisurely|casual\w*|easy|comfortabl\w*|upright|sit up|simple|detendu\w*|tranquille\w*|confortable\w*|facile|de temps en temps|occasionnel\w*/);
      rule('feel', 'balanced', /bit of both|a bit of each|balanced|equilibre\w*|un peu des deux/);
      rule('feel', 'fast', /\bfast\w*|\bspeed\w*|quick\w*|sporty|aggressive|longer rides?|farther|further|training|rapide\w*|sportif\w*|plus loin|entrainement/);
    }
    if (cat === 'commute') {
      const d = t.match(/(\d+(?:[.,]\d+)?)\s?(km|kilomet\w*|miles?|mi)\b/);
      if (d) {
        let v = num(d[1]); const miles = /^mi/.test(d[2]); if (miles) v = v * 1.609;
        v = Math.round(v); const r = V.ranges.distance;
        if (v >= r.min && v <= r.max) { out.ranges.distance = { value: v, evidence: d[0] }; evidence.push(norm(d[0])); if (miles) out.notes.push(T('Converted {a} to about {b} km.', { a: d[0], b: v })); if (/round trip|return|aller-?retour|each way|both ways/.test(t)) out.notes.push('The quiz asks for the one-way distance: please check the number we took.'); }
        else out.notes.push(T('A distance of {a} km is outside this quiz’s range.', { a: v }));
      }
      powerRules();
      rule('weather', 'winter', /winter|snow|ice\b|salt|hiver|neige|glace|sel de voirie/);
      if (!out.answers.some(a => a.group === 'weather')) { rule('weather', 'always', /rain or shine|in any weather|beau temps,? mauvais temps|par tous les temps/); rule('weather', 'sometimes', /rain|pluie|sometimes in/); rule('weather', 'rarely', /fair[- ]weather|rarely in the rain|rarement/); }
      rule('cargo', 'heavy', /groceries|heavy|epicerie|lourd\w*|trailer|remorque|kids? on (?:the )?back|enfants? (?:sur|a l')/);
      if (!out.answers.some(a => a.group === 'cargo')) { rule('cargo', 'rack', /panniers?|rack\b|sacoches?|porte-?bagages?/); rule('cargo', 'light', /backpack|laptop|sac a dos|light bag/); rule('cargo', 'none', /just me|nothing|rien|seulement moi/); }
      rule('route', 'hilly_assist', /hill\w*|cote\w*|vallonn\w*|steep|pente/);
      rule('route', 'city_streets', /bike lanes?|city streets?|downtown|piste\w* cyclables?|rues?\b|centre-ville|urban\w*/);
      rule('route', 'mixed_paths', /gravel|mixed|dirt path|gravier|chemins? mixtes?/);
      rule('route', 'long_flat', /\bflat\b|\bplat\b|long straight|highway|autoroute/);
      rule('storage', 'apartment', /apartment|condo|office|appartement|bureau/);
      rule('storage', 'stairs', /stairs|escaliers?|transit|metro|autobus|train/);
      rule('storage', 'garage', /garage|shed|remise|cabanon/);
      rule('experience', 'new', /new to (?:cycling|riding|biking)|beginner|debutant\w*|never commuted|nouveau (?:en|dans)/);
    }
    if (cat === 'bikepacking') {
      // "weekend rides" are day rides, not a weekend trip
      rule('triplength', 'overnight', /overnight|weekend(?! rides?| riding)|week-end(?! rides?)|fin de semaine|one night|une nuit|1 night/);
      rule('triplength', 'week', /\b(?:a|one|1) week\b|une semaine|7 days|sept jours|1 week/);
      rule('triplength', 'multiweek', /\b(?:two|three|four|2|3|4|several|few|plusieurs) (?:weeks|semaines)|multi-?week/);
      // a number of days: up to 3 is a weekend, up to 9 about a week, ten or more several weeks (shown with its words, so it can be changed)
      { const dd = t.match(/\b(\d{1,3})\s?(?:-|\s)?(?:days?|jours?|nights?|nuits?)\b/); if (dd && !out.answers.some(a => a.group === 'triplength')) { const n = +dd[1]; add('triplength', n <= 3 ? 'overnight' : n <= 9 ? 'week' : n < 60 ? 'multiweek' : 'expedition', dd[0]); } }
      rule('triplength', 'expedition', /months?|mois|continent|round the world|tour du monde/);
      rule('terrain', 'trail_mountain', /singletrack|rough trail|technical|trail\b|sentiers?|backcountry|tout-?terrain/);
      // "road and gravel" is the quiz's own "mixed paved & gravel"; naming both surfaces must not also tick gravel-only
      const combo = /(?:road|roads|paved|pavement|asphalt) (?:and|&|\/|\+) gravel|gravel (?:and|&|\/|\+) (?:road|roads|paved|pavement|asphalt)|(?:route|routes|asphalte) et gravier|gravier et (?:route|routes|asphalte)/;
      const comboEv = first(t, combo);
      if (comboEv) add('terrain', 'mixed', comboEv);
      else {
        rule('terrain', 'gravel', /gravel|gravier/);
        rule('terrain', 'road_paved', /paved only|fully paved|asphalt|pavement|bike paths?|pistes? cyclables?/);
      }
      // the quiz itself describes the Ring Road as "mixed paved and gravel", so the same words give the same answer here
      rule('terrain', 'mixed', /mixed|mix of|paved and gravel|asphalte et gravier|mixte|ring road|route 1 in iceland/);
      rule('purpose', 'touring', /touring|relaxed|comfortabl\w*|leisure|cyclotourisme|tranquille/);
      rule('purpose', 'adventure', /adventure|aventure/);
      rule('purpose', 'ultra_race', /ultra|tour divide|transcontinental|self-supported race|course d'ultra|bikepacking race/);
      // "robust", "durable", "tough" are the quiz's question about tires that must not let you down (shown with the words, so it can be removed)
      rule('tires', 'reliable', /robust\w*|durab\w*|tough|sturdy|rugged|reliab\w*|flat[- ]?proof|puncture|solide|fiable|resistant\w*/);
      rule('experience', 'new', /first (?:ever )?(?:\w+ )?(?:trip|time|tour|overnight|ride|bikepacking|cyclocamping|adventure)|never (?:done|tried)|beginner|premiere (?:sortie|fois)|debutant\w*|je debute/);
      rule('experience', 'some', /a few trips|done a few|some experience|quelques sorties/);
      rule('experience', 'experienced', /experienced|veteran|many trips|done many|experimente\w*|beaucoup de sorties/);
      rule('carrystyle', 'rack_panniers', /panniers?|\bracks?\b|sacoches?|porte-?bagages?/);
      rule('carrystyle', 'minimalist', /frame bag|seat pack|bar roll|bikepacking bags|sac de cadre|sac de selle|no rack|sans porte-?bagages?/);
    }
    if (cat === 'mountainbiking') {
      rule('discipline', 'downhill', /downhill|\bdh\b|descente|bike park|lift/);
      rule('discipline', 'enduro', /enduro/);
      rule('discipline', 'dirt_jump', /dirt jump|pump track|\bjumps?\b|sauts?|pumptrack/);
      rule('discipline', 'xc', /cross-?country|\bxc\b/);
      rule('discipline', 'trail', /\btrails?\b|singletrack|sentiers?|all-?mountain|polyvalent/);
      rule('experience', 'new', /beginner|new to|first (?:mountain )?bike|debutant\w*|je debute|never (?:ridden|mountain)/);
      rule('experience', 'experienced', /experienced|advanced|expert|years of riding|experimente\w*/);
      rule('suspensionType', 'hardtail', /hardtail|semi-?rigide|front suspension only/);
      rule('suspensionType', 'full_suspension', /full[- ]?sus\w*|full suspension|double suspension|dual suspension/);
      rule('dropper', 'want_it', /dropper|telescopique/);
    }
    if (cat === 'racing') {
      rule('discipline', 'triathlon', /triathlon|ironman|\btri\b/);
      rule('discipline', 'audax', /audax|brevet|\bpbp\b|\blel\b|randonneu\w*|paris-?brest/);
      rule('discipline', 'ultra_distance', /ultra|race across america|\braam\b|transcontinental/);
      rule('discipline', 'road_race', /\bcrit\w*|criterium|road rac\w*|gran fondo|\brace\b|racing|course sur route|competition|competitive/);
      rule('character', 'climbing', /climb\w*|hilly|mountain\w*|grimp\w*|montagne|cols?\b|vallonn\w*/);
      rule('character', 'aero', /\baero\w*|flat\b|\bplat\b|sprint\w*|fast on the flats/);
      rule('character', 'all_rounder', /all-?round\w*|balanced|versatile|polyvalent/);
      rule('dynamo', 'want_it', /dynamo|through the night|all night|toute la nuit|de nuit/);
    }
    finish(out, t, evidence);
  }

  // what the quiz still needs (never guessed), and which clauses of the text were not used
  function finish(out, t, evidence) {
    const cat = out.category;
    out.missing = []; out.missingKeys = [];
    if (cat) {
      const V = VOCAB[cat], need = V.need;
      const miss = (label, key) => { out.missing.push(label); if (!out.missingKeys.includes(key)) out.missingKeys.push(key); };
      need.groups.forEach(g => { if (!out.answers.some(a => a.group === g)) miss(V.groups[g].label, stepKey(cat, 'group', g)); });
      need.ranges.forEach(r => { if (!out.ranges[r]) miss(V.ranges[r].label, stepKey(cat, 'range', r)); });
      if (need.characterIfRoad && out.answers.some(a => a.group === 'discipline' && a.value === 'road_race') && !out.answers.some(a => a.group === 'character')) miss(V.groups.character.label, 'discipline');
      out.answers = out.answers.filter(a => !a.derived);
      if (need.height && out.ranges[need.height]) out.answers.push({ group: 'sizemode', value: 'height', evidence: out.ranges[need.height].evidence, derived: true });
      out.missingKeys.sort((a, b) => V.flow.indexOf(a) - V.flow.indexOf(b));
    }
    // clauses that contributed nothing: shown, never scored
    // (judged by position, so a phrase that spans a split word, like "road and gravel", counts as used on both sides)
    const tn = fixTypos(norm(out.original)), spans = [];
    evidence.forEach(e => { if (!e) return; let i = tn.indexOf(e); while (i !== -1) { spans.push([i, i + e.length]); i = tn.indexOf(e, i + e.length); } });
    const parts = []; let from = 0, sm;
    const sep = /[,.;!?]+|\band\b|\bet\b|\bbut\b|\bmais\b/g;
    while ((sm = sep.exec(tn))) { parts.push([from, sm.index]); from = sm.index + sm[0].length; }
    parts.push([from, tn.length]);
    // the original wording of each part is shown, found by the same order of splitting
    const origParts = String(out.original).split(/[,.;!?]+|\band\b|\bet\b|\bbut\b|\bmais\b/i);
    out.unused = parts.map(([a, b], i) => ({ a, b, shown: (origParts[i] || tn.slice(a, b)).trim(), nc: tn.slice(a, b).trim() })).filter(p => {
      if (p.nc.length < 5 || p.nc.split(' ').length < 2 || /^(i'?m|i am|je suis|i want|i would|j'ai|je veux|my|ma|mon)\b/.test(p.nc) && p.nc.split(' ').length < 4) return false;
      return !spans.some(([x, y]) => x < p.b && y > p.a);
    }).map(p => p.shown).slice(0, 4);
  }

  // a model's answer must stay inside the quizzes' vocabulary and the criteria engine's list
  function validate(r) {
    const errs = [];
    if (!r || typeof r !== 'object') return ['not an object'];
    if (r.category != null && !VOCAB[r.category]) errs.push('unknown category ' + r.category);
    const V = VOCAB[r.category];
    if (V) {
      (r.answers || []).forEach(a => { if (a.group === 'sizemode' && a.value === 'height') return; if (!V.groups[a.group] || !V.groups[a.group].values[a.value]) errs.push('not in the quiz vocabulary: ' + a.group + '=' + a.value); });
      Object.entries(r.ranges || {}).forEach(([k, x]) => { const d = V.ranges[k]; if (!d) errs.push('unknown slider ' + k); else if (!(x.value >= d.min && x.value <= d.max)) errs.push('slider out of range: ' + k + '=' + x.value); });
    }
    if (CR()) { const kept = CR().sanitize((r.extras || []).map(x => ({ id: x.id, p: x.p, m: x.m }))); if (kept.length !== (r.extras || []).length) errs.push('a criterion is not in the engine’s list'); }
    return errs;
  }

  // the hand-off to the quiz reuses its share-link format (#m=...): answers, extra criteria, the shopper's words, whether to
  // score at once (d: 1) or to land on the first open question (s: 0, g: its step)
  function handoff(state) {
    const V = VOCAB[state.category];
    const o = state.answers.map(a => [a.group, a.value]);
    const r = {}; Object.entries(state.ranges).forEach(([k, x]) => { r[k] = String(x.value); });
    const complete = state.missing.length === 0;
    const payload = { o, r, s: complete ? 1 : 0 };
    if (state.extras.length) payload.x = state.extras.map(x => ({ id: x.id, p: x.p, m: x.m }));
    if (state.original) payload.t = state.original.slice(0, 300);
    if (complete) payload.d = 1; else if (state.missingKeys[0]) payload.g = state.missingKeys[0];
    return V.page + '#m=' + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
  }

  window.SVDescribe = { VOCAB, interpret, fillFor, validate, handoff, stepKey };

  // ------------------------------------------------------------------ the screen
  const EXAMPLES = {
    en: ["First overnight bikepacking trip in Gaspésie, mostly gravel, about $1,500. I'm 172 cm and I'd like panniers. Must have fenders, and a Canadian brand if possible.",
         "My daughter is 120 cm, rides with training wheels, mostly the neighbourhood paths. Budget $300.",
         "Winter commute in Montréal, 12 km, snow and salt, groceries on the back, e-bike welcome, around $2,500. I'm 175 cm. Need disc brakes and fenders, no carbon."],
    fr: ["Première sortie de cyclocamping d'une nuit en Gaspésie, surtout du gravier, environ 1 500 $. Je mesure 172 cm et je veux des sacoches. Il me faut des garde-boue, et une marque canadienne si possible.",
         "Ma fille mesure 120 cm, elle roule avec des stabilisateurs, surtout dans les pistes du quartier. Budget de 300 $.",
         "Je pédale 12 km en hiver à Montréal, neige et sel, épicerie à transporter, vélo électrique accepté, environ 2 500 $. Je mesure 175 cm. Il me faut des freins à disque et des garde-boue, pas de carbone."],
  };

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); });
    kids.flat().forEach(k => { if (k != null) e.append(k.nodeType ? k : document.createTextNode(k)); });
    return e;
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function build(host) {
    host.innerHTML = '';
    const wrap = el('div', { class: 'wrap' });
    const tag = el('div', { class: 'fig-tag' }, el('span', { text: T('Preview') }), el('span', { class: 'chip-div' }), el('span', { text: T('Describe your ride') }));
    const h2 = el('h2', { text: T('Not sure where to start? Just tell us about your ride.') });
    const lede = el('p', { class: 'describe-lede', text: T('Write a sentence or two, in English or French. We pick the right quiz, fill in what you said, and add your extra wishes (disc brakes, a weight limit, a brand) to the matching. Then you go straight on, and you can change anything on the way.') });
    const ta = el('textarea', { id: 'describeText', rows: '3', maxlength: '600', 'data-no-i18n': true, 'aria-label': T('Describe your ride'), placeholder: EXAMPLES[FR() ? 'fr' : 'en'][0] });
    const go = el('button', { type: 'button', class: 'btn-primary', id: 'describeGo', text: T('Find my bike') });
    const exRow = el('div', { class: 'describe-examples' }, el('span', { text: T('Try an example:') }),
      ...[0, 1, 2].map(i => el('button', { type: 'button', class: 'describe-ex', 'data-i': String(i), text: [T('Overnight trip'), T('Kid’s first bike'), T('Winter commute')][i] })));
    const out = el('div', { class: 'describe-out', id: 'describeOut', 'aria-live': 'polite' });
    const fine = el('p', { class: 'describe-fine', text: T('This is a preview. It reads your text on this device with simple rules: nothing you type is sent or stored. A language model could replace that step later, and you would still be able to confirm and change every answer before any bike is scored.') });
    wrap.append(tag, h2, lede, ta, el('div', { class: 'describe-actions' }, go, el('span', { class: 'describe-hint', text: T('Ctrl+Enter also works') })), exRow, out, fine);
    host.append(wrap);

    let state = null, timer = null, token = 0;
    const stopAuto = () => { clearInterval(timer); timer = null; const b = out.querySelector('.auto-bar'); if (b) b.remove(); };
    const go2 = () => { stopAuto(); location.href = handoff(state); };

    function refresh() {
      // keep "what is still needed" in step with edits
      const V = VOCAB[state.category]; if (!V) return;
      const need = V.need; state.missing = []; state.missingKeys = [];
      const miss = (label, key) => { state.missing.push(label); if (!state.missingKeys.includes(key)) state.missingKeys.push(key); };
      need.groups.forEach(g => { if (!state.answers.some(a => a.group === g)) miss(V.groups[g].label, stepKey(state.category, 'group', g)); });
      need.ranges.forEach(r => { if (!state.ranges[r]) miss(V.ranges[r].label, stepKey(state.category, 'range', r)); });
      if (need.characterIfRoad && state.answers.some(a => a.group === 'discipline' && a.value === 'road_race') && !state.answers.some(a => a.group === 'character')) miss(V.groups.character.label, 'discipline');
      state.answers = state.answers.filter(a => !a.derived);
      if (need.height && state.ranges[need.height]) state.answers.push({ group: 'sizemode', value: 'height', evidence: state.ranges[need.height].evidence, derived: true });
      state.missingKeys.sort((a, b) => V.flow.indexOf(a) - V.flow.indexOf(b));
    }
    const removeBtn = fn => { const b = el('button', { type: 'button', class: 'chip-x', 'aria-label': T('Remove this answer'), text: '×' }); b.addEventListener('click', () => { stopAuto(); fn(); }); return b; };

    // ---- step 2: "reading" animation, so the visitor sees the text being understood
    async function reading(my) {
      out.innerHTML = '';
      const steps = [T('Choosing the right quiz'), T('Filling in your answers'), T('Adding your extra wishes')];
      const list = el('ul', { class: 'describe-reading', 'aria-hidden': 'true' }, ...steps.map(s => el('li', { text: s })));
      out.append(list);
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      for (const li of list.children) { if (my !== token) return false; await sleep(reduce ? 0 : 260); li.classList.add('done'); }
      await sleep(reduce ? 0 : 200);
      return my === token;
    }

    // ---- step 3: what was understood, and the next action
    function render() {
      stopAuto(); out.innerHTML = '';
      const V = state.category && VOCAB[state.category];
      // nothing understood: ask the one question that unlocks everything, and keep the words and wishes
      if (!V) {
        // a guided question in plain words (not quiz names)
        out.append(el('p', { class: 'describe-h', text: !state.original ? T('Tell me a little about your ride first.') : T('What will you mostly use the bike for? One quick question, and your words and wishes carry over.') }));
        if (state.original) out.append(chooser());
        return;
      }
      const sure = state.confidence === 'high' || state.confidence === 'medium';
      const sel = el('select', { id: 'describeCat', 'aria-label': T('Quiz') }, ...Object.keys(VOCAB).map(c => el('option', Object.assign({ value: c }, c === state.category ? { selected: true } : {}), T(VOCAB[c].name))));
      sel.addEventListener('change', () => { stopAuto(); fillFor(state, sel.value); state.confidence = 'low'; refresh(); render(); });
      out.append(el('div', { class: 'describe-cat' }, el('span', { text: T('This looks like:') }), sel, el('span', { class: 'describe-conf', text: T(state.confidence === 'high' ? 'confident' : state.confidence === 'medium' ? 'fairly sure' : state.confidence === 'guess' ? 'closest fit, not certain: change it if it is wrong' : 'not sure, please check') })));
      out.append(el('p', { class: 'describe-h', text: T('Here is what we understood') }));
      const list = el('ul', { class: 'describe-chips' });
      state.answers.filter(a => !a.derived).forEach(a => {
        const g = V.groups[a.group];
        const s = el('select', { 'aria-label': T(g.label) }, ...Object.entries(g.values).map(([v, l]) => el('option', Object.assign({ value: v }, v === a.value ? { selected: true } : {}), T(l))));
        s.addEventListener('change', () => { stopAuto(); a.value = s.value; });
        list.append(el('li', {}, el('span', { class: 'chip-k', text: T(g.label) }), s, el('span', { class: 'chip-ev', 'data-no-i18n': true, title: T('from your words'), text: '“' + a.evidence + '”' }), removeBtn(() => { state.answers = state.answers.filter(x => x !== a); refresh(); render(); })));
      });
      Object.entries(state.ranges).forEach(([k, x]) => {
        const d = V.ranges[k];
        const inp = el('input', { type: 'number', min: d.min, max: d.max, step: d.step, value: x.value, 'aria-label': T(d.label) });
        inp.addEventListener('change', () => { stopAuto(); const v = Math.min(d.max, Math.max(d.min, Math.round(+inp.value / d.step) * d.step)); x.value = v; inp.value = v; });
        list.append(el('li', {}, el('span', { class: 'chip-k', text: T(d.label) }), inp, el('span', { class: 'chip-u', text: d.unit === 'C$' ? '$ CA' : d.unit }), el('span', { class: 'chip-ev', 'data-no-i18n': true, title: T('from your words'), text: '“' + x.evidence + '”' }), removeBtn(() => { delete state.ranges[k]; refresh(); render(); })));
      });
      state.extras.forEach(x => {
        const ms = el('select', { 'aria-label': T('How important is this?') }, ...[['must', 'Must have'], ['prefer', 'Nice to have'], ['avoid', 'Avoid']].map(([v, l]) => el('option', Object.assign({ value: v }, v === x.m ? { selected: true } : {}), T(l))));
        ms.addEventListener('change', () => { stopAuto(); x.m = ms.value; });
        list.append(el('li', { class: 'chip-extra' }, el('span', { class: 'chip-k', text: CR().display(x, T) }), ms, el('span', { class: 'chip-ev', 'data-no-i18n': true, title: T('from your words'), text: '“' + x.ev + '”' }), removeBtn(() => { state.extras = state.extras.filter(y => y !== x); render(); })));
      });
      if (!list.children.length) list.append(el('li', { class: 'chip-empty', text: T('Nothing specific found yet: the quiz will ask everything.') }));
      out.append(list);
      if (state.extras.length) out.append(el('p', { class: 'describe-extra-note', text: T('Your extra wishes are added to the matching. Where a bike’s record does not list something, we say “not listed” instead of guessing.') }));
      if (state.unusable.length) out.append(el('p', { class: 'describe-notes', text: T('We have no data on these for {name} bikes, so they cannot change the ranking: {list}.', { name: T(V.name), list: state.unusable.map(x => CR().display(x, T)).join(', ') }) }));
      if (state.unused.length) out.append(el('p', { class: 'describe-unused' }, T('Not used (we could not turn these into criteria): '), el('span', { 'data-no-i18n': true, text: state.unused.map(u => '“' + u + '”').join(' ') })));
      if (state.notes.length) out.append(el('ul', { class: 'describe-notes' }, ...state.notes.map(n => el('li', { text: T(n) }))));
      const complete = state.missing.length === 0;
      out.append(el('p', { class: 'describe-missing', text: complete ? T('That is everything the quiz needs.') : T('Still needed (we do not guess): {list}', { list: state.missing.map(m => T(m)).join(', ') }) + (state.missingKeys.length ? '' : '') }));
      const cont = el('button', { type: 'button', class: 'btn-primary', id: 'describeContinue', text: complete ? T('Show my matches') : T('Continue: I will ask only what is missing') });
      cont.addEventListener('click', go2);
      const actions = el('div', { class: 'describe-actions' }, cont);
      out.append(actions);
      // sure and complete: carry on by themselves, with a visible, cancellable countdown
      if (complete && sure) {
        const SEC = 4, bar = el('div', { class: 'auto-bar', role: 'status' }, el('span', { class: 'auto-msg', text: T('Taking you to your matches in {n}…', { n: SEC }) }), el('button', { type: 'button', class: 'auto-cancel', text: T('Edit first') }), el('span', { class: 'auto-track' }, el('i', {})));
        bar.querySelector('.auto-cancel').addEventListener('click', () => { stopAuto(); cont.focus(); });
        out.append(bar);
        let left = SEC; const fill = bar.querySelector('i'); fill.style.transitionDuration = SEC + 's'; requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = '100%'; }));
        timer = setInterval(() => { left -= 1; const m = bar.querySelector('.auto-msg'); if (m) m.textContent = T('Taking you to your matches in {n}…', { n: Math.max(left, 0) }); if (left <= 0) go2(); }, 1000);
      }
    }
    function chooser() {
      // each option leads straight to a quiz
      const pick = c => () => { fillFor(state, c); state.confidence = 'low'; refresh(); render(); };
      const opts = [['Getting to work, school or running errands', pick('commute')], ['Casual or weekend rides', pick('casual')], ['Trips with camping gear', pick('bikepacking')],
                    ['Trails and off-road riding', pick('mountainbiking')], ['Racing, triathlon or hard training', pick('racing')], ['A bike for a child', pick('kids')]];
      return el('div', { class: 'describe-choose' }, ...opts.map(([label, fn]) => { const b = el('button', { type: 'button', class: 'btn-secondary', text: T(label) }); b.addEventListener('click', fn); return b; }));
    }

    async function run() {
      stopAuto();
      const my = ++token;
      state = interpret(ta.value);
      if (state.category) { const errs = validate(state); if (errs.length) console.warn('describe: interpretation rejected', errs); }
      refresh();
      if (!ta.value.trim()) { render(); ta.focus(); return; }
      if (!(await reading(my))) return;
      render();
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    go.addEventListener('click', run);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } });
    exRow.querySelectorAll('.describe-ex').forEach(b => b.addEventListener('click', () => { ta.value = EXAMPLES[FR() ? 'fr' : 'en'][+b.dataset.i]; run(); }));
  }

  function init() { const host = document.getElementById('describe'); if (host) build(host); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
