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
  (défaut https://api.caso.fr).
- **Contrôle chaque semaine** : `.github/workflows/chat-semaine.yml` lance `outils/chat/controle.js` (363 phrases de contrôle,
  exemples dans les 10 langues) et `outils/chat/essai-appli.js` (essais dans l'appli). `node outils/chat/controle.js --base`
  enregistre une nouvelle référence après un changement voulu.

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
