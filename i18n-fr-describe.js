// French (Québec) for the "Describe your ride" preview on the home page (describe.js). English text is the key.
// AI-written, not reviewed by a native speaker: see i18n-glossary.md. The labels repeat the quizzes' own wording.
(function () {
  const I = window.I18N;
  if (!I) return;
  const add = o => Object.assign(I.exact, o);
  add({
    // the screen
    'Preview': 'Aperçu',
    'Describe your ride': 'Décrivez votre balade',
    'Not sure where to start? Just tell us about your ride.': 'Vous ne savez pas par où commencer ? Racontez-nous simplement votre balade.',
    'Write a sentence or two, in English or French. We turn it into the quiz answers, show you exactly what we understood, and let you change anything before a single bike is scored.':
      'Écrivez une ou deux phrases, en français ou en anglais. Nous les transformons en réponses au questionnaire, vous montrons exactement ce que nous avons compris, et vous laissons tout modifier avant qu’un seul vélo soit évalué.',
    'Write a sentence or two, in English or French. We pick the right quiz, fill in what you said, and add your extra wishes (disc brakes, a weight limit, a brand) to the matching. Then you go straight on, and you can change anything on the way.':
      'Écrivez une ou deux phrases, en français ou en anglais. Nous choisissons le bon questionnaire, remplissons ce que vous avez dit et ajoutons vos souhaits supplémentaires (freins à disque, limite de poids, marque) à l’évaluation. Vous poursuivez ensuite directement, et pouvez tout modifier en chemin.',
    'This is a preview. It reads your text on this device with simple rules: nothing you type is sent or stored. A language model could replace that step later, and you would still be able to confirm and change every answer before any bike is scored.':
      'Ceci est un aperçu. Il lit votre texte sur cet appareil avec des règles simples : rien de ce que vous écrivez n’est envoyé ni conservé. Un modèle de langage pourrait remplacer cette étape plus tard, et vous pourriez quand même confirmer et modifier chaque réponse avant qu’un seul vélo soit évalué.',
    // the extra criteria (also in i18n-fr-quiz.js, which the home page does not load)
    'Must have': 'Indispensable', 'Avoid': 'À éviter',
    'Disc brakes': 'Freins à disque', 'Fenders included': 'Garde-boue inclus', 'Rack mounts': 'Fixations de porte-bagages',
    'Lighter than {n} kg': 'Moins de {n} kg', '{m} frame': 'Cadre en {m}', 'Canadian brand': 'Marque canadienne',
    'Electronic shifting': 'Changement de vitesses électronique', 'Brand: {x}': 'Marque : {x}', 'Colour: {c}': 'Couleur : {c}',
    'Folds': 'Pliable', 'Front suspension': 'Suspension avant', 'Belt drive or internal gears': 'Courroie ou vitesses internes',
    'steel': 'acier', 'carbon': 'carbone', 'aluminum': 'aluminium', 'titanium': 'titane',
    'Black': 'Noir', 'Silver': 'Argent', 'Blue': 'Bleu', 'Red': 'Rouge', 'Green': 'Vert', 'Orange': 'Orange', 'White': 'Blanc', 'Yellow': 'Jaune', 'Grey': 'Gris', 'Charcoal': 'Anthracite', 'Teal': 'Sarcelle', 'Pink': 'Rose', 'Purple': 'Violet', 'Brown': 'Brun',
    'Find my bike': 'Trouver mon vélo',
    'Ctrl+Enter also works': 'Ctrl+Entrée fonctionne aussi',
    'Choosing the right quiz': 'Choix du bon questionnaire',
    'Filling in your answers': 'Remplissage de vos réponses',
    'Adding your extra wishes': 'Ajout de vos souhaits supplémentaires',
    'Thanks. I could not tell which kind of bike this is for, so tell me and I will carry your words and wishes over.':
      'Merci. Je n’ai pas pu déterminer pour quel type de vélo c’est : dites-le-moi et je reporterai vos mots et vos souhaits.',
    'What will you mostly use the bike for? One quick question, and your words and wishes carry over.': 'À quoi servira surtout le vélo ? Une seule question rapide, et vos mots et vos souhaits sont conservés.',
    'Where will you mostly ride?': 'Où roulerez-vous surtout ?',
    'Getting to work, school or running errands': 'Aller au travail, à l’école ou faire des courses',
    'Casual or weekend rides': 'Balades tranquilles ou de fin de semaine',
    'Trips with camping gear': 'Voyages avec équipement de camping',
    'Trails and off-road riding': 'Sentiers et pratique hors route',
    'Racing, triathlon or hard training': 'Course, triathlon ou entraînement intense',
    'A bike for a child': 'Un vélo pour un enfant',
    'Mostly paved paths and roads, flat to rolling': 'Surtout des pistes et routes asphaltées, du plat au légèrement vallonné',
    'A mix of road and gravel': 'Un mélange de route et de gravier',
    'Dirt trails and rough ground': 'Sentiers de terre et terrain accidenté',
    // casual riding quiz
    'Casual riding': 'Balade',
    'How far from home do you usually ride?': 'Jusqu’où roulez-vous habituellement depuis chez vous ?',
    'How should the ride feel?': 'Comment la sortie devrait-elle se sentir ?',
    'Comfortable and easy: upright, simple controls': 'Confortable et facile : position droite, commandes simples',
    'A bit of both': 'Un peu des deux',
    'Quicker and farther: leaning forward, more efficient': 'Plus rapide et plus loin : penché vers l’avant, plus efficace',
    'Paved paths and roads': 'Pistes et routes asphaltées',
    'Packed gravel and rail trails': 'Gravier compacté et anciennes voies ferrées',
    'You gave a ride length. This quiz asks for the farthest point from home, one way (half of an out-and-back ride): please set it yourself.':
      'Vous avez indiqué la longueur d’une sortie. Ce questionnaire demande le point le plus éloigné de chez vous, à l’aller (la moitié d’une sortie aller-retour) : veuillez le régler vous-même.',
    'Tell me a little about your ride first.': 'Parlez-moi d’abord un peu de votre balade.',
    'How important is this?': 'Quelle importance cela a-t-il ?',
    'Nice to have': 'Souhaitable',
    'Your extra wishes are added to the matching. Where a bike’s record does not list something, we say “not listed” instead of guessing.':
      'Vos souhaits supplémentaires sont ajoutés à l’évaluation. Quand la fiche d’un vélo n’indique pas quelque chose, nous écrivons « non indiqué » plutôt que de deviner.',
    'We have no data on these for {name} bikes, so they cannot change the ranking: {list}.':
      'Nous n’avons pas de données là-dessus pour les vélos de type {name}, ils ne peuvent donc pas changer le classement : {list}.',
    'Not used (we could not turn these into criteria): ': 'Non utilisé (nous n’avons pas pu en faire des critères) : ',
    'Show my matches': 'Voir mes vélos',
    'Continue: I will ask only what is missing': 'Continuer : je ne poserai que les questions manquantes',
    'Taking you to your matches in {n}…': 'Nous vous menons à vos résultats dans {n}…',
    'Edit first': 'Modifier d’abord',
    'Converted {a} to about {b} km.': '{a} converti en environ {b} km.',
    'Try an example:': 'Essayer un exemple :',
    'Overnight trip': 'Sortie d’une nuit',
    'Kid’s first bike': 'Premier vélo d’enfant',
    'Winter commute': 'Trajet d’hiver',
    'This is a preview. It reads your text on this device with simple rules: nothing you type is sent or stored. A language model could replace that step later, and you would still confirm every answer before any bike is scored.':
      'Ceci est un aperçu. Il lit votre texte sur cet appareil avec des règles simples : rien de ce que vous écrivez n’est envoyé ni conservé. Un modèle de langage pourrait remplacer cette étape plus tard, et vous confirmeriez quand même chaque réponse avant qu’un seul vélo soit évalué.',
    'We could not tell which kind of bike this is for. Add a few words about how you will ride it, or pick a quiz below.':
      'Nous n’avons pas pu déterminer pour quel type de vélo c’est. Ajoutez quelques mots sur la façon dont vous roulerez, ou choisissez un questionnaire plus bas.',
    'We could not tell which kind of bike this is for.': 'Nous n’avons pas pu déterminer pour quel type de vélo c’est.',
    'Quiz': 'Questionnaire',
    'This looks like:': 'Cela ressemble à :',
    'confident': 'assez certain',
    'fairly sure': 'assez sûr',
    'closest fit, not certain: change it if it is wrong': 'meilleur choix possible, sans certitude : changez-le si ce n’est pas le bon',
    'not sure, please check': 'incertain, veuillez vérifier',
    'from your words': 'tiré de vos mots',
    'Nothing specific found yet: the quiz will ask everything.': 'Rien de précis trouvé pour l’instant : le questionnaire posera toutes les questions.',
    'Here is what we understood': 'Voici ce que nous avons compris',
    'Remove this answer': 'Retirer cette réponse',
    'Still needed (we do not guess): {list}': 'Encore nécessaire (nous ne devinons pas) : {list}',
    'That is everything the quiz needs.': 'C’est tout ce dont le questionnaire a besoin.',
    'Continue to the quiz': 'Continuer vers le questionnaire',
    'See my matches': 'Voir mes résultats',
    'Bikepacking / bike touring': 'Cyclocamping / cyclotourisme',
    'Want the extra stopping power of disc brakes?': 'Voulez-vous la puissance de freinage supplémentaire des freins à disque ?',
    'Yes, disc brakes': 'Oui, des freins à disque',
    'How much do flat tires worry you out there?': 'À quel point les crevaisons vous inquiètent-elles ?',
    'A lot — give me tough, reliable tires': 'Beaucoup : donnez-moi des pneus robustes et fiables',
    // notes
    'Your budget of {a} is outside this quiz’s slider, so it was set to {b}.': 'Votre budget de {a} est hors de la plage de ce questionnaire; il a été fixé à {b}.',
    'A height of {a} cm is outside this quiz’s range ({b}–{c} cm).': 'Une taille de {a} cm est hors de la plage de ce questionnaire ({b}–{c} cm).',
    'A distance of {a} km is outside this quiz’s range.': 'Une distance de {a} km est hors de la plage de ce questionnaire.',
    'You mentioned an age. We do not convert ages to heights, because children of the same age differ a lot: please enter their height in cm.':
      'Vous avez mentionné un âge. Nous ne convertissons pas l’âge en taille, car des enfants du même âge diffèrent beaucoup : veuillez indiquer sa taille en cm.',
    'The quiz asks for the one-way distance: please check the number we took.': 'Le questionnaire demande la distance à l’aller seulement : vérifiez le nombre que nous avons retenu.',
    // kids
    "Child's height": 'Taille de l’enfant', 'Budget': 'Budget', 'Riding experience': 'Expérience à vélo',
    'Never ridden': 'N’a jamais fait de vélo', 'Balance bike': 'Draisienne', 'Training wheels': 'Roues stabilisatrices', 'Confident, no training wheels': 'À l’aise, sans roues stabilisatrices',
    'Where they ride': 'Où votre enfant roule', 'Pavement / driveway': 'Pavé / entrée de garage', 'Road and gravel': 'Route et gravier', 'Neighborhood paths': 'Pistes de quartier',
    'Trail, road and gravel': 'Sentiers, route et gravier', 'Light dirt trails': 'Sentiers de terre légers',
    'Brake preference': 'Préférence de freins', 'Coaster': 'Rétropédalage', 'Hand brakes': 'Freins à main',
    'Brand origin': 'Origine de la marque', 'Prefer Canadian': 'Préférer les marques canadiennes',
    // commute
    'Commute distance (one-way)': 'Distance du trajet (aller simple)', 'Your height': 'Votre taille',
    "What's your route like?": 'Comment est votre parcours ?', 'City streets & bike lanes': 'Rues de la ville et pistes cyclables', 'Mixed paved & gravel paths': 'Chemins mixtes, pavés et en gravier',
    'Long, flat roads': 'Longues routes plates', 'Hilly — could use assist': 'Vallonné : une assistance serait utile',
    'What do you need to carry?': 'Que devez-vous transporter ?', 'Just me': 'Seulement moi', 'Backpack or light bag': 'Sac à dos ou sac léger', 'Rack or panniers': 'Porte-bagages ou sacoches', 'Heavy loads (groceries, gear)': 'Lourdes charges (épicerie, équipement)',
    'Power preference': 'Préférence de motorisation', 'Pedal only': 'Pédalage seulement', 'Open to e-assist': 'Ouvert à l’assistance électrique', 'Want e-assist': 'Je veux une assistance électrique',
    'Will you ride in the rain or snow?': 'Roulerez-vous sous la pluie ou la neige ?', 'Rarely': 'Rarement', 'Sometimes': 'Parfois', 'Rain or shine': 'Beau temps, mauvais temps', 'Through winter: snow, ice and road salt': 'Tout l’hiver : neige, glace et sel de voirie',
    'Where will you keep it?': 'Où le rangerez-vous ?', 'Garage or shed': 'Garage ou remise', 'Apartment or office': 'Appartement ou bureau', 'Stairs or transit': 'Escaliers ou transport en commun',
    'How experienced a cyclist are you?': 'Quelle est votre expérience à vélo ?', 'New to regular riding': 'Nouveau dans la pratique régulière du vélo', 'Ride sometimes': 'Je roule à l’occasion', 'Very experienced': 'Très expérimenté',
    // cyclocamping
    "What's the terrain?": 'Quel est le terrain ?', 'Fully paved': 'Entièrement asphalté', 'Dedicated gravel': 'Gravier seulement', 'Mixed paved & gravel': 'Mixte, asphalte et gravier', 'Rough trail / singletrack': 'Sentier accidenté / sentier étroit',
    'How long is the trip?': 'Quelle est la durée de la sortie ?', 'Overnight or a weekend': 'Une nuit ou une fin de semaine', 'About a week': 'Environ une semaine', 'Several weeks': 'Plusieurs semaines', 'Months / continent-crossing': 'Des mois / traversée d’un continent',
    "What's the goal of the trip?": 'Quel est l’objectif de la sortie ?', 'Comfortable multi-week touring': 'Voyage confortable de plusieurs semaines', 'A proper adventure ride': 'Une vraie sortie d’aventure', 'Self-supported ultra-racing': 'Ultra-course en autonomie',
    'How experienced a bikepacker are you?': 'Quelle est votre expérience en cyclocamping ?', 'First trip': 'Première sortie', 'Done a few trips': 'Quelques sorties à mon actif',
    'How do you want to carry your gear?': 'Comment voulez-vous transporter votre équipement ?', 'Frame bag, seat pack, bar roll': 'Sac de cadre, sac de selle, rouleau de guidon', 'Rack and panniers': 'Porte-bagages et sacoches',
    'Frame material': 'Matériau du cadre', 'Aluminum': 'Aluminium', 'Steel': 'Acier', 'Titanium': 'Titane', 'Carbon': 'Carbone',
    // mountain
    'What kind of riding do you do most?': 'Quel type de vélo pratiquez-vous le plus ?', 'Cross-country': 'Cross-country', 'Trail': 'Trail', 'Enduro': 'Enduro', 'Downhill': 'Descente', 'Dirt jump / park': 'Saut de terre / parc',
    'How experienced a mountain biker are you?': 'Quelle est votre expérience en vélo de montagne ?', 'New to it': 'Je débute',
    'Hardtail or full suspension?': 'Semi-rigide ou double suspension ?', 'Hardtail': 'Semi-rigide', 'Full suspension': 'Double suspension',
    'Want a dropper post?': 'Voulez-vous une tige de selle télescopique ?', 'Yes, want it': 'Oui, je le veux', "Don't need it": 'Pas nécessaire',
    // racing
    'What are you training or buying for?': 'Pour quoi vous entraînez-vous ou achetez-vous ?', 'Road racing': 'Course sur route', 'Triathlon or Ironman': 'Triathlon ou Ironman', 'Audax / randonneuring': 'Audax / randonnée de longue distance', 'Ultra-distance racing': 'Course d’ultra-distance',
    'What matters more for your racing?': 'Qu’est-ce qui compte le plus pour votre pratique de la course ?', 'Aero': 'Aérodynamique', 'Climbing': 'Grimpeur', 'All-rounder': 'Polyvalent',
    'Shifting preference': 'Préférence de changement de vitesses', 'Electronic (Di2 / AXS)': 'Électronique (Di2 / AXS)', 'Mechanical is fine': 'Mécanique me convient',
    'Dynamo lighting or overnight support?': 'Éclairage par dynamo ou équipement pour la nuit ?', 'Yes, I ride through the night': 'Oui, je roule toute la nuit', 'No, daytime only': 'Non, seulement le jour',
  });
})();
