# Chat autonome de casô

Le chat de casô comprend les 10 langues (celle choisie à la connexion), apprend sans le dire dans la conversation
et n'utilise aucun service extérieur. Il travaille sur les données de casô (`db`) : il n'en garde aucune copie.

## Fichiers
- `engine.js`, `brain.js` : le moteur du chat (compréhension, apprentissage, réponses traduites).
- `data.json` : vocabulaire du métier et des 10 langues (avec le vocabulaire de compréhension `workL`).
- `i18n/xx.json` : les réponses du chat dans chaque langue (le français sert de clé).
- `caso-mini.js`, `caso-mini-model.json` : le mini modèle (5 Mo), chargé après coup, sans bloquer casô.
- `pont.js` : le branchement avec casô.
- `intel.js` : plusieurs demandes dans une phrase, renvois, devis depuis une description, contrôle du devis, durée d'un travail, questions sur l'activité, apprentissage partagé.
- `lexique.js` : lexique du bâtiment en 10 langues (32 mots, 26 définitions) et ordre des travaux.
- `chantier.js` : fiche chantier dans le chat (documents, photos, travaux faits, ce qui reste, chantiers d'une semaine), questions au lexique, historique des modifications (qui, quand, quoi) ; aucun bouton ajouté.

## Comment il s'insère dans casô
`chatSend()` passe d'abord la phrase au chat. Il la garde s'il sait la faire lui-même, sinon les modules de casô
continuent comme avant (planning, factures, prix, services). Si aucun module de casô ne l'a reconnue, le chat la
reprend avant les notes de devis (second passage : créneau à compléter, ligne à enlever, relance, commande fournisseur).
Les noms de client sont contrôlés : « Lui Dire », « Carreler », « L'instant » ne deviennent pas des clients ; un nom
tapé en majuscules est enregistré « Fontaine ».

Ce que le chat fait lui-même :
- **Devis prêt** : « fais un devis pour mon prochain travail », « prépare le devis de Mme Martin ». Il lit les prix, les
  anciens devis, les modèles et l'objet du rendez-vous, prépare le devis dans casô et l'affiche en carte : l'œil jaune
  l'ouvre, la flèche l'envoie par lien casô après Face ID (même service que l'écran de signature ; le devis passe « en cours de signature »). Sans signature enregistrée, l'écran de signature de casô s'ouvre.
- **Questions** : numéro ou adresse d'un client, prochain rendez-vous, disponibilités, total ou nombre de devis, prix.
- **Messages et appels** : SMS, e-mail, appel (un seul lien, c'est le téléphone qui envoie).
- **Rendez-vous devinés** : « ajoute un créneau » → « Tu veux : ajouter un rendez-vous ? » → jour, heure → planning de casô.
  Un rendez-vous compris directement reste au planning de casô (rappels, équipe, répétitions).
- **Mémoire** : « retiens… », « oublie… », mots appris, modèles enregistrés.
- **Sauvegarde, export, mode** : « fais une sauvegarde », « exporte mes clients » (CSV), « exporte mes prix »,
  « mode bricoleur » : un bouton dans la bulle lance la fonction de casô (le partage du téléphone demande un geste).
  Dans le module 3D, « mode artisan » (ou « pro mode », « modo profesional »…) ramène au mode Artisan.
- **Fautes de frappe** : « poite », « factue », « ntoe », « dveis » sont corrigés vers les mots de commande
  (`data.json` → `cmdw`) ; les noms (majuscule, après « chez ») et les mots valides d'une des 10 langues ne sont jamais touchés.
- **Base d'apprentissage** : le mini modèle est réentraîné avec les phrases abîmées (fautes, SMS, sans accents,
  majuscules) que la simulation de 100 utilisateurs n'a pas comprises, avec le sens de leur version propre.

- **Lignes de devis sans prix** : « ajoute 10 m² de carrelage » va au devis (avant : sol de la maquette 3D).
  Un meuble (« ajoute un canapé de 2 m ») reste une demande de maquette.
- **Dictée** : « casô note » et « casô fin » tapés ou dictés dans la phrase sont retirés (commandes de la dictée).
- **Réponse seule** : « oui » sans question en cours → « D'accord. » ; un nombre seul (« 16 ») → le chat demande à quoi il sert.
- **Nom sans majuscule** : « c'est quoi le numéro de faure » cherche le client Faure.
- « non » après une demande faite par casô lui-même : « D'accord. » (le chat n'annonce plus une annulation qu'il n'a pas faite).
- **Notes du devis** : « il faut commander la colle », « attention humidité » (dans les 10 langues) sont gardés sur le devis,
  dans la carte « Notes » (à faire, remarques). Elles ne partent jamais au client.
- « 20 m² de carrelage » seul va au devis (avant : sol de la maquette 3D). « quanto faccio pagare le piastrelle »,
  « cuánto cobro por el azulejo », « combien coûte le parquet » : le prix de l'artisan.
- Phrase de maquette 3D dans le chat Pro : la dernière maquette enregistrée s'ouvre avec la demande ; sans maquette, le
  chat dit d'ajouter d'abord le plan (bouton « Plan 3D »). Dans le module 3D, une demande pour le chat Pro (devis,
  client, rendez-vous…) repart dans la conversation de casô.

**Enchaînements (une question, une réponse)** — trombone du chat, image collée ou glissée dans la conversation
(`index.html` : `chatFile`, `chKind`, `chReponse`) :
- **Plan ou croquis** → envoyé directement à la maquette 3D (écran de recadrage du module 3D).
- **Facture, devis, ticket ou bon de livraison d'un fournisseur** → « Facture · Point P · 2 lignes · 848,52 € TTC —
  J'enregistre ce fournisseur et j'ajoute les matériaux à tes prix ? » [Oui] [Au devis]. Le fournisseur est créé
  (tél., e-mail, adresse, SIRET), l'achat rangé, les matériaux ajoutés aux prix avec la marge de l'import. Sans nom de
  fournisseur lisible, le chat le demande. « non » annule tout.
- **Carte de visite** → « c'est un client ou un fournisseur ? ».
- **Adresse tapée** (sans chantier à cette adresse) → « Nouveau chantier à cette adresse pour Martin ? » ; sans client
  en cours, le chat demande le client, le crée et rattache le chantier.
- Lecture impossible → « C'est un plan ou un document fournisseur ? ».
On répond en tapant (« oui », « au devis », « client », un nom, dans les 10 langues) ou d'un seul bouton.

**Lecture des documents** (`index.html` : `docImg`, utilisé par le chat et par l'import) : avant la lecture, la photo
est agrandie si elle est petite, le papier est égalisé (ombre, éclairage), l'image est redressée (−5° à 5°) et les
traits de tableau sont effacés. Les lignes de ticket sur deux lignes (« PLAQUE BA13 » puis « 14 x 8,95  125,30 »)
sont réunies ; une virgule perdue (« 6240 » pour 62,40) est rétablie quand quantité × prix = total le confirme ;
les adresses et les totaux mal lus ne deviennent pas des articles ; un total TTC qui ne colle pas avec les lignes
n'est pas affiché. Banc d'essai (4 documents × net / petit / photo) : 48 lignes justes sur 57, contre 10 avant.

**Premier message** : le mini modèle (fautes de frappe) se charge dès qu'on touche la barre d'écriture ; le premier
message l'attend au plus 4 s.

**Plus malin (nov. 2026)** — `intel.js`, `brain/p10.js` du moteur, branché dans `chatSend` :
- **Plusieurs demandes dans une phrase** : « crée le client Durand, rendez-vous jeudi 9h et prépare le devis » (10 langues ;
  virgules, « et », « puis »). Chaque demande suit son chemin, l'une après l'autre ; le client nommé ou créé vaut pour les
  suivantes ; la phrase tapée s'affiche une fois, suivie d'une réponse par demande ; « non » ou Annuler défait toute la phrase.
  Quand le chat sait faire toutes les demandes lui-même et qu'il n'y a pas de rendez-vous (« nouveau devis pour Petit, ajoute
  faïence 10 m² »), il garde la phrase entière comme avant. Les mots qui ne commencent pas une demande restent avec la
  précédente (« carrelage et faïence », « à Paul et Marie »). « crée le client X » crée le client (avant : question).
- **Renvois** : « le client d'hier / de ce matin / de lundi » (rendez-vous et pointages du jour), « la dame de la rue des
  Lilas » (adresse des clients et des chantiers). Un seul client trouvé : son nom remplace le renvoi ; la phrase tapée reste
  affichée. « fais le même devis que Martin pour Dupont » copie le devis de Martin. « prépare le devis » sans nom : le client
  dont on vient de parler, ou celui du devis ouvert.
- **Devis depuis une description** : « salle de bain 6 m², dépose carrelage, pose faïence, receveur » → une ligne par travail,
  quantités calculées (sol, murs, plinthes, pièces à l'unité) avec les mesures de la maquette si la pièce y est, sinon pour une
  pièce carrée de cette surface (2,50 m sous plafond, une porte) ; prix de « Mes services » quand ils correspondent.
- **Contrôle du devis** (une ligne « À vérifier » sous les lignes ajoutées, une seule fois par remarque) : fournitures oubliées
  (colle et joint avec le carrelage…) quand le devis détaille ses fournitures, dépose sans évacuation des gravats, prix à moins
  de 70 % de d'habitude, prix de vente sous le dernier prix d'achat.
- **Durée d'un travail** : « combien de temps pour 25 m² de carrelage » → heures par m² des anciens devis où ce travail est le
  poste principal (lignes en h, sinon heures pointées), puis le premier jour où le planning a assez de jours libres de suite.
- **Questions sur l'activité** : fournisseur le moins cher pour un produit (achats lus sur les factures), chantiers les plus
  rentables (HT facturé − achats rattachés au client, € par heure pointée), achats chez un fournisseur sur une période,
  meilleurs clients.
- **Facture d'un fournisseur** : « PLAQUE BA13 STD 2500x1200 » met à jour « Placo BA13 » de tes prix (même référence, ou tous
  les mots du libellé pour un prix qui vient déjà d'un fournisseur ; jamais un prix de pose), au lieu d'en créer un second.
- **Corrections** : « non » ou le bouton Annuler juste après une action du chat : ce qu'il avait compris n'est plus refait pour
  cette phrase, et la phrase suivante, si elle en parle, lui apprend ce qui était voulu.
- **Apprentissage partagé** (rien n'est affiché) : les demandes de lecture apprises par l'usager (ouvrir un écran, une
  information ; jamais une modification) partent au serveur casô (`/api/appris`) sous forme masquée (« @c » pour le client,
  « # » pour les nombres), seulement si tous leurs mots sont des mots du métier ou des commandes, sans nom (ni ceux des clients,
  ni ceux déjà tapés avec une majuscule), sans texte, sans nombre écrit en clair. L'appareil reçoit une fois par jour celles des
  autres. Elles ne servent que si le chat ne comprend pas la phrase lui-même, et toujours en proposition (« Tu veux : … ? ») ;
  ce que l'usager a appris lui-même passe avant ; un « non » l'efface chez lui. Serveur : `window.CASO_APPRIS`
  (défaut https://app-e6c6e91c-8623-4524-95ef-2cefb8b67f7b.cleverapps.io).
- **Contrôle chaque semaine** : `.github/workflows/chat-semaine.yml` lance `outils/chat/controle.js` (363 phrases de contrôle,
  exemples dans les 10 langues), `outils/chat/fautes.js` (une faute de frappe sur 100 phrases par langue, seuil 80 % compris)
  et `outils/chat/essai-appli.js` (essais dans l'appli). `node outils/chat/controle.js --base`
  enregistre une nouvelle référence après un changement voulu.

**Étapes du 11 novembre 2026** (`intel.js`) :
- « le client de jeudi » avec plusieurs clients ou aucun ce jour-là : le chat le dit (« Le jeudi 5 novembre : Martin, Petit. Lequel ? »), on répond par le nom.
- « ajoute une marge de 10 % » (« sur la fourniture », « sur la main d'œuvre ») : prix des lignes augmentés, annulable.
- « devis pour Martin carrelage… » : le client reste Martin ; « dépose carrelage » ne prend plus le prix du carrelage ;
  « carrelage 14 m² et main d'oeuvre 8 h » donne deux lignes ; « à », « de », « la » ne font plus passer une phrase pour de l'anglais.
- Apprendre du geste : après « Je n'ai pas compris », l'écran ouvert à la main juste après est retenu pour cette phrase, en proposition.
- « fais le devis de la rénovation » : l'estimation de la Rénovation (postes cochés, quantités) devient un devis, avec les prix de Mes services
  quand ils correspondent, sinon le milieu de la fourchette indicative (TTC → HT, TVA 10 %), signalé.
- À l'ouverture du chat (une fois par jour) : une ligne de rappel (rendez-vous du jour, devis envoyés depuis 7 jours, factures en retard).
- Devis signé (30 derniers jours) : « facture d'acompte de 30 % et 3 j de chantier au planning à partir du lundi 16 ? » [Oui] →
  les jours sont bloqués au planning et la facture d'acompte s'ouvre.
- Message d'un client collé (« Bonjour, je suis disponible jeudi à 14h30… Cordialement, Mme Petit ») → « Rendez-vous jeudi 14h30 avec Mme Petit ? » [Oui].
- Facture fournisseur : « ↑ Colle carrelage C2 25 kg : +13 % (13,20 € → 14,90 €) » quand le prix monte de 5 % ou plus chez ce fournisseur.
- Mini modèle : `outils/mini` et `.github/workflows/mini-semaine.yml` le réentraînent chaque lundi avec les phrases apprises par plusieurs usagers.
- Plus rapide : le chat ne teste une règle de traduction que si le texte contient ses mots (`peut`, `motsRequis`) et ne construit
  ses regex qu'au premier usage (`rxOf`, `LazyRe`, `B.prechauffer` quand le téléphone ne fait rien) ; seules les réponses dans la
  langue de l'appli sont chargées à l'ouverture (les 8 autres ensuite) ; le module Devis se précharge après le chat. Mêmes
  traductions qu'avant sur 2 026 phrases des 10 langues. Téléphone lent simulé (processeur ÷ 6) : 1re réponse 15,2 s → 3,5 s,
  3e réponse 11,3 s → 1,8 s, chat prêt 3,6 s → 2,5 s.

**Toutes les fonctions de l'appli par le chat** (10 langues, fautes et tournures libres ; moteur : `brain/p8app.js`,
intentions `app.*` ; exécution : `pont.js` → `appFaire` / `autreFaire`) :
- Compte et réglages : langue de l'appli (« mets l'appli en anglais »), mon compte, code de secours, déconnexion
  (bouton dans la bulle), notifications, restaurer une sauvegarde, améliorer la traduction.
- Mon entreprise : ouvrir la fiche, ou changer un champ en une phrase (« mon IBAN c'est … », « mon taux horaire est
  de 45 € », SIRET, TVA intracommunautaire, assurance décennale, validité des devis, délai de paiement…). Annulable.
- Équipe : « mon équipe », « invite un ouvrier » ; « ma signature » ouvre la signature de l'artisan.
- Devis : nouveau, dupliquer, section, option, avenant (module Devis), devis payant, acompte %, sans TVA,
  autoliquidation, début et durée des travaux, valider, lien, modèle (dépannage, diagnostic…), PDF (après signature).
- Factures : avoir (sur la dernière facture du client), export des encaissements, historique.
- Clients et fournisseurs : nouveau client, client depuis les contacts, supprimer un client (avec confirmation),
  nouveau fournisseur, import d'une facture ou d'un ticket (photo), supprimer un service, importer mes prix.
- Planning : vue semaine ou jour, créneaux de travail, agenda de l'iPhone, annuler un rendez-vous.
- Pointage : « je commence ma journée » / « fin de journée » pointent si la personne et le chantier sont connus
  (sinon l'écran de pointage s'ouvre), présents, journal, oubli, chantiers et NFC.
- Plan d'une pièce (photo, laser), maquette 3D, dictée, « qu'est-ce que tu sais faire ».
- « non » juste après annule l'action (fiche entreprise, client supprimé, service, rendez-vous, pointage…).
- Base d'apprentissage : `mini/app-phrases.json` (phrases de chaque fonction dans les 10 langues) est ajouté au
  générateur ; le mini modèle est réentraîné avec leurs versions abîmées (fautes, majuscules, sans accents).

Module 3D du mode bricoleur (même conversation, 10 langues) :
- « envoie à mon artisan » ouvre l'envoi des changements (la personne valide avant l'envoi).
- « agrandis le salon », « la pièce fait 4 m sur 5 m » : les murs sont modifiés par l'artisan ; la demande part au prochain envoi.
- « la chambre » seule montre la chambre ; elle n'y déplace le dernier meuble que s'il vient d'être ajouté ou déplacé.
- « agrandis le meuble » quand il n'y en a pas : le chat le dit au lieu d'en ajouter un.
- Après « De quoi s'agit-il ? » ou « Quelle couleur ? », une nouvelle demande complète n'est pas prise pour la réponse.
- Fautes de frappe corrigées aussi dans les 9 autres langues, sur le vocabulaire de la langue détectée ; formes
  déclinées ajoutées (« patul », « yatağı », « canapeaua », « łazience », « دشا »…), prix, fenêtres et portes traduits.
- « tourne le lit de 180° » est annoncé comme un demi-tour.
- Tourner un meuble qui obligerait à en déplacer un autre : le chat demande d'abord (« oui » / « non », 10 langues).

Chaque message a ses mini icônes : copier, renvoyer, modifier (la dernière demande modifiée annule ce qu'elle avait fait).
Quand rien n'est compris : « Je n'ai pas compris. », sans phrase d'exemple ; la reformulation est apprise en silence.

Le chat garde seulement ce qu'il apprend, sous la clé `caso_ia` (et `caso_ia_mini` pour le mini modèle).
Source du moteur et outils de traduction : le module « caso-ia » (moteur, catalogues, contrôles).

**Fautes de frappe dans les 10 langues (11 novembre 2026)** :
- Le correcteur connaît aussi le vocabulaire de chaque langue (règles de traduction : « radidor » → radiador, « portta » → porta),
  corrige aussi le russe et l'arabe, et relit la phrase après correction (langue et mots).
- Un mot seul que rien ne reconnaît est lu dans la langue de l'appli.
- Avec une faute, compris dans les 9 autres langues : 42 à 67 % avant, 87 à 98 % après. Français (phrases artisan) : 56 → 62 sur 74.
- « annlue » → annule ; « spuer », « parfiat » → politesse ; « șterge clientul Paul » (et la même phrase dans les autres langues) supprime la fiche.
- Mode Artisan : « demande de devis (de Dupont) » ouvre un nouveau devis, dans les 10 langues. En mode Bricoleur, la phrase garde son sens
  (demander un devis à un artisan).

**Questions du métier (13 novembre 2026)** (`brain/p8me.js` du moteur) :
- Réponses fixes, vérifiées sur les textes en vigueur le 13 novembre 2026, dans les 10 langues. Ce n'est pas une conversation libre.
- TVA (10 %, 5,5 %, 20 %, mention à la place de l'attestation depuis 2025), garanties (décennale, parfait achèvement, bon fonctionnement),
  rétractation et paiement interdit 7 jours (contrat signé chez le client), acompte, devis obligatoire (dépannage), délais de paiement
  entre professionnels, retenue de garantie, autoliquidation, sections de câble (NF C 15-100), pentes d'évacuation, séchage d'une chape.
- Calculs : dalle de béton (surface et épaisseur), parpaings, nombre de carreaux d'un format, m³ ↔ litres, « combien fait 12 m² à 45 € ».
- « tva à 10 % » avec une phrase de réglage (un nombre et %) reste un réglage du devis : la TVA des lignes du devis ouvert change
  (avant, casô ajoutait une ligne « Tva 10 u »).

**Cœur de l'IA (14 novembre 2026)** :
- Chat du module 3D : quand il ne comprend pas une phrase ou ne connaît pas un mot, le chat de l'appli la relit (10 langues, fautes),
  et le module 3D répond dans la langue de l'usager (`coeur3d` dans le module 3D).
- Mémoire commune (`chat/memoire.js`) : le chat 3D apprend sur le même serveur que le chat (mots seulement, publiés à partir de 2 usagers) ;
  les phrases incomprises (chat et 3D) partent masquées (chiffres → #, noms → @) et ne sont lisibles qu'à partir de 3 usagers,
  avec la clé `CASO_CLE_IA` (`node outils/ia/incompris.js`).
- Contexte : « mets la rénovation sur le devis de Dupont » va sur le devis en cours de Dupont.
- Enchaînements : acompte non reçu au bout de 7 jours [Relancer] ; fin de chantier au planning → facture de solde [Oui] ;
  devis refusé → la raison (prix, délai, autre), reprise par « pourquoi mes devis sont refusés ».
- Bilan de toute l'IA chaque lundi : `node outils/ia/bilan.js` (commandes, métier, fautes, seuils dans `outils/ia/seuils.json`),
  puis `outils/chat/essai-appli.js` et `outils/ia/essai-3d.js` dans le navigateur.

**Évolutions du 14 novembre 2026** :
- Ouverture : le module 3D est dans `lib/m3d.html` (chargé au premier usage, préchargé au repos) et les traductions de l'interface dans
  `i18n/ui-xx.json` (seule la langue choisie, gardée sur l'appareil, mise à jour en arrière-plan). `index.html` : 1 038 → 400 Ko compressé.
- Bénéfice réel : « combien j'ai gagné chez Martin » → CA, achats, heures pointées au coût de l'heure (demandé une fois,
  ou « mon heure me coûte 30 € »), bénéfice et %.
- Dictée : nombres en lettres, « virgule », « 14 heures 30 », « huit heures et demie » (`B.dicte`, appelé par `vnMake`).
- Relance des devis envoyés depuis 7 jours : [Relancer les devis] dans le rappel du matin, message prêt (SMS, WhatsApp, e-mail).
- Pointage par la position, appli ouverte (iPhone, site web) : proposition d'arrivée sur un chantier du jour, de sortie quand on s'en éloigne ;
  l'appli Android garde son pointage automatique en arrière-plan.
- `outils/chat/fautes.js` : tirage stable (une graine par phrase).

**Chantier, lexique, historique (15 nov. 2026)** — `chantier.js`, `lexique.js`, branchés avant les questions sur l'activité :
- « fiche du chantier Martin », « rapport du chantier Martin », « documents / photos du chantier Martin », « qu'est-ce que j'ai fait chez Martin », « qu'est-ce qu'il reste chez Martin » : une réponse qui regroupe rendez-vous, devis, factures, plans, heures pointées, achats, reste à facturer et reste dû ; chaque ligne ouvre sa fiche ;
- « reprends le chantier de la semaine dernière », « montre les chantiers de la semaine prochaine » (10 langues) ;
- « c'est quoi un ragréage », « ragréage avant le parquet », « ordre des travaux » : seuls les ordres admis partout sont donnés, sinon « pas d'ordre fixe » ;
- volume d'une dalle donnée en longueur × largeur (moteur, `brain/p8me.js`) ;
- historique : chaque enregistrement note qui a changé quoi et quand (`caso_journal` dans le téléphone, 400 dernières), avec la phrase du chat qui l'a provoqué ; la fiche modifiée garde le prénom de son auteur (`by`) pour l'équipe. « historique », « qui a modifié le devis de Martin ».

**Rien d'inventé, rien d'un autre client (15 nov. 2026)** — `intel.js`, `pont.js`, `parseNote` (index.html) :
- une ligne dite sans quantité (« mettre du carrelage », « prévoir les plinthes ») n'est plus comptée 1 m² : elle reste à préciser, le chat le dit, et la réponse suivante (« 20 m² », « 4 m sur 3,5 m ») la calcule. Un article à l'unité (« un receveur ») compte toujours 1 ;
- « il faut refaire le sol chez Martin, mettre du carrelage et prévoir les plinthes » et « ajoute du carrelage et des plinthes au devis de Martin » donnent des lignes de devis (plus de « maquette 3D », plus de plinthes perdues), dans les 10 langues ;
- un devis avec une quantité manquante n'est pas envoyé (même règle que pour un prix manquant) ; la vérification du devis le signale ;
- la rénovation (œil 3D) mise sur un devis est celle du client du devis : une rénovation liée à personne est d'abord proposée (« La mettre sur le devis de Dupont ? »), puis reste liée à ce client (`db.maq3d[].cli`) ; celle d'un autre client n'est jamais prise. Les mesures d'une pièce ne viennent plus d'une maquette d'un autre client.
- essai : `outils/chat/essai-fiabilite.js` (navigateur, chaque semaine).

**Plusieurs actions dans une phrase (15 nov. 2026)** — `intel.js` :
- « nouveau devis pour Dupont et ajoute du carrelage » : la commande d'abord, puis la description sur le devis qu'elle vient d'ouvrir (le moteur prenait « ajoute du carrelage » pour la maquette 3D). « pour le chantier Martin, … » donne le client au morceau qui suit ;
- « Pour le chantier Martin, ajoute la rénovation de la salle de bain, prévois une douche italienne, remplace le carrelage, calcule les surfaces et prépare un devis » : lignes Douche italienne et Carrelage sur le devis de Martin, surface demandée ; « prépare un devis », « calcule les surfaces », « la rénovation de … » disent quoi faire, ce ne sont pas des lignes ;
- les lignes vont toujours sur le devis du client nommé (son brouillon, sinon un nouveau devis), jamais sur le devis ouvert d'un autre client ni sur un devis déjà envoyé ;
- un service enregistré n'est plus pris pour un autre (« douche italienne » ≠ « receveur de douche »).
- « crée le client Bernard et ajoute de la faïence » : la ligne va sur un devis de Bernard, et « 12 m² » juste après la calcule ;
- « envoie le devis de Martin », « appelle Martin et envoie-lui le devis » : le devis de Martin pas encore envoyé (celui ouvert d'abord, sinon le plus récent), même si un autre devis est ouvert ; aucun → « Je ne trouve pas de devis à envoyer pour Martin » (`pont.js`).

**Questions et modifications, pas une mauvaise action (16 nov. 2026)** — `intel.js`, `chantier.js` :
- « remplace le carrelage (de cette salle de bain) par du parquet imitation bois », « change la peinture en parquet chez Martin » : la ligne du devis change de libellé et de prix (Mes services, sinon prix à remplir), la quantité reste (autre unité → à préciser) ; « non » juste après annule. Dans les 10 langues (« replace … with … », « cambia … por … », « замени … на … » ; noms reconnus par le lexique). Un devis déjà envoyé n'est pas modifié. « change le sol en beige » sans ligne au devis reste pour la maquette 3D ;
- « montre-moi ce qu'on a fait la semaine dernière chez Martin » : travaux faits, passages et heures pointées de cette période ; « montre-moi Martin » : la fiche du chantier ;
- « y a-t-il des conflits dans mon planning ? » : les rendez-vous qui se chevauchent sur 30 jours (ou la période dite), chacun cliquable vers le planning ;
- « enlève … », « remplace … par … » ne sont plus pris pour une description de travaux.

**Détails d'usage (16 nov. 2026)** — `intel.js` (`usage`), `chantier.js`, `index.html` (`agChat`, `prParse`, `prAddLine`), moteur (`findRdv`) :
- devis en cours : « en fait mets 14 m² », « le carrelage c'est 15 m² pas 14 », « finalement 8 h », « non, 3 sacs » changent la quantité de la ligne (plus de ligne « En fait mets ») ; « enlève la colle » retire la ligne ; « mets le carrelage à 50 € » change le prix de la ligne (plus de 2ᵉ ligne « 1 m² ») ; « combien ça fait ? », « le total ? » donnent le total HT et TTC ; « supprime la main d'œuvre » quand elle n'y est pas : le chat le dit (avant : il l'ajoutait) ;
- rendez-vous : « décale le rdv de Martin… » déplace celui de Martin (avant : le premier rendez-vous venu, d'un autre client) ; « annule le rdv de Martin » prend le prochain, pas un rendez-vous passé ; « rdv Petit vendredi 8h pour le métré de la cuisine » crée le rendez-vous « Métré de la cuisine » ; juste après un rendez-vous, « mets-le plutôt à 10h » le déplace et « finalement annule » l'annule ; « j'ai quoi cette semaine ? » liste la semaine ;
- état d'un devis : « le devis de Martin est signé », « Martin a refusé le devis » demandent un Oui avant de changer l'état ; « est-ce que Martin a signé ? », « mes devis en attente », « dernier devis de Petit » donnent la liste ;
- prix : « quel est le prix du carrelage ? » donne mon prix ; sinon le prix payé chez les fournisseurs (« combien coûte une plaque de BA13 ? ») ; « ajoute un service : pose de parquet 35 € le m² » enregistre « Pose de parquet » ;
- clients et factures : « nouveau client : Mme Leroy, 06…, 5 rue des Roses à Lyon » (avant : un client « Lyon ») ; « Martin a tout payé » encaisse le reste dû après un Oui (avant : une ligne de devis) ; « relance Martin » prépare la relance de sa facture ; « combien d'heures chez Martin ? » donne les heures pointées.

**Langage de chantier, étape 1 (16 nov. 2026)** — nouveaux `chat/lexique-btp.js` et `chat/langage.js`, placés devant le moteur (rien n'est retiré) :
- `lexique-btp.js` : 166 termes du parler de chantier en français, 12 métiers. Une ligne par terme : nom, métier, type, façon de compter (m² de la pièce, m² à donner, ml, à l'unité, forfait), variantes et fautes, abréviations, parler familier. Un « ? » marque un mot à plusieurs sens (bâti, rail, ligne, bandes, tableau, chape) : rien n'est encore tranché, c'est l'étape 2. `lexique.js` (définitions, ordre des travaux) ne change pas.
- `langage.js` : `CASO_LANGAGE.nettoie(phrase)` réécrit la phrase avant le moteur, par `casoPont.renvoi` ; le texte tapé reste affiché tel quel.
  - fautes sur les mots du métier (« carlage » → carrelage, « fenetre » → fenêtre) ;
  - abréviations (« sdb », « dep comp », « inter », « ba13 » → BA13), seulement avec un devis, un « faut » ou un autre mot du métier dans la phrase ;
  - parler familier devant un mot du métier (« péter / virer / faire sauter le vieux carrelage » → « déposer l'ancien carrelage », « tirer une ligne » → « poser une ligne électrique », « faire les bandes » → « faire les bandes à joint ») ;
  - « remettre du neuf » : du neuf du dernier matériau dit, et plus jamais le chiffre 9 ;
  - un synonyme n'est pas remplacé (« cumulus » reste « cumulus ») ; une commande de l'appli sort identique (« vire le client Dupont », « change le prix du carrelage »).
- `intel.js` (`lire`, `decrire`) : un mot du lexique donne une ligne de devis (chauffe-eau, ligne électrique, bandes à joint, laine de verre…) avec sa façon de compter ; « BA13 » n'est plus lu comme une quantité ; la surface dite avec un travail est la sienne (« dépose placo 20 m² » = 20 m², avant 43,1 m² de murs calculés) ; libellés avec accents, sans « : » devant.
- `index.html` (`vnMatch`) : « dépose placo » ne prend plus le prix de « Dépose carrelage ».
- essais : `outils/chat/essai-langage.js` (sans navigateur : 88 phrases de `corpus-langage.json`, et les 1 348 phrases du contrôle du moteur qui doivent sortir identiques) ; 13 contrôles dans `essai-fiabilite.js`.
- pas encore : question sur un mot à plusieurs sens, projet décrit sur plusieurs messages, constats (« le sol est mort »), vocabulaire personnel, libellé professionnel, autres langues.

**Langage de chantier, étape 2 (16 nov. 2026)** — mots à plusieurs sens, projet sur plusieurs messages, constats :
- **mots à plusieurs sens** (`lexique-btp.js` → `sens`, `langage.js` → `leve`, `ambigus`) : « bâti », « rail », « tableau » dits seuls.
  - ce qui tranche : le mot qui suit (« le rail du placard » → rail de porte coulissante), sinon le devis en cours et les trois derniers messages ; un autre travail de la même phrase ne suffit pas ;
  - sinon la ligne (ou la note) garde le mot tapé, et le chat pose une seule question après sa réponse : « Bâti » : bâti de porte, bâti de fenêtre, ou bâti-support de WC ? Les réponses se touchent (`casoPont.sens(i)`) ou se tapent (« de porte », « le premier ») ; la ligne ou la note est alors renommée, annulable par « non ».
- **projet en plusieurs messages** (`intel.js` → `projet`) : « Je dois refaire ma salle de bain. » ouvre un projet (20 min) ; « Elle fait 8 m² », « 4 m sur 3 » donnent la surface ; « on enlève tout le carrelage », « on met du nouveau au sol et aux murs », « on change l'évier » sont notés ; « fais-moi le devis » en fait un devis. Le sol prend la surface dite ; les murs ne sont pas devinés : « Carrelage mural (m²) » reste à préciser, et « 18 m² » juste après le remplit.
- **constats** (`intel.js` → `constat`) : « Le mur est abîmé. » va dans les remarques du devis (jamais envoyées au client), « Celui de droite. » le précise, « Il faut le reprendre aussi derrière la porte. » devient une note À faire sur ce mur. Rien n'en est déduit (ni cause, ni travaux).
- **modèles du métier** (moteur, `devisDepuis`) : « fais un devis pour Dupont pour refaire sa cuisine » sans devis ni modèle de l'artisan : les surfaces et les heures du modèle ne sont plus posées (« Crédence 4 m² », « 20 h ») ; elles restent à préciser.
- « dépose lino » ne prend plus le prix de « Dépose carrelage » (mots de 4 lettres comptés).
- essais : 24 contrôles de plus dans `essai-fiabilite.js` (154).

**Langage de chantier, étape 2 bis (16 nov. 2026)** — les quatre limites de l'étape 2 :
- **autres langues** (`intel.js` → `projetX`, `constatX`) : le projet en plusieurs messages marche dans les 10 langues. Le traducteur du moteur rend les noms (carrelage, sol, murs, salle de bain, devis, m2) ; les verbes (refaire, enlever) et quelques mots (pièce, sol, mur, état) sont reconnus sur la phrase tapée (`X_PIECE`, `X_REFAIRE`, `X_OTER`, `X_SOL`, `X_MUR`, `X_ETAT`). Les lignes du devis restent en français, comme partout dans l'appli. Un constat est gardé tel que tapé. Un mot du lexique donne une ligne de devis depuis une phrase étrangère (« replace the water heater » → Chauffe-eau). La langue de l'usager est celle de l'appli (`enFr`), le moteur se trompant parfois sur une phrase courte.
  Restent en français seulement : le nettoyage du parler familier et des abréviations, la question sur un mot à plusieurs sens, « celui de droite ».
- **mots à plusieurs sens** : 12 (bâti, rail, tableau, bandes, joint, plaque, colonne, gaine, conduit, coffre, cadre, trappe). Dans `sens`, un mot précédé de « ! » suffit même s'il n'est que dans la même phrase (« doublage + bandes » → bandes à joint ; « changer la plaque et la hotte » → plaque de cuisson). Quand la suite du mot le précise déjà (« le rail du placard », « 10 plaques de BA13 »), rien n'est réécrit ni demandé. « refaire les joints » n'est plus décidé d'office : question.
- **constats rédigés** (`etatPro`) : « le sol est mort » → « Sol hors d'usage », « les plinthes sont pourries » → « Plinthes dégradées » (accordé comme le mot tapé). La phrase tapée est gardée avec la note (`o`).
- **dernier recours** (`casoPont.travail`, appelé juste avant « Je n'ai pas compris ») : un travail dit sans « faut » (« refaire la gouttière », « évacuation des gravats à la benne ») va dans les notes À faire du devis.
- « 10 plaques de BA13 » se compte à l'unité ; « joints de carrelage » ne prend plus le prix de « Carrelage ».
- **simulation** : `outils/chat/simulation.js` (nouveau, l'ancien script n'était pas dans le dépôt) — 100 usagers, 10 langues, fautes de frappe, style SMS ; même graine = mêmes messages, pour comparer deux versions. « Compris » veut dire « autre chose que Je n'ai pas compris », pas « bien compris ». 40 usagers chaque semaine.

**Les fonctions arrivées depuis dans les exécutions du chat (16 nov. 2026)** — après la fusion de `main` (Newsletter, Fournisseurs simple, vidéo reprise, sécurité discrète) :
- **« Mon entreprise » en quatre pages** (`pont.js` → `ecran`) : le chat ouvre la page du réglage demandé. Avant, « mon équipe », « invite un ouvrier », « change la langue », « ouvre les notifications » ouvraient la page Entreprise, où le réglage est caché. La page est lue sur le `data-cp` du réglage : rien à tenir à jour si un réglage change de page.
- **Newsletter** (`veille.js`) : « ouvre la newsletter », « newsletter » ouvrent la page. « quoi de neuf » répond toujours dans le chat.
- **métier** (moteur `parseApp`, `APP_METIERS`) : « mon métier c'est plombier », « je suis électricien » règlent le métier de Mon entreprise (celui qui trie la Newsletter). Un métier hors liste (carreleur, plaquiste…) donne « Autre métier du bâtiment ». Lu sur le texte tapé : la correction des fautes change « carreleur » en « carrelage ».
- **zone couverte par l'assurance**, et « mon iban », « change mon siret » ouvrent le champ.
- **prix en ligne** (`app.prix_ligne`) : « cherche le prix du placo en ligne », « compare les prix de la laine de verre » ouvrent Fournisseurs → Prix en ligne et lancent la recherche. « prix du BA13 en magasin » répond toujours depuis les achats enregistrés.
- **vidéo** (`app.video`) : « filme la pièce pour la maquette », « reprends l'analyse de la vidéo » ouvrent le module 3D ; « où en est la vidéo » donne l'étape en cours.
- **Face ID / empreinte** (`app.faceid`) : un bouton, comme pour le code de secours ; il ouvre Sauvegarde et fait le réglage, ou dit que le téléphone ne le permet pas.
- Ces phrases sont comprises en français ; « newsletter » dans les 10 langues. Les réponses sont traduites.
- `veille.js` : « du nouveau » n'est une question sur la Newsletter qu'en début ou en fin de phrase (« on met du nouveau au sol » est un travail).
- essais : 23 contrôles de plus dans `essai-fiabilite.js` (245).

