// French (Québec) for the Showcase page. English text is the key. Loaded after i18n-fr-core.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md. Bike names, brand names and shop names are never translated.
// The bike "type" labels and the short notes come from data/showcase.json, so they are listed here by their exact wording.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);
  I.keep.push(/^(All-City|Brompton|Cannondale|Devinci|Giant|Kona|Marin|MEC|Norco|Opus|Panorama Cycles|Polygon|Rad Power Bikes|Rocky Mountain|Salsa|Specialized|Surly|Woom|Cycling Elements) \(\d+\)$/);

  // ---------------------------------------------------------------- page text
  add({
    'SelectVelo — Current bikes you can buy in Canada': 'SelectVelo — Vélos actuels offerts au Canada',
    'Current bike models from the brands and Canadian shops, with photos, Canadian prices and links straight to each maker’s or shop’s own page. Only this year’s and next year’s models, checked and refreshed every quarter.': 'Des modèles de vélos actuels des marques et des boutiques canadiennes, avec photos, prix canadiens et liens directs vers la page de chaque fabricant ou boutique. Seulement les modèles de l’année dernière, de cette année et de la prochaine, vérifiés et mis à jour chaque trimestre.',
    'Current models from the brands and Canadian shops: what you can buy in Canada now, with Canadian prices and a link to each maker’s or shop’s own page. A bike tagged New is one its maker calls new. Photos and prices come from the brand’s or shop’s own site.': 'Des modèles actuels des marques et des boutiques canadiennes : ce que vous pouvez acheter au Canada maintenant, avec les prix canadiens et un lien vers la page de chaque fabricant ou boutique. Un vélo marqué Nouveau est un vélo que son fabricant dit nouveau. Les photos et les prix proviennent du site de la marque ou de la boutique.',
    'New and current bikes from the brands and Canadian shops, with photos, Canadian prices and links straight to each maker’s or shop’s own page. Checked and refreshed every quarter.':
      'Des vélos nouveaux et actuels des marques et des boutiques canadiennes, avec photos, prix canadiens et liens directs vers la page de chaque fabricant ou boutique. Vérifiés et mis à jour chaque trimestre.',
    'Bikes you can buy in Canada': 'Des vélos que vous pouvez acheter au Canada',
    'New 2027 models and current favourites from the brands and Canadian shops. A bike tagged New is one its maker calls new. Photos and prices come from the brand’s or shop’s own site, and every bike links back to it.':
      'Les nouveaux modèles 2027 et les favoris actuels des marques et des boutiques canadiennes. Un vélo marqué « Nouveau » est un vélo que son fabricant dit nouveau. Les photos et les prix proviennent du site de la marque ou de la boutique, et chaque vélo y renvoie.',
    'Filter the bikes': 'Filtrer les vélos',
    'Checking the latest list…': 'Vérification de la liste la plus récente…',
    'All': 'Tous', 'Bikepacking & gravel': 'Cyclocamping et gravier', 'Mountain': 'Montagne', 'Kids': 'Enfants',
    'New only': 'Nouveautés seulement', 'Brand': 'Marque', 'All brands': 'Toutes les marques', 'New': 'Nouveau',
    '(opens in a new tab)': '(s’ouvre dans un nouvel onglet)',
    'Photo unavailable right now': 'Photo indisponible pour l’instant',
    '<b>No bikes match those filters.</b> Try another type or brand, or turn off “New only”.': '<b>Aucun vélo ne correspond à ces filtres.</b> Essayez un autre type ou une autre marque, ou désactivez « Nouveautés seulement ».',
    '<b>We couldn’t load the bikes just now.</b> Reload the page in a moment, or browse by type from the menu.': '<b>Nous n’avons pas pu charger les vélos à l’instant.</b> Rechargez la page dans un moment, ou parcourez par type depuis le menu.',
    'How this page works': 'Comment fonctionne cette page',
    'A bike is tagged New only if its maker says so: a “New” label, an all-new range, or a 2027 model-year page. The rest are bikes on sale now from the brand or a Canadian shop. Every bike has a live product page and a photo we checked.':
      'Un vélo n’est marqué « Nouveau » que si son fabricant l’affirme : une étiquette « Nouveau », une toute nouvelle gamme ou une page de modèle 2027. Les autres sont des vélos en vente maintenant chez la marque ou dans une boutique canadienne. Chaque vélo a une page de produit en ligne et une photo que nous avons vérifiées.',
    'Prices are shown only when they are in Canadian dollars, as the “from” price on the day we checked, so they can change before you buy. Where a brand’s page doesn’t show a Canadian price, we say so instead of guessing.':
      'Les prix ne sont affichés que s’ils sont en dollars canadiens, comme prix « à partir de » le jour de la vérification : ils peuvent donc changer avant votre achat. Lorsque la page d’une marque n’affiche pas de prix canadien, nous l’indiquons au lieu de deviner.',
    'Photos load from each brand’s or shop’s own website and belong to them. We link to them and don’t pass them off as ours. If a photo goes missing, the bike still links to its page.':
      'Les photos se chargent depuis le site de chaque marque ou boutique et leur appartiennent. Nous y renvoyons et ne les faisons pas passer pour les nôtres. Si une photo disparaît, le vélo renvoie quand même à sa page.',
    'We re-check every link and photo each quarter and add the new arrivals.': 'Nous revérifions chaque lien et chaque photo chaque trimestre et ajoutons les nouveautés.',
    'Left off for now': 'Laissés de côté pour l’instant',
    '<b>Specialized Sirrus X 3.0 and X 5.0.</b> Health Canada has a crank recall for these model names (2020–2022 model years), and we couldn’t confirm the listed bikes are a newer year.':
      '<b>Specialized Sirrus X 3.0 et X 5.0.</b> Santé Canada a un rappel de manivelles visant ces noms de modèles (années-modèles 2020 à 2022), et nous n’avons pas pu confirmer que les vélos présentés sont d’une année plus récente.',
    '<b>Norco Fluid Gen 3 (2027).</b> Norco issued a voluntary safety recall on all 2027 Fluid Gen 3 models; not featured.':
      '<b>Norco Fluid Gen 3 (2027).</b> Norco a émis un rappel de sécurité volontaire visant tous les modèles Fluid Gen 3 2027; non présentés.',
    '<b>Canyon Spectral:ON CF 9 and other Canyon launches.</b> Only a “coming soon” page with no product page to link to as of 2026-11-12.':
      '<b>Canyon Spectral:ON CF 9 et autres lancements de Canyon.</b> Seulement une page « bientôt disponible », sans page de produit vers laquelle renvoyer au 2026-11-12.',
    '<b>Trek 2027 range.</b> Trek’s new-bikes pages are script-rendered and returned only banner images; add by hand once product pages and photos can be verified.':
      '<b>Gamme Trek 2027.</b> Les pages des nouveaux vélos de Trek sont générées par script et n’ont donné que des images de bannière; à ajouter à la main dès que les pages de produits et les photos pourront être vérifiées.',
    '<b>Giant Defy Advanced 4 (2027).</b> Product page returns 404 on Giant Canada.': '<b>Giant Defy Advanced 4 (2027).</b> La page du produit renvoie une erreur 404 sur Giant Canada.',
    '<b>Priority, Guardian, Aventon, Ride1Up, Tumbleweed and Quintana Roo.</b> These sell only in the US, so we can’t say you can buy them in Canada.':
      '<b>Priority, Guardian, Aventon, Ride1Up, Tumbleweed et Quintana Roo.</b> Ces marques ne vendent qu’aux États-Unis : nous ne pouvons donc pas affirmer qu’on peut les acheter au Canada.',
    '<b>Brands without a verified Canadian product page yet.</b> Trek, Cervélo, Canyon, Scott, Santa Cruz and others aren’t listed until we can check their Canadian pages and photos.':
      '<b>Marques sans page de produit canadienne vérifiée pour l’instant.</b> Trek, Cervélo, Canyon, Scott, Santa Cruz et d’autres ne sont pas présentées tant que nous ne pouvons pas vérifier leurs pages canadiennes et leurs photos.',
  });

  // ---------------------------------------------------------------- dynamic lines
  P(/^New for (\d{4})$/, (m, y) => 'Nouveau pour ' + y);
  P(/^from (.+?)(?: (CAD|USD))?$/, (m, price, cur) => 'dès ' + price + (cur ? (cur === 'USD' ? ' US' : ' CA') : ''));
  P(/^price on (.+)’s page$/, (m, s) => 'prix sur la page de ' + s);
  P(/^View at (.+)$/, (m, s) => 'Voir chez ' + s);
  P(/^Showing (\d+) of (\d+) (?:bike|bikes)$/, (m, a, b) => 'Affichage de ' + a + (Number(a) > 1 ? ' vélos' : ' vélo') + ' sur ' + b);
  P(/^Show (\d+) more \((\d+) left\)$/, (m, n, l) => 'Afficher ' + n + ' de plus (' + l + ' restants)');
  P(/^Last checked$/, () => 'Dernière vérification :');
  P(/^\. (\d+) bikes from (\d+) brands, (\d+) of them new\. Refreshed every quarter\.$/, (m, a, b, c) => '. ' + a + ' vélos de ' + b + ' marques, dont ' + c + ' nouveaux. Mis à jour chaque trimestre.');
  P(/^Part of the all-new (.+) range, per (.+)$/, (m, r, s) => 'Fait partie de la toute nouvelle gamme ' + r + ', selon ' + s);
  P(/^(\d{4}) model-year page on (.+)$/, (m, y, s) => 'Page du modèle ' + y + ' sur ' + s);
  P(/^Labelled “New” on (.+)$/, (m, s) => 'Marqué « Nouveau » sur ' + s);
  P(/^(\d{4}) model on (.+)$/, (m, y, s) => 'Modèle ' + y + ' sur ' + s);
  P(/^Sold by (.+) in Canada$/, (m, s) => 'Vendu par ' + s + ' au Canada');
  P(/^Sold by (.+) \(Canadian online shop\)$/, (m, s) => 'Vendu par ' + s + ' (boutique en ligne canadienne)');
  P(/^Sold in Canada\. See (.+)’s page for stores and price$/, (m, s) => 'Vendu au Canada. Voir la page de ' + s + ' pour les magasins et le prix');
  P(/^Kids’ bike, (\d+)"( with training wheels)?$/, (m, n, tw) => 'Vélo d’enfant, ' + n + ' po' + (tw ? ', avec roues stabilisatrices' : ''));

  // ---------------------------------------------------------------- bike types (data/showcase.json "type")
  add({
    'Race road bike': 'Vélo de route de course', 'Aero road bike': 'Vélo de route aérodynamique', 'Aluminum race bike': 'Vélo de course en aluminium', 'Gravel race bike': 'Vélo de gravier de course',
    'Electric trail bike': 'Vélo trail électrique', 'Trail / enduro bike': 'Vélo trail / enduro', 'Electric mountain bike': 'Vélo de montagne électrique', 'Fitness / commuter bike': 'Vélo de fitness / de ville',
    'Step-through commuter': 'Vélo de ville à cadre ouvert', 'Youth mountain bike': 'Vélo de montagne pour jeunes', 'folding commuter': 'Vélo de ville pliant', 'Commuter for mixed paths': 'Vélo de ville pour chemins mixtes',
    'Electric hill-friendly commuter': 'Vélo de ville électrique pour terrains vallonnés', 'City commuter': 'Vélo de ville urbain', 'Long-distance commuter': 'Vélo de ville pour longues distances',
    'Ultra-distance race bike': 'Vélo de course d’ultra-distance', 'Adventure / gravel bike': 'Vélo d’aventure / de gravier', 'Touring bike': 'Vélo de cyclotourisme',
    'Cross-country hardtail bike': 'Vélo cross-country semi-rigide', 'Trail full-suspension bike': 'Vélo trail à double suspension', 'Trail hardtail bike': 'Vélo trail semi-rigide',
    'Enduro full-suspension bike': 'Vélo d’enduro à double suspension', 'Cross-country full-suspension bike': 'Vélo cross-country à double suspension', 'Dirt-jump hardtail bike': 'Vélo de saut de terre semi-rigide',
    'All-round road bike': 'Vélo de route polyvalent', 'Endurance road bike': 'Vélo de route d’endurance', 'Audax / long-distance road bike': 'Vélo de route d’audax / de longue distance',
    'City / commuter bike': 'Vélo de ville', 'Downhill full-suspension bike': 'Vélo de descente à double suspension', 'Kids’ bike': 'Vélo d’enfant', 'Bikepacking bike': 'Vélo de cyclocamping',
    'Gravel bike': 'Vélo de gravier', 'Electric commuter / gravel bike': 'Vélo électrique de ville / de gravier', 'Trail bike': 'Vélo trail', 'Adventure bike': 'Vélo d’aventure',
    'City & Hybrid bike': 'Vélo de ville et hybride', 'Aero Race bike': 'Vélo de course aérodynamique', 'Bike': 'Vélo', 'XC bike': 'Vélo XC', 'Race bike': 'Vélo de course',
    'Triathlon / TT bike': 'Vélo de triathlon / de contre-la-montre', 'Electric city bike': 'Vélo de ville électrique', 'Electric cargo bike': 'Vélo cargo électrique',
    'Electric off-road bike': 'Vélo électrique hors route', 'E-Bike': 'Vélo électrique', 'City & Active bike': 'Vélo de ville et d’activité', 'Road bike': 'Vélo de route',
  });
  // ---------------------------------------------------------------- "fits my height" panel
  add({
    'Your height': 'Votre taille',
    'See what fits': 'Voyez ce qui convient',
    'Select your height': 'Choisissez votre taille',
    'Find bikes that fit your height': 'Trouvez les vélos qui conviennent à votre taille',
    'Show only bikes that fit me': 'Afficher seulement les vélos qui me conviennent',
    'Also show bikes with no recorded fit': 'Afficher aussi les vélos sans plage de taille consignée',
    'Fit range not recorded': 'Plage de taille non consignée',
    "That's about a 4-year-old.": 'Cela correspond à un enfant d’environ 4 ans.',
    "That's about a 6-year-old.": 'Cela correspond à un enfant d’environ 6 ans.',
    "That's about an 8-year-old.": 'Cela correspond à un enfant d’environ 8 ans.',
    "That's about a 10 to 12-year-old.": 'Cela correspond à un enfant de 10 à 12 ans.',
    "That's a teenager, or a petite adult.": 'C’est un adolescent, ou un adulte de petite taille.',
    "That's an average-height adult.": 'C’est un adulte de taille moyenne.',
    'Height ranges come from our quiz catalogs: the maker’s recommended range where it was published, otherwise a typical range for that kind of bike. A bike that is not in those catalogs shows “Fit range not recorded”, and is left out when you filter by height unless you choose to include it.':
      'Les plages de taille proviennent de nos catalogues de questionnaires : la plage recommandée par le fabricant lorsqu’elle est publiée, sinon une plage typique pour ce genre de vélo. Un vélo absent de ces catalogues affiche « Plage de taille non consignée » et est exclu quand vous filtrez par taille, à moins que vous choisissiez de l’inclure.',
    '<b>No bikes match those filters.</b> Try another type or brand, turn off “New only”, or turn off the height filter.':
      '<b>Aucun vélo ne correspond à ces filtres.</b> Essayez un autre type ou une autre marque, désactivez « Nouveautés seulement », ou désactivez le filtre de taille.',
  });
  P(/^Only current models are listed: model years (\d{4}) to (\d{4}), and bikes a maker or shop lists today without a model year\. Older models are dropped at each refresh\.$/, (m, a, b) => 'Seuls les modèles actuels sont affichés : années-modèles ' + a + ' à ' + b + ', et les vélos qu’un fabricant ou une boutique propose aujourd’hui sans année-modèle. Les modèles plus anciens sont retirés à chaque mise à jour.');
  P(/^Made for riders (\d+)–(\d+) cm$/, (m, a, b) => 'Conçu pour des cyclistes de ' + a + ' à ' + b + ' cm');
  P(/^Bikes made for riders (\d+) cm tall: (\d+)\. (\d+) more have no recorded fit range and are (hidden|shown too)\.$/, (m, h, n, u, st) => 'Vélos conçus pour des cyclistes de ' + h + ' cm : ' + n + '. ' + u + ' autres n’ont pas de plage de taille consignée et sont ' + (st === 'hidden' ? 'masqués' : 'aussi affichés') + '.');
  P(/^Of (\d+) bikes, (\d+) have a recorded fit range\. Press the button to keep only the ones that fit (\d+) cm\.$/, (m, n, k, h) => 'Sur ' + n + ' vélos, ' + k + ' ont une plage de taille consignée. Appuyez sur le bouton pour ne garder que ceux qui conviennent à ' + h + ' cm.');
  P(/^That's about (?:a|an) (\d+)-year-old\.$/, (m, n) => 'Cela correspond à un enfant d’environ ' + n + ' ans.');
  P(/^⌀ (\d+)in$/, (m, n) => '⌀ ' + n + ' po');
  P(/^Standover ~(\d+)cm$/, (m, n) => 'Enjambement ~' + n + ' cm');
  P(/^Wheelbase ~(\d+)cm$/, (m, n) => 'Empattement ~' + n + ' cm');
  P(/^A (child|teenager|rider) about (\d+) cm tall (?:riding a bike|on a bike) with (\d+|700c)(?: inch| inches)? wheels$/, (m, who, h, w) => ({ child: 'Un enfant', teenager: 'Un adolescent', rider: 'Un cycliste' }[who]) + ' d’environ ' + h + ' cm sur un vélo à roues de ' + (w === '700c' ? '700c' : w + ' po'));
})();
