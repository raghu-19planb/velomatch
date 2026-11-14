// French (Québec) for the route maps page. English text is the key. Loaded after i18n-fr-core.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md. The maps themselves are the cities' own PDFs and are
// linked as published (most are in English); map titles keep their official English name in parentheses.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);
  I.keep.push(/^(Canada|Ontario|Toronto|Mississauga|Brampton|Vaughan|Markham|Richmond Hill|Oakville|Burlington|Hamilton|Niagara Region|Waterloo Region|Caledon|Simcoe County|Dufferin County)$/);

  add({
    'SelectVelo — Bike route maps': 'SelectVelo — Cartes d’itinéraires cyclables',
    'Every official municipal cycling map across the Greater Toronto Area and beyond, in one place — direct links to real, official PDFs, growing region by region.':
      'Toutes les cartes cyclables municipales officielles de la région du Grand Toronto et d’ailleurs, au même endroit : des liens directs vers de vrais PDF officiels, région par région.',
    'Bike route maps': 'Cartes d’itinéraires cyclables',
    'Every official cycling map, <span class="pencil-mark">in one place</span>.': 'Toutes les cartes cyclables officielles, <span class="pencil-mark">au même endroit</span>.',
    "No more digging through a dozen municipal websites to find where the bike lanes actually are. Real, official maps — sourced directly from the city, region, or county that publishes them, linked straight to the real PDF. Nothing here is redrawn or guessed; if a municipality hasn't published a dedicated cycling map yet, we say so and link to the closest real resource instead.":
      'Plus besoin de fouiller une douzaine de sites municipaux pour trouver où sont réellement les pistes cyclables. De vraies cartes officielles, provenant directement de la ville, de la région ou du comté qui les publie, avec un lien direct vers le vrai PDF. Rien n’est redessiné ni deviné : si une municipalité n’a pas encore publié de carte cyclable dédiée, nous le disons et renvoyons vers la ressource réelle la plus proche.',
    'Country': 'Pays',
    'Province / State': 'Province / État',
    'More provinces, states, and countries coming — this list grows as we add regions.': 'D’autres provinces, États et pays s’ajouteront : cette liste s’allonge à mesure que nous ajoutons des régions.',
    "<b>Bookmark this page.</b> We're adding more regions regularly — Ontario's Greater Toronto Area and surrounding counties are the starting point, not the whole plan.":
      '<b>Ajoutez cette page à vos favoris.</b> Nous ajoutons régulièrement d’autres régions : la région du Grand Toronto et les comtés environnants, en Ontario, sont le point de départ, pas tout le plan.',
    'The core': 'Le centre',
    'City of Toronto Cycling Network Map': 'Carte du réseau cyclable de la Ville de Toronto (City of Toronto Cycling Network Map)',
    'Bike lanes, cycle tracks, on-street shared routes, and multi-use trails across the whole city, updated annually.': 'Bandes cyclables, pistes cyclables, itinéraires partagés sur rue et sentiers polyvalents dans toute la ville, mis à jour chaque année.',
    'Greater Toronto Area': 'Région du Grand Toronto',
    'The GTA, municipality by municipality.': 'La région du Grand Toronto, municipalité par municipalité.',
    "Each city in the GTA publishes its own cycling map — no single regional map covers all of them, so here's every one we could verify is real and current.":
      'Chaque ville de la région du Grand Toronto publie sa propre carte cyclable : aucune carte régionale unique ne les couvre toutes, voici donc toutes celles que nous avons pu vérifier comme réelles et à jour.',
    'Multi-use trails, park trails, bike lanes, and signed routes.': 'Sentiers polyvalents, sentiers de parc, bandes cyclables et itinéraires signalisés.',
    '"Ride a Bike, Discover Your City" — trails, pathways, and on-street routes.': '« Ride a Bike, Discover Your City » : sentiers, voies polyvalentes et itinéraires sur rue.',
    "Vaughan doesn't publish its own separate map — its network is covered by York Region's regional cycling maps.": 'Vaughan ne publie pas de carte distincte : son réseau est couvert par les cartes cyclables régionales de la région de York.',
    '17"×11" printable cycling and trail map covering the whole city.': 'Carte cyclable et des sentiers imprimable de 17 po sur 11 po, couvrant toute la ville.',
    "On-street routes and off-road trails, with York Region's map for connections beyond town limits.": 'Itinéraires sur rue et sentiers hors route, avec la carte de la région de York pour les liaisons au-delà des limites de la ville.',
    "Cycling Network Map from the town's Active Transportation Plan.": 'Carte du réseau cyclable tirée du plan de transport actif de la ville.',
    '195km of multi-use trails, cycling lanes, and signed bike routes across the urban area.': '195 km de sentiers polyvalents, de voies cyclables et d’itinéraires cyclables signalisés dans le secteur urbain.',
    'Beyond the GTA': 'Au-delà de la région du Grand Toronto',
    'The wider region — Hamilton, Niagara, and the counties around it.': 'La région élargie : Hamilton, Niagara et les comtés environnants.',
    "Some of these are single official PDFs; a few counties haven't published one dedicated cycling map yet, so those cards link to the closest real, official resource instead — labeled honestly, not dressed up as something it isn't.":
      'Certaines sont des PDF officiels uniques; quelques comtés n’ont pas encore publié de carte cyclable dédiée, et ces cartes renvoient donc vers la ressource officielle réelle la plus proche, étiquetée honnêtement et sans prétendre être autre chose.',
    'Urban bike routes, trails, and parks map, plus a separate rural edition on the same city page.': 'Carte des itinéraires cyclables urbains, des sentiers et des parcs, plus une édition rurale distincte sur la même page de la ville.',
    'Bilingual regional map: the Waterfront Trail, Greater Niagara Circle Route, Greenbelt Route, and 200+ loop rides.': 'Carte régionale bilingue : le Waterfront Trail, le Greater Niagara Circle Route, le Greenbelt Route et plus de 200 boucles à vélo.',
    'Separate urban and rural PDF maps covering Kitchener, Waterloo, and Cambridge.': 'Cartes PDF distinctes, urbaine et rurale, couvrant Kitchener, Waterloo et Cambridge.',
    "<b>No downloadable PDF found</b> — Caledon's official cycling routes live on an interactive map instead of a printable one.":
      '<b>Aucun PDF téléchargeable trouvé</b> : les itinéraires cyclables officiels de Caledon se trouvent sur une carte interactive plutôt que sur une carte imprimable.',
    "Cycle Simcoe's route maps — the Simcoe County Loop Trail (160km off-road) plus regional on-road routes, organized by sub-region rather than one single PDF.":
      'Cartes d’itinéraires de Cycle Simcoe : le Simcoe County Loop Trail (160 km hors route) et des itinéraires régionaux sur route, organisés par sous-région plutôt qu’en un seul PDF.',
    "<b>No dedicated cycling map published yet</b> — the closest official resource is the County Forest &amp; Rail Trail map, which permits cycling. We'll swap this in the moment a real one exists.":
      '<b>Aucune carte cyclable dédiée n’est encore publiée</b> : la ressource officielle la plus proche est la carte des forêts du comté et des sentiers ferroviaires (County Forest &amp; Rail Trail map), où le vélo est permis. Nous la remplacerons dès qu’une vraie carte existera.',
    'How this stays honest': 'Comment nous restons honnêtes',
    'Why some cards look different from others.': 'Pourquoi certaines cartes diffèrent des autres.',
    "Every link on this page was checked, not guessed — if a real, current, official PDF exists, that's what you get. If a municipality doesn't have one yet, the card says so plainly and points to the nearest genuine alternative instead of pretending a map exists that doesn't. Nothing here is a map we drew ourselves — a wrong bike lane on a fabricated map isn't a data-quality issue, it's a safety one.":
      'Chaque lien de cette page a été vérifié, et non deviné : si un vrai PDF officiel à jour existe, c’est celui que vous obtenez. Si une municipalité n’en a pas encore, la carte le dit clairement et renvoie vers la véritable solution de rechange la plus proche, au lieu de prétendre qu’une carte existe alors que ce n’est pas le cas. Rien ici n’est une carte que nous avons dessinée nous-mêmes : une fausse piste cyclable sur une carte inventée n’est pas un problème de qualité des données, c’est un problème de sécurité.',
  });
  P(/^Download the official PDF — (.+) →$/, (m, s) => 'Télécharger le PDF officiel — ' + s + ' →');
  P(/^Download PDF — (.+) →$/, (m, s) => 'Télécharger le PDF — ' + s + ' →');
  P(/^View York Region maps — (.+) →$/, (m, s) => 'Voir les cartes de la région de York — ' + s + ' →');
  P(/^View both PDFs — (.+) →$/, (m, s) => 'Voir les deux PDF — ' + s + ' →');
  P(/^Open the interactive map — (.+) →$/, (m, s) => 'Ouvrir la carte interactive — ' + s + ' →');
  P(/^Browse route maps — (.+) →$/, (m, s) => 'Parcourir les cartes d’itinéraires — ' + s + ' →');
  P(/^View trail map — (.+) →$/, (m, s) => 'Voir la carte des sentiers — ' + s + ' →');
})();
