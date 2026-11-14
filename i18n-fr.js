// French (Québec) for the bikepacking journey. Loaded with i18n.js. English text is the key.
//
// Written by an AI translator and NOT yet reviewed by a native speaker: treat it as a good first draft and
// have a Québec French speaker read it before it is relied on. Terms follow Québec usage where there is a
// difference ("courriel", "blogue", "cyclocamping"). Anything without an entry here stays in English.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);

  // ---------------------------------------------------------------- navigation and chrome
  add({
    'The right bike for how you ride.': 'Le bon vélo pour votre façon de rouler.',
    "Kids' bikes": 'Vélos d’enfant', 'Commuting': 'Vélo urbain', 'Bikepacking': 'Bikepacking', 'Mountain biking': 'Vélo de montagne',
    'Racing': 'Course', 'Showcase': 'Vitrine', 'Schematics': 'Schémas', 'Route maps': 'Cartes de routes', 'Blog': 'Blogue',
    'Start matching': 'Trouver mon vélo', 'Check out': 'Découvrez', 'new bikes': 'les nouveaux vélos',
    'Check out new bikes, in the Showcase': 'Découvrez les nouveaux vélos, dans la Vitrine',
    'Free': 'Gratuit', '3 minutes': '3 minutes', 'Every brand': 'Toutes les marques',
    'A smarter way to find a bike that fits your ride.': 'Une façon plus intelligente de trouver un vélo adapté à votre façon de rouler.',
    'Why we built this': 'Pourquoi nous avons créé ceci', 'Close': 'Fermer',
    'Sheet 003': 'Planche 003', 'SelectVelo — Find your bikepacking bike': 'SelectVelo — Trouvez votre vélo de bikepacking',
  });

  // ---------------------------------------------------------------- hero
  add({
    'The right': 'Le bon vélo de',
    'bikepacking': 'bikepacking',
    'bike makes every mile unforgettable — blisters optional.': 'rend chaque kilomètre inoubliable — les ampoules sont facultatives.',
    "Iceland's ring road isn't Patagonia, and a weekend loop isn't the Tour Divide. Answer questions about your actual route, trip length, and how you'll carry your gear — we measure real bikes against your actual trip, not a generic \"adventure bike\" shelf.":
      'La route de ceinture de l’Islande n’est pas la Patagonie, et une boucle de fin de semaine n’est pas le Tour Divide. Répondez à des questions sur votre vrai parcours, la durée de la sortie et la façon dont vous transporterez votre équipement : nous comparons de vrais vélos à votre vraie sortie, pas à un rayon générique de « vélos d’aventure ».',
    'New to bikepacking? Start here': 'Nouveau en bikepacking? Commencez ici',
    'WHEEL': 'ROUE', '⌀ 650b/700c': '⌀ 650b/700c', 'WHEELBASE — loaded & steady': 'EMPATTEMENT — chargé et stable',
    'racks & panniers': 'porte-bagages et sacoches',
    'Fig. 001 — geometry and gear capacity we score against your trip': 'Fig. 001 — la géométrie et la capacité de charge que nous comparons à votre sortie',
    'Studio render of a loaded bikepacking bike with front and rear racks, panniers, a duffel and a handlebar bag, annotated with wheel diameter, standover height, and wheelbase':
      'Rendu en studio d’un vélo de bikepacking chargé, avec porte-bagages avant et arrière, sacoches, un sac polochon et un sac de guidon, annoté avec le diamètre des roues, la hauteur d’enjambement et l’empattement',
  });

  // ---------------------------------------------------------------- "new to bikepacking" section
  add({
    'First trip': 'Première sortie', 'Start here': 'Commencez ici',
    'New to bikepacking? Decide before you spend.': 'Nouveau en bikepacking? Décidez avant de dépenser.',
    'Bikepacking means carrying what you need to sleep and eat on your bike, in bags or panniers, for one night or many. You do not need a special bike to begin, and the right first purchase may be nothing at all. This is how to decide.':
      'Le bikepacking (ou cyclocamping), c’est transporter sur votre vélo, dans des sacs ou des sacoches, ce qu’il faut pour dormir et manger, pour une nuit ou plusieurs. Vous n’avez pas besoin d’un vélo spécial pour commencer, et le bon premier achat peut être… aucun. Voici comment décider.',
    'Could the bike you already own do it?': 'Le vélo que vous possédez déjà pourrait-il faire l’affaire?',
    'Check these before you shop. If most are a yes, try a one- or two-night trip with what you have, then buy once you know what you miss.':
      'Vérifiez ces points avant de magasiner. Si la plupart sont un oui, essayez une sortie d’une ou deux nuits avec ce que vous avez, puis achetez quand vous saurez ce qui vous manque.',
    'Tyre room.': 'Espace pour les pneus.', 'Can it take tyres at least 35 mm wide? Wider tyres are more comfortable and grip better on gravel and crushed stone.': 'Peut-il recevoir des pneus d’au moins 35 mm de large? Des pneus plus larges sont plus confortables et adhèrent mieux sur le gravier et la pierre concassée.',
    'Places to mount things.': 'Des endroits où fixer des choses.', 'Rack mounts, or bosses for bottle cages and bags. Without them you rely on strapped-on bags.': 'Des fixations de porte-bagages, ou des points d’ancrage pour les porte-bidons et les sacs. Sans eux, vous devez compter sur des sacs attachés avec des sangles.',
    'Easy gears.': 'Des petits braquets.', 'A loaded bike is much heavier than an empty one, so a low gear matters on hills.': 'Un vélo chargé est beaucoup plus lourd qu’un vélo vide : un petit braquet fait toute la différence dans les côtes.',
    'Brakes you trust.': 'Des freins sur lesquels vous pouvez compter.', 'Check them in the wet, with a load on.': 'Vérifiez-les sur le mouillé, avec une charge.',
    'A frame that fits you.': 'Un cadre à votre taille.', 'A long trip is a poor time to find out it does not.': 'Une longue sortie est un mauvais moment pour découvrir qu’il ne l’est pas.',
    'Condition.': 'État.', 'Tyres, chain, brake pads and wheels. Have a shop check it before a long trip.': 'Pneus, chaîne, plaquettes de frein et roues. Faites-le vérifier en atelier avant une longue sortie.',
    'Bags or racks and panniers?': 'Sacs, ou porte-bagages et sacoches?', 'Neither is better in general. It depends on your route and how long you will be out.': 'Aucun n’est meilleur en général. Cela dépend de votre parcours et de la durée de la sortie.',
    'Bikepacking bags': 'Les sacs de bikepacking', '(frame, seat pack, handlebar roll) are narrower and suit rougher trails. They fit bikes without racks, but need room in the frame and are harder to pack for a long trip.': '(sac de cadre, sac de selle, rouleau de guidon) sont plus étroits et conviennent aux sentiers plus accidentés. Ils s’installent sur des vélos sans porte-bagages, mais demandent de la place dans le cadre et sont plus difficiles à remplir pour une longue sortie.',
    'Racks and panniers': 'Les porte-bagages et sacoches', 'carry more and are easier to pack and unpack. They suit longer trips on roads and gravel, and the bike needs rack mounts.': 'transportent plus et sont plus faciles à remplir et à vider. Ils conviennent aux sorties plus longues sur route et sur gravier, et le vélo doit avoir des fixations de porte-bagages.',
    'The quiz asks which you prefer, or recommends from your trip if you are not sure.': 'Le questionnaire vous demande lequel vous préférez, ou recommande selon votre sortie si vous n’êtes pas certain.',
    'Planning a trip in Québec': 'Planifier une sortie au Québec',
    'Distances, opening dates and rules change, so we link to the official sources instead of repeating their details. Check them before you go.': 'Les distances, les dates d’ouverture et les règles changent : nous renvoyons donc aux sources officielles plutôt que de répéter leurs détails. Consultez-les avant de partir.',
    'La Route verte': 'La Route verte', ": the province's cycling network, with maps and route information.": ' : le réseau cyclable de la province, avec cartes et information sur les parcours.',
    'Le Québec à vélo: map of the Route verte': 'Le Québec à vélo : carte de la Route verte', ", from Vélo Québec's cycle-tourism site.": ', du site de cyclotourisme de Vélo Québec.',
    'Cycling in Gaspésie': 'À vélo en Gaspésie', ', one of its regional guides.': ', l’un de ses guides régionaux.',
    'Sépaq reservations': 'Réservations Sépaq', ": campsites in Québec's parks.": ' : emplacements de camping dans les parcs du Québec.',
    'VIA Rail: bicycles and sports equipment': 'VIA Rail : vélos et équipement sportif', ', if you plan to start or finish by train.': ', si vous prévoyez de commencer ou de finir en train.',
    'Ask before you buy': 'Demandez avant d’acheter',
    'Does it come in my size, and can I sit on one first?': 'Existe-t-il dans ma taille, et puis-je m’asseoir sur un vélo d’abord?',
    'Will the shop fit racks or bags, and what does that cost?': 'Le magasin peut-il installer des porte-bagages ou des sacs, et à quel coût?',
    'What is the return policy if it does not fit?': 'Quelle est la politique de retour s’il ne me convient pas?',
    'Is there a shop that can service it near where I will ride?': 'Y a-t-il un atelier capable de l’entretenir près de l’endroit où je roulerai?',
    'Can I test it with a load before the trip?': 'Puis-je l’essayer avec une charge avant la sortie?',
    'The rest of the kit': 'Le reste de l’équipement', 'The bike is only part of the cost. We do not price these here; check each with the seller.': 'Le vélo n’est qu’une partie du coût. Nous n’indiquons pas de prix ici : vérifiez chaque article auprès du vendeur.',
    'Sleep:': 'Dormir :', 'tent or bivy, sleeping bag, sleeping pad.': 'tente ou bivouac, sac de couchage, matelas.',
    'Carry:': 'Transporter :', 'bags or rack and panniers, plus dry bags.': 'sacs, ou porte-bagages et sacoches, plus des sacs étanches.',
    'Food and water:': 'Nourriture et eau :', 'stove, a way to treat water, bottles.': 'réchaud, un moyen de traiter l’eau, bidons.',
    'Repair:': 'Réparation :', 'spare tube, pump, multi-tool, chain lube, patches.': 'chambre à air de rechange, pompe, multi-outil, lubrifiant à chaîne, rustines.',
    'Other:': 'Autre :', 'lights, rain layer, warm layer, first aid, navigation.': 'éclairage, couche imperméable, couche chaude, premiers soins, navigation.',
  });

  // ---------------------------------------------------------------- how it works
  add({
    'Fig. 002': 'Fig. 002', 'How it works': 'Comment ça marche',
    'Three steps to a bike that fits your trip.': 'Trois étapes vers un vélo adapté à votre sortie.',
    'No "adventure bike" catch-all. Terrain, trip length, how you carry gear, and your actual frame size — run against real bikes built for real routes.': 'Pas de « vélo d’aventure » fourre-tout. Le terrain, la durée, la façon de transporter l’équipement et votre vraie taille de cadre — comparés à de vrais vélos conçus pour de vrais parcours.',
    'Describe your trip': 'Décrivez votre sortie', "Terrain from paved to singletrack, how long you're out, how much climbing, and how remote you'll be.": 'Le terrain, de l’asphalte au sentier étroit, la durée, le dénivelé et l’isolement.',
    'We score every bike': 'Nous évaluons chaque vélo', "A rigid tourer that can't handle singletrack is ruled down; a boutique frame that's a perfect fit still surfaces when nothing mainstream beats it.": 'Un vélo de voyage rigide qui ne peut pas affronter un sentier étroit est déclassé; un cadre artisanal parfaitement ajusté ressort quand rien de courant ne fait mieux.',
    'See your top matches': 'Voyez vos meilleurs choix', "Ranked with plain-language reasons — frame size, gear capacity, climbing range, and how it's meant to be loaded.": 'Classés avec des raisons en langage clair : taille du cadre, capacité de charge, plage de braquets et façon de le charger.',
  });

  // ---------------------------------------------------------------- the quiz
  add({
    'Fig. 003': 'Fig. 003', 'The fit quiz': 'Le questionnaire d’ajustement',
    "Let's find your bikepacking bike.": 'Trouvons votre vélo de bikepacking.',
    'Answer six quick questions for a first set of matches, then add detail if you like: bikepacking bikes vary more than any other category here, so there is more to refine. None of it requires expert terminology.': 'Répondez à six questions rapides pour une première série de choix, puis ajoutez des détails si vous le souhaitez : les vélos de bikepacking varient plus que toute autre catégorie ici, il y a donc plus à préciser. Aucune question n’exige de terminologie d’expert.',
    'Your route': 'Votre parcours', 'Your trip': 'Votre sortie', 'Your fit': 'Votre ajustement', 'Your budget': 'Votre budget', 'About you': 'À propos de vous',
    'How you\'ll carry it': 'Comment vous le transporterez', 'The bike itself': 'Le vélo lui-même', 'You & your budget': 'Vous et votre budget',
    'Optional: fine-tune your match': 'Facultatif : peaufiner votre choix',
    'Rack-and-panniers vs. soft bikepacking bags is a real fork in the road, and it depends on trip length and wheel size as much as taste.': 'Porte-bagages et sacoches ou sacs souples de bikepacking : c’est une vraie croisée des chemins, qui dépend autant de la durée de la sortie et de la taille des roues que du goût.',
    "What's the terrain?": 'Quel est le terrain?', '(choose all that apply)': '(choisissez tout ce qui s’applique)',
    'Fully paved': 'Entièrement asphalté', 'Dedicated gravel': 'Gravier seulement', "Mixed paved & gravel (like Iceland's Ring Road)": 'Mixte, asphalte et gravier (comme la route de ceinture de l’Islande)', 'Rough trail / singletrack (like Patagonia)': 'Sentier accidenté / sentier étroit (comme en Patagonie)',
    'Skipped questions do not change your results.': 'Les questions sautées ne changent pas vos résultats.', 'Skip for now': 'Passer pour l’instant', 'Back': 'Retour', 'Next': 'Suivant', 'See my matches now': 'Voir mes choix maintenant',
    'How long is the trip?': 'Quelle est la durée de la sortie?', 'Overnight or a weekend': 'Une nuit ou une fin de semaine', 'About a week': 'Environ une semaine', 'Several weeks': 'Plusieurs semaines', 'Months / continent-crossing': 'Des mois / traversée d’un continent',
    "What's the goal of the trip?": 'Quel est l’objectif de la sortie?', 'Comfortable multi-week touring': 'Voyage confortable de plusieurs semaines', 'A proper adventure ride': 'Une vraie sortie d’aventure', 'Self-supported ultra-racing (Tour Divide, TCR, LEL, RAAM-style)': 'Ultra-course en autonomie (Tour Divide, TCR, LEL, style RAAM)',
    'Do you know your frame size?': 'Connaissez-vous votre taille de cadre?', 'Yes — I know my size': 'Oui — je connais ma taille', 'Not sure — use my height': 'Pas certain — utiliser ma taille',
    'Budget (in Canadian dollars)': 'Budget (en dollars canadiens)',
    'How experienced a bikepacker are you?': 'Quelle est votre expérience en bikepacking?', 'First trip': 'Première sortie', 'Done a few trips': 'Quelques sorties à mon actif', 'Very experienced': 'Très expérimenté',
    'How much climbing, loaded?': 'Combien de dénivelé, avec la charge?', 'Mostly flat or rolling': 'Surtout plat ou vallonné', 'Steep, sustained climbs': 'Longues côtes raides',
    'How remote will you be?': 'À quel point serez-vous isolé?', 'Towns most days': 'Des villes presque chaque jour', 'Days between resupply': 'Des jours entre les ravitaillements',
    'How do you want to carry your gear?': 'Comment voulez-vous transporter votre équipement?', 'Frame bag, seat pack, bar roll — no rack': 'Sac de cadre, sac de selle, rouleau de guidon — sans porte-bagages', 'Rack and panniers': 'Porte-bagages et sacoches', 'Not sure — recommend based on my trip': 'Pas certain — recommander selon ma sortie',
    'Wheel size preference': 'Préférence de taille de roue', '700c — faster rolling, more tire choice': '700c — roule plus vite, plus de choix de pneus', '650b — higher-volume tires for rough terrain': '650b — pneus à plus gros volume pour terrain accidenté', 'No preference': 'Aucune préférence',
    'How much do flat tires worry you out there?': 'À quel point les crevaisons vous inquiètent-elles?', 'A lot — give me tough, reliable tires': 'Beaucoup — donnez-moi des pneus robustes et fiables', 'Not especially': 'Pas particulièrement',
    'Want a dynamo hub for lights/charging?': 'Voulez-vous un moyeu dynamo pour l’éclairage et la recharge?', 'Yes, want it': 'Oui, j’en veux un', "Don't need it": 'Pas besoin',
    'Frame material': 'Matériau du cadre', 'Aluminum': 'Aluminium', 'Carbon': 'Carbone', 'Steel': 'Acier', 'Titanium': 'Titane',
    'Frame shape': 'Forme du cadre', '(sometimes marketed as "women\'s" or "men\'s")': '(parfois vendu comme « pour femme » ou « pour homme »)',
    'Step-through — lower bar, easier to mount': 'Cadre ouvert — barre plus basse, plus facile à enfourcher', 'Step-over — traditional diamond frame': 'Cadre à barre haute — cadre en diamant traditionnel',
    'A step-through frame has a low or missing top tube — easier to swing a leg over, traditionally sold as a "women\'s" bike. A step-over frame is the traditional diamond shape, traditionally sold as a "men\'s" bike. Either shape genuinely works for any rider. Loaded touring/bikepacking frames also need diamond-frame rigidity — real mainstream rigs in this category aren\'t built step-through, so this question mostly serves as an honest heads-up rather than a filter.':
      'Un cadre ouvert a un tube supérieur bas ou absent : plus facile à enjamber, vendu traditionnellement comme un vélo « pour femme ». Un cadre à barre haute est la forme en diamant traditionnelle, vendue traditionnellement comme un vélo « pour homme ». L’une ou l’autre forme convient à n’importe quel cycliste. Les cadres de voyage et de bikepacking chargés ont aussi besoin de la rigidité d’un cadre en diamant — les vrais vélos courants de cette catégorie ne sont pas offerts en cadre ouvert, cette question sert donc surtout d’avertissement honnête plutôt que de filtre.',
    'Want some relief from harsh roads?': 'Voulez-vous un peu de répit sur les routes dures?', 'A suspension fork or a built-in comfort mechanism (like Specialized\'s Future Shock or Cannondale\'s Kingpin) — both count.': 'Une fourche suspendue ou un mécanisme de confort intégré (comme le Future Shock de Specialized ou le Kingpin de Cannondale) — les deux comptent.',
    'No, fully rigid is fine': 'Non, entièrement rigide me convient', 'Yes, I want some damping': 'Oui, je veux un peu d’amortissement',
    'Groupset preference': 'Préférence de groupe de transmission', 'Shifting preference': 'Préférence de changement de vitesses', 'Electronic (Di2 / AXS)': 'Électronique (Di2 / AXS)', 'Mechanical is fine': 'Mécanique me convient',
    'Preferred color': 'Couleur préférée', 'Black': 'Noir', 'Silver': 'Argent', 'Grey': 'Gris', 'Green': 'Vert', 'Orange': 'Orange',
    'Availability preference': 'Préférence de disponibilité', 'Prefer widely available bikes': 'Je préfère des vélos largement disponibles', "I'm open to boutique/small-builder bikes": 'Je suis ouvert aux vélos de boutique ou de petits fabricants',
    'Brand origin': 'Origine de la marque', 'Prefer Canadian': 'Je préfère canadien',
    "That's everything. Ready to see your matches?": 'C’est tout. Prêt à voir vos choix?', 'See recommendations': 'Voir les recommandations',
    'Pick a terrain, trip goal, and trip length first.': 'Choisissez d’abord un terrain, un objectif et une durée de sortie.',
    'Your top matches will appear here, ranked with reasons — including frame size fit, gear capacity, and climbing range.': 'Vos meilleurs choix apparaîtront ici, classés avec des raisons — y compris l’ajustement du cadre, la capacité de charge et la plage de braquets.',
    // explanations
    'Which frame material?': 'Quel matériau de cadre?', 'Which frame material? — show explanation': 'Quel matériau de cadre? — afficher l’explication', 'Close explanation': 'Fermer l’explication',
    'The frame is the heart of the bike. Its material sets how much the bike weighs, how it feels over bumps, how long it lasts, and a big part of the price.': 'Le cadre est le cœur du vélo. Son matériau détermine le poids du vélo, sa sensation sur les bosses, sa durée de vie et une bonne partie du prix.',
    'Good for': 'Idéal pour', 'Keep in mind': 'À garder en tête',
    'Light, stiff and affordable — the best value for most riders. It doesn’t rust.': 'Léger, rigide et abordable — le meilleur rapport qualité-prix pour la plupart des cyclistes. Il ne rouille pas.', 'Can feel a little harsher over rough roads than carbon or steel.': 'Peut sembler un peu plus dur sur les routes accidentées que le carbone ou l’acier.',
    'The lightest option. It soaks up road buzz yet stays stiff where you pedal — the choice for racing and speed.': 'L’option la plus légère. Il absorbe les vibrations de la route tout en restant rigide là où l’on pédale — le choix pour la course et la vitesse.', 'Costs the most, and a hard knock can crack it. Repairs need a specialist.': 'C’est le plus cher, et un choc violent peut le fissurer. Les réparations demandent un spécialiste.',
    'Tough, smooth and springy, and almost any shop or welder can repair it. A favourite for touring and bikepacking.': 'Robuste, souple et élastique, et presque n’importe quel atelier ou soudeur peut le réparer. Un favori pour le voyage et le bikepacking.', 'Heavier, and it can rust if scratches are left untreated.': 'Plus lourd, et il peut rouiller si les égratignures ne sont pas traitées.',
    'Rust-proof and built to last for decades, with a smooth ride and less weight than steel.': 'Inoxydable et conçu pour durer des décennies, avec une conduite douce et moins de poids que l’acier.', 'Very expensive — a “buy it once” bike.': 'Très cher — un vélo qu’on achète une seule fois.',
    'Rule of thumb: aluminum for value, carbon for speed, steel for toughness on long trips. Not sure? Pick “No preference” — material is just one of many things we weigh.': 'Règle générale : l’aluminium pour la valeur, le carbone pour la vitesse, l’acier pour la robustesse en longue sortie. Pas certain? Choisissez « Aucune préférence » — le matériau n’est qu’un des nombreux éléments que nous pondérons.',
    'What’s a groupset?': 'Qu’est-ce qu’un groupe de transmission?', 'What’s a groupset? — show explanation': 'Qu’est-ce qu’un groupe de transmission? — afficher l’explication',
    'The groupset is the bike’s gear system: the shifters, the derailleurs that move the chain between gears, the cranks and the chain. A couple of companies make nearly all of them, and they all work well — it mostly comes down to feel and what’s already on the bike you like.': 'Le groupe de transmission est le système de vitesses du vélo : les manettes, les dérailleurs qui déplacent la chaîne d’un pignon à l’autre, les manivelles et la chaîne. Deux ou trois entreprises en fabriquent presque tous, et ils fonctionnent tous bien — tout est question de sensation et de ce qui équipe déjà le vélo que vous aimez.',
    'Shimano': 'Shimano', 'SRAM': 'SRAM',
    'The most common groupset in the world — on everything from commuters to Tour de France bikes. Parts and mechanics who know them are everywhere, so repairs are easy and cheap.': 'Le groupe le plus répandu au monde — sur tout, des vélos urbains aux vélos du Tour de France. Les pièces et les mécaniciens qui les connaissent sont partout : les réparations sont donc faciles et peu coûteuses.',
    'Ranges from entry level (Tourney, Altus, CUES) up to premium (105, Ultegra, XT, XTR). Its electronic shifting is called Di2.': 'De l’entrée de gamme (Tourney, Altus, CUES) au haut de gamme (105, Ultegra, XT, XTR). Son changement de vitesses électronique s’appelle Di2.',
    'The big American alternative, popular on mountain, gravel and performance road bikes. Known for clean, simple single-chainring (“1x”) setups, like Eagle on mountain bikes.': 'La grande alternative américaine, populaire sur les vélos de montagne, de gravier et de route de performance. Connue pour ses montages simples à un seul plateau (« 1x »), comme Eagle sur les vélos de montagne.',
    'Ranges from entry level (SX, Apex) up to premium (GX, Force, XX, Red). Its electronic shifting is called AXS.': 'De l’entrée de gamme (SX, Apex) au haut de gamme (GX, Force, XX, Red). Son changement de vitesses électronique s’appelle AXS.',
    'At the same level, neither brand is “better”. Within a brand, the higher up the range you go, the lighter, smoother and pricier the parts. No favourite? Pick “No preference”.': 'À niveau égal, aucune des deux marques n’est « meilleure ». Au sein d’une marque, plus on monte en gamme, plus les pièces sont légères, fluides et chères. Pas de préférence? Choisissez « Aucune préférence ».',
  });

  // ---------------------------------------------------------------- the rest of the page
  add({
    'Fig. 004': 'Fig. 004', 'Why fit matters': 'Pourquoi l’ajustement compte', 'km, no regrets': 'km, sans regrets',
    "a bike sized and loaded wrong turns day three into the worst day of the trip — the wrong frame size or the wrong carry setup doesn't show up until you're already out there.": 'un vélo mal dimensionné et mal chargé fait du troisième jour la pire journée de la sortie — la mauvaise taille de cadre ou le mauvais système de transport ne se révèle qu’une fois sur place.',
    'Fig. 005': 'Fig. 005', "Every brand is eligible for a match — we don't sell any of them": 'Toutes les marques peuvent être recommandées — nous n’en vendons aucune',
    'Fig. 006': 'Fig. 006', 'Take a spin': 'Faites un tour', 'How steady is your hand?': 'Votre main est-elle assez sûre?',
    'Steer with your mouse, your finger, or the arrow keys. The lane never ends, and it never stops narrowing — stay off the edges.': 'Dirigez avec votre souris, votre doigt ou les touches fléchées. La voie ne finit jamais et ne cesse de rétrécir — évitez les bords.',
    'Ready?': 'Prêt?', 'Move your mouse, drag your finger, or use the arrow keys to steer.': 'Bougez votre souris, glissez votre doigt ou utilisez les touches fléchées pour diriger.', 'Start riding': 'Commencer à rouler',
    'Fig. 007 — where this is headed': 'Fig. 007 — où nous allons', "To everyone who's stood in a bike aisle guessing,": 'À toutes celles et ceux qui se sont tenus dans une allée de vélos à deviner,',
    "Buying a bike usually comes down to a guess: a size sticker on a rack, a salesperson pointing at whatever's in stock, or a color you liked in a catalog. Get it wrong and it's money spent on something that never quite fits.": 'Acheter un vélo se résume généralement à une devinette : une étiquette de taille sur un présentoir, un vendeur qui désigne ce qu’il y a en stock, ou une couleur qui vous a plu dans un catalogue. Si vous vous trompez, c’est de l’argent dépensé pour quelque chose qui ne vous va jamais tout à fait.',
    'We think fit should come from geometry, not guesswork — reach, stack, standover, all measured and matched to the rider, whoever that rider is.': 'Nous croyons que l’ajustement doit venir de la géométrie, pas de la devinette — allonge, hauteur de cadre, enjambement, tout mesuré et adapté au cycliste, quel qu’il soit.',
    "SelectVelo is built to do that matching for every kind of rider and every kind of ride. Right now it's five working prototypes: a first bike for a growing kid, a daily commuter, a bikepacking rig, a mountain bike, and a racing or ultra-endurance bike — because those are the cases where a wrong guess costs the most. The same approach — real measurements, scored against real bikes — is what we're building toward next, for every rider after this one.": 'SelectVelo est conçu pour faire cet appariement pour tous les types de cyclistes et de sorties. Pour l’instant, ce sont cinq prototypes fonctionnels : un premier vélo pour un enfant qui grandit, un vélo urbain quotidien, un vélo de bikepacking, un vélo de montagne et un vélo de course ou d’ultra-endurance — parce que ce sont les cas où une mauvaise devinette coûte le plus cher. La même approche — de vraies mesures, comparées à de vrais vélos — est ce que nous bâtissons ensuite, pour chaque cycliste après celui-ci.',
    "It won't get everything right yet. But it will show its work — the frame size, the gear capacity, the climbing range — so you're choosing a bike, not gambling on one.": 'Il ne fera pas tout parfaitement pour l’instant. Mais il montrera son travail — la taille du cadre, la capacité de charge, la plage de braquets — pour que vous choisissiez un vélo plutôt que de miser sur un.',
    'This is where we\'re starting. Not where we\'re stopping.': 'Nous commençons ici. Nous ne nous arrêtons pas là.',
    'A steering mini-game: move your mouse, drag your finger, or use the arrow keys to keep a bike inside a winding, narrowing lane': 'Un mini-jeu de conduite : bougez votre souris, glissez votre doigt ou utilisez les touches fléchées pour garder un vélo dans une voie sinueuse qui se rétrécit',
    'Best: 0.0s': 'Meilleur : 0,0 s', '0.0s': '0,0 s',
  });

  // ---------------------------------------------------------------- results, built in the browser
  const CAP = { ultralight: 'ultraléger', weekend: 'fin de semaine', 'week-long': 'd’une semaine', expedition: 'd’expédition' };
  const TRIP = { 'weekend trip': 'une sortie de fin de semaine', 'week-long trip': 'une sortie d’une semaine', 'multi-week trip': 'une sortie de plusieurs semaines', 'months-long trip': 'une sortie de plusieurs mois' };
  const TERR = { 'paved roads': 'routes asphaltées', gravel: 'gravier', 'mixed paved and gravel': 'mixte, asphalte et gravier', 'rough trail': 'sentier accidenté' };
  const MAT = { aluminum: 'aluminium', steel: 'acier', carbon: 'carbone', titanium: 'titane' };
  const tcap = s => CAP[s] || s, ttrip = s => TRIP[s] || s, tterr = s => TERR[s] || s, tmat = s => MAT[s] || s;
  const P = (re, rep) => I.patterns.push([re, rep]);

  add({
    'Top pick': 'Premier choix', 'Based on:': 'Selon vos réponses :', 'Left out:': 'Écartés :',
    'Change any answer and the matches update. The order is by how well each bike fits': 'Modifiez une réponse et les résultats se mettent à jour. L’ordre reflète à quel point chaque vélo correspond à',
    'your': 'vos', 'answers.': 'réponses.',
    'Copy link to these results': 'Copier le lien vers ces résultats', 'Link copied': 'Lien copié', 'Email these matches': 'Envoyer ces choix par courriel',
    'Route': 'Parcours', 'Trip': 'Durée', 'Goal': 'Objectif', 'Fit': 'Ajustement', 'Budget': 'Budget', 'Experience': 'Expérience',
    'A proper adventure': 'Une vraie aventure', 'Comfortable touring': 'Voyage confortable', 'Ultra-racing': 'Ultra-course', 'First trip ': 'Première sortie', 'A few trips': 'Quelques sorties',
    'Price': 'Prix', 'Wheels': 'Roues', 'Frame': 'Cadre', 'Drivetrain': 'Transmission', 'Gear capacity': 'Capacité de charge', 'Climbing gears': 'Braquets pour grimper', 'Rack mounts': 'Fixations de porte-bagages',
    'Frame-bag friendly': 'Compatible avec un sac de cadre', 'Tyres': 'Pneus', 'Weight (catalog)': 'Poids (catalogue)', 'Sizes': 'Tailles', 'not listed': 'non indiqué', 'yes': 'oui', 'no': 'non', 'tight': 'serré',
    'reinforced': 'renforcés', 'standard': 'standard', 'catalog': 'catalogue',
    'Seller page confirmed': 'Page du vendeur confirmée', 'Canadian listing': 'Fiche canadienne',
    'Canadian availability not confirmed. Check before you buy': 'Disponibilité au Canada non confirmée. Vérifiez avant d’acheter',
    "This seller's site doesn't allow automatic checks, so open the page to confirm the model and price": 'Le site de ce vendeur bloque les vérifications automatiques : ouvrez la page pour confirmer le modèle et le prix',
    "The seller page didn't clearly show this model. Check that it is the right bike": 'La page du vendeur n’affichait pas clairement ce modèle. Vérifiez qu’il s’agit du bon vélo',
    'No seller page confirmed yet for this bike': 'Aucune page de vendeur n’est encore confirmée pour ce vélo',
    'catalog price, not re-checked': 'prix du catalogue, non revérifié',
    'Sizes aren\'t listed here yet. Check the brand\'s size chart before you buy': 'Les tailles ne sont pas encore indiquées ici. Consultez le tableau des tailles de la marque avant d’acheter',
    'Has rack mounts for panniers': 'A des fixations de porte-bagages pour les sacoches', 'No rack mounts, so panniers need a workaround': 'Aucune fixation de porte-bagages : les sacoches demandent une solution de rechange',
    'Roomy main triangle for a frame bag': 'Grand triangle principal pour un sac de cadre', 'Tight frame-bag fit, so plan on a smaller bag': 'Peu de place pour un sac de cadre : prévoyez un sac plus petit',
    'Reinforced tyres to cut down on flats': 'Pneus renforcés pour réduire les crevaisons',
    'Standard gearing: expect to push on steep climbs with a load': 'Braquets standard : attendez-vous à pousser dans les côtes raides avec une charge',
    'Single-speed: no gears, so hills are hard work with a load': 'Une seule vitesse : les côtes sont très exigeantes avec une charge',
    'Race-oriented: quicker and twitchier than a relaxed first-trip bike': 'Orienté course : plus rapide et plus nerveux qu’un vélo détendu pour une première sortie',
    'Relaxed, touring-style handling suits a first trip': 'Une conduite détendue de style voyage convient à une première sortie',
  });
  add({
    'paved roads': 'routes asphaltées', 'gravel': 'gravier', 'mixed paved and gravel': 'mixte, asphalte et gravier', 'rough trail': 'sentier accidenté',
    'weekend trip': 'fin de semaine', 'week-long trip': 'une semaine', 'multi-week trip': 'plusieurs semaines', 'months-long trip': 'plusieurs mois',
  });
  add({ 'Recall notice:': 'Avis de rappel :', 'Read the notice': 'Lire l’avis' });
  P(/^Health Canada lists a recall that names this model \((.*)\)\. Check which model years and parts it covers before you buy\.$/s, 'Santé Canada publie un avis de rappel qui nomme ce modèle ($1). Vérifiez quelles années-modèles et quelles pièces sont visées avant d’acheter.');
  P(/^Health Canada lists a recall for other bikes in the (.*?) line \((.*)\)\. Check whether this one is included\.$/s, 'Santé Canada publie un avis de rappel pour d’autres vélos de la gamme $1 ($2). Vérifiez si celui-ci est visé.');
  // several terrains joined with " + "
  P(/^((?:paved roads|gravel|mixed paved and gravel|rough trail)(?: \+ (?:paved roads|gravel|mixed paved and gravel|rough trail))+)$/, m => m.split(' + ').map(tterr).join(' + '));
  // sentences with numbers and names
  P(/^Question (\d+) of (\d+) \(the essentials\)$/, 'Question $1 de $2 (l’essentiel)');
  P(/^Question (\d+) of (\d+)$/, 'Question $1 de $2');
  P(/^The remaining (\d+) questions are optional\. Answer any that matter to you\.$/, 'Les $1 questions restantes sont facultatives. Répondez à celles qui comptent pour vous.');
  P(/^Your top (\d+) matches$/, 'Vos $1 meilleurs choix');
  P(/^Side by side: your top (\d+)$/, 'Comparaison : vos $1 premiers choix');
  P(/^(\d+) no longer sold new \((.*?)\)(; |\.$)/, (m, n, names, tail) => n + ' qui ne sont plus vendus neufs (' + names + ')' + tail);
  P(/(\d+) that the seller says it cannot ship to Canada \((.*?)\)/, (m, n, names) => n + ' que le vendeur dit ne pas pouvoir expédier au Canada (' + names + ')');
  P(/(\d+) whose seller page no longer loads/, '$1 dont la page du vendeur ne s’affiche plus');
  P(/^Fits a (\d+) cm rider \(this bike covers (\d+)–(\d+) cm\)$/, 'Convient à un cycliste de $1 cm (ce vélo couvre $2–$3 cm)');
  P(/^Sized for riders (\d+)–(\d+) cm, and you're (\d+) cm$/, 'Conçu pour des cyclistes de $1–$2 cm, et vous mesurez $3 cm');
  P(/^Comes in a (\d+) cm frame$/, 'Offert en cadre de $1 cm');
  P(/^Nearest frame is (\d+) cm; you said (\d+) cm$/, 'Le cadre le plus proche est de $1 cm; vous avez indiqué $2 cm');
  P(/^Made for (paved roads|gravel|mixed paved and gravel|rough trail), like your route$/, (m, t) => 'Conçu pour ' + (t === 'gravel' ? 'le gravier' : t === 'paved roads' ? 'les routes asphaltées' : t === 'rough trail' ? 'les sentiers accidentés' : 'un parcours mixte, asphalte et gravier') + ', comme votre parcours');
  P(/^Built for (paved roads|gravel|mixed paved and gravel|rough trail): more bike than your route needs, so heavier and slower on smooth ground$/, (m, t) => 'Conçu pour ' + tterr(t) + ' : plus de vélo que ce que votre parcours exige, donc plus lourd et plus lent sur surface lisse');
  P(/^Built for (paved roads|gravel|mixed paved and gravel|rough trail): may feel limited on rougher stretches of your route$/, (m, t) => 'Conçu pour ' + tterr(t) + ' : peut sembler limité sur les tronçons plus accidentés de votre parcours');
  P(/^Better suited to (paved roads|gravel|mixed paved and gravel|rough trail) than your route$/, (m, t) => 'Mieux adapté à ' + tterr(t) + ' qu’à votre parcours');
  P(/^Rated for (ultralight|weekend|week-long|expedition) loads, enough for a (weekend trip|week-long trip|multi-week trip|months-long trip)$/, (m, c, t) => 'Prévu pour des charges ' + tcap(c) + ', suffisant pour ' + ttrip(t));
  P(/^Rated for (ultralight|weekend|week-long|expedition) loads, and you described a (weekend trip|week-long trip|multi-week trip|months-long trip)$/, (m, c, t) => 'Prévu pour des charges ' + tcap(c) + ', et vous avez décrit ' + ttrip(t));
  P(/^(Very low \(loaded-climb\) gearing|Low gearing|Standard gearing) for climbing with a load$/, (m, g) => (g.startsWith('Very') ? 'Très petits braquets (pour grimper chargé)' : g.startsWith('Low') ? 'Petits braquets' : 'Braquets standard') + ' pour grimper avec une charge');
  P(/^Within your C\$(\d+) budget \((.*?)\)$/, 'Dans votre budget de $1 $ CA ($2)');
  P(/^About C\$(\d+) over your budget$/, 'Environ $1 $ CA de plus que votre budget');
  P(/^: that gets you (.*)\.$/, ' : cela vous apporte $1.');
  P(/^(\d+) cm tall$/, '$1 cm de taille');
  P(/^(\d+) cm frame$/, 'cadre de $1 cm');
  P(/^seen on the seller's page(, (\d{4}-\d{2}-\d{2}))?$/, (m, a, d) => 'vu sur la page du vendeur' + (d ? ', ' + d : ''));
  P(/^Seller page confirmed on (\d{4}-\d{2}-\d{2})(, but it shows no price we can read)?$/, (m, d, nop) => 'Page du vendeur confirmée le ' + d + (nop ? ', mais elle n’affiche aucun prix lisible' : ''));
  P(/^Open seller page at (.+?)( →)?$/, 'Ouvrir la page du vendeur sur $1$2');
  P(/^See photos at (.+?)( →)?$/, 'Voir les photos sur $1$2');
  P(/^Search for photos of the (.+?)( →)?$/, 'Chercher des photos du $1$2');
  P(/^No seller page confirmed\. Search for sellers( →)?$/, 'Aucune page de vendeur confirmée. Chercher des vendeurs$1');
  P(/^The seller's page shows (.+?), which may be a different trim\. Confirm with the seller\.$/, 'La page du vendeur affiche $1, ce qui peut être une autre version. Confirmez auprès du vendeur.');
  P(/^sizes: see the brand$/, 'tailles : voir la marque');
  // the spec lines under each bike
  P(/^(700c|650b) wheels · (sizes [\d/]+cm|sizes: see the brand) · (\w+) frame · (.*?) \((mechanical|electronic)\)$/, (m, w, sz, mat, grp, sh) => w + ' roues · ' + sz.replace('sizes: see the brand', 'tailles : voir la marque').replace('sizes ', 'tailles ') + ' · cadre en ' + tmat(mat) + ' · ' + grp + ' (' + (sh === 'mechanical' ? 'mécanique' : 'électronique') + ')');
  P(/^(ultralight|weekend|week-long|expedition) capacity · (very low \(loaded-climb\) gearing|low gearing|standard gearing) · (rigid|suspension fork|front comfort damping)$/, (m, c, g, s) => 'capacité ' + tcap(c) + ' · ' + (g.startsWith('very') ? 'très petits braquets (pour grimper chargé)' : g.startsWith('low') ? 'petits braquets' : 'braquets standard') + ' · ' + (s === 'rigid' ? 'rigide' : s === 'suspension fork' ? 'fourche suspendue' : 'amortissement avant'));
  P(/^Prices are in the currency the brand or retailer lists, before tax\.(.*)$/s, (m, rest) => 'Les prix sont dans la devise indiquée par la marque ou le détaillant, avant taxes.' + rest
    .replace(/ US prices are converted at the Bank of Canada's rate for (\S+) \(1 US\$ = C\$([\d.]+)\) only to compare against your budget\./, ' Les prix en dollars américains sont convertis au taux de la Banque du Canada du $1 (1 $ US = $2 $ CA) uniquement pour les comparer à votre budget.')
    .replace(' The exchange rate could not be loaded, so your budget was compared to each listed number as it is.', ' Le taux de change n’a pas pu être chargé : votre budget a donc été comparé à chaque prix tel qu’il est indiqué.')
    .replace(' Bikes whose seller page we have confirmed get a small ranking boost, because we know you can really buy them.', ' Les vélos dont nous avons confirmé la page du vendeur reçoivent un léger avantage au classement, parce que nous savons que vous pouvez vraiment les acheter.')
    .replace('“Catalog price” means we have not re-checked it on the seller\'s page.', 'Un « prix du catalogue » signifie que nous ne l’avons pas revérifié sur la page du vendeur.')
    .replace(' Specifications come from our catalog and can be out of date. Always confirm size, price, specifications and stock with the seller before you buy.', ' Les spécifications proviennent de notre catalogue et peuvent être périmées. Confirmez toujours la taille, le prix, les spécifications et le stock auprès du vendeur avant d’acheter.'));
})();
