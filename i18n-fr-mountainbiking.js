// French (Québec) for the mountain biking quiz. English text is the key. Loaded after i18n-fr-core.js and i18n-fr-quiz.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md. "Hardtail" is rendered "semi-rigide" and a
// full-suspension bike "double suspension", the terms Québec shops use; the OQLF has no entry for them.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);
  I.keep.push(/^(Kona|Specialized|Trek|Giant|Santa Cruz|Yeti|Norco|Rocky Mountain|Canyon|Transition|Devinci|Cannondale|Ibis|Pivot|Commencal|XS|S|M|L|XL)$/);

  // ---------------------------------------------------------------- page text
  add({
    'SelectVelo — Find your mountain bike': 'SelectVelo — Trouvez votre vélo de montagne',
    'Match your actual riding — XC, trail, enduro, downhill — against real mountain bikes from every brand, scored on suspension, travel, and geometry, not a guess.':
      'Comparez votre façon de rouler (cross-country, trail, enduro, descente) à de vrais vélos de montagne de toutes les marques, évalués selon la suspension, le débattement et la géométrie, et non au hasard.',
    'The right <span class="pencil-mark">mountain</span> bike makes every trail forgiving — until you want it not to be.': 'Le bon vélo de <span class="pencil-mark">montagne</span> rend tous les sentiers indulgents, jusqu’à ce que vous souhaitiez le contraire.',
    'An XC race bike and an enduro sled solve completely different problems. Answer questions about how and where you actually ride, and we measure real bikes against your riding, not a generic "mountain bike" shelf.':
      'Un vélo de course cross-country et un vélo d’enduro règlent des problèmes complètement différents. Répondez à des questions sur la façon dont vous roulez et l’endroit où vous roulez réellement, et nous comparons de vrais vélos à votre pratique, et non à un rayon générique de « vélos de montagne ».',
    'FRONT': 'AVANT',
    'TRAVEL': 'DÉBATTEMENT',
    'rear shock': 'amortisseur arrière',
    'Fig. 001 — travel and geometry we score against how you ride': 'Fig. 001 — le débattement et la géométrie que nous évaluons selon votre façon de rouler',
    'Three steps to a bike that fits your riding.': 'Trois étapes vers un vélo adapté à votre façon de rouler.',
    'No "mountain bike" catch-all. Discipline, suspension, wheel size, and your fit — run against real bikes built for real trails.': 'Pas de « vélo de montagne » fourre-tout. Discipline, suspension, taille de roues et ajustement, évalués selon de vrais vélos conçus pour de vrais sentiers.',
    'Describe your riding': 'Décrivez votre pratique',
    'XC, trail, enduro, or downhill — how aggressive the terrain gets, and whether you want a dropper post.': 'Cross-country, trail, enduro ou descente, le niveau d’agressivité du terrain, et si vous voulez une tige de selle télescopique.',
    "An XC race bike is ruled down for a rider who wants enduro travel; a hardtail still surfaces when it's genuinely the better fit for the terrain.": 'Un vélo de course cross-country est déclassé pour un cycliste qui veut du débattement d’enduro; un semi-rigide reste proposé quand il convient vraiment mieux au terrain.',
    "Ranked with plain-language reasons — suspension travel, wheel size, and how it's meant to be ridden.": 'Classés avec des raisons en langage clair : débattement de la suspension, taille de roues et usage prévu.',
    "Let's find your mountain bike.": 'Trouvons votre vélo de montagne.',
    'None of this requires expert terminology going in — we explain the jargon as we go.': 'Aucune connaissance de la terminologie spécialisée n’est requise : nous expliquons le jargon au fur et à mesure.',
    'Your riding': 'Votre pratique',
    'Suspension': 'Suspension',
    'What kind of riding do you do most?': 'Quel type de vélo pratiquez-vous le plus ?',
    'Cross-country — fast, efficient, mostly climbing and flowing singletrack': 'Cross-country : rapide et efficace, surtout des montées et des sentiers fluides',
    'Trail — a mix of climbing and descending, the most common all-round style': 'Trail : un mélange de montées et de descentes, le style polyvalent le plus courant',
    'Enduro — technical descents matter more than climbing efficiency': 'Enduro : les descentes techniques comptent plus que l’efficacité en montée',
    'Downhill — lift/shuttle-served, descents only': 'Descente : accessible par remontée mécanique ou navette, descentes seulement',
    'Dirt jump / park — jumps, berms, pump tracks': 'Saut de terre / parc : sauts, virages relevés, pistes de bosses',
    'How experienced a mountain biker are you?': 'Quelle est votre expérience en vélo de montagne ?',
    'New to it': 'Je débute',
    'Ride sometimes': 'Je roule à l’occasion',
    "Mountain bikes are sized by letter (XS-XL), not a cm number the way road bikes are — so that's what we ask for here.": 'Les vélos de montagne se mesurent par lettre (XS à XL), et non par un nombre en cm comme les vélos de route : c’est donc ce que nous demandons ici.',
    'Hardtail or full suspension?': 'Semi-rigide ou double suspension ?',
    'A hardtail (front suspension only) is lighter and more efficient pedaling; full suspension soaks up rough terrain but costs more and weighs more.':
      'Un semi-rigide (suspension avant seulement) est plus léger et pédale plus efficacement; la double suspension absorbe mieux les terrains accidentés, mais coûte plus cher et pèse plus lourd.',
    'Hardtail': 'Semi-rigide',
    'Full suspension': 'Double suspension',
    'Want a dropper post?': 'Voulez-vous une tige de selle télescopique ?',
    'Drops your saddle at the touch of a lever for descents, then raises it back for pedaling — standard on most trail/enduro bikes now, less common on XC race bikes.':
      'Elle abaisse votre selle d’un simple geste de levier pour les descentes, puis la remonte pour pédaler : elle est maintenant courante sur la plupart des vélos trail et enduro, moins sur les vélos de course XC.',
    '27.5" — nimbler, easier to throw around': '27,5 po : plus agile, plus facile à manœuvrer',
    '29" — rolls over rough terrain more easily': '29 po : passe plus facilement sur les terrains accidentés',
    'A step-through frame has a low or missing top tube — easier to swing a leg over, traditionally sold as a "women\'s" bike. A step-over frame is the traditional diamond shape, traditionally sold as a "men\'s" bike. Either shape genuinely works for any rider. Real mountain bikes also need diamond-frame rigidity for off-road loads — this catalog doesn\'t have step-through mountain bikes, so this question mostly serves as an honest heads-up rather than a filter.':
      'Un cadre ouvert a un tube supérieur bas ou absent : il est plus facile à enjamber et se vend traditionnellement comme un vélo « pour femmes ». Un cadre classique a la forme traditionnelle en losange et se vend traditionnellement comme un vélo « pour hommes ». Les deux formes conviennent vraiment à n’importe quel cycliste. Les vrais vélos de montagne ont aussi besoin de la rigidité d’un cadre en losange pour les charges hors route : notre catalogue ne contient pas de vélos de montagne à cadre ouvert, cette question sert donc surtout d’avertissement honnête plutôt que de filtre.',
    'Pick a riding style first.': 'Choisissez d’abord un style de pratique.',
    "Your top matches will appear here, ranked with reasons — including suspension travel, wheel size, and how it's meant to be ridden.": 'Vos meilleurs choix apparaîtront ici, classés avec leurs raisons, y compris le débattement de la suspension, la taille de roues et l’usage prévu.',
    '~3kg': '~3 kg',
    'heavier for full suspension — and worth every gram on the way down': 'de plus pour une double suspension, et chaque gramme en vaut la peine à la descente',
    'that\'s the real tradeoff, not marketing spin: a full-suspension bike soaks up rough descents a hardtail can\'t, but you feel every extra kilogram on the climbs. Picking between them isn\'t about which bike is "better" — it\'s about which one is better for where you actually ride.':
      'c’est le vrai compromis, sans artifice de marketing : un vélo à double suspension absorbe des descentes accidentées qu’un semi-rigide ne peut pas absorber, mais on sent chaque kilogramme de plus dans les montées. Choisir entre les deux, ce n’est pas décider lequel est « meilleur » : c’est décider lequel convient le mieux à l’endroit où vous roulez réellement.',
    'Studio render of a full-suspension mountain bike, annotated with wheel diameter, front and rear suspension travel, and wheelbase': 'Rendu en studio d’un vélo de montagne à double suspension, annoté avec le diamètre des roues, le débattement de la suspension avant et arrière, et l’empattement',
  });
  P(/^(\d+)"$/, (m, n) => n + ' po');

  // ---------------------------------------------------------------- summary chips, comparison table, card details
  add({
    'cross-country': 'cross-country', 'trail riding': 'trail', 'downhill': 'descente', 'dirt jump and park': 'saut de terre et parc',
    'Rides sometimes': 'Roule à l’occasion',
    'Riding': 'Pratique', 'Experience': 'Expérience', 'Fit': 'Ajustement', 'Budget': 'Budget',
    'size {s}': 'taille {s}', '{n} cm tall': '{n} cm de taille',
    'Built for': 'Conçu pour', 'Frame type': 'Type de cadre', 'Front travel': 'Débattement avant', 'Rear travel': 'Débattement arrière', 'Wheels': 'Roues', 'Frame': 'Cadre', 'Drivetrain': 'Transmission', 'Dropper post': 'Tige de selle télescopique', 'Sizes': 'Tailles',
    'hardtail': 'semi-rigide', 'full suspension': 'double suspension', 'none': 'aucun', 'yes': 'oui', 'no': 'non',
    'aluminum': 'aluminium', 'carbon': 'carbone', 'steel': 'acier', 'titanium': 'titane',
    '{w}" wheels': 'roues de {w} po', 'sizes {s}': 'tailles {s}', 'sizes: see the brand': 'tailles : voir la marque',
    'aluminum frame': 'cadre en aluminium', 'carbon frame': 'cadre en carbone', 'steel frame': 'cadre en acier', 'titanium frame': 'cadre en titane',
    '{f} mm front / {r} mm rear travel': 'débattement de {f} mm à l’avant et de {r} mm à l’arrière', '{f} mm front travel': 'débattement avant de {f} mm', 'dropper post': 'tige de selle télescopique',
  });

  // ---------------------------------------------------------------- the reasons under each match (mountainbiking.html explainMatch)
  add({
    'Built for {d}, the riding you do most': 'Conçu pour la pratique « {d} », celle que vous faites le plus',
    'Close to {c}: it is built for {d}': 'Proche de « {c} » : conçu pour « {d} »',
    'Built for {d}, which is quite different from {c}': 'Conçu pour « {d} », ce qui est assez différent de « {c} »',
    'Aggressive-terrain bike: more capable than a new rider needs, and harder to pedal uphill': 'Vélo pour terrains exigeants : plus performant que ce dont un nouveau cycliste a besoin, et plus difficile à pédaler en montée',
    'Hardtail, as you wanted': 'Semi-rigide, comme vous le souhaitiez',
    'Full suspension, as you wanted': 'Double suspension, comme vous le souhaitiez',
    'Hardtail, not the full-suspension you asked for': 'Semi-rigide, et non la double suspension demandée',
    'Full suspension, not the hardtail you asked for': 'Double suspension, et non le semi-rigide demandé',
    'Comes in your size ({s})': 'Offert dans votre taille ({s})',
    'No {s} in this model. Sizes: {l}': 'Aucune taille {s} dans ce modèle. Tailles : {l}',
    'Fits a {h} cm rider (made for {a}–{b} cm)': 'Convient à un cycliste de {h} cm (conçu pour {a}–{b} cm)',
    "Made for riders {a}–{b} cm, and you're {h} cm": 'Conçu pour des cyclistes de {a}–{b} cm, et vous mesurez {h} cm',
    'Dropper post included': 'Tige de selle télescopique incluse',
    'No dropper post, which you wanted': 'Pas de tige de selle télescopique, que vous souhaitiez',
    '{w}" wheels, as you prefer': 'Roues de {w} po, comme vous le préférez',
    '{w}" wheels, not the {p}" you prefer': 'Roues de {w} po, et non de {p} po comme vous le préférez',
    'Within your {c} budget ({p})': 'Dans votre budget de {c} ({p})',
    'full suspension instead of a hardtail': 'une double suspension plutôt qu’un semi-rigide',
    'a lighter carbon frame': 'un cadre en carbone plus léger',
    'a dropper post': 'une tige de selle télescopique',
    'more suspension travel for rougher terrain': 'plus de débattement pour un terrain plus accidenté',
    'a step up in components for the same basic bike': 'des composants de meilleure qualité pour le même vélo de base',
    '{a} and {b}': '{a} et {b}',
    '<b>About {x} over your budget</b>: that gets you {p}.': '<b>Environ {x} de plus que votre budget</b> : cela vous procure {p}.',
    'Pick a riding style first.': 'Choisissez d’abord un style de pratique.',
    'Still loading the bike catalog — try again in a second.': 'Le catalogue de vélos est encore en chargement : réessayez dans une seconde.',
  });
})();
