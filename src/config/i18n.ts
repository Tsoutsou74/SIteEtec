// ============================================================
//  E-TEC — Traductions FR / EN / MG
//  src/config/i18n.ts   (fichier .ts pur — pas de JSX ici)
// ============================================================

export type Locale = 'fr' | 'en' | 'mg';

export const translations = {

  topbar: {
    phone:  { fr: '+261 22 02 123 45',             en: '+261 22 02 123 45',               mg: '+261 22 02 123 45' },
    email:  { fr: 'contact@univ-fianarantsoa.org', en: 'contact@univ-fianarantsoa.org',  mg: 'contact@univ-fianarantsoa.org' },
    theme:  { fr: 'Changer de thème',              en: 'Toggle theme',                   mg: 'Ovay loko' },
  },

  navbar: {
    home:       { fr: 'Accueil',        en: 'Home',        mg: 'Fandraisana' },
    university: { fr: 'Université',     en: 'University',  mg: 'Oniversite' },
    training:   { fr: 'Formations',     en: 'Programs',    mg: 'Fiofanana' },
    admission:  { fr: 'Admissions',     en: 'Admissions',  mg: 'Fidirana' },
    research:   { fr: 'Recherche',      en: 'Research',    mg: 'Fikarohana' },
    news:       { fr: 'Actualités',     en: 'News',        mg: 'Vaovao' },
    espace:     { fr: 'E-espace',       en: 'E-space',     mg: 'E-toerana' },
    openMenu:   { fr: 'Ouvrir le menu', en: 'Open menu',   mg: 'Sokafy ny menio' },
  },

  hero: {
    title1:   { fr: "Université d'excellence",  en: 'A university of excellence', mg: 'Oniversite ambony' },
    title2:   { fr: "et d'innovation",          en: 'and innovation',             mg: 'sy fanovana' },
    subtitle: { fr: "Découvrez un environnement d'apprentissage moderne conçu pour propulser vos ambitions professionnelles à Madagascar.", en: 'Discover a modern learning environment designed to propel your professional ambitions in Madagascar.', mg: 'Ahitao tontolo fampianarana maoderina natao hanentana ny fanirinao matihanina eto Madagasikara.' },
    cta:      { fr: 'Inscription', en: 'Register', mg: 'Misoratra' },
    programs: { fr: 'Formations',  en: 'Programs',  mg: 'Fiofanana' },
  },

  stats: {
    students:  { fr: 'Etudiants',   en: 'Students',   mg: 'Mpianatra' },
    faculties: { fr: 'Facultes',    en: 'Faculties',  mg: 'Fakiolte' },
    programs:  { fr: 'Formations',  en: 'Programs',   mg: 'Fiofanana' },
    teachers:  { fr: 'Enseignants', en: 'Teachers',   mg: 'Mpampianatra' },
  },

  about: {
    sectionLabel: { fr: 'A-propos',          en: 'About',           mg: 'Momba antsika' },
    whoWeAre:     { fr: 'Qui sommes-nous ?', en: 'Who are we?',     mg: 'Iza isika ?' },
    title:        { fr: "L'excellence academique",            en: 'Academic excellence',              mg: 'Fahatsaran-kevitra ara-akademika' },
    titleSpan:    { fr: 'au coeur de Faravohitra',            en: 'at the heart of Faravohitra',      mg: "ao amin'ny Faravohitra" },
    desc:         { fr: "Fondee avec l'ambition de former l'elite technologique et manageriale de Madagascar, l'Universite E-TEC s'impose comme un pole d'innovation majeur.", en: "Founded with the ambition of training Madagascar's technological and managerial elite, E-TEC University stands as a major innovation hub.", mg: "Naorina tamin'ny tanjona hamolavolana ny sarambaben'ny tekinolojia sy fitantanana eto Madagasikara, ny Oniversite E-TEC dia lasa ivon'ny fanovana lehibe." },
    keyFigures:   { fr: 'Chiffres Cles',     en: 'Key Figures',     mg: 'Isa Lehibe' },
    insertionPro: { fr: 'Insertion Pro',     en: 'Job Placement',   mg: 'Fidirana asa' },
    partners:     { fr: 'Partenaires',       en: 'Partners',        mg: 'Mpiara-miasa' },
    missionTitle: { fr: 'Notre Mission',     en: 'Our Mission',     mg: 'Iraka' },
    missionDesc:  { fr: "Propulser l'employabilite des jeunes malgaches par le biais de formations professionnalisantes.", en: 'Boost the employability of Malagasy youth through professional training.', mg: "Hampiroborobo ny fahafahana mahazo asa ho an'ny tanora Malagasy amin'ny alalan'ny fiofanana matihanina." },
    visionTitle:  { fr: 'Notre Vision',      en: 'Our Vision',      mg: 'Fahitantsika' },
    visionDesc:   { fr: "Devenir l'etablissement de reference a Madagascar pour la formation des cadres et ingenieurs de demain.", en: "Become Madagascar's reference institution for training tomorrow's executives and engineers.", mg: "Ho lasa andrim-panjakana fototra eto Madagasikara amin'ny famofanana ny mpitantana sy injeniera ho avy." },
    valuesTitle:  { fr: 'Les valeurs qui nous guident', en: 'The values that guide us', mg: 'Ny soatoavina mitarika antsika' },
    valuesDesc:   { fr: "Chaque jour, notre communaute academique s'appuie sur quatre piliers immuables.", en: 'Every day, our academic community relies on four unwavering pillars.', mg: "Isan'andro, ny fiaraha-monina akademika dia miandraikitra andry efatra tsy miova." },
    val1Title: { fr: 'Excellence',  en: 'Excellence',  mg: 'Tombontsaina' },
    val1Desc:  { fr: 'Exiger le meilleur de nous-memes pour garantir des diplomes reconnus et valorises.', en: 'Demanding the best of ourselves to guarantee recognised and valued degrees.', mg: "Mitaky ny tsara indrindra amintsika mba hiantohana diplaoma azo ekena sy tsara lenta." },
    val2Title: { fr: 'Integrite',   en: 'Integrity',   mg: 'Fahamarinana' },
    val2Desc:  { fr: 'Cultiver un environnement ethique, transparent et respectueux des merites de chacun.', en: 'Cultivating an ethical, transparent environment that respects individual merits.', mg: "Mamorona tontolo ara-pitondrantena, mazava ary manaja ny tombam-pahaizana isam-batan'olona." },
    val3Title: { fr: 'Engagement',  en: 'Commitment',  mg: 'Fanoloran-tena' },
    val3Desc:  { fr: "Accompagner chaque etudiant individuellement vers la reussite de son projet de vie.", en: "Individually supporting each student towards the success of their life project.", mg: "Manatrika mpianatra tsirairay manokana ho amin'ny fahombiazana amin'ny tetik'asa fiainana." },
    val4Title: { fr: 'Innovation',  en: 'Innovation',  mg: 'Fanovana' },
    val4Desc:  { fr: "Adapter continuellement nos infrastructures et technologies aux exigences de demain.", en: "Continuously adapting our infrastructure and technologies to tomorrow's requirements.", mg: "Manadio hatrany ny fotodrafitrasa sy teknolojia mba hifanaraka amin'ny filana ho avy." },
  },

  news: {
    sectionLabel: { fr: 'Actualites & Media', en: 'News & Media',       mg: 'Vaovao & Media' },
    title:        { fr: 'Suivez la vie de',   en: 'Follow the life of', mg: "Araho ny fiainan'" },
    titleSpan:    { fr: 'notre Universite',   en: 'our University',     mg: 'ny Oniversitentsika' },
    desc:         { fr: "Restez informe des derniers projets, des innovations pedagogiques et des evenements de la communaute E-TEC.", en: "Stay informed of the latest projects, educational innovations and events of the E-TEC community.", mg: "Maharaha vaovao momba ny tetikasa farany, ny fanovana pedagogika ary ny hetsika amin'ny fiaraha-monina E-TEC." },
    readArticle:  { fr: "Lire l'article",     en: 'Read article',       mg: 'Vakio ny lahatsoratra' },
    seeMore:      { fr: "Voir plus d'actualites", en: 'See more news',  mg: 'Jereo vaovao bebe kokoa' },
  },

  filiers: {
    sectionLabel:    { fr: "Nos Formations d'Avenir", en: 'Our Future Programs', mg: 'Ny Fiofanana ho Avy' },
    title:           { fr: 'Decouvrez nos',           en: 'Discover our',        mg: 'Hitantarao ny' },
    titleSpan:       { fr: 'Filieres Majeures',       en: 'Major Programs',      mg: 'Lalana Lehibe' },
    desc:            { fr: "E-TEC propose des cursus d'excellence pour repondre aux besoins d'innovation des entreprises a Madagascar et a l'international.", en: "E-TEC offers excellence curricula to meet the innovation needs of companies in Madagascar and internationally.", mg: "Ny E-TEC dia manolotra fandaharam-pianarana ambony natao hampifanaraka ny filana fanovana ny orinasa eto Madagasikara sy iraisam-pirenena." },
    specializations: { fr: 'Specialisations :', en: 'Specializations:', mg: 'Fahaizana manokana :' },
    details:         { fr: 'Details',            en: 'Details',          mg: 'Antsipiriany' },
    duration3:       { fr: 'Licence Pro (3 ans)', en: "Bachelor's (3 years)", mg: 'Lisaonsy Pro (3 taona)' },
    duration5:       { fr: 'Licence (3 ans) / Master (5 ans)', en: 'Bachelor (3 yrs) / Master (5 yrs)', mg: 'Lisaonsy (3 taona) / Masteira (5 taona)' },
    f1Title: { fr: 'Administration et Gestion',                en: 'Business Administration',                       mg: 'Fitantanana sy Fandraharahana' },
    f1opt1:  { fr: 'Gestion des Entreprises',                  en: 'Business Management',                           mg: 'Fitantanana Orinasa' },
    f1opt2:  { fr: 'Ressources Humaines',                      en: 'Human Resources',                               mg: "Loharanon'olombelona" },
    f1opt3:  { fr: 'Marketing & Commerce',                     en: 'Marketing & Commerce',                          mg: 'Marketing & Varotra' },
    f1opt4:  { fr: 'Comptabilite et Finance',                  en: 'Accounting & Finance',                          mg: 'Kaonty sy Fitantanam-bola' },
    f2Title: { fr: 'Genie Logiciel et Administration Reseaux', en: 'Software Engineering & Network Administration',  mg: 'Injeniera Logisiel sy Tambajotra' },
    f2opt1:  { fr: 'Developpement Full-Stack',                 en: 'Full-Stack Development',                        mg: 'Fampandrosoana Full-Stack' },
    f2opt2:  { fr: 'Architecture Reseaux & Cloud',             en: 'Network & Cloud Architecture',                  mg: 'Fananganana Tambajotra & Cloud' },
    f2opt3:  { fr: 'Cybersecurite',                            en: 'Cybersecurity',                                 mg: 'Fiarovana nomerika' },
    f2opt4:  { fr: 'Administration Systemes',                  en: 'Systems Administration',                        mg: 'Fitantanana Rafitra' },
    f3Title: { fr: 'Batiment et Travaux Publics',              en: 'Civil Engineering & Construction',              mg: 'Rafitra sy Asa Tsotra' },
    f3opt1:  { fr: 'Genie Civil & Structures',                 en: 'Civil Engineering & Structures',                mg: 'Injeniera Sivily & Rafitra' },
    f3opt2:  { fr: 'Conduite de Travaux',                      en: 'Construction Management',                       mg: 'Fitantanana Asa' },
    f3opt3:  { fr: 'Topographie & Dessin BTP',                 en: 'Surveying & BTP Drawing',                       mg: 'Topografia & Sary BTP' },
    f3opt4:  { fr: 'Infrastructures Durables',                 en: 'Sustainable Infrastructure',                    mg: 'Fotodrafitrasa maharitra' },
    f4Title: { fr: 'Electromecanique et Industriels',          en: 'Electromechanics & Industrial Systems',         mg: 'Elektromekanika sy Indostria' },
    f4opt1:  { fr: 'Automatismes Industriels',                 en: 'Industrial Automation',                         mg: 'Otomaika Indostrialy' },
    f4opt2:  { fr: 'Maintenance Electromecanique',             en: 'Electromechanical Maintenance',                 mg: 'Fikojakojana Elektromekanika' },
    f4opt3:  { fr: 'Robotique & Systemes Integres',            en: 'Robotics & Integrated Systems',                 mg: 'Robotika & Rafitra Iray' },
    f4opt4:  { fr: 'Genie Energetique',                        en: 'Energy Engineering',                            mg: 'Injeniera Angovo' },
  },

  admission: {
    sectionLabel: { fr: 'Inscriptions ouvertes',        en: 'Applications open',        mg: 'Misokatra ny fandraisan-kaonty' },
    title:        { fr: 'Rejoignez',                    en: 'Join',                     mg: "Midira ao amin'" },
    titleSpan:    { fr: 'E-TEC University',             en: 'E-TEC University',         mg: 'E-TEC University' },
    desc:         { fr: "Prenez en main votre avenir professionnel. Remplissez votre demande d'admission en quelques clics.", en: 'Take charge of your professional future. Fill in your admission application in a few clicks.', mg: "Andraso ny ho avinkao matihanina. Fenoy ny fangatahana fidirana amin'ny kilik-monja vitsivitsy." },
    processTitle: { fr: "Le processus d'admission",     en: 'The admission process',    mg: 'Ny dingana fidirana' },
    step1Title:   { fr: 'Candidature en ligne',         en: 'Online application',       mg: 'Fanoratana an-tserasera' },
    step1Desc:    { fr: 'Remplissez le formulaire de pre-inscription avec vos informations personnelles.', en: 'Fill in the pre-registration form with your personal details.', mg: "Fenoy ny formiola fisoratana mialoha miaraka amin'ny mombamomba anao manokana." },
    step2Title:   { fr: 'Etude de dossier',             en: 'File review',              mg: 'Fanadihadiana ny antontan-taratasy' },
    step2Desc:    { fr: 'Notre equipe pedagogique examine vos releves de notes et votre parcours.', en: 'Our teaching team reviews your transcripts and background.', mg: "Ny ekipanay pedagogika dia mamaky ny tatitra nahazo isa sy ny lalan'nao." },
    step3Title:   { fr: 'Entretien de motivation',      en: 'Motivation interview',     mg: 'Resaka fanamarinana' },
    step3Desc:    { fr: 'Un echange pour comprendre vos ambitions et valider votre orientation.', en: 'A discussion to understand your ambitions and confirm your direction.', mg: 'Resaka mba hahazoana ny tanjona sy hanamarinana ny fitondranao.' },
    step4Title:   { fr: 'Inscription finale',           en: 'Final registration',       mg: 'Fanoratana farany' },
    step4Desc:    { fr: "Validation de votre place apres depot des pieces physiques et ecolage.", en: 'Confirmation of your place after submitting physical documents and tuition.', mg: "Fankatoavana ny toera-nao aorian'ny fametrahana antontan-taratasy ara-batana sy sarany." },
    formTitle:    { fr: 'Formulaire de pre-inscription', en: 'Pre-registration form',   mg: 'Formiola fisoratana mialoha' },
    formDesc:     { fr: "Tous les champs sont obligatoires pour l'etude de votre dossier initial.", en: 'All fields are required for the review of your initial application.', mg: "Ilaina ny sehatra rehetra amin'ny fanadihadiana ny antontan-taratasy fanombohana." },
    labelNom:     { fr: 'Nom',                          en: 'Last name',                mg: 'Fianakaviana' },
    labelPrenom:  { fr: 'Prenom',                       en: 'First name',               mg: 'Anarana' },
    labelEmail:   { fr: 'Adresse Email',                en: 'Email address',            mg: 'Adiresy Email' },
    labelPhone:   { fr: 'Numero de telephone',          en: 'Phone number',             mg: 'Nomerao finday' },
    labelFiliere: { fr: 'Filiere souhaitee',            en: 'Desired program',          mg: 'Lalana irinao' },
    submit:       { fr: 'Envoyer ma candidature',       en: 'Send my application',      mg: 'Alefaso ny fangatahako' },
    successTitle: { fr: 'Demande recue !',              en: 'Application received!',    mg: 'Voaray ny fangatahana!' },
    successDesc:  { fr: 'votre pre-inscription a bien ete enregistree. Notre service vous contactera sous 48 heures.', en: 'your pre-registration has been recorded. Our team will contact you within 48 hours.', mg: "voarakitra ny fanoratanao mialoha. Ny sampan'asa fanoratana dia hifandray aminao ao anatin'ny ora 48." },
    newRequest:   { fr: 'Faire une nouvelle demande',   en: 'Make a new request',       mg: 'Hanao fangatahana vaovao' },
  },

  contact: {
    sectionLabel:       { fr: 'Une equipe a votre ecoute',  en: 'A team ready to listen',    mg: 'Ekipa mihaino anao' },
    title:              { fr: 'Nous',                       en: 'Contact',                   mg: 'Mifandraisa' },
    titleSpan:          { fr: 'contacter',                  en: 'us',                        mg: 'amintsika' },
    desc:               { fr: "Une question sur les formations ou nos campus ? Laissez-nous un message et notre equipe vous repondra rapidement.", en: "A question about programs or our campuses? Leave us a message and our team will get back to you soon.", mg: "Fanontaniana momba ny fiofanana na ny campus ? Avelao hafatra aminay ary ny ekipanay hamaly anao haingana." },
    coordTitle:         { fr: 'Nos coordonnees',            en: 'Our contact details',       mg: 'Ny mombamomba antsika' },
    locationTitle:      { fr: 'Location',                   en: 'Location',                  mg: 'Toerana' },
    locationAddr:       { fr: 'Faravohitra, Fianarantsoa',  en: 'Faravohitra, Fianarantsoa', mg: 'Faravohitra, Fianarantsoa' },
    locationHours:      { fr: 'Lun-Ven : 09h00 - 18h00',   en: 'Mon-Fri: 09:00 - 18:00',    mg: 'Lun-Zom : 09h00 - 18h00' },
    phoneTitle:         { fr: 'Telephone',                  en: 'Phone',                     mg: 'Finday' },
    phoneFormat:        { fr: 'Format international',       en: 'International format',      mg: 'Endrika iraisam-pirenena' },
    emailTitle:         { fr: 'Email',                      en: 'Email',                     mg: 'Email' },
    socialTitle:        { fr: 'Reseaux',                    en: 'Social',                    mg: 'Tambajotra' },
    formTitle:          { fr: 'Formulaire de contact',      en: 'Contact form',              mg: 'Formiola fifandraisana' },
    formDesc:           { fr: 'Tous les champs sont obligatoires pour le traitement rapide de votre message.', en: 'All fields are required for the quick processing of your message.', mg: "Ilaina ny sehatra rehetra amin'ny fikirakirana haingana ny hafatrao." },
    labelNom:           { fr: 'Nom',                        en: 'Last name',                 mg: 'Fianakaviana' },
    labelPrenom:        { fr: 'Prenom',                     en: 'First name',                mg: 'Anarana' },
    labelEmail:         { fr: 'Email',                      en: 'Email',                     mg: 'Email' },
    labelPhone:         { fr: 'Telephone',                  en: 'Phone',                     mg: 'Finday' },
    labelSubject:       { fr: 'Sujet',                      en: 'Subject',                   mg: 'Lohahevitra' },
    labelMessage:       { fr: 'Message',                    en: 'Message',                   mg: 'Hafatra' },
    placeholderSubject: { fr: 'Ex: Renseignements sur les admissions', en: 'E.g. Enquiry about admissions', mg: 'Oh: Fanontaniana momba ny fidirana' },
    placeholderMessage: { fr: 'Votre message...',           en: 'Your message...',           mg: 'Ny hafatrao...' },
    submit:             { fr: 'Envoyer le message',         en: 'Send message',              mg: 'Alefaso ny hafatra' },
    successTitle:       { fr: 'Message envoye !',           en: 'Message sent!',             mg: 'Nalefa ny hafatra!' },
    successDesc:        { fr: 'votre message a bien ete transmis. Notre equipe vous recontactera tres rapidement.', en: 'your message has been sent. Our team will get back to you very soon.', mg: 'voaray ny hafatrao. Ny ekipanay dia hifandraisa aminao haingana dia haingana.' },
    newMessage:         { fr: 'Envoyer un autre message',   en: 'Send another message',      mg: 'Alefaso hafatra iray hafa' },
  },

  footer: {
    rights:   { fr: 'Tous droits reserves.',    en: 'All rights reserved.',     mg: 'Zo rehetra voatahiry.' },
    madeWith: { fr: 'Fait avec coeur a',        en: 'Made with love in',        mg: "Natao tamin'ny fo ao" },
    location: { fr: 'Fianarantsoa, Madagascar', en: 'Fianarantsoa, Madagascar', mg: 'Fianarantsoa, Madagasikara' },
  },

} as const;

// Types exportes
export type Section = keyof typeof translations;
export type Key<S extends Section> = keyof (typeof translations)[S];

// Fonction utilitaire sans React (utilisable partout)
export function getT<S extends Section>(
  section: S,
  key: Key<S>,
  locale: Locale
): string {
  const entry = (translations[section][key]) as Record<Locale, string>;
  return entry[locale] ?? entry['fr'];
}