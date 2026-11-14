// French (Québec) for the kids' bike quiz. English text is the key. Loaded after i18n-fr-core.js and i18n-fr-quiz.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);

  // ---------------------------------------------------------------- page text
  add({
    "A bike that fits now, with room left to grow, is easier to ride and easier to keep riding. That is why the quiz shows the growing room of every bike in centimetres.": "Un vélo qui convient maintenant, avec de la marge pour grandir, est plus facile à conduire et plus facile à garder. C’est pourquoi le questionnaire indique la marge de croissance de chaque vélo en centimètres.",
    'SelectVelo — Find their first bike': 'SelectVelo — Trouvez son premier vélo',
    "Answer a few questions about your kid's height and experience — SelectVelo scores real kids' bikes from every brand and explains exactly why the top match fits.":
      'Répondez à quelques questions sur la taille et l’expérience de votre enfant : SelectVelo évalue de vrais vélos d’enfant de toutes les marques et explique exactement pourquoi le premier choix convient.',
    'First bike, ages 5–14': 'Premier vélo, de 5 à 14 ans',
    'The right <span class="pencil-mark">kid\'s</span> bike makes every ride unforgettable. (Ask the neighbors.)': 'Le bon vélo <span class="pencil-mark">d’enfant</span> rend chaque balade inoubliable. (Demandez aux voisins.)',
    "Answer a few questions about your kid. We measure real bikes from every brand against their height, experience, and budget — then explain exactly why the top match fits, and how long it'll last them.":
      'Répondez à quelques questions sur votre enfant. Nous mesurons de vrais vélos de toutes les marques selon sa taille, son expérience et votre budget, puis nous expliquons exactement pourquoi le premier choix convient et combien de temps il lui servira.',
    "Fig. 001 — geometry we score against your kid's height": 'Fig. 001 — la géométrie que nous évaluons selon la taille de votre enfant',
    'Three steps to a bike that actually fits.': 'Trois étapes pour un vélo vraiment adapté.',
    'No sales pitch, no single-brand catalog. Just the questions a good bike fitter would ask, run against real geometry.':
      'Pas de boniment, pas de catalogue d’une seule marque. Seulement les questions que poserait un bon technicien en ajustement de vélo, évaluées selon la géométrie réelle.',
    'Answer six questions': 'Répondez à six questions',
    "Height, experience, where they'll ride, brakes, budget, and how much room to grow matters to you.": 'Taille, expérience, terrain, freins, budget, et l’importance que vous accordez à la marge de croissance.',
    "Each answer weighs differently — a wrong-size bike is ruled out, a great-fit bike that's a little over budget isn't.": 'Chaque réponse pèse différemment : un vélo de mauvaise taille est écarté, un vélo parfaitement adapté qui dépasse un peu le budget ne l’est pas.',
    'Ranked with plain-language reasons and how much growing room it has before they outgrow it — not just a spec sheet.': 'Classés avec des raisons en langage clair et la marge de croissance de chaque vélo avant que votre enfant ne l’ait dépassé, et pas seulement une fiche technique.',
    "Let's find their bike.": 'Trouvons son vélo.',
    'This prototype covers kids five and up. One question at a time — every answer feeds the match.': 'Ce prototype couvre les enfants de cinq ans et plus. Une question à la fois : chaque réponse alimente le résultat.',
    'Your child': 'Votre enfant',
    "Child's height": 'Taille de l’enfant',
    'Assumes a starting age of 5 and up.': 'Suppose un enfant d’au moins 5 ans.',
    '~5 yrs old': '~5 ans',
    '~14+ yrs old': '~14 ans et plus',
    'Riding experience': 'Expérience à vélo',
    'Never ridden': 'N’a jamais fait de vélo',
    'Balance bike': 'Draisienne',
    'Training wheels': 'Roues stabilisatrices',
    'Confident, no training wheels': 'À l’aise, sans roues stabilisatrices',
    'Confident': 'À l’aise',
    'Where they ride': 'Où il ou elle roule',
    'Where will they ride?': 'Où votre enfant roulera-t-il ?',
    'Pavement / driveway': 'Pavé / entrée de garage',
    'Road and gravel': 'Route et gravier',
    'Neighborhood paths': 'Pistes de quartier',
    'Trail, road and gravel': 'Sentiers, route et gravier',
    'Light dirt trails': 'Sentiers de terre légers',
    'pavement and driveways': 'pavé et entrées de garage',
    'road and gravel': 'route et gravier',
    'neighbourhood paths': 'pistes de quartier',
    'trail, road and gravel': 'sentiers, route et gravier',
    'light dirt trails': 'sentiers de terre légers',
    'Brake preference': 'Préférence de freins',
    'Coaster': 'Rétropédalage',
    'Hand brakes': 'Freins à main',
    'How much does "grows with them" matter?': 'Quelle importance accordez-vous à « grandit avec l’enfant » ?',
    'Not important': 'Pas important',
    'A little': 'Un peu',
    'Somewhat': 'Moyennement',
    'Important': 'Important',
    'Very important': 'Très important',
    'Frame shape <span class="q-hint">(sometimes marketed as "girls\'" or "boys\'")</span>': 'Forme du cadre <span class="q-hint">(parfois présenté comme « pour filles » ou « pour garçons »)</span>',
    'A step-through frame has a low or missing top tube — easier to swing a leg over, traditionally sold as a "girls\'" bike. A step-over frame is the traditional diamond shape, traditionally sold as a "boys\'" bike. Either shape genuinely works for any kid; it\'s a fit and mounting-ease choice, not a rule about who rides which.':
      'Un cadre ouvert a un tube supérieur bas ou absent : il est plus facile à enjamber et se vend traditionnellement comme un vélo « de fille ». Un cadre classique a la forme traditionnelle en losange et se vend traditionnellement comme un vélo « de garçon ». Les deux formes conviennent vraiment à n’importe quel enfant : c’est un choix d’ajustement et de facilité à monter, pas une règle sur qui roule sur quoi.',
    'Pick an experience level and where they will ride first.': 'Choisissez d’abord un niveau d’expérience et l’endroit où votre enfant roulera.',
    'Your top matches will appear here, ranked with reasons — including how much growing room it has before they outgrow it.':
      'Vos meilleurs choix apparaîtront ici, classés avec leurs raisons, y compris la marge de croissance de chaque vélo avant que votre enfant ne l’ait dépassé.',
    "Studio render of a kids' bike, annotated with wheel diameter, standover height, wheelbase, and seat height range":
      'Rendu en studio d’un vélo d’enfant, annoté avec le diamètre des roues, la hauteur d’enjambement, l’empattement et la plage de hauteur de selle',
    // the quiz page title area / labels used by the results
    'Height': 'Taille',
    'Riding': 'Expérience',
    'Where': 'Terrain',
    'Budget': 'Budget',
    'Wheels': 'Roues',
    'Fits children': 'Pour enfants de',
    'Growing room': 'Marge de croissance',
    'Brakes': 'Freins',
    'Seat adjustment': 'Réglage de la selle',
    'Adjustable handlebars': 'Guidon ajustable',
    'Resale value': 'Valeur de revente',
    'yes': 'oui',
    'no': 'non',
    'can be fitted': 'peuvent être installées',
    'hand': 'à main',
    'coaster': 'rétropédalage',
    'none': 'aucun',
    'coaster brakes': 'freins à rétropédalage',
    'hand brakes': 'freins à main',
    'no brakes': 'aucun frein',
    'low': 'faible',
    'medium': 'moyenne',
    'high': 'élevée',
  });
  P(/^WHEELBASE (.+)$/, (m, v) => 'EMPATTEMENT ' + v);
  P(/^grows ~(\d+)cm$/, (m, n) => 'se règle sur ~' + n + ' cm');
  P(/^(\d+) in$/, (m, n) => n + ' po');
  P(/^C\$([\d,]+)(\+?)$/, (m, n, plus) => Number(n.replace(/,/g, '')).toLocaleString('fr-CA') + ' $ CA' + plus);

  // ---------------------------------------------------------------- the reasons under each match (kids.html explainMatch)
  add({
    "Your child is near the top of this bike's range ({a}–{b} cm), so they may outgrow it soon": 'Votre enfant est près du haut de la plage de tailles de ce vélo ({a}–{b} cm) : il pourrait donc le dépasser bientôt',
    "Near the bottom of this bike's range ({a}–{b} cm): it may feel big at first, but it has room to grow": 'Près du bas de la plage de tailles de ce vélo ({a}–{b} cm) : il peut sembler grand au début, mais il a de la marge pour grandir',
    'Fits a {h} cm child (made for {a}–{b} cm)': 'Convient à un enfant de {h} cm (conçu pour {a}–{b} cm)',
    'Made for {a}–{b} cm, and your child is {h} cm': 'Conçu pour {a}–{b} cm, et votre enfant mesure {h} cm',
    "About {n} cm of growing room before they reach this bike's top height": 'Environ {n} cm de marge de croissance avant d’atteindre la taille maximale de ce vélo',
    'Suits a child who has never ridden': 'Convient à un enfant qui n’a jamais fait de vélo',
    'Suits a child who has used a balance bike': 'Convient à un enfant qui a utilisé une draisienne',
    'Suits a child who rides with training wheels': 'Convient à un enfant qui roule avec des roues stabilisatrices',
    'Suits a child who rides confidently without training wheels': 'Convient à un enfant qui roule avec assurance sans roues stabilisatrices',
    'Usually chosen for children at a different stage than one who has never ridden': 'Habituellement choisi pour des enfants à un autre stade que celui d’un enfant qui n’a jamais fait de vélo',
    'Usually chosen for children at a different stage than one who has used a balance bike': 'Habituellement choisi pour des enfants à un autre stade que celui d’un enfant qui a utilisé une draisienne',
    'Usually chosen for children at a different stage than one who rides with training wheels': 'Habituellement choisi pour des enfants à un autre stade que celui d’un enfant qui roule avec des roues stabilisatrices',
    'Usually chosen for children at a different stage than one who rides confidently without training wheels': 'Habituellement choisi pour des enfants à un autre stade que celui d’un enfant qui roule avec assurance sans roues stabilisatrices',
    'Coaster (pedal-back) brake, as you wanted': 'Frein à rétropédalage (on pédale vers l’arrière), comme vous le souhaitiez',
    'Hand brakes, as you wanted': 'Freins à main, comme vous le souhaitiez',
    'Hand brakes, not the coaster brakes you asked for': 'Freins à main, et non les freins à rétropédalage demandés',
    'No brakes, not the coaster brakes you asked for': 'Aucun frein, et non les freins à rétropédalage demandés',
    'No brakes, not the hand brakes you asked for': 'Aucun frein, et non les freins à main demandés',
    'Coaster brakes, not the hand brakes you asked for': 'Freins à rétropédalage, et non les freins à main demandés',
    'Made for {t}, like where they will ride': 'Conçu pour ce terrain : {t}, comme là où votre enfant roulera',
    'Better suited to {t} than where they will ride': 'Mieux adapté à un autre terrain : {t}, différent de celui où votre enfant roulera',
    'Seat adjusts through {n} cm': 'La selle se règle sur {n} cm',
    'Seat adjusts through {n} cm and the handlebars adjust too': 'La selle se règle sur {n} cm et le guidon est ajustable aussi',
    'Training wheels can be fitted': 'Des roues stabilisatrices peuvent être installées',
    'Within your {c} budget ({p})': 'Dans votre budget de {c} ({p})',
    'an adjustable handlebar for a longer growth window': 'un guidon ajustable pour une période de croissance plus longue',
    'extra seatpost travel to grow with them longer': 'une tige de selle à plus grande course pour suivre sa croissance plus longtemps',
    'strong resale value if they outgrow it fast': 'une bonne valeur de revente si votre enfant le dépasse vite',
    'hand brakes with more stopping power as they ride faster': 'des freins à main plus puissants à mesure que votre enfant roule plus vite',
    'a bit more room to grow into': 'un peu plus de marge pour grandir',
    '{a} and {b}': '{a} et {b}',
    '<b>About {x} over your budget</b>: that gets you {p}.': '<b>Environ {x} de plus que votre budget</b> : cela vous procure {p}.',
    '{w}in wheels · fits {a}–{b}cm · {br}': 'Roues de {w} po · pour enfants de {a}–{b} cm · {br}',
    'About {n} cm of growing room at their current height': 'Environ {n} cm de marge de croissance à sa taille actuelle',
    'Pick their riding experience and where they will ride first.': 'Choisissez d’abord l’expérience à vélo de votre enfant et l’endroit où il roulera.',
    'Still loading the bike catalog — try again in a second.': 'Le catalogue de vélos est encore en chargement : réessayez dans une seconde.',
    "Fit uses the height range each brand publishes. Inseam matters too: have your child stand against a wall, measure from the floor to the top of the inner leg, and check that against the bike's lowest seat height on the seller's page. Children grow at different rates (often around 6 cm a year at these ages), so we show growing room in centimetres instead of guessing years.":
      'L’ajustement repose sur la plage de tailles que publie chaque marque. L’entrejambe compte aussi : demandez à votre enfant de se tenir contre un mur, mesurez du sol jusqu’en haut de l’intérieur de la jambe, puis comparez avec la hauteur de selle minimale du vélo sur la page du vendeur. Les enfants grandissent à des rythmes différents (souvent d’environ 6 cm par année à ces âges) : nous indiquons donc la marge de croissance en centimètres plutôt que de deviner un nombre d’années.',
  });
})();
