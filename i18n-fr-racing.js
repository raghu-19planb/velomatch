// French (Québec) for the racing quiz. English text is the key. Loaded after i18n-fr-core.js and i18n-fr-quiz.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md. Event names (LEL, PBP, Ironman, Race Across America)
// are kept as they are written everywhere.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);
  I.keep.push(/^(Specialized|Trek|Cannondale|Cervélo|Giant|Canyon|Scott|BMC|Pinarello|Colnago|Genesis|Kinesis|Mason|Thorn|Campagnolo)$/);

  // ---------------------------------------------------------------- page text
  add({
    'SelectVelo — Find your racing bike': 'SelectVelo — Trouvez votre vélo de course',
    'Road racing, triathlon, or ultra-endurance — SelectVelo scores real race bikes from every brand against your discipline, frame fit, and budget.':
      'Course sur route, triathlon ou ultra-endurance : SelectVelo évalue de vrais vélos de course de toutes les marques selon votre discipline, l’ajustement du cadre et votre budget.',
    'The right <span class="pencil-mark">racing</span> bike makes every ride unforgettable. (Watts not included.)': 'Le bon vélo de <span class="pencil-mark">course</span> rend chaque sortie inoubliable. (Watts non inclus.)',
    "A crit isn't an Ironman, and an Ironman isn't PBP. Answer questions about what you're actually training for, your fit, and your components — we measure real race and endurance bikes against your event, not a generic \"race bike\" shelf.":
      'Un critérium n’est pas un Ironman, et un Ironman n’est pas le PBP. Répondez à des questions sur ce pour quoi vous vous entraînez réellement, votre ajustement et vos composants : nous comparons de vrais vélos de course et d’endurance à votre épreuve, et non à un rayon générique de « vélos de course ».',
    'marginal gains': 'gains marginaux',
    'Fig. 001 — geometry we score against your event and your fit': 'Fig. 001 — la géométrie que nous évaluons selon votre épreuve et votre ajustement',
    'Three steps to a bike that fits your event.': 'Trois étapes vers un vélo adapté à votre épreuve.',
    'No "race bike" catch-all. What you\'re training for, how you\'re built, and what you want on it — run against real bikes built for real racing and real distance.':
      'Pas de « vélo de course » fourre-tout. Ce pour quoi vous vous entraînez, votre morphologie et ce que vous voulez sur votre vélo, évalués selon de vrais vélos conçus pour la vraie course et les vraies distances.',
    "Tell us what you're training for": 'Dites-nous pour quoi vous vous entraînez',
    'Criterium, road race, Ironman, or an ultra-distance push like LEL, PBP, or a Race Across America-style event.': 'Critérium, course sur route, Ironman, ou épreuve d’ultra-distance comme LEL, PBP ou une course de style Race Across America.',
    "A triathlon bike is a poor road racer and a road bike is a poor time-trialist — we don't pretend otherwise. An audax bike built for all-night comfort isn't scored as a competitive racer either.":
      'Un vélo de triathlon est un mauvais vélo de course sur route, et un vélo de route est un mauvais vélo de contre-la-montre : nous ne prétendons pas le contraire. Un vélo d’audax conçu pour le confort toute la nuit n’est pas non plus évalué comme un vélo de compétition.',
    "Ranked with plain-language reasons — frame size, groupset, aero vs. climbing character, and whether it's ready for an all-night push.": 'Classés avec des raisons en langage clair : taille du cadre, groupe de composants, caractère aérodynamique ou grimpeur, et aptitude à une épreuve de nuit.',
    "Let's find your racing bike.": 'Trouvons votre vélo de course.',
    'Covers road racing, triathlon/Ironman, and ultra-endurance riding (audax like LEL and PBP, and competitive ultra-distance racing). None of it requires you to already know the jargon.':
      'Couvre la course sur route, le triathlon et l’Ironman, et l’ultra-endurance (audax comme LEL et PBP, et course d’ultra-distance de compétition). Aucune connaissance préalable du jargon n’est requise.',
    'Your event': 'Votre épreuve',
    'Your racing': 'Votre pratique de la course',
    'What are you training or buying for? <span class="q-hint">(choose all that apply)</span>': 'Pour quoi vous entraînez-vous ou achetez-vous ? <span class="q-hint">(choisissez toutes les réponses qui s’appliquent)</span>',
    'Road racing (criteriums, road races, gran fondos)': 'Course sur route (critériums, courses sur route, grands fondos)',
    'Triathlon or Ironman (the bike leg)': 'Triathlon ou Ironman (l’épreuve de vélo)',
    'Audax / randonneuring (LEL, PBP, all-night riding)': 'Audax / randonnée de longue distance (LEL, PBP, sorties de nuit)',
    'Ultra-distance racing (Race Across America-style)': 'Course d’ultra-distance (style Race Across America)',
    'Aero — speed on the flats': 'Aérodynamique : vitesse sur le plat',
    'Climbing — lightness for hilly races': 'Grimpeur : légèreté pour les courses vallonnées',
    'All-rounder — balanced for varied terrain': 'Polyvalent : équilibré pour des terrains variés',
    'Do you need dynamo lighting or overnight-riding support?': 'Avez-vous besoin d’un éclairage par dynamo ou d’un équipement pour rouler la nuit ?',
    'Yes, I ride through the night': 'Oui, je roule toute la nuit',
    'No, daytime only': 'Non, seulement le jour',
    'Wheel preference': 'Préférence de roues',
    'Deep-section aero wheels': 'Roues aérodynamiques à profil haut',
    'Lighter climbing wheels': 'Roues de montée plus légères',
    'A step-through frame has a low or missing top tube — easier to swing a leg over, traditionally sold as a "women\'s" bike. A step-over frame is the traditional diamond shape, traditionally sold as a "men\'s" bike. Either shape genuinely works for any rider. Drop-bar racing frames also need diamond-frame rigidity for stiffness and aero — real racing bikes in this category aren\'t built step-through, so this question mostly serves as an honest heads-up rather than a filter.':
      'Un cadre ouvert a un tube supérieur bas ou absent : il est plus facile à enjamber et se vend traditionnellement comme un vélo « pour femmes ». Un cadre classique a la forme traditionnelle en losange et se vend traditionnellement comme un vélo « pour hommes ». Les deux formes conviennent vraiment à n’importe quel cycliste. Les cadres de course à guidon de route ont aussi besoin de la rigidité d’un cadre en losange, pour la rigidité et l’aérodynamisme : les vrais vélos de course de cette catégorie ne sont pas conçus à cadre ouvert, cette question sert donc surtout d’avertissement honnête plutôt que de filtre.',
    'Italian road-racing royalty, loved for its feel and heritage and found on premium road bikes.': 'La noblesse italienne de la course sur route, appréciée pour sa sensation et son héritage, qu’on trouve sur les vélos de route haut de gamme.',
    'Pricier, and fewer shops stock the parts.': 'Plus cher, et moins de magasins ont les pièces en stock.',
    "I'm open to boutique/premium brands": 'J’accepte les marques de boutique ou haut de gamme',
    "Pick what you're training for first.": 'Choisissez d’abord pour quoi vous vous entraînez.',
    'Pick what matters more for your racing first.': 'Choisissez d’abord ce qui compte le plus pour votre pratique de la course.',
    'Your top matches will appear here, ranked with reasons — including frame size fit, groupset, and aero vs. climbing character.': 'Vos meilleurs choix apparaîtront ici, classés avec leurs raisons, y compris l’ajustement du cadre, le groupe de composants et le caractère aérodynamique ou grimpeur.',
    'is a whole category': 'c’est une catégorie à part entière',
    "the aero and weight gap between race bikes is measured in single-digit percentages — a frame that doesn't fit your reach and stack costs you more than any of it, for free, every ride.":
      'l’écart d’aérodynamisme et de poids entre les vélos de course se mesure en pourcentages à un chiffre : un cadre qui ne convient pas à votre allonge (reach) et à votre hauteur de cadre (stack) vous coûte plus que tout cela, gratuitement, à chaque sortie.',
    'Studio render of a road racing bike, annotated with wheel diameter, standover height, and wheelbase': 'Rendu en studio d’un vélo de course sur route, annoté avec le diamètre des roues, la hauteur d’enjambement et l’empattement',
  });
  P(/^(\d+)–(\d+)%$/, (m, a, b) => a + '–' + b + ' %');

  // ---------------------------------------------------------------- summary chips, comparison table, card details
  add({
    'road racing': 'course sur route', 'triathlon': 'triathlon', 'audax and randonneuring': 'audax et randonnée de longue distance', 'ultra-distance racing': 'course d’ultra-distance',
    ' or ': ' ou ',
    'Event': 'Épreuve', 'Fit': 'Ajustement', 'Budget': 'Budget', '{n} cm frame': 'cadre de {n} cm', '{n} cm tall': '{n} cm de taille',
    'Built for': 'Conçu pour', 'Character': 'Caractère', 'Frame': 'Cadre', 'Drivetrain': 'Transmission', 'Shifting': 'Changement de vitesses', 'Brakes': 'Freins', 'Wheels': 'Roues',
    'Weight (catalog)': 'Poids (catalogue)', 'Sizes': 'Tailles', 'Dynamo-ready': 'Prêt pour dynamo',
    'aero': 'aérodynamique', 'climbing': 'grimpeur', 'all rounder': 'polyvalent', 'endurance': 'endurance',
    'Aero': 'aérodynamique', 'Climbing': 'grimpeur', 'All-round': 'polyvalent', 'Endurance': 'endurance',
    'disc': 'à disque', 'electronic': 'électronique', 'mechanical': 'mécanique', 'deep aero': 'aérodynamique à profil haut', 'lightweight': 'légères', 'yes': 'oui', 'no': 'non',
    'aluminum': 'aluminium', 'carbon': 'carbone', 'steel': 'acier', 'titanium': 'titane',
    'Sizes {s} cm': 'Tailles {s} cm', 'Sizes: see the brand': 'Tailles : voir la marque',
    'aluminum frame': 'cadre en aluminium', 'carbon frame': 'cadre en carbone', 'steel frame': 'cadre en acier', 'titanium frame': 'cadre en titane',
    '(electronic)': '(électronique)', '(mechanical)': '(mécanique)', 'disc brakes': 'freins à disque',
    '{c} character': 'caractère {c}', 'deep aero wheels': 'roues aérodynamiques à profil haut', 'lightweight wheels': 'roues légères', 'dynamo-ready': 'prêt pour dynamo',
  });

  // ---------------------------------------------------------------- the reasons under each match (racing.html explainMatch)
  add({
    'Designed for {d}, as you asked': 'Conçu pour la pratique « {d} », comme vous l’avez demandé',
    'Suited to {c} even though it is built for {d}': 'Convient à la pratique « {c} », même s’il est conçu pour « {d} »',
    'Built for {d}, not {c}': 'Conçu pour « {d} », et non pour « {c} »',
    '{x} character, as you prefer': 'Caractère {x}, comme vous le préférez',
    '{x} character, while you prefer {y}': 'Caractère {x}, alors que vous préférez le caractère {y}',
    'Fits a {h} cm rider (made for {a}–{b} cm)': 'Convient à un cycliste de {h} cm (conçu pour {a}–{b} cm)',
    "Made for riders {a}–{b} cm, and you're {h} cm": 'Conçu pour des cyclistes de {a}–{b} cm, et vous mesurez {h} cm',
    'Comes in a {n} cm frame': 'Offert avec un cadre de {n} cm',
    'Nearest frame is {n} cm; you said {s} cm': 'Le cadre le plus proche est de {n} cm; vous avez indiqué {s} cm',
    'Dynamo-ready for night riding': 'Prêt pour une dynamo, pour rouler la nuit',
    'Not dynamo-ready, which you wanted for riding through the night': 'Pas prêt pour une dynamo, que vous souhaitiez pour rouler toute la nuit',
    'Electronic shifting, as you asked': 'Changement de vitesses électronique, comme vous l’avez demandé',
    'Mechanical shifting, not the electronic you asked for': 'Changement de vitesses mécanique, et non électronique comme vous l’avez demandé',
    'Shallow wheels, not the deep aero wheels you asked for': 'Roues à profil bas, et non les roues aérodynamiques à profil haut demandées',
    'Deep aero wheels, not the lighter climbing wheels you asked for': 'Roues aérodynamiques à profil haut, et non les roues de montée plus légères demandées',
    'Within your {c} budget ({p})': 'Dans votre budget de {c} ({p})',
    'electronic shifting': 'un changement de vitesses électronique', 'a carbon frame': 'un cadre en carbone', 'a titanium frame': 'un cadre en titane',
    'deeper aero wheels': 'des roues aérodynamiques à profil plus haut', 'a dynamo-ready hub for all-night riding': 'un moyeu prêt pour une dynamo, pour rouler toute la nuit',
    'a step up in components for the same basic bike': 'des composants de meilleure qualité pour le même vélo de base',
    '{a} and {b}': '{a} et {b}',
    '<b>About {x} over your budget</b>: that gets you {p}.': '<b>Environ {x} de plus que votre budget</b> : cela vous procure {p}.',
    'Still loading the bike catalog — try again in a second.': 'Le catalogue de vélos est encore en chargement : réessayez dans une seconde.',
  });
})();
