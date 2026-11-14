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
    'Understand my ride': 'Analyser ma balade',
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
    'not sure, please check': 'incertain, veuillez vérifier',
    'from your words': 'tiré de vos mots',
    'Nothing specific found yet: the quiz will ask everything.': 'Rien de précis trouvé pour l’instant : le questionnaire posera toutes les questions.',
    'Here is what we understood': 'Voici ce que nous avons compris',
    'Remove this answer': 'Retirer cette réponse',
    'Still needed (we do not guess): {list}': 'Encore nécessaire (nous ne devinons pas) : {list}',
    'That is everything the quiz needs.': 'C’est tout ce dont le questionnaire a besoin.',
    'Continue to the quiz': 'Continuer vers le questionnaire',
    'See my matches': 'Voir mes résultats',
    'Cyclocamping': 'Cyclocamping',
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
