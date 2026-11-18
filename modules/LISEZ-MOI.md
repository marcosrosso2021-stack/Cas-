# modules/ — le code de l'appli, un fichier par module

Avant, tout le code de l'appli était écrit dans `index.html` (un bloc de 5 400 lignes).
Il est maintenant rangé ici, un fichier par module. Le code est le même, seul son emplacement a changé.

## Comment c'est chargé

`index.html` liste les fichiers dans l'ordre (`<script type="text/x-caso" data-src="modules/…">`).
Au démarrage, ils sont lus tout de suite, pendant que le coffre s'ouvre, puis exécutés **d'un seul tenant
et dans l'ordre de la liste**, comme quand ils étaient dans la page. Viennent ensuite `chat/` et `pointage/`.

**L'ordre compte.** Un fichier peut se servir de ce qu'un fichier *précédent* déclare dès son chargement.
Ce qu'un fichier *suivant* déclare ne peut servir que plus tard (dans une fonction appelée après le démarrage).
Pour ajouter un fichier : le mettre ici et ajouter sa ligne au bon endroit dans `index.html`.

## Les fichiers, dans l'ordre

| Fichier | Contenu | Module de l'abonnement |
|---|---|---|
| `noyau.js` | outils communs, couche de données, langue de l'appli, langues de la note vocale | commun |
| `note-vocale.js` | note vocale « casô note » | commun |
| `devis-signature.js` | signature et envoi du devis | devis |
| `interface.js` | notifications, menus latéraux, choix du module, sous-écrans | commun |
| `clients.js` | clients et fournisseurs, fiches, barre des mesures | commun |
| `chat.js` | enchaînement du chat, écran principal, icônes des messages | commun |
| `planning-semaine.js` | planning de la semaine : carte, tournée, temps prévu | planning |
| `compte-securite.js` | code de secours, suppression du compte, signature enregistrée | commun |
| `plan-photo.js` | plan à partir d'une photo, tour de la pièce | 3d / rénovation |
| `planning.js` | moteur de langage local, écran « Mon planning », rappels, agenda, équipe | planning |
| `facturation.js` | factures, paiements, encaissements, PDF | devis / paiement |
| `devis.js` | rendu du devis, éditeur à blocs, devis, mes services, historique | devis |
| `fournisseurs.js` | import intelligent, devis et factures des fournisseurs | fournisseurs |
| `pointage.js` | écran Pointage et ses actions | pointage |
| `compte.js` | premier lancement, compte, sauvegarde | commun |
| `synchro.js` | QR code, synchronisation, équipe, démarrage de l'appli | commun |
| `planning-phrases.js` | compréhension des phrases (planning et paiements dictés) | planning |
| `listes.js` | glisser une ligne vers la gauche pour la corbeille | commun |
| `devis-module.js` | module Devis (`devis.html`) branché sur le bouton Devis | devis |

Le module 3D reste dans `lib/m3d.html`, le moteur du chat dans `chat/`, le pointage automatique dans `pointage/`.

## Hors ligne et appli mobile

- `sw.js` garde ces fichiers hors ligne (comme `chat/` et `pointage/`).
- `serveur/server.js` les sert.
- `android-app/scripts/prepare-web.js` les copie dans l'appli Android / iPhone.
