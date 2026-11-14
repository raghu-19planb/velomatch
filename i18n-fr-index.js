// French (Québec) for the home page. English text is the key. Loaded after i18n.js and i18n-fr-core.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);

  add({
    'SelectVelo — Find the right bike, measured': 'SelectVelo — Trouvez le bon vélo, mesures à l’appui',
    'Find the bike that actually fits — kids, commuting, bikepacking, mountain biking, or racing. A free quiz scores real bikes from every brand against your measurements, not a sales pitch.':
      'Trouvez le vélo qui vous convient vraiment : vélo d’enfant, vélo de ville, cyclocamping, vélo de montagne ou course. Un questionnaire gratuit évalue de vrais vélos de toutes les marques selon vos mesures, sans boniment.',
    'Every ride starts somewhere.': 'Chaque balade commence quelque part.',
    'Choose your ride': 'Choisissez votre balade',
    'Every <span class="pencil-mark">rider</span> gets the same honest measurement.': 'Chaque <span class="pencil-mark">cycliste</span> a droit à la même mesure honnête.',
    "No sales pitch, no single brand, no guessing. Pick what you're actually buying a bike for, answer a few real questions, and we'll score every model against real geometry — then show our work.":
      'Pas de boniment, pas de marque unique, pas de devinettes. Choisissez l’usage réel de votre vélo, répondez à quelques vraies questions, et nous évaluerons chaque modèle selon sa géométrie réelle, puis nous vous montrerons nos calculs.',
    'Try it': 'Essayez-le',
    'Before you pick': 'Avant de choisir',
    'Drag to any height': 'Faites glisser pour choisir une taille',
    "Sounds like a kid's first bike.": 'Cela ressemble à un premier vélo d’enfant.',
    'Getting into bigger-bike territory.': 'On passe aux vélos plus grands.',
    'Sounds like an adult bike — commuting, bikepacking, mountain biking, or racing.': 'Cela ressemble à un vélo d’adulte : vélo de ville, cyclocamping, vélo de montagne ou course.',
    "That's a teenager, or a petite adult.": 'C’est un adolescent, ou un adulte de petite taille.',
    "That's an average-height adult.": 'C’est un adulte de taille moyenne.',
    "That's about a 10 to 12-year-old.": 'Cela correspond à un enfant de 10 à 12 ans.',
    "Kids' first bike": 'Premier vélo d’enfant',
    "Height, experience, and budget — matched against real kids' bike geometry, not a size sticker on a rack.":
      'Taille, expérience et budget, évalués selon la géométrie réelle des vélos d’enfant, et non selon un autocollant de taille sur un support.',
    'Distance, route, cargo, and power preference — matched to a bike built for your actual ride to work or school.':
      'Distance, parcours, charge et préférence de motorisation, associés à un vélo conçu pour votre vrai trajet vers le travail ou l’école.',
    'Terrain, trip length, and how you carry your gear — from a weekend loop to a self-supported ultra race.':
      'Terrain, durée du voyage et façon de transporter votre équipement, de la boucle de fin de semaine à la course ultra en autosuffisance.',
    'XC, trail, enduro, or downhill — matched on suspension travel and geometry, not a generic "mountain bike" shelf.':
      'Cross-country, trail, enduro ou descente, évalués selon le débattement de la suspension et la géométrie, et non selon un rayon générique de « vélos de montagne ».',
    'Road racing, triathlon, and ultra-endurance — from a criterium to Ironman to an all-night push like LEL or PBP.':
      'Course sur route, triathlon et ultra-endurance, du critérium à l’Ironman jusqu’aux épreuves de nuit comme LEL ou PBP.',
    'An oil painting of a small orange bike in a meadow of wildflowers, with trees and a soft sky behind.':
      'Peinture à l’huile d’un petit vélo orange dans un pré de fleurs sauvages, avec des arbres et un ciel doux en arrière-plan.',
    'An oil painting of a bike leaning on a lamp post on a city street at dawn, brick buildings and warm windows on either side.':
      'Peinture à l’huile d’un vélo appuyé contre un lampadaire dans une rue de ville à l’aube, avec des bâtiments de brique et des fenêtres éclairées de chaque côté.',
    'An oil painting of a loaded bikepacking bike leaning on a boulder, snow-capped mountains behind.':
      'Peinture à l’huile d’un vélo de cyclocamping chargé, appuyé contre un rocher, avec des montagnes enneigées derrière.',
    'An oil painting of a bike resting on a rock beside a forest trail, tall pines behind it.':
      'Peinture à l’huile d’un vélo posé sur un rocher au bord d’un sentier forestier, avec de grands pins derrière.',
    'An oil painting of a road bike resting by an empty road at sunrise, mountains in the distance.':
      'Peinture à l’huile d’un vélo de route posé au bord d’une route vide au lever du soleil, avec des montagnes au loin.',
  });

  // the height slider on the home page
  P(/^That's about (?:a|an) (\d+)-year-old\.$/, (m, n) => 'Cela correspond à un enfant d’environ ' + n + ' ans.');
  P(/^⌀ (\d+)in$/, (m, n) => '⌀ ' + n + ' po');
  P(/^Standover ~(\d+)cm$/, (m, n) => 'Enjambement ~' + n + ' cm');
  P(/^Wheelbase ~(\d+)cm$/, (m, n) => 'Empattement ~' + n + ' cm');
  P(/^A (child|teenager|rider) about (\d+) cm tall (?:riding a bike|on a bike) with (\d+|700c)(?: inch| inches)? wheels$/, (m, who, h, w) => ({ child: 'Un enfant', teenager: 'Un adolescent', rider: 'Un cycliste' }[who]) + ' d’environ ' + h + ' cm sur un vélo à roues de ' + (w === '700c' ? '700c' : w + ' po'));
  P(/^A child about (\d+) cm tall riding a bike with (\d+) inch wheels$/, (m, h, w) => 'Un enfant d’environ ' + h + ' cm sur un vélo à roues de ' + w + ' po');
})();
