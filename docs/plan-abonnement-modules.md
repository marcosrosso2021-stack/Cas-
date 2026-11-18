# Abonnement par module : chaque usager n'a que ce qu'il a choisi

## Règles décidées

- **Tous les comptes se valent** : Google, Microsoft et e-mail ont un compte sur le serveur casô, avec le même essai et le même plan.
- **Essai de 30 jours** (inchangé) : tout le mode Artisan est ouvert, quels que soient les modules choisis.
  Il démarre quand le SIRET est donné, une seule fois par personne et par SIRET.
- **Après l'essai** : les modules du plan (« On construit le plan »), plus le **socle gratuit** :
  - le chat (et la note vocale) ;
  - le carnet de clients ;
  - les rendez-vous simples (« RDV jeudi 9h chez Durand », rappel) ; l'écran complet « Mon planning » reste dans le module Planning ;
  - **1 devis par mois**.
- **Module retiré** : ses données restent en **lecture seule** (voir, télécharger, ne plus créer).
  Les factures doivent rester consultables 10 ans.
- **Mode Bricoleur** : inchangé pour l'instant (gratuit, sans essai).

## Ce qui change par rapport à l'idée de départ

Ne pas charger le code d'un module ne sert presque à rien : le planning (`agToday`, `chatSend`) sert partout, et la lecture seule
a besoin du code des devis, factures et pointages. On **verrouille** donc les écrans et les actions, et seul le code de la
newsletter (qui ne sert à rien d'autre) n'est pas chargé quand le module n'est pas pris.

## Étapes

### 1. Règles communes — `lib/plan.js` ✅
- `GRATUIT` : socle gratuit (chat, clients, rendez-vous simples, 1 devis par mois).
- `droits(compte, maintenant)` : `ouvert(module)` (sinon : verrouillé, données en lecture seule) ; `devisRestants()` pour le devis gratuit du mois.
- Le même fichier sert au serveur et à l'appli : la règle est écrite une seule fois.
- Tests : `tests/plan.test.js`.

### 2. Comptes e-mail sur le serveur — `serveur/auth.js` ✅
- `POST /api/auth/mail/creer` et `POST /api/auth/mail/entrer` : e-mail + preuve du mot de passe → session (comme Google / Microsoft).
- Le mot de passe ne part jamais tel quel : l'appli envoie une empreinte dérivée (différente de celle du coffre), le serveur la hache encore (scrypt).
- Limites d'essais par adresse IP et par e-mail ; même essai de 30 jours, même plan.
- Appli : à la création du compte et à la connexion, la session serveur est ouverte en même temps.
  Hors ligne : rien ne bloque ; la session est ouverte à la prochaine saisie du mot de passe avec réseau.
  Ouverture par Face ID seulement : pas de mot de passe saisi, donc pas encore de rattachement (à traiter à l'étape 3).
  Comptes e-mail déjà créés : rattachés au serveur à la prochaine saisie du mot de passe.
- Tests : `tests/auth.test.js` (serveur), `tests/compte-mail.test.js` (navigateur, avec son propre serveur).
- Limite connue : sans e-mail de vérification, quelqu'un peut créer un compte casô avec l'adresse d'un autre.
  L'essai reste limité à une fois par SIRET. Un code par e-mail pourra être ajouté quand un service d'envoi sera branché.

### 3. Verrous dans l'appli ✅ (`modules/abonnement.js`)
- Chaque écran est rattaché à un module ; un écran non pris affiche « Ajouter à mon abonnement » (ouvre « On construit le plan »).
- Lecture seule : listes et documents visibles, boutons de création et de modification masqués.
- Le chat répond « Le module Devis n'est pas dans ton abonnement · Ajouter » au lieu d'agir.
- Menu : un petit cadenas à côté des modules non pris.
- Sans réseau : la dernière liste connue est gardée (on ne verrouille jamais tout parce que le téléphone est hors ligne).
- Tant que le compte n'a pas encore de session serveur : traité comme en essai.

### 4. Chargement ✅
- `modules/newsletter.js` n'est pas chargé si le module Newsletter n'est pas pris (ni en essai).

### 5. Essais ✅
- Serveur : création e-mail, connexion, mauvais mot de passe, essai, fin d'essai, plan (`tests/auth.test.js`, `tests/compte-mail.test.js`).
- Navigateur : en essai (tout ouvert), après l'essai sans plan (socle seul, 1 devis par mois), avec plan, lecture seule,
  sans compte casô, Bricoleur (`tests/abonnement.test.js`).

## Reste à faire
- **Face ID seul** : sans mot de passe saisi, un compte e-mail déjà créé n'est pas rattaché au serveur, donc rien n'est verrouillé.
  Proposer une fois « Relie ton compte casô » (mot de passe demandé une seule fois).
- **Pointage** : « Pointer » est verrouillé ; ajouter un chantier ou une personne dans l'écran Pointage ne l'est pas encore.
- **Le serveur ne contrôle pas encore** le devis gratuit du mois ni les modules : tout est vérifié sur le téléphone.
  À faire avec le paiement (Stripe) : le serveur refusera les actions des modules non payés (numéros de facture, signature, prix en ligne).
