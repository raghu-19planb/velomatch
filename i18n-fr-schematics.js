// French (Québec) for the schematics page. English text is the key. Loaded after i18n-fr-core.js.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md. Part names follow the OQLF's cycling vocabulary
// (jeu de direction, jeu de pédalier, tige de selle, pivot de fourche, support de dérailleur, plateau, pignon, manette de
// dérailleur, étrier de frein, patin de frein). "Lockring", "quick-release" and "jockey wheels" have no OQLF entry:
// bague de blocage, blocage rapide and galets are what Québec shops say, and are the first things a reviewer should check.
(function () {
  const I = window.I18N;
  if (!I) return;
  const E = I.exact;
  const add = o => Object.assign(E, o);

  add({
    'SelectVelo — Bike Schematics': 'SelectVelo — Schémas de vélo',
    'See how a bicycle actually goes together — an animated, labeled diagram covering single-speed, mechanical, wide-range, and electronic drivetrains.':
      'Voyez comment un vélo se monte réellement : un schéma animé et annoté couvrant les transmissions monovitesse, mécanique, à large plage et électronique.',
    'Bike schematics': 'Schémas de vélo',
    'Know your bike before you buy one.': 'Connaissez votre vélo avant d’en acheter un.',
    'Bikes are getting more complex — electronic shifting, wireless derailleurs, a dozen cassette options that all sound the same in a shop pitch. Watch a bike go together, part by part, so you can walk in speaking the language instead of nodding along.':
      'Les vélos se compliquent : changement de vitesses électronique, dérailleurs sans fil, une douzaine de cassettes qui se ressemblent toutes dans le boniment d’un vendeur. Regardez un vélo se monter pièce par pièce, pour entrer en magasin en parlant le même langage au lieu d’acquiescer sans comprendre.',
    'Quick reference': 'Aide-mémoire',
    'A full-bike cheat sheet, before the interactive breakdown below.': 'Un aide-mémoire du vélo complet, avant la décomposition interactive ci-dessous.',
    'Single-speed': 'Monovitesse',
    'Mechanical (cassette)': 'Mécanique (cassette)',
    'Cassette range': 'Plage de la cassette',
    'Electronic shifting': 'Changement de vitesses électronique',
    'Narrow — 11–28T': 'Étroite : 11–28 dents',
    'Wide — 10–50T': 'Large : 10–50 dents',
    'The simplest drivetrain there is: one chainring, one rear cog, one gear. Nothing to shift and nothing to adjust — the trade-off is you provide all the gearing yourself on hills.':
      'La transmission la plus simple qui soit : un plateau, un pignon arrière, une seule vitesse. Rien à changer et rien à régler; en contrepartie, c’est vous qui fournissez tout l’effort dans les côtes.',
    'SINGLE COG': 'PIGNON UNIQUE',
    'SADDLE': 'SELLE',
    'FRAME & FORK': 'CADRE ET FOURCHE',
    'COCKPIT': 'POSTE DE PILOTAGE',
    'WHEEL — rim · spoke · hub': 'ROUE : jante · rayon · moyeu',
    'CRANKSET & PEDALS': 'PÉDALIER ET PÉDALES',
    'Replay assembly': 'Rejouer le montage',

    'Frame & steering': 'Cadre et direction',
    'Frame': 'Cadre',
    'Ties every other part together — its size and angles set how the bike fits and handles.': 'Relie toutes les autres pièces : sa taille et ses angles déterminent l’ajustement et la maniabilité du vélo.',
    'Fork': 'Fourche',
    'Holds the front wheel and carries steering input down to it from the headset.': 'Retient la roue avant et lui transmet la direction depuis le jeu de direction.',
    'Headset': 'Jeu de direction',
    'Two sealed bearings, top and bottom of the head tube, that let the fork rotate smoothly when you steer.': 'Deux roulements étanches, en haut et en bas du tube de direction, qui permettent à la fourche de tourner en douceur quand vous dirigez.',

    'Wheels': 'Roues',
    'Rim & tire': 'Jante et pneu',
    'The rim is sized by diameter (700c, 650b, 26", etc.); the tire mounts on it and is the only part actually touching the road.': 'La jante se mesure par son diamètre (700c, 650b, 26 po, etc.); le pneu s’y monte et c’est la seule pièce qui touche réellement la route.',
    'Spokes': 'Rayons',
    'Tensioned wires from hub to rim that hold the wheel true — more spokes generally means a stronger, heavier wheel.': 'Des fils tendus du moyeu à la jante qui gardent la roue bien droite : plus de rayons donne généralement une roue plus solide et plus lourde.',
    'Hub & skewer': 'Moyeu et blocage rapide',
    "The bearing at the wheel's center, plus the quick-release (or thru-axle) that clamps the wheel into the frame or fork.": 'Le roulement au centre de la roue, plus le blocage rapide (ou l’axe traversant) qui fixe la roue au cadre ou à la fourche.',

    'Cockpit & saddle': 'Poste de pilotage et selle',
    'Stem': 'Potence',
    "Bolts the handlebar to the fork's steerer tube — its length sets how far forward you reach.": 'Fixe le guidon au pivot de fourche : sa longueur détermine jusqu’où vous vous étirez vers l’avant.',
    'Handlebar': 'Guidon',
    'What you actually hold — flat, riser, or drop-bar shape sets your riding position and hand options.': 'Ce que vous tenez réellement : la forme (droit, relevé ou cintre de route) détermine votre position et les positions possibles des mains.',
    'Brake & shift lever': 'Levier de frein et de vitesses',
    'On most road and gravel bikes, one lever does both jobs — squeeze to brake, click or push sideways to shift.': 'Sur la plupart des vélos de route et de gravier, un seul levier fait les deux : on serre pour freiner, on clique ou on pousse de côté pour changer de vitesse.',
    'Seatpost': 'Tige de selle',
    'Slides into the seat tube and clamps the saddle at your measured height.': 'Elle glisse dans le tube de selle et maintient la selle à la hauteur qui vous convient.',
    'Saddle rails': 'Rails de selle',
    'The two rods the saddle clamps onto — sliding them back or forward fine-tunes your position over the pedals.': 'Les deux tiges sur lesquelles se fixe la selle : les faire glisser vers l’arrière ou l’avant affine votre position au-dessus des pédales.',
    'Saddle': 'Selle',
    'The single most personal fit point on the whole bike — shape and width matter more than padding thickness.': 'Le point d’ajustement le plus personnel de tout le vélo : la forme et la largeur comptent plus que l’épaisseur du rembourrage.',

    'Drivetrain — crankset': 'Transmission : pédalier',
    'Chainring': 'Plateau',
    'The front toothed ring the pedals turn — its tooth count, paired with the rear cog, sets how hard or easy each stroke feels.': 'La couronne dentée avant que font tourner les pédales : son nombre de dents, combiné à celui du pignon arrière, détermine la dureté de chaque coup de pédale.',
    'Bottom bracket': 'Jeu de pédalier',
    'The bearing inside the frame that the crank spindle spins in — a worn one shows up as play or creaking underfoot.': 'Le roulement dans le cadre dans lequel tourne l’axe du pédalier : un jeu de pédalier usé se manifeste par du jeu ou des craquements sous les pieds.',
    'Crank arms & pedals': 'Manivelles et pédales',
    'Where your legs put in power. Arm length is a fit measurement too, just like frame size.': 'L’endroit où vos jambes transmettent la puissance. La longueur des manivelles est aussi une mesure d’ajustement, tout comme la taille du cadre.',
    'Chain': 'Chaîne',
    'A loop of linked plates and rollers carrying power from the chainring to whichever rear cog is currently selected.': 'Une boucle de plaques et de rouleaux articulés qui transmet la puissance du plateau au pignon arrière sélectionné.',

    'Brakes': 'Freins',
    'Brake caliper': 'Étrier de frein',
    'Squeezes the pads onto the rim (drawn here) or a disc rotor, depending on the bike.': 'Serre les patins contre la jante (illustré ici) ou contre un disque, selon le vélo.',
    'Brake pads': 'Patins de frein',
    'The actual wearing part — rubber for a rim, replaceable pucks for a disc. Check these before you check anything else.': 'La pièce qui s’use vraiment : du caoutchouc pour une jante, des plaquettes remplaçables pour un disque. Vérifiez-les avant toute autre chose.',
    'Brake cable housing': 'Gaine de câble de frein',
    'Runs from each brake lever to its caliper — front and rear are routed separately, drawn here along the top tube and fork.': 'Va de chaque levier de frein à son étrier : l’avant et l’arrière sont acheminés séparément, ici le long du tube horizontal et de la fourche.',

    'Gearing — single-speed': 'Vitesses : monovitesse',
    'Rear cog': 'Pignon arrière',
    'One gear, always engaged — no derailleur, cable, or adjustment needed.': 'Une seule vitesse, toujours enclenchée : ni dérailleur, ni câble, ni réglage.',
    'Lockring': 'Bague de blocage',
    'Threads onto the hub to hold the single cog in place — the same idea a full cassette uses, just for one gear instead of many.': 'Se visse sur le moyeu pour retenir le pignon unique : c’est le même principe que pour une cassette complète, mais pour une seule vitesse au lieu de plusieurs.',
    'Chain tensioner': 'Tendeur de chaîne',
    'With no derailleur to take up slack, something has to keep the chain taut — a small spring-loaded wheel, or horizontal dropouts you slide by hand.': 'Sans dérailleur pour absorber le jeu, il faut autre chose pour garder la chaîne tendue : un petit galet à ressort, ou des pattes horizontales qu’on fait glisser à la main.',

    'Gearing — mechanical': 'Vitesses : mécanique',
    'Derailleur hanger': 'Support de dérailleur',
    "A small, deliberately weak bracket bolting the derailleur to the frame — it's meant to bend or snap in a crash instead of the frame itself, and shops keep spares for exactly this reason.": 'Une petite pièce volontairement fragile qui fixe le dérailleur au cadre : elle est conçue pour plier ou casser lors d’une chute, plutôt que le cadre lui-même, et les ateliers en gardent en réserve pour cette raison même.',
    'Cassette': 'Cassette',
    'A stack of different-sized cogs. Shifting moves the chain sideways between them to change gear.': 'Un empilement de pignons de tailles différentes. Changer de vitesse déplace la chaîne latéralement de l’un à l’autre.',
    'Cassette lockring': 'Bague de blocage de la cassette',
    'Threads onto the freehub body to clamp the whole stack of cogs in place.': 'Se visse sur le corps de roue libre pour retenir tout l’empilement de pignons.',
    'Derailleur body': 'Corps du dérailleur',
    'The cable-pulled arm bolted to the frame that swings the chain sideways onto a bigger or smaller cog.': 'Le bras tiré par un câble, fixé au cadre, qui déplace la chaîne latéralement vers un pignon plus gros ou plus petit.',
    'Jockey wheels & cage': 'Galets et chape',
    'Two small pulleys that guide the chain and take up slack — the metal plate holding them is the "cage" shops refer to.': 'Deux petites poulies qui guident la chaîne et absorbent le jeu : la plaque métallique qui les tient est la « chape » dont parlent les ateliers.',
    'Gear cable housing': 'Gaine de câble de dérailleur',
    'Carries the pull from your shift lever to the derailleur — the part that stretches over time and needs the odd adjustment.': 'Transmet la traction de votre manette au dérailleur : c’est la pièce qui s’étire avec le temps et demande un réglage de temps à autre.',

    'Gearing — cassette range': 'Vitesses : plage de la cassette',
    'A small, deliberately weak bracket bolting the derailleur to the frame — it bends or snaps in a crash instead of the frame itself.': 'Une petite pièce volontairement fragile qui fixe le dérailleur au cadre : elle plie ou casse lors d’une chute, plutôt que le cadre lui-même.',
    'Cassette — narrow range (11–28T)': 'Cassette : plage étroite (11–28 dents)',
    'Gears sit close together for smooth, evenly-spaced pedaling on flatter roads — but no easy bail-out gear for steep climbs.': 'Les vitesses sont rapprochées pour un pédalage fluide et régulier sur les routes plus plates, mais sans petite vitesse de secours pour les côtes raides.',
    'Cassette — wide range (10–50T)': 'Cassette : plage large (10–50 dents)',
    'Trades smooth spacing for a much easier bail-out gear — the difference between grinding and walking on a loaded climb.': 'Elle sacrifie la régularité de l’espacement pour une petite vitesse de secours beaucoup plus facile : la différence entre peiner et marcher dans une côte avec une charge.',
    'Threads onto the freehub body to clamp the whole stack of cogs in place, whichever range it spans.': 'Se visse sur le corps de roue libre pour retenir tout l’empilement de pignons, quelle que soit la plage couverte.',
    'Rear derailleur — short cage': 'Dérailleur arrière : chape courte',
    "A narrow cassette needs less chain wrap, so the derailleur's cage stays short.": 'Une cassette étroite demande moins de capacité d’enroulement de la chaîne : la chape du dérailleur reste donc courte.',
    'Rear derailleur — long cage': 'Dérailleur arrière : chape longue',
    'A wide-range cassette needs far more chain wrap to take up slack, so the cage stretches noticeably longer to reach the biggest cog.': 'Une cassette à large plage demande beaucoup plus de capacité d’enroulement pour absorber le jeu : la chape s’allonge donc nettement pour atteindre le plus gros pignon.',
    'Jockey wheels': 'Galets',
    'The two pulleys inside the cage — notice how much farther apart they sit once the cage lengthens for the wide cassette.': 'Les deux poulies à l’intérieur de la chape : remarquez à quel point elles s’éloignent l’une de l’autre quand la chape s’allonge pour la cassette large.',
    'Carries the pull from your shift lever to the derailleur, whichever range the cassette is built for.': 'Transmet la traction de votre manette au dérailleur, quelle que soit la plage pour laquelle la cassette est conçue.',

    'Gearing — electronic': 'Vitesses : électronique',
    'Same job as on a mechanical bike — a stack of cogs the chain moves between — usually with more speeds (11–13) on electronic groupsets.': 'Même rôle que sur un vélo mécanique (un empilement de pignons entre lesquels la chaîne se déplace), généralement avec plus de vitesses (11 à 13) sur les groupes électroniques.',
    'Electronic derailleur': 'Dérailleur électronique',
    'A small motor built into the derailleur body moves the chain instead of a cable pulling it — shifts stay precise and never need cable-tension adjustment.': 'Un petit moteur intégré au corps du dérailleur déplace la chaîne au lieu d’un câble qui la tire : les changements de vitesse restent précis et n’exigent jamais de réglage de la tension du câble.',
    'Same job as on a mechanical derailleur — guiding the chain and taking up slack — just driven by the motor above them.': 'Même rôle que sur un dérailleur mécanique (guider la chaîne et absorber le jeu), mais entraînés par le moteur situé au-dessus.',
    'Battery pack': 'Batterie',
    "Powers the derailleur's motor (and front derailleur, if fitted) — typically good for hundreds of kilometres per charge.": 'Alimente le moteur du dérailleur (et le dérailleur avant, s’il y en a un) : généralement bonne pour des centaines de kilomètres par charge.',
    'Wireless shift signal': 'Signal de changement de vitesse sans fil',
    "A button tap sends a signal — wireless on some brands, a thin wire on others — to the derailleur's motor instead of pulling a cable.": 'Un appui sur un bouton envoie un signal (sans fil chez certaines marques, par un mince fil chez d’autres) au moteur du dérailleur, au lieu de tirer un câble.',

    'Why this matters': 'Pourquoi c’est important',
    'Understanding your bike is how you avoid overpaying for the wrong thing.': 'Comprendre votre vélo, c’est éviter de payer trop cher pour la mauvaise chose.',
    "A shop can always describe a bike in terms that sound impressive. Knowing what each part actually does is how you tell an upgrade worth paying for from one that isn't.": 'Un magasin peut toujours décrire un vélo avec des mots impressionnants. Savoir ce que fait réellement chaque pièce, c’est ce qui permet de distinguer une amélioration qui vaut son prix d’une autre qui ne le vaut pas.',
    'Same words, no surprises': 'Les mêmes mots, sans surprise',
    '"Cassette," "derailleur cage," "electronic shifting" stop being sales jargon and start being parts you can point at.': '« Cassette », « chape de dérailleur », « changement de vitesses électronique » cessent d’être du jargon de vente et deviennent des pièces que vous pouvez désigner.',
    'Spot the real trade-offs': 'Repérez les vrais compromis',
    'Wider cassette, longer derailleur cage, heavier bike — every upgrade trades something for something else. Now you can see what.': 'Cassette plus large, chape de dérailleur plus longue, vélo plus lourd : chaque amélioration échange quelque chose contre autre chose. Vous pouvez maintenant voir quoi.',
    'Ask better questions': 'Posez de meilleures questions',
    "Walk into any shop, or open any quiz on this site, already knowing what you're choosing between.": 'Entrez dans n’importe quel magasin, ou ouvrez n’importe quel questionnaire de ce site, en sachant déjà entre quoi vous choisissez.',

    "Labeled diagram of a bicycle's parts: saddle, seatpost, top tube, down tube, head tube, seat tube, chain stays, fork, cassette, derailleurs, bottom bracket, crankset, chain, spokes, hub, tires, and cable routing":
      'Schéma annoté des pièces d’un vélo : selle, tige de selle, tube horizontal, tube diagonal, tube de direction, tube de selle, bases, fourche, cassette, dérailleurs, jeu de pédalier, pédalier, chaîne, rayons, moyeu, pneus et acheminement des câbles',
    'Drivetrain type': 'Type de transmission',
    'Blueprint diagram of a bicycle, animating as its parts assemble into place': 'Schéma technique d’un vélo, animé pendant que ses pièces se mettent en place',
  });
})();
