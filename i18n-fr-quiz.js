// French (Québec) for what the five quiz pages share: the quiz steps, the "i" explanation cards, the results
// layer (match-ui.js) and the colour/brand lists. English text is the key. Loaded after i18n-fr-core.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);
  const P = (re, fn) => I.patterns.push([re, fn]);
  I.keep.push(/^(Shimano|SRAM|Campagnolo|microSHIFT|Microshift|Tektro|Box|Rotor|Gevenalle)\b/, /\d+x\d+$/, /^[XSML\/ ]+$/);
  I.keep.push(/^(Woom|Trek|Cleary|Norco|Islabikes|Specialized|Frog Bikes|Huffy|Schwinn|Decathlon|Supercycle|Cannondale|Giant|Surly|Kona|Canyon|Devinci|Rocky Mountain|Cervélo|Shimano|SRAM)$/);

  // ---------------------------------------------------------------- page furniture
  add({
    'Free': 'Gratuit',
    '2 minutes': '2 minutes',
    '3 minutes': '3 minutes',
    'Every brand': 'Toutes les marques',
    'WHEEL': 'ROUE',
    'STANDOVER': 'ENJAMBEMENT',
    'WHEELBASE': 'EMPATTEMENT',
    'How it works': 'Comment ça fonctionne',
    'We score every bike': 'Nous évaluons chaque vélo',
    'See your top matches': 'Découvrez vos meilleurs choix',
    'The fit quiz': 'Le questionnaire d’ajustement',
    'Why fit matters': 'Pourquoi l’ajustement compte',
    "Every brand is eligible for a match — we don't sell any of them": 'Toutes les marques sont admissibles : nous n’en vendons aucune',
  });

  // ---------------------------------------------------------------- the quiz steps
  add({
    'Skipped questions do not change your results.': 'Les questions ignorées ne changent pas vos résultats.',
    'Skip for now': 'Passer pour l’instant',
    'Back': 'Retour',
    'Next': 'Suivant',
    'See my matches now': 'Voir mes résultats maintenant',
    'Optional: fine-tune your match': 'Facultatif : affinez vos résultats',
    "That's everything. Ready to see your matches?": 'C’est tout. Prêt à voir vos résultats ?',
    'See recommendations': 'Voir les recommandations',
    'No preference': 'Aucune préférence',
    'Your budget': 'Votre budget',
    'Budget (in Canadian dollars)': 'Budget (en dollars canadiens)',
    'The bike itself': 'Le vélo lui-même',
    'You & your budget': 'Vous et votre budget',
    'Your fit': 'Votre ajustement',
    'About you': 'À propos de vous',
    'Very experienced': 'Très expérimenté',
    'Brand origin': 'Origine de la marque',
    'Prefer Canadian': 'Préférer les marques canadiennes',
    'Availability preference': 'Préférence de disponibilité',
    'Prefer widely available bikes': 'Préférer les vélos largement disponibles',
    "I'm open to boutique/small-builder bikes": 'J’accepte les vélos de boutique ou de petits fabricants',
    'Wheel size preference': 'Préférence de taille de roues',
    'Yes, want it': 'Oui, je le veux',
    "Don't need it": 'Pas nécessaire',
    'Do you know your frame size?': 'Connaissez-vous votre taille de cadre ?',
    'Yes — I know my size': 'Oui : je connais ma taille de cadre',
    'Not sure — use my height': 'Pas certain : utiliser ma taille corporelle',
    'Shifting preference': 'Préférence de changement de vitesses',
    'Electronic (Di2 / AXS)': 'Électronique (Di2 / AXS)',
    'Mechanical is fine': 'Mécanique me convient',
    'Step-through — lower bar, easier to mount': 'Cadre ouvert : tube plus bas, plus facile à enfourcher',
    'Step-over — traditional diamond frame': 'Cadre classique : cadre traditionnel en losange',
    'Frame shape <span class="q-hint">(sometimes marketed as "women\'s" or "men\'s")</span>': 'Forme du cadre <span class="q-hint">(parfois présenté comme « pour femmes » ou « pour hommes »)</span>',
    'Frame material': 'Matériau du cadre',
    'Groupset preference': 'Préférence de groupe de composants',
    'Preferred color <span class="q-hint">(choose all that apply)</span>': 'Couleur préférée <span class="q-hint">(choisissez toutes celles qui s’appliquent)</span>',
  });
  P(/^Question (\d+) of (\d+) \(the essentials\)$/, (m, a, b) => 'Question ' + a + ' de ' + b + ' (l’essentiel)');
  P(/^Question (\d+) of (\d+)$/, (m, a, b) => 'Question ' + a + ' de ' + b);
  P(/^The remaining (\d+) questions are optional\. Answer any that matter to you\.$/, (m, n) => 'Les ' + n + ' questions restantes sont facultatives. Répondez à celles qui comptent pour vous.');
  P(/^(\d+)cm$/, (m, n) => n + ' cm');
  P(/^(.+?) (\d+)-speed$/, (m, g, n) => g + ' ' + n + ' vitesses');
  P(/^WHEELBASE (.+)$/, (m, v) => 'EMPATTEMENT ' + v);
  P(/^C\$([\d,]+)(\+?)$/, (m, n, plus) => Number(n.replace(/,/g, '')).toLocaleString('fr-CA') + ' $ CA' + plus);
  add({
    'Within your {c} budget ({p})': 'Dans votre budget de {c} ({p})',
    '{a} and {b}': '{a} et {b}',
    '<b>About {x} over your budget</b>: that gets you {p}.': '<b>Environ {x} de plus que votre budget</b> : cela vous procure {p}.',
    'Still loading the bike catalog — try again in a second.': 'Le catalogue de vélos est encore en chargement : réessayez dans une seconde.',
  });

  // ---------------------------------------------------------------- colours
  add({ 'Black': 'Noir', 'Silver': 'Argent', 'Blue': 'Bleu', 'Red': 'Rouge', 'Green': 'Vert', 'Orange': 'Orange', 'White': 'Blanc', 'Yellow': 'Jaune', 'Grey': 'Gris', 'Gray': 'Gris', 'Purple': 'Violet', 'Pink': 'Rose', 'Brown': 'Brun', 'Teal': 'Sarcelle', 'Gold': 'Or' });

  // ---------------------------------------------------------------- the "i" explanation cards (info-tips.js)
  add({
    'i': 'i',
    'Which frame material?': 'Quel matériau de cadre ?',
    'Which frame material? — show explanation': 'Quel matériau de cadre ? — afficher l’explication',
    'What’s a groupset?': 'Qu’est-ce qu’un groupe de composants ?',
    'What’s a groupset? — show explanation': 'Qu’est-ce qu’un groupe de composants ? — afficher l’explication',
    'Good for': 'Avantages',
    'Keep in mind': 'À garder en tête',
    'The frame is the heart of the bike. Its material sets how much the bike weighs, how it feels over bumps, how long it lasts, and a big part of the price.':
      'Le cadre est le cœur du vélo. Son matériau détermine le poids du vélo, son confort sur les bosses, sa durée de vie et une bonne part du prix.',
    'Aluminum': 'Aluminium',
    'Light, stiff and affordable — the best value for most riders. It doesn’t rust.': 'Léger, rigide et abordable : le meilleur rapport qualité-prix pour la plupart des cyclistes. Il ne rouille pas.',
    'Can feel a little harsher over rough roads than carbon or steel.': 'Peut sembler un peu plus rude sur les routes accidentées que le carbone ou l’acier.',
    'Carbon': 'Carbone',
    'The lightest option. It soaks up road buzz yet stays stiff where you pedal — the choice for racing and speed.': 'L’option la plus légère. Il absorbe les vibrations de la route tout en restant rigide là où vous pédalez : le choix de la course et de la vitesse.',
    'Costs the most, and a hard knock can crack it. Repairs need a specialist.': 'C’est le plus cher, et un choc violent peut le fissurer. Les réparations exigent un spécialiste.',
    'Steel': 'Acier',
    'Tough, smooth and springy, and almost any shop or welder can repair it. A favourite for touring and bikepacking.': 'Solide, doux et souple, et presque n’importe quel atelier ou soudeur peut le réparer. Un favori pour le cyclotourisme et le cyclocamping.',
    'Heavier, and it can rust if scratches are left untreated.': 'Plus lourd, et il peut rouiller si les égratignures ne sont pas traitées.',
    'Titanium': 'Titane',
    'Rust-proof and built to last for decades, with a smooth ride and less weight than steel.': 'Inoxydable et conçu pour durer des décennies, avec une conduite douce et un poids inférieur à celui de l’acier.',
    'Very expensive — a “buy it once” bike.': 'Très cher : un vélo qu’on n’achète qu’une seule fois.',
    'Rule of thumb: aluminum for value, carbon for speed, steel for toughness on long trips. Not sure? Pick “No preference” — material is just one of many things we weigh.':
      'Règle générale : l’aluminium pour le rapport qualité-prix, le carbone pour la vitesse, l’acier pour la robustesse en voyage de longue durée. Un doute ? Choisissez « Aucune préférence » : le matériau n’est qu’un des nombreux critères que nous pesons.',
    'The groupset is the bike’s gear system: the shifters, the derailleurs that move the chain between gears, the cranks and the chain. A couple of companies make nearly all of them, and they all work well — it mostly comes down to feel and what’s already on the bike you like.':
      'Le groupe de composants est le système de vitesses du vélo : les manettes de vitesses, les dérailleurs qui déplacent la chaîne d’un braquet à l’autre, le pédalier et la chaîne. Quelques entreprises fabriquent presque tous les groupes, et ils fonctionnent tous bien : tout se résume surtout à la sensation et à ce qui équipe déjà le vélo que vous aimez.',
    'Shimano': 'Shimano',
    'SRAM': 'SRAM',
    'The most common groupset in the world — on everything from commuters to Tour de France bikes. Parts and mechanics who know them are everywhere, so repairs are easy and cheap.':
      'Le groupe de composants le plus répandu au monde, sur tous les vélos, du vélo de ville à ceux du Tour de France. Les pièces et les mécaniciens qui les connaissent sont partout : les réparations sont donc faciles et peu coûteuses.',
    'Ranges from entry level (Tourney, Altus, CUES) up to premium (105, Ultegra, XT, XTR). Its electronic shifting is called Di2.':
      'La gamme va de l’entrée de gamme (Tourney, Altus, CUES) au haut de gamme (105, Ultegra, XT, XTR). Sa transmission électronique s’appelle Di2.',
    'The big American alternative, popular on mountain, gravel and performance road bikes. Known for clean, simple single-chainring (“1x”) setups, like Eagle on mountain bikes.':
      'La grande alternative américaine, populaire sur les vélos de montagne, de gravier et de route de performance. Connu pour ses configurations à plateau unique (« 1x »), simples et épurées, comme Eagle sur les vélos de montagne.',
    'Ranges from entry level (SX, Apex) up to premium (GX, Force, XX, Red). Its electronic shifting is called AXS.':
      'La gamme va de l’entrée de gamme (SX, Apex) au haut de gamme (GX, Force, XX, Red). Sa transmission électronique s’appelle AXS.',
    'At the same level, neither brand is “better”. Within a brand, the higher up the range you go, the lighter, smoother and pricier the parts. No favourite? Pick “No preference”.':
      'À niveau égal, aucune des deux marques n’est « meilleure ». Au sein d’une même marque, plus on monte en gamme, plus les pièces sont légères, fluides et chères. Pas de favori ? Choisissez « Aucune préférence ».',
  });

  // ---------------------------------------------------------------- the results layer (match-ui.js)
  add({
    'Seller page confirmed on {d}': 'Page du vendeur confirmée le {d}',
    'Seller page confirmed on {d}, but it shows no price we can read': 'Page du vendeur confirmée le {d}, mais elle n’affiche aucun prix lisible',
    'Seller page confirmed': 'Page du vendeur confirmée',
    'Seller page confirmed, but it shows no price we can read': 'Page du vendeur confirmée, mais elle n’affiche aucun prix lisible',
    "This seller's site doesn't allow automatic checks, so open the page to confirm the model and price": 'Le site de ce vendeur n’autorise pas les vérifications automatiques : ouvrez la page pour confirmer le modèle et le prix',
    "The seller page didn't clearly show this model. Check that it is the right bike": 'La page du vendeur n’affichait pas clairement ce modèle. Vérifiez qu’il s’agit du bon vélo',
    'No seller page confirmed yet for this bike': 'Aucune page de vendeur confirmée pour l’instant pour ce vélo',
    'Canadian listing': 'Offre canadienne',
    'Canadian availability not confirmed. Check before you buy': 'Disponibilité au Canada non confirmée. Vérifiez avant d’acheter',
    "seen on the seller's page, {d}": 'vu sur la page du vendeur, {d}',
    "seen on the seller's page": 'vu sur la page du vendeur',
    'catalog price, not re-checked': 'prix du catalogue, non revérifié',
    "The seller's page shows {p}, which may be a different trim. Confirm with the seller.": 'La page du vendeur indique {p}, ce qui peut correspondre à une autre version. Confirmez auprès du vendeur.',
    'See photos at {h}': 'Voir les photos sur {h}',
    'See photos': 'Voir les photos',
    'Open seller page at {h}': 'Ouvrir la page du vendeur sur {h}',
    'Open seller page': 'Ouvrir la page du vendeur',
    'Search for photos of the {b}': 'Chercher des photos de la marque {b}',
    'No seller page confirmed. Search for sellers': 'Aucune page de vendeur confirmée. Chercher des vendeurs',
    'Change this answer': 'Modifier cette réponse',
    '1 no longer sold new ({names})': '1 qui n’est plus vendu neuf ({names})',
    '{n} no longer sold new ({names})': '{n} qui ne sont plus vendus neufs ({names})',
    '1 that the seller says it cannot ship to Canada ({names})': '1 que le vendeur dit ne pas pouvoir expédier au Canada ({names})',
    '{n} that the seller says it cannot ship to Canada ({names})': '{n} que le vendeur dit ne pas pouvoir expédier au Canada ({names})',
    '1 whose seller page no longer loads': '1 dont la page du vendeur ne se charge plus',
    '{n} whose seller page no longer loads': '{n} dont la page du vendeur ne se charge plus',
    'Your top {n} matches': 'Vos {n} meilleurs choix',
    'Your answers. Select one to change it': 'Vos réponses. Sélectionnez-en une pour la modifier',
    'Based on:': 'Selon :',
    'Change any answer and the matches update. The order is by how well each bike fits <em>your</em> answers.': 'Modifiez une réponse et les résultats se mettent à jour. L’ordre reflète à quel point chaque vélo correspond à <em>vos</em> réponses.',
    'Copy link to these results': 'Copier le lien vers ces résultats',
    'Email these matches': 'Envoyer ces résultats par courriel',
    'Left out:': 'Écartés :',
    'Recall notice:': 'Avis de rappel :',
    'Health Canada lists a recall that names this model ({t}). Check which model years and parts it covers before you buy.': 'Santé Canada signale un rappel qui nomme ce modèle ({t}). Vérifiez quelles années-modèles et quelles pièces il couvre avant d’acheter.',
    'Health Canada lists a recall for other bikes in the {l} line ({t}). Check whether this one is included.': 'Santé Canada signale un rappel visant d’autres vélos de la gamme {l} ({t}). Vérifiez si celui-ci est visé.',
    'Health Canada lists a recall for other bikes in the same line ({t}). Check whether this one is included.': 'Santé Canada signale un rappel visant d’autres vélos de la même gamme ({t}). Vérifiez si celui-ci est visé.',
    'Read the notice': 'Lire l’avis',
    'Top pick': 'Premier choix',
    'Side by side: your top {n}': 'Côte à côte : vos {n} meilleurs choix',
    'Price': 'Prix',
    'catalog': 'catalogue',
    'not listed': 'non indiqué',
    "US prices are converted at the Bank of Canada's rate for {d} (1 US$ = C${r}) only to compare against your budget.": 'Les prix en dollars américains sont convertis au taux de la Banque du Canada du {d} (1 $ US = {r} $ CA), uniquement pour les comparer à votre budget.',
    'The exchange rate could not be loaded, so your budget was compared to each listed number as it is.': 'Le taux de change n’a pas pu être chargé : votre budget a donc été comparé tel quel au prix indiqué de chaque vélo.',
    'Prices are in the currency the brand or retailer lists, before tax.': 'Les prix sont dans la devise indiquée par la marque ou le détaillant, avant taxes.',
    "Bikes whose seller page we have confirmed get a small ranking boost, because we know you can really buy them. “Catalog price” means we have not re-checked it on the seller's page.": 'Les vélos dont nous avons confirmé la page du vendeur reçoivent un léger avantage au classement, parce que nous savons qu’on peut vraiment les acheter. « Prix du catalogue » signifie que nous ne l’avons pas revérifié sur la page du vendeur.',
    'Specifications come from our catalog and can be out of date. Always confirm size, price, specifications and stock with the seller before you buy.': 'Les caractéristiques proviennent de notre catalogue et peuvent être périmées. Confirmez toujours la taille, le prix, les caractéristiques et le stock auprès du vendeur avant d’acheter.',
    'Link copied': 'Lien copié',
    'Copy this link': 'Copiez ce lien',
    'See the full result and why each was picked:': 'Consultez le résultat complet et les raisons de chaque choix :',
    'My bike matches from SelectVelo': 'Mes choix de vélos sur SelectVelo',
  });
})();
