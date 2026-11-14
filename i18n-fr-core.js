// French (Québec): the words every page shares: navigation, footer, the "why we built this" letter, the
// steering mini-game, and the figure/sheet labels. English text is the key. Loaded after i18n.js.
//
// Written by an AI translator and NOT reviewed by a native speaker. Terms follow the OQLF's cycling vocabulary
// and i18n-glossary.md (courriel, blogue, cyclocamping, vélo de gravier, stabilisateurs). Anything without an
// entry here stays in English.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);
  // text that is the same in both languages: never reported as missing
  I.keep.push(/^Fig\. \d+$/, /^(select|vel|SelectVelo|English|Français|Langue)$/);

  // ---------------------------------------------------------------- navigation and header
  add({
    'The right bike for how you ride.': 'Le bon vélo pour votre façon de rouler.',
    "Kids' bikes": 'Vélos d’enfant',
    'Commuting': 'Vélo de ville',
    'Bikepacking': 'Cyclocamping',
    'Mountain biking': 'Vélo de montagne',
    'Racing': 'Course',
    'Showcase': 'Vitrine',
    'Schematics': 'Schémas',
    'Route maps': 'Cartes d’itinéraires',
    'Blog': 'Blogue',
    'Check out': 'Découvrez',
    'new bikes': 'les nouveaux vélos',
    'Check out new bikes, in the Showcase': 'Découvrez les nouveaux vélos, dans la Vitrine',
    'Close': 'Fermer',
    'Start matching': 'Trouver mon vélo',
    'Close explanation': 'Fermer l’explication',
  });

  // ---------------------------------------------------------------- footer and the letter
  add({
    'A smarter way to find the right bike, for any ride.': 'Une façon plus intelligente de trouver le bon vélo, pour n’importe quel parcours.',
    'A smarter way to find a bike that fits your ride.': 'Une façon plus intelligente de trouver un vélo adapté à votre façon de rouler.',
    "A smarter way to find a kid's first bike.": 'Une façon plus intelligente de trouver le premier vélo de votre enfant.',
    'Why we built this': 'Pourquoi nous avons créé ce site',
    "To everyone who's stood in a bike aisle guessing,": 'À toutes celles et à tous ceux qui se sont déjà retrouvés dans une allée de vélos à deviner,',
    "Buying a bike usually comes down to a guess: a size sticker on a rack, a salesperson pointing at whatever's in stock, or a color you liked in a catalog. Get it wrong and it's money spent on something that never quite fits.":
      'Acheter un vélo se résume souvent à une devinette : un autocollant de taille sur un support, un vendeur qui désigne ce qu’il a en stock, ou une couleur qui vous a plu dans un catalogue. Si on se trompe, l’argent est dépensé pour un vélo qui ne convient jamais tout à fait.',
    'We think fit should come from geometry, not guesswork — reach, stack, standover, all measured and matched to the rider, whoever that rider is.':
      'Nous croyons que l’ajustement doit venir de la géométrie, pas de l’intuition : l’allonge (reach), la hauteur du cadre (stack) et la hauteur d’enjambement, tout est mesuré et adapté au cycliste, quel qu’il soit.',
    "SelectVelo is built to do that matching for every kind of rider and every kind of ride. Right now it's five working prototypes: a first bike for a growing kid, a daily commuter, a bikepacking rig, a mountain bike, and a racing or ultra-endurance bike — because those are the cases where a wrong guess costs the most. The same approach — real measurements, scored against real bikes — is what we're building toward next, for every rider after this one.":
      'SelectVelo est conçu pour faire cette mise en correspondance pour tous les types de cyclistes et tous les types de parcours. Pour l’instant, ce sont cinq prototypes fonctionnels : un premier vélo pour un enfant qui grandit, un vélo de ville pour le quotidien, un vélo de cyclocamping, un vélo de montagne, et un vélo de course ou d’ultra-endurance, parce que ce sont les cas où une mauvaise décision coûte le plus cher. La même approche, soit de vraies mesures évaluées sur de vrais vélos, est ce que nous voulons étendre ensuite à tous les cyclistes.',
    "It won't get everything right yet. But it will show its work — the wheel size, the standover, the years of growth room — so you're choosing a bike, not gambling on one.":
      'Il ne tombera pas toujours juste pour l’instant. Mais il montre son raisonnement (le diamètre des roues, la hauteur d’enjambement, la marge de croissance) pour que vous choisissiez un vélo plutôt que de parier sur l’un d’eux.',
    "It won't get everything right yet. But it will show its work — the frame size, the gear capacity, the climbing range — so you're choosing a bike, not gambling on one.":
      'Il ne tombera pas toujours juste pour l’instant. Mais il montre son raisonnement (la taille du cadre, la capacité de chargement, la plage de braquets pour grimper) pour que vous choisissiez un vélo plutôt que de parier sur l’un d’eux.',
    "It won't get everything right yet. But it will show its work — the frame size, the groupset, the aero-vs-climbing character — so you're choosing a bike, not gambling on one.":
      'Il ne tombera pas toujours juste pour l’instant. Mais il montre son raisonnement (la taille du cadre, le groupe de composants, le caractère aérodynamique ou grimpeur) pour que vous choisissiez un vélo plutôt que de parier sur l’un d’eux.',
    "It won't get everything right yet. But it will show its work — the frame size, the suspension travel, the gear range — so you're choosing a bike, not gambling on one.":
      'Il ne tombera pas toujours juste pour l’instant. Mais il montre son raisonnement (la taille du cadre, le débattement de la suspension, la plage de braquets) pour que vous choisissiez un vélo plutôt que de parier sur l’un d’eux.',
    "This is where we're starting. Not where we're stopping.": 'Ce n’est qu’un début.',
  });
  P(/^Fig\. (\d+) — where this is headed$/, (m, n) => 'Fig. ' + n + ' — là où nous allons');
  P(/^Sheet (\d+)$/, (m, n) => 'Planche ' + n);

  // ---------------------------------------------------------------- the steering mini-game
  add({
    'Take a spin': 'Faites un tour',
    'How steady is your hand?': 'Avez-vous la main sûre ?',
    'Steer with your mouse, your finger, or the arrow keys. The lane never ends, and it never stops narrowing — stay off the edges.':
      'Dirigez avec la souris, le doigt ou les touches fléchées. La voie ne se termine jamais et ne cesse de se rétrécir : évitez les bords.',
    'Ready?': 'Prêt ?',
    'Move your mouse, drag your finger, or use the arrow keys to steer.': 'Bougez la souris, glissez le doigt ou utilisez les touches fléchées pour diriger.',
    'Start riding': 'Partir à vélo',
    'A steering mini-game: move your mouse, drag your finger, or use the arrow keys to keep a bike inside a winding, narrowing lane':
      'Un mini-jeu de direction : bougez la souris, glissez le doigt ou utilisez les touches fléchées pour garder un vélo dans une voie sinueuse qui se rétrécit',
  });
  add({ 'You hit the edge!': 'Vous avez touché le bord !' });
  P(/^Survived (\d+\.\d)s\. Give it another go\?$/, (m, s) => 'Vous avez tenu ' + s.replace('.', ',') + ' s. Réessayer ?');
  P(/^(\d+\.\d)s$/, (m, s) => s.replace('.', ',') + ' s');
  P(/^Best: (\d+\.\d)s$/, (m, s) => 'Meilleur : ' + s.replace('.', ',') + ' s');
})();
