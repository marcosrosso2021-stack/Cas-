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
- **Fautes de frappe** : « poite », « factue », « ntoe », « dveis » sont corrigés vers les mots de commande
  (`data.json` → `cmdw`) ; les noms (majuscule, après « chez ») et les mots valides d'une des 10 langues ne sont jamais touchés.
- **Base d'apprentissage** : le mini modèle est réentraîné avec les phrases abîmées (fautes, SMS, sans accents,
  majuscules) que la simulation de 100 utilisateurs n'a pas comprises, avec le sens de leur version propre.

Chaque message a ses mini icônes : copier, renvoyer, modifier (la dernière demande modifiée annule ce qu'elle avait fait).
Quand rien n'est compris : « Je n'ai pas compris. », sans phrase d'exemple ; la reformulation est apprise en silence.

Le chat garde seulement ce qu'il apprend, sous la clé `caso_ia` (et `caso_ia_mini` pour le mini modèle).
Source du moteur et outils de traduction : le module « caso-ia » (moteur, catalogues, contrôles).
