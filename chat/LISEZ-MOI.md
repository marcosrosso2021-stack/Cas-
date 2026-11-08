# Chat autonome de casô

Le chat de casô comprend les 10 langues (celle choisie à la connexion), apprend sans le dire dans la conversation
et n'utilise aucun service extérieur. Il travaille sur les données de casô (`db`) : il n'en garde aucune copie.

## Fichiers
- `engine.js`, `brain.js` : le moteur du chat (compréhension, apprentissage, réponses traduites).
- `data.json` : vocabulaire du métier et des 10 langues (avec le vocabulaire de compréhension `workL`).
- `i18n/xx.json` : les réponses du chat dans chaque langue (le français sert de clé).
- `caso-mini.js`, `caso-mini-model.json` : le mini modèle (5 Mo), chargé après coup, sans bloquer casô.
- `pont.js` : le branchement avec casô.

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
