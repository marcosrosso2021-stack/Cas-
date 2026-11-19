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
- Chaque écran est rattaché à un module ; un écran non pris garde un bandeau « Lecture seule · Ajouter ».
- Une action d'un module non pris ouvre directement « On construit le plan », le module coché, avec un petit mot propre au module.
- Profil : une pastille discrète (icône, « Essai · 12 j », « 3 modules · 15 € » ou « On construit le plan ») ouvre le plan.
- Mon planning (rendez-vous simples) et Mes services restent ouverts dans le socle gratuit.
- Lecture seule : listes et documents visibles, boutons de création et de modification masqués.
- Menu : un petit cadenas à côté des modules non pris.
- Le module « Paiement » s'appelle « Encaissements », comme son écran : à encaisser en haut, encaissé sur la période dessous.
- Sans réseau : la dernière liste connue est gardée (on ne verrouille jamais tout parce que le téléphone est hors ligne).
- Tant que le compte n'a pas encore de session serveur : traité comme en essai.

### 4. Chargement ✅
- `modules/newsletter.js` n'est pas chargé si le module Newsletter n'est pas pris (ni en essai).

### 5. Essais ✅
- Serveur : création e-mail, connexion, mauvais mot de passe, essai, fin d'essai, plan (`tests/auth.test.js`, `tests/compte-mail.test.js`).
- Navigateur : en essai (tout ouvert), après l'essai sans plan (socle seul, 1 devis par mois), avec plan, lecture seule,
  sans compte casô, Bricoleur (`tests/abonnement.test.js`).

## Fait ensuite
- **Face ID seul** ✅ : un compte e-mail pas encore relié au serveur reçoit une fois « Relier mon compte » (mot de passe vérifié
  sur le téléphone, puis session casô) ; ensuite la pastille du profil le propose. Google / Outlook expiré : « Se reconnecter ».
- **Contrôle du serveur** ✅ pour les prix en ligne : refusés (403) à un compte Artisan sans le module Fournisseurs après l'essai ;
  l'appli met alors sa liste à jour et ouvre le plan.

## Reste à faire
- **Signature des devis et numéros de facture** : ils passent par le serveur de l'équipe, avec une clé d'équipe qui n'est pas
  liée au compte casô. Pour que le serveur les contrôle, il faudra relier l'équipe au compte casô du patron (à faire avec Stripe).
- **Pointage** : ajouter un chantier ou une personne dans l'écran Pointage n'est pas verrouillé.

## Prochaines étapes (demandées)
- **Clés Mailjet sur l'hébergement** : `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `MAIL_FROM` (voir serveur/LISEZ-MOI.md), et domaine validé (SPF, DKIM).
  Sans elles, l'envoi par e-mail reste caché et l'appli propose Copier le message / Partager.
- **casô collaborateur** : l'appli du collaborateur invité (son pointage, ses heures, ses paiements). Il faut d'abord un espace
  d'équipe par entreprise sur le serveur casô (aujourd'hui un seul espace, « e1 ») pour rejoindre son patron à distance.
- **casô client final** : l'espace du client (ses devis, factures, suivi du chantier). La page de signature refaite en est le début.
- **E-mail rédigé par une vraie IA** : aujourd'hui rédigé sur le téléphone à partir du devis ; une IA en ligne (Claude) demanderait une clé.
- **Signature des devis et numéros de facture contrôlés par le serveur** selon l'abonnement (avec Stripe).
- **Pointage** : ajouter un chantier ou une personne n'est pas verrouillé par l'abonnement.
