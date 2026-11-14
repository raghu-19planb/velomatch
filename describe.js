// "Describe your ride": a PREVIEW of how an AI front door could work, built with a mock interpreter.
//
// The visitor writes a sentence ("first overnight trip in Gaspésie, about $1,500, I'm 172 cm"). The interpreter turns it into
// the SAME structured answers the quizzes already use (category, option values, slider values). The visitor then sees exactly
// what was understood, with the words it came from, can change or remove any answer, and only then continues to the quiz, which
// scores bikes with its normal, deterministic engine. Nothing is guessed: what the text does not say stays blank and the quiz asks.
//
// This interpreter runs on the device with simple rules, in English and French, and sends nothing anywhere. A language model can
// replace `interpret()` later: it must return the same shape (see docs/ai-matching-design.md) and `validate()` rejects anything
// that is not in the quizzes' vocabulary, so a model could never invent an answer the quiz does not have.
(function () {
  'use strict';
  const T = (s, v) => (window.I18N ? window.I18N.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m)) : s));
  const FR = () => !!(window.I18N && window.I18N.lang === 'fr');

  // ------------------------------------------------------------------ the vocabulary: exactly what each quiz understands
  const VOCAB = {
    kids: {
      name: "Kids' first bike", page: 'kids.html',
      ranges: { height: { label: "Child's height", min: 100, max: 180, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 80, max: 600, step: 10, unit: 'C$' } },
      groups: {
        exp: { label: 'Riding experience', values: { none: 'Never ridden', balance: 'Balance bike', training: 'Training wheels', confident: 'Confident, no training wheels' } },
        terrain: { label: 'Where they ride', values: { pavement: 'Pavement / driveway', road_gravel: 'Road and gravel', park: 'Neighborhood paths', trail_road_gravel: 'Trail, road and gravel', trail: 'Light dirt trails' } },
        brake: { label: 'Brake preference', values: { coaster: 'Coaster', hand: 'Hand brakes' } },
        origin: { label: 'Brand origin', values: { canadian: 'Prefer Canadian' } },
      },
      need: { groups: ['exp', 'terrain'], ranges: ['height', 'budget'] },
    },
    commute: {
      name: 'Commuting', page: 'commute.html',
      ranges: { distance: { label: 'Commute distance (one-way)', min: 1, max: 40, step: 1, unit: 'km' }, riderHeight: { label: 'Your height', min: 145, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 300, max: 3000, step: 50, unit: 'C$' } },
      groups: {
        route: { label: "What's your route like?", multi: true, values: { city_streets: 'City streets & bike lanes', mixed_paths: 'Mixed paved & gravel paths', long_flat: 'Long, flat roads', hilly_assist: 'Hilly — could use assist' } },
        cargo: { label: 'What do you need to carry?', values: { none: 'Just me', light: 'Backpack or light bag', rack: 'Rack or panniers', heavy: 'Heavy loads (groceries, gear)' } },
        power: { label: 'Power preference', values: { pedal_only: 'Pedal only', open: 'Open to e-assist', want_ebike: 'Want e-assist' } },
        weather: { label: 'Will you ride in the rain or snow?', values: { rarely: 'Rarely', sometimes: 'Sometimes', always: 'Rain or shine', winter: 'Through winter: snow, ice and road salt' } },
        storage: { label: 'Where will you keep it?', values: { garage: 'Garage or shed', apartment: 'Apartment or office', stairs: 'Stairs or transit' } },
        experience: { label: 'How experienced a cyclist are you?', values: { new: 'New to regular riding', some: 'Ride sometimes', experienced: 'Very experienced' } },
        origin: { label: 'Brand origin', values: { canadian: 'Prefer Canadian' } },
      },
      need: { groups: ['route', 'cargo', 'power', 'weather'], ranges: ['distance', 'riderHeight', 'budget'] },
    },
    bikepacking: {
      name: 'Cyclocamping', page: 'bikepacking.html',
      ranges: { riderHeight: { label: 'Your height', min: 150, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 1200, max: 6000, step: 50, unit: 'C$' } },
      groups: {
        terrain: { label: "What's the terrain?", multi: true, values: { road_paved: 'Fully paved', gravel: 'Dedicated gravel', mixed: 'Mixed paved & gravel', trail_mountain: 'Rough trail / singletrack' } },
        triplength: { label: 'How long is the trip?', values: { overnight: 'Overnight or a weekend', week: 'About a week', multiweek: 'Several weeks', expedition: 'Months / continent-crossing' } },
        purpose: { label: "What's the goal of the trip?", values: { touring: 'Comfortable multi-week touring', adventure: 'A proper adventure ride', ultra_race: 'Self-supported ultra-racing' } },
        experience: { label: 'How experienced a bikepacker are you?', values: { new: 'First trip', some: 'Done a few trips', experienced: 'Very experienced' } },
        carrystyle: { label: 'How do you want to carry your gear?', multi: true, values: { minimalist: 'Frame bag, seat pack, bar roll', rack_panniers: 'Rack and panniers' } },
        frame: { label: 'Frame material', values: { aluminum: 'Aluminum', steel: 'Steel', titanium: 'Titanium', carbon: 'Carbon' } },
        origin: { label: 'Brand origin', values: { canadian: 'Prefer Canadian' } },
      },
      need: { groups: ['terrain', 'triplength', 'purpose', 'experience'], ranges: ['riderHeight', 'budget'], height: 'riderHeight' },
    },
    mountainbiking: {
      name: 'Mountain biking', page: 'mountainbiking.html',
      ranges: { height: { label: 'Your height', min: 145, max: 205, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 700, max: 6000, step: 50, unit: 'C$' } },
      groups: {
        discipline: { label: 'What kind of riding do you do most?', values: { xc: 'Cross-country', trail: 'Trail', enduro: 'Enduro', downhill: 'Downhill', dirt_jump: 'Dirt jump / park' } },
        experience: { label: 'How experienced a mountain biker are you?', values: { new: 'New to it', some: 'Ride sometimes', experienced: 'Very experienced' } },
        suspensionType: { label: 'Hardtail or full suspension?', values: { hardtail: 'Hardtail', full_suspension: 'Full suspension' } },
        dropper: { label: 'Want a dropper post?', values: { want_it: 'Yes, want it', dont_need: "Don't need it" } },
        frame: { label: 'Frame material', values: { aluminum: 'Aluminum', carbon: 'Carbon' } },
        origin: { label: 'Brand origin', values: { canadian: 'Prefer Canadian' } },
      },
      need: { groups: ['discipline', 'experience'], ranges: ['height', 'budget'], height: 'height' },
    },
    racing: {
      name: 'Racing', page: 'racing.html',
      ranges: { riderHeight: { label: 'Your height', min: 150, max: 200, step: 1, unit: 'cm' }, budget: { label: 'Budget', min: 1200, max: 13000, step: 100, unit: 'C$' } },
      groups: {
        discipline: { label: 'What are you training or buying for?', multi: true, values: { road_race: 'Road racing', triathlon: 'Triathlon or Ironman', audax: 'Audax / randonneuring', ultra_distance: 'Ultra-distance racing' } },
        character: { label: 'What matters more for your racing?', values: { aero: 'Aero', climbing: 'Climbing', all_rounder: 'All-rounder' } },
        shifting: { label: 'Shifting preference', values: { electronic: 'Electronic (Di2 / AXS)', mechanical: 'Mechanical is fine' } },
        dynamo: { label: 'Dynamo lighting or overnight support?', values: { want_it: 'Yes, I ride through the night', dont_need: 'No, daytime only' } },
        frame: { label: 'Frame material', values: { carbon: 'Carbon', aluminum: 'Aluminum', steel: 'Steel', titanium: 'Titanium' } },
        origin: { label: 'Brand origin', values: { canadian: 'Prefer Canadian' } },
      },
      need: { groups: ['discipline'], ranges: ['riderHeight', 'budget'], height: 'riderHeight', characterIfRoad: true },
    },
  };

  // ------------------------------------------------------------------ the mock interpreter (rules, English + French)
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’`]/g, "'");
  const LEX = {
    kids: /\b(child|children|kid|kids|son|daughter|boy|girl|toddler|enfant|enfants|fils|fille|garcon|bambin|balance bike|draisienne|training wheels|stabilisat\w*|years? old|ans)\b/g,
    commute: /\b(commut\w*|to work|work|office|bureau|travail|travailler|boulot|navett\w*|trajet|daily|quotidien\w*|errands?|groceries|epicerie|school run|city|ville|urban\w*|every day|tous les jours|velotaf)\b/g,
    bikepacking: /\b(bikepack\w*|cyclocamp\w*|camping|camp|overnight|multi-?day|touring|tour|voyage|panniers?|sacoches?|trip|gaspesie|route verte|gravel trip|nuit|tente|tent)\b/g,
    mountainbiking: /\b(mountain|mtb|trail|trails|singletrack|enduro|downhill|vtt|sentiers?|montagne|forest|foret|jump|bike park|xc|cross-?country|hardtail|semi-?rigide|dropper|telescopique|full[- ]?sus\w*|suspension)\b/g,
    racing: /\b(race|races|racing|crit|criterium|triathlon|ironman|audax|randonneu\w*|gran fondo|pbp|lel|course|competition|competitive|time trial|contre-la-montre)\b/g,
  };
  const count = (t, re) => (t.match(re) || []).length;
  const first = (t, re) => { const m = t.match(re); return m ? m[0].trim() : null; };
  const num = s => { s = String(s).replace(/\s/g, ''); if (/,\d{1,2}$/.test(s) && !/,\d{3}/.test(s)) s = s.replace(',', '.'); return parseFloat(s.replace(/,(?=\d{3})/g, '')); };

  function parseBudget(t) {
    const rx = [
      /(?:budget|under|below|max(?:imum)?|up to|moins de|jusqu'a|environ|about|around|roughly|approx\w*)\s*(?:of|de|est|is|:)?\s*(?:c?\$)?\s*(\d[\d\s,.]*\d|\d)(\s?k)?\b/,
      /(?:c?\$)\s?(\d[\d\s,.]*\d|\d)(\s?k)?\b/,
      /(\d[\d\s,.]*\d|\d)(\s?k)?\s?(?:\$|dollars?|cad|bucks|piasses)/,
    ];
    for (const r of rx) { const m = t.match(r); if (m) { let v = num(m[1]); if (m[2]) v = v * 1000; if (v >= 50 && v <= 50000) return { value: Math.round(v), evidence: m[0].trim() }; } }
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
    const t = norm(orig);
    const out = { category: null, confidence: 'low', scores: {}, answers: [], ranges: {}, missing: [], notes: [], alternatives: [] };
    if (t.length < 4) return out;
    for (const c of Object.keys(LEX)) out.scores[c] = count(t, LEX[c]);
    const ranked = Object.entries(out.scores).sort((a, b) => b[1] - a[1]);
    if (ranked[0][1] > 0) {
      out.category = ranked[0][0];
      out.confidence = ranked[0][1] >= 3 && ranked[0][1] - ranked[1][1] >= 2 ? 'high' : ranked[0][1] >= 2 ? 'medium' : 'low';
      out.alternatives = ranked.filter(([c, n]) => n > 0 && c !== out.category).map(([c]) => c);
    }
    const cat = out.category;
    if (!cat) { out.notes.push('We could not tell which kind of bike this is for.'); return out; }
    const V = VOCAB[cat];
    const add = (group, value, evidence) => { if (V.groups[group] && V.groups[group].values[value] && !out.answers.some(a => a.group === group && a.value === value)) { if (!V.groups[group].multi) out.answers = out.answers.filter(a => a.group !== group); out.answers.push({ group, value, evidence }); } };
    const rule = (group, value, re) => { const e = first(t, re); if (e) add(group, value, e); };

    // numbers
    const b = parseBudget(t);
    if (b && V.ranges.budget) { const r = V.ranges.budget; const v = Math.min(r.max, Math.max(r.min, Math.round(b.value / r.step) * r.step)); out.ranges.budget = { value: v, evidence: b.evidence }; if (v !== b.value) out.notes.push(T('Your budget of {a} is outside this quiz’s slider, so it was set to {b}.', { a: b.value, b: v })); }
    const hKey = Object.keys(V.ranges).find(k => /height/i.test(k));
    const h = parseHeight(t);
    if (h && hKey) { const r = V.ranges[hKey]; if (h.value >= r.min && h.value <= r.max) out.ranges[hKey] = { value: h.value, evidence: h.evidence }; else out.notes.push(T('A height of {a} cm is outside this quiz’s range ({b}–{c} cm).', { a: h.value, b: r.min, c: r.max })); }

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
    if (cat === 'commute') {
      const d = t.match(/(\d+(?:[.,]\d+)?)\s?(?:km|kilomet\w*)/);
      if (d) { const v = Math.round(num(d[1])); const r = V.ranges.distance; if (v >= r.min && v <= r.max) { out.ranges.distance = { value: v, evidence: d[0] }; if (/round trip|return|aller-?retour|each way|both ways/.test(t)) out.notes.push('The quiz asks for the one-way distance: please check the number we took.'); } else out.notes.push(T('A distance of {a} km is outside this quiz’s range.', { a: v })); }
      rule('power', 'want_ebike', /e-?bike|electric|assist\w*|electrique|assistance|moteur/);
      rule('power', 'pedal_only', /pedal only|no (?:e-?bike|motor|assist\w*)|sans (?:assistance|moteur)|pas electrique|pedalage seulement/);
      rule('power', 'open', /open to (?:an? )?(?:e-?bike|electric|assist)|ouvert a (?:l'?)?assistance/);
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
      rule('triplength', 'overnight', /overnight|weekend|week-end|fin de semaine|one night|une nuit|1 night/);
      rule('triplength', 'week', /\b(?:a|one|1) week\b|une semaine|7 days|sept jours|1 week/);
      rule('triplength', 'multiweek', /\b(?:two|three|four|2|3|4|several|few|plusieurs) (?:weeks|semaines)|multi-?week/);
      rule('triplength', 'expedition', /months?|mois|continent|round the world|tour du monde/);
      rule('terrain', 'trail_mountain', /singletrack|rough trail|technical|trail\b|sentiers?|backcountry|tout-?terrain/);
      rule('terrain', 'gravel', /gravel|gravier/);
      rule('terrain', 'road_paved', /paved only|fully paved|asphalt|pavement|route verte|bike paths?|pistes? cyclables?/);
      rule('terrain', 'mixed', /mixed|mix of|paved and gravel|asphalte et gravier|mixte/);
      rule('purpose', 'touring', /touring|relaxed|comfortabl\w*|leisure|cyclotourisme|tranquille/);
      rule('purpose', 'adventure', /adventure|aventure/);
      rule('purpose', 'ultra_race', /ultra|tour divide|transcontinental|self-supported race|course d'ultra|bikepacking race/);
      rule('experience', 'new', /first (?:ever )?(?:trip|time|tour|overnight)|never (?:done|tried)|beginner|premiere (?:sortie|fois)|debutant\w*|je debute/);
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
      rule('shifting', 'electronic', /electronic|di2|\baxs\b|electronique/);
      rule('dynamo', 'want_it', /dynamo|through the night|all night|toute la nuit|de nuit/);
    }
    // shared preferences
    rule('origin', 'canadian', /canadian[- ]made|made in canada|canadian brand|prefer canadian|marque canadienne|fabrique au canada|canadien\w*/);
    for (const [v, re] of [['carbon', /carbon\w*|carbone/], ['aluminum', /alumin\w*/], ['steel', /\bsteel\b|\bacier\b/], ['titanium', /titan\w*/]]) rule('frame', v, re);

    // what the quiz still needs (and is not guessed)
    const need = V.need;
    need.groups.forEach(g => { if (!out.answers.some(a => a.group === g)) out.missing.push(V.groups[g].label); });
    need.ranges.forEach(r => { if (!out.ranges[r]) out.missing.push(V.ranges[r].label); });
    if (need.characterIfRoad && out.answers.some(a => a.group === 'discipline' && a.value === 'road_race') && !out.answers.some(a => a.group === 'character')) out.missing.push(V.groups.character.label);
    if (need.height && out.ranges[need.height]) out.answers.push({ group: 'sizemode', value: 'height', evidence: out.ranges[need.height].evidence, derived: true });
    return out;
  }

  // a model's answer must stay inside the quizzes' vocabulary
  function validate(r) {
    const errs = [];
    if (!r || typeof r !== 'object') return ['not an object'];
    if (r.category != null && !VOCAB[r.category]) errs.push('unknown category ' + r.category);
    const V = VOCAB[r.category];
    if (V) {
      (r.answers || []).forEach(a => { if (a.group === 'sizemode' && a.value === 'height') return; if (!V.groups[a.group] || !V.groups[a.group].values[a.value]) errs.push('not in the quiz vocabulary: ' + a.group + '=' + a.value); });
      Object.entries(r.ranges || {}).forEach(([k, x]) => { const d = V.ranges[k]; if (!d) errs.push('unknown slider ' + k); else if (!(x.value >= d.min && x.value <= d.max)) errs.push('slider out of range: ' + k + '=' + x.value); });
    }
    return errs;
  }

  // the hand-off to the quiz reuses its existing "share link" format (#m=...), so nothing in the quiz changes
  function handoff(state) {
    const V = VOCAB[state.category];
    const o = state.answers.map(a => [a.group, a.value]);
    const r = {}; Object.entries(state.ranges).forEach(([k, x]) => { r[k] = String(x.value); });
    const complete = state.missing.length === 0;
    const json = JSON.stringify({ o, r, s: complete ? 1 : 0 });
    return V.page + '#m=' + encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  }

  window.SVDescribe = { VOCAB, interpret, validate, handoff };

  // ------------------------------------------------------------------ the screen
  const EXAMPLES = {
    en: ["First overnight bikepacking trip in Gaspésie, mostly gravel, about $1,500. I'm 172 cm and I'd like panniers.",
         "My daughter is 120 cm, never ridden without training wheels, mostly the neighbourhood paths. Budget $300.",
         "Winter commute in Montréal, 12 km, snow and salt, groceries on the back, e-bike welcome, around $2,500. I'm 175 cm."],
    fr: ["Première sortie de cyclocamping d'une nuit en Gaspésie, surtout du gravier, environ 1 500 $. Je mesure 172 cm et je veux des sacoches.",
         "Ma fille mesure 120 cm, elle roule avec des stabilisateurs, surtout dans les pistes du quartier. Budget de 300 $.",
         "Je pédale 12 km en hiver à Montréal, neige et sel, épicerie à transporter, vélo électrique accepté, environ 2 500 $. Je mesure 175 cm."],
  };

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); });
    kids.flat().forEach(k => { if (k != null) e.append(k.nodeType ? k : document.createTextNode(k)); });
    return e;
  }

  function build(host) {
    host.innerHTML = '';
    const wrap = el('div', { class: 'wrap' });
    const tag = el('div', { class: 'fig-tag' }, el('span', { text: T('Preview') }), el('span', { class: 'chip-div' }), el('span', { text: T('Describe your ride') }));
    const h2 = el('h2', { text: T('Not sure where to start? Just tell us about your ride.') });
    const lede = el('p', { class: 'describe-lede', text: T('Write a sentence or two, in English or French. We turn it into the quiz answers, show you exactly what we understood, and let you change anything before a single bike is scored.') });
    const ta = el('textarea', { id: 'describeText', rows: '3', maxlength: '600', 'data-no-i18n': true, 'aria-label': T('Describe your ride'), placeholder: EXAMPLES[FR() ? 'fr' : 'en'][0] });
    const go = el('button', { type: 'button', class: 'btn-primary', id: 'describeGo', text: T('Understand my ride') });
    const exRow = el('div', { class: 'describe-examples' }, el('span', { text: T('Try an example:') }),
      ...[0, 1, 2].map(i => el('button', { type: 'button', class: 'describe-ex', 'data-i': String(i), text: [T('Overnight trip'), T('Kid’s first bike'), T('Winter commute')][i] })));
    const out = el('div', { class: 'describe-out', id: 'describeOut', 'aria-live': 'polite' });
    const fine = el('p', { class: 'describe-fine', text: T('This is a preview. It reads your text on this device with simple rules: nothing you type is sent or stored. A language model could replace that step later, and you would still confirm every answer before any bike is scored.') });
    wrap.append(tag, h2, lede, ta, el('div', { class: 'describe-actions' }, go), exRow, out, fine);
    host.append(wrap);

    let state = null;
    const label = (cat, group, value) => T(VOCAB[cat].groups[group].values[value]);
    function render() {
      out.innerHTML = '';
      if (!state) return;
      const V = state.category && VOCAB[state.category];
      if (!V) { out.append(el('p', { class: 'describe-none', text: T('We could not tell which kind of bike this is for. Add a few words about how you will ride it, or pick a quiz below.') })); return; }
      // category (changeable)
      const sel = el('select', { id: 'describeCat', 'aria-label': T('Quiz') }, ...Object.keys(VOCAB).map(c => el('option', Object.assign({ value: c }, c === state.category ? { selected: true } : {}), T(VOCAB[c].name))));
      sel.addEventListener('change', () => { state = reinterpret(sel.value); render(); });
      out.append(el('div', { class: 'describe-cat' }, el('span', { text: T('This looks like:') }), sel, el('span', { class: 'describe-conf', text: T(state.confidence === 'high' ? 'confident' : state.confidence === 'medium' ? 'fairly sure' : 'not sure, please check') })));
      // understood answers, each editable
      const list = el('ul', { class: 'describe-chips' });
      state.answers.filter(a => !a.derived).forEach((a, idx) => {
        const g = V.groups[a.group];
        const s = el('select', { 'aria-label': T(g.label) }, ...Object.entries(g.values).map(([v, l]) => el('option', Object.assign({ value: v }, v === a.value ? { selected: true } : {}), T(l))));
        s.addEventListener('change', () => { a.value = s.value; });
        list.append(el('li', {}, el('span', { class: 'chip-k', text: T(g.label) }), s, el('span', { class: 'chip-ev', 'data-no-i18n': true, title: T('from your words'), text: '“' + a.evidence + '”' }), removeBtn(() => { state.answers = state.answers.filter(x => x !== a); refreshMissing(); render(); })));
      });
      Object.entries(state.ranges).forEach(([k, x]) => {
        const d = V.ranges[k];
        const inp = el('input', { type: 'number', min: d.min, max: d.max, step: d.step, value: x.value, 'aria-label': T(d.label) });
        inp.addEventListener('change', () => { const v = Math.min(d.max, Math.max(d.min, Math.round(+inp.value / d.step) * d.step)); x.value = v; inp.value = v; });
        list.append(el('li', {}, el('span', { class: 'chip-k', text: T(d.label) }), inp, el('span', { class: 'chip-u', text: d.unit === 'C$' ? '$ CA' : d.unit }), el('span', { class: 'chip-ev', 'data-no-i18n': true, title: T('from your words'), text: '“' + x.evidence + '”' }), removeBtn(() => { delete state.ranges[k]; refreshMissing(); render(); })));
      });
      if (!list.children.length) list.append(el('li', { class: 'chip-empty', text: T('Nothing specific found yet: the quiz will ask everything.') }));
      out.append(el('p', { class: 'describe-h', text: T('Here is what we understood') }), list);
      if (state.notes.length) out.append(el('ul', { class: 'describe-notes' }, ...state.notes.map(n => el('li', { text: T(n) }))));
      refreshMissing();
      const miss = el('p', { class: 'describe-missing' });
      out.append(miss);
      function paintMissing() { miss.textContent = state.missing.length ? T('Still needed (we do not guess): {list}', { list: state.missing.map(m => T(m)).join(', ') }) : T('That is everything the quiz needs.'); }
      paintMissing();
      state.paint = paintMissing;
      const cont = el('a', { class: 'btn-primary', id: 'describeContinue', href: handoff(state), text: state.missing.length ? T('Continue to the quiz') : T('See my matches') });
      cont.addEventListener('click', () => { cont.href = handoff(state); });
      out.append(el('div', { class: 'describe-actions' }, cont));
    }
    function removeBtn(fn) { const b = el('button', { type: 'button', class: 'chip-x', 'aria-label': T('Remove this answer'), text: '×' }); b.addEventListener('click', fn); return b; }
    function refreshMissing() {
      if (!state || !state.category) return;
      const V = VOCAB[state.category], need = V.need;
      state.missing = [];
      need.groups.forEach(g => { if (!state.answers.some(a => a.group === g)) state.missing.push(V.groups[g].label); });
      need.ranges.forEach(r => { if (!state.ranges[r]) state.missing.push(V.ranges[r].label); });
      if (need.characterIfRoad && state.answers.some(a => a.group === 'discipline' && a.value === 'road_race') && !state.answers.some(a => a.group === 'character')) state.missing.push(V.groups.character.label);
      state.answers = state.answers.filter(a => !a.derived);
      if (need.height && state.ranges[need.height]) state.answers.push({ group: 'sizemode', value: 'height', evidence: state.ranges[need.height].evidence, derived: true });
      if (state.paint) state.paint();
    }
    function reinterpret(cat) { return interpretFor(ta.value, cat); }
    go.addEventListener('click', () => { state = interpret(ta.value); const errs = state.category ? validate(state) : []; if (errs.length) console.warn('describe: interpretation rejected', errs); render(); });
    exRow.querySelectorAll('.describe-ex').forEach(b => b.addEventListener('click', () => { ta.value = EXAMPLES[FR() ? 'fr' : 'en'][+b.dataset.i]; go.click(); }));
  }

  // reading the same text as a different quiz: interpret() with the category forced
  function interpretFor(text, cat) {
    const saved = Object.assign({}, LEX);
    Object.keys(LEX).forEach(c => { LEX[c] = c === cat ? /\b[a-z]+\b/g : /(?!x)x/g; });
    let r; try { r = interpret(text); } finally { Object.assign(LEX, saved); }
    r.confidence = 'low'; return r;
  }

  function init() { const host = document.getElementById('describe'); if (host) build(host); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
