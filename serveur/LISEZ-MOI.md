# casô : travailler à plusieurs

Seul, casô marche tout de suite sur ton téléphone, sans rien installer.
Pour **partager** les devis, les prix, les chantiers et les pointages avec ton équipe, il faut un **poste de l'entreprise** : un ordinateur qui reste allumé au bureau et qui garde les données. Elles restent chez toi.

## Les mots

| On dit | Ça veut dire |
|---|---|
| Poste de l'entreprise | L'ordinateur allumé qui partage les données |
| Espace | Ton entreprise dans casô, protégée par ton mot de passe |
| QR code | Le carré à scanner avec l'appareil photo, pour inviter quelqu'un |
| Adresse de l'entreprise | Ce qu'on tape si le QR code ne marche pas (ex. http://192.168.1.20:8787) |
| Mettre à jour | Envoyer et recevoir les changements |

## 1. Préparer le poste (une seule fois)

Mets le dossier dans l'ordinateur, par exemple `casô`.

- **Windows** : double-clique sur `Demarrer-Devis-BTP.bat`. La première fois, il installe tout seul ce qu'il faut (internet requis, quelques minutes). Si Windows demande l'accès au réseau, choisis **Autoriser** (réseau privé).
- **Mac** : double-clique sur `Demarrer-Devis-BTP.command` (installe d'abord Node.js depuis nodejs.org).

Une page s'ouvre. **Laisse la fenêtre noire ouverte** : c'est elle qui garde l'entreprise en marche.

## 2. Créer ton espace (patron)

Sur la page qui s'ouvre : ton prénom, un mot de passe, **Créer mon espace**. C'est tout.

## 3. Inviter quelqu'un

Dans l'appli : icône personne en haut à droite (**Compte**), carte **Équipe**, **Inviter quelqu'un**.

1. Écris son prénom et choisis son rôle.
2. Appuie sur **Créer le QR code**.
3. La personne ouvre l'**appareil photo** de son téléphone et scanne. C'est connecté : rien à taper, aucun mot de passe à retenir.

Il faut être sur le **même Wi-Fi** que le poste de l'entreprise. Un QR code ne marche qu'**une fois** et dure 7 jours. Téléphone perdu ou changé : bouton **QR code** à côté de son nom dans « Mon équipe ». Pour couper l'accès à quelqu'un : **Retirer**.

| Rôle | Peut faire |
|---|---|
| Patron | Tout, y compris inviter |
| Chef | Tout sauf gérer l'équipe |
| Ouvrier | Pointer ; voit les chantiers et les personnes. Ne reçoit ni les prix ni les devis |

## Si le QR code ne marche pas

Tu n'as pas besoin de connaître d'« IP » : la fenêtre noire affiche l'adresse toute faite, sur la ligne qui commence par `http://192.168...`. L'employé la tape dans le navigateur de son téléphone (Safari, Chrome). Sinon, appuie sur **Copier le lien** sous le QR code et envoie-le-lui par message.

Pour la retrouver toi-même :
- **Windows** : Paramètres, Réseau et Internet, Wi-Fi, ton réseau, « Adresse IPv4 ».
- **Mac** : Réglages Système, Wi-Fi, Détails, « Adresse IP ».
- **iPhone / Android** : Réglages, Wi-Fi, appuie sur ton réseau, « Adresse IP ».

L'adresse de l'entreprise, c'est `http://` + cette adresse + `:8787`. Exemple : `http://192.168.1.20:8787`.

## Au quotidien

- Le poste doit être **allumé**, fenêtre noire ouverte, pour que les téléphones se mettent à jour. Entre-temps chaque téléphone marche seul et envoie tout au retour.
- La mise à jour est automatique.
- Si deux personnes modifient la même fiche, la modification la plus récente gagne.

## Sauvegarde

Copie régulièrement le dossier `donnees` (fichier `data.json`) sur une clé USB. Ne le mets jamais sur GitHub.

## Sécurité

- Le Wi-Fi de l'entreprise doit être protégé par un mot de passe. Pas de Wi-Fi public.
- **N'ouvre jamais ce poste directement sur internet.** Pour y accéder depuis un chantier, utilise un accès privé de type VPN (par exemple Tailscale).
- Les heures de travail sont des données personnelles : préviens tes salariés.

## Utiliser un téléphone Android comme poste (préparé, non testé)

Possible avec l'application **Termux** (à installer depuis F-Droid) : copie ce dossier dans le téléphone puis lance `bash termux-demarrer.sh`. Le téléphone doit rester allumé, branché, avec Termux ouvert. **Cette voie n'a pas été testée sur un vrai téléphone** ; l'ordinateur reste le choix le plus fiable. Un iPhone ne peut pas servir de poste, seulement de téléphone d'employé.

## Limites actuelles

- Un poste = une entreprise.
- Deux téléphones qui créent un devis hors ligne en même temps peuvent obtenir le même numéro.
- La mémoire des formats de fournisseurs (import par photo) reste propre à chaque téléphone.
- Un ouvrier voit les pointages de ses collègues.
- Le fichier `.bat` Windows et le script Termux n'ont pas été testés sur de vrais appareils.
- L'appli publiée sur GitHub ne peut pas parler à un poste en `http://` : pour les invitations, ouvre l'appli depuis le poste lui-même (`http://localhost:8787`).

## Faire signer les devis par lien (service en ligne)

Dans le devis, **Valider le devis** ouvre l'écran de validation : **Revoir le devis** pour tout relire, **Signer** pour signer, puis **Valider et envoyer**. casô te demande alors comment l'envoyer (SMS, WhatsApp, e-mail, autre, ou copier le lien). Ton client reçoit un lien. Il ouvre le devis sur son téléphone, coche « bon pour accord », signe avec le doigt. Le devis passe en **Validé** chez toute l'équipe et tu reçois une notification.

Pour que le client puisse ouvrir le lien depuis chez lui, casô doit être **en ligne** (le poste du bureau n'est joignable qu'en Wi-Fi). Le plus simple, depuis un téléphone :

1. Mets tous les fichiers de ce dossier dans ton dépôt GitHub (Add file › Upload files).
2. Crée un compte sur **render.com**, puis **New › Blueprint** et choisis ton dépôt. Le fichier `render.yaml` règle tout.
3. Dans Render, ouvre le service **caso** › **Environment** et note la valeur de **SETUP_CODE**.
4. Ouvre l'adresse donnée par Render (`https://caso-xxxx.onrender.com`), va dans **Compte › Équipe**, crée ton espace : casô te demande le code de configuration, colle **SETUP_CODE**.
5. Invite ton équipe comme d'habitude (QR code). Cette fois, ça marche partout, pas seulement au bureau.

Coût indicatif : le service toujours allumé (« Starter ») environ 7 $ par mois, plus le disque (0,25 $ par Go et par mois). La formule gratuite ne convient pas : elle s'endort et ne garde pas les données. Vérifie les prix sur render.com/pricing.

**Notifications sur iPhone :** elles ne marchent que si casô est ajouté à l'écran d'accueil (Safari › Partager › Sur l'écran d'accueil), puis Compte › Notifications. Sur Android, ça marche directement.

**Valeur de la signature :** c'est une signature électronique simple, valable pour un devis. casô garde la date, l'heure, l'adresse IP du client et une empreinte du devis (SHA-256) : si le devis était modifié après coup, l'empreinte ne correspondrait plus. Pour de très gros montants, un service de signature certifié (Yousign, Docusign…) donne une preuve plus forte.

**PDF :** le PDF n'est disponible qu'une fois le devis validé par le client (Historique › PDF). Avant, seul le lien de signature est envoyé.

## Se repérer dans l'appli

- **Menu de gauche (logo casô)**, l'appli et ton travail : « Mon travail » (Nouveau devis, Mes devis, Clients, Fournisseurs) et « L'appli » (Langue et notifications, Sauvegarde).
- **Menu de droite (profil)**, toi et ton entreprise : Mon entreprise, Créer mon devis (ton modèle), Mon planning, Mon équipe, Ma signature, Se déconnecter.
- **En bas** : Devis (le chat), Mes services, Pointage, Historique.

## Clients dans le chat

- Un nom déjà enregistré est reconnu et associé (même juste « Dupont » pour Clément Dupont). « Mme Brown », « M. Martin » sont reconnus même sans « chez ».
- Plusieurs clients possibles (ex. trois « Clément ») : le chat affiche la liste avec leur adresse ou téléphone ; tu touches le bon. « Nouveau client » en crée un autre.
- **Prix par le chat** : « main d'œuvre 50€ », « pose carrelage 40 €/m2 », « change le prix du déplacement à 35€ » : le prix du service enregistré est changé ; s'il n'existe pas, le service est créé (au forfait, ou à l'unité dite : m², h, ml, jour). Aucun devis n'est créé ; si le devis ouvert contient ce service à un autre prix, « Appliquer aussi à ce devis » est proposé. « Annuler » remet comme avant. Avec une quantité (« 20 m2 de carrelage à 40€ »), ça reste une ligne de devis. « Ajoute(-moi) main d'œuvre 60€ » avec un devis en cours : une ligne au devis à 60 € (1 h), puis « Garder ce prix dans Mes services » (ou « Ajouter à Mes services » si le service n'existe pas) ; sans devis en cours, ça change le prix du service.
- « Ajoute mes services au devis » (ou « mes prix ») : le chat affiche la liste de Mes services avec leurs prix ; ceux qui correspondent au chantier sont déjà cochés et la surface dite avant (ex. « 19m2 ») est reprise pour les services au m². « Ajouter au devis » les met dans le devis du client du rendez-vous ; « Préparer le devis » rouvre ensuite ce devis déjà commencé.
- « chambre Mme X à 9h 19m2 » : rendez-vous à 9h (« à 9h » est une heure, pas 9 heures de main-d'œuvre).
- « Réserve le prochain créneau pour une terrasse chez Baptiste » : casô prend le premier créneau libre (1 h, ou la durée donnée : « de 3h », « une journée ») et l'ajoute au planning avec le client. Avec un jour : « réserve le premier créneau libre jeudi… ».
- Un rendez-vous avec un client : le chat affiche le bouton « Préparer le devis », qui ouvre le devis relié au rendez-vous.

## Connexion et création du compte

- Après l'intro : le logo, e-mail, mot de passe et le bouton **Connexion**. Dessous, centré : « Pas encore de compte ? **Créer ton compte** ». La langue se choisit tout en bas, en petit.
- **Créer ton compte** : 3 champs seulement. **Ton nom ou ton n° SIRET**, e-mail, mot de passe, puis **Créer mon compte**. En bas : « J'ai une invitation » (pour un employé : scanner le QR code du patron).
- Si tu tapes ton **nom**, il est enregistré tel quel.
- Si tu tapes un **SIRET, un SIREN ou un n° RCS/RM**, casô cherche l'entreprise dans l'annuaire public de l'État (recherche-entreprises.api.gouv.fr, gratuit, sans clé). Nom, adresse, SIRET, forme juridique et n° de TVA apparaissent déjà remplis ; tu vérifies et tu corriges si besoin. « Mon entreprise » est rempli d'office. Un numéro faux est signalé tout de suite. Sans réseau, tu remplis les champs toi-même (le n° de TVA est calculé).
- Un seul compte par téléphone : s'il y en a déjà un, « Créer ton compte » renvoie vers la connexion (ou « Mot de passe oublié ? »). Personne ne peut créer un compte par-dessus le tien pour lire tes devis.
- **Repartir de zéro** (pour revoir l'intro et la création du compte) : ajoute `?neuf` à la fin de l'adresse (ex. `…/devis.html?neuf`). Attention, ça efface le compte et les données de ce navigateur.

## Mot de passe oublié

À la création du compte, casô affiche un **code de secours** (ex. `95YE7-DKAAW`). Note-le : c'est le seul moyen de changer ton mot de passe si tu l'oublies (écran de connexion › **Mot de passe oublié ?**). Après usage, casô t'en donne un nouveau. Tu peux aussi en refaire un dans **Mon entreprise**.

Sans code, il reste **Je n'ai plus mon code** : le compte et les données de ce téléphone sont effacés. Si le téléphone était relié à ton entreprise, tu retrouves tes données en la rejoignant de nouveau.

## Astuces du chat

- **Les noms** : « M. Durand » ou « Madame Lefèvre » suffit, pas besoin d'écrire « client ». Un client déjà enregistré est reconnu par son nom seul. Si casô voit un nom qu'il ne connaît pas, il demande : **Client** ou **Fournisseur** ? Si tu donnes une adresse sans nom, il te demande le nom du client.
- **Les mesures** : tape un nombre, la barre apparaît au-dessus du champ (elle reste cachée sinon) : **m²**, **m**, **Largeur**, **Hauteur**, **Heures**. Un appui transforme « 50 » en « 50 m² », « 50 m de largeur »… Avec une largeur et une hauteur, casô calcule la surface tout seul (5 m × 3 m = 15 m²).

- **Les fautes** (4 novembre 2026) : le chat comprend les mots mal écrits, dans les 10 langues : lettre oubliée, en trop, inversée ou voisine sur le clavier, accents oubliés, mots collés ou coupés (« main doeuvre », « rendevous »), écriture SMS (« dm1 », « pr », « sdb », « tmrw », « mñn », « завтро »…). La bulle montre la phrase comprise ; en dessous, en petit, « Tu as écrit … ». Quelques fautes de grammaire courantes sont aussi comprises (« fait la facture », « je travail de 8h à 17h »).
  - **Les noms ne sont jamais changés tout seuls.** Un nom qui ressemble à un client connu (« Baptsite ») affiche « Tu parles de ce client ? » : tu choisis Baptiste ou « Nouveau client ».
  - **Les mots justes ne sont pas touchés** : casô connaît les mots courants de chaque langue et ceux de l'appli (pluriels, conjugaisons, déclinaisons).
  - **Plus de façons de dire les choses** : « ma journée », « montre mon planning », « bouge le rdv », « laisse tomber le rdv » ; et dans les autres langues « what's on », « mis citas », « ne var », « мои встречи », « ماذا عندي »…
  - Mesuré : 99 % des demandes avec fautes donnent le même résultat que sans faute (700 phrases, 10 langues ; 52 % avant). Moins de 1 mot juste sur 400 est changé à tort. Tests : `outils/test-fautes-chat.js`, `outils/test-fautes-10-langues.js`, `outils/test-fautes-mots-justes.js`.
  - Le dictionnaire ajoute environ 100 Ko (compressé) à la page ; il se prépare quand tu touches la zone de texte. Listes de mots courants : projet FrequencyWords (Hermit Dave, CC BY-SA 4.0).

## Plan à partir d'une photo

- Dans le chat, le petit bouton « Plan photo » (au-dessus de « Dicter une note ») ouvre la prise de photo ou l'import.
- Chaque photo est rangée dans un client, puis dans un projet (créé au besoin). On retrouve les plans dans la fiche du client.
- Le repérage (murs, angles, portes, fenêtres) se fait sur le téléphone, sans service payant. La photo reste sur le téléphone (IndexedDB) ; seul le plan (cotes, petite vignette) est synchronisé.
- Sans laser : toutes les cotes sont des estimations, marquées « ~ » et « à vérifier ». Avec laser : on mesure le mur A pour mettre tout le plan à l'échelle ; les autres cotes restent à vérifier.
- Aucune quantité n'entre dans le devis tant que l'artisan n'a pas mesuré ou validé chaque cote.

### Tour de la pièce (tous les iPhone)

- Dans « Faire le plan d'une pièce », choisir « Tour de la pièce » : on se met au milieu de la pièce, on tient le téléphone droit et on vise chaque angle au sol avec le viseur, en tournant sur soi-même. On peut ensuite viser les coins des portes et fenêtres, puis le haut d'un mur pour la hauteur sous plafond.
- Le téléphone calcule la distance avec son inclinaison et la hauteur à laquelle on le tient (1,50 m par défaut, réglable). Une seule mesure laser recale tout le plan.
- iPhone : l'appli demande l'accès « Mouvement et orientation » au toucher de « Démarrer ». Sous iOS 12, l'activer dans Réglages > Safari. Il faut que l'appli soit ouverte en https (Render).
- Téléphone sans gyroscope (ex. Galaxy A10) : mode « mur par mur », pièce rectangulaire, on vise le pied de chaque mur bien en face.

#### Calibrage du tour de la pièce

- Chaque visée est stabilisée : le téléphone moyenne 0,6 s de mesures et redemande si l'artisan bouge.
- « Étalonner le téléphone (une fois) » : viser un repère net, téléphone à l'endroit puis tête en bas. Le défaut d'inclinaison du téléphone est mesuré et gardé pour tous les tours suivants.
- « Étalonner la hauteur (conseillé) » : saisir la hauteur sous plafond (laser ou mètre), viser le pied puis le haut d'un mur. La hauteur du téléphone est calculée, et la hauteur sous plafond est validée.
- Les angles proches de 90° sont mis d'équerre (désactivable dans le plan).
- Chaque mur affiche sa précision estimée (± cm) ; les moins précis sont en tête de la liste « À vérifier ».
- Chaque mesure saisie (laser ou mètre) recale tout le plan à partir des visées gardées : hauteur du téléphone, et inclinaison quand une mesure verticale (hauteur sous plafond) est disponible.

## Mon planning

- Menu du profil > « Mon planning » : vues Jour, Semaine et Créneaux de travail.
- Le chat comprend les dates et les horaires (10 langues), sans service d'IA payant : un petit moteur de langage local repère les jours, heures, plages, noms et l'intention.
  - « mes créneaux de travail sont de 15h à 19h du lundi au vendredi » : tout le reste s'affiche « Indisponible ».
  - « mise de carrelage demain à 7h chez Osvald » : rendez-vous créé ; si Osvald n'est pas un client, il est créé et la notification « Nouveau client ajouté ! » propose « Préparer un devis ? ».
  - « je ne suis pas dispo vendredi », « congés du 24 au 31 décembre », « qu'est-ce que j'ai demain ? », « déplace le rdv chez Osvald à jeudi 16h », « annule le rdv chez Osvald ».
- Un rendez-vous en dehors des créneaux ou qui en chevauche un autre est signalé. Chaque action du chat peut être annulée.
- Un rendez-vous peut être envoyé dans l'agenda du téléphone (fichier .ics).
- Les rendez-vous sont synchronisés avec le serveur (collection « events »).

### Planning : rappels, créneaux libres, agenda iPhone, équipe

- Rappels la veille à 18h et 1 h avant (réglables dans Mon planning > Créneaux). Appli ouverte : bannière. Appli fermée : notification envoyée par le serveur (il faut avoir activé les notifications) au patron, au chef et aux ouvriers affectés, dans leur langue.
- « trouve-moi un créneau de 3h cette semaine », « suis-je libre jeudi à 14h ? » : casô cherche les trous dans les créneaux de travail ; toucher un créneau le réserve. Aussi dans Mon planning > Semaine.
- Répétitions : « réunion tous les lundis à 8h jusqu'au 21 décembre », ou dans la fiche (tous les jours, chaque semaine, du lundi au vendredi, tous les mois). « annule le rdv chez X » retire la prochaine séance, « annule tous les rdv chez X » la série.
- Équipe : « … avec Paulo et Karim » affecte les ouvriers (prénoms de Pointage). L'ouvrier voit ses rendez-vous ; l'onglet Pointage montre « Rendez-vous du jour » avec « Pointer ici ».
- Agenda de l'iPhone : « S'abonner dans Calendrier » crée un lien secret webcal:// (un par personne, l'ouvrier ne voit que ses rendez-vous) ; le Calendrier se met à jour tout seul. Sans serveur : export .ics.

## Facturation

- Historique > onglet Devis : « Facturer » sur un devis validé. S'il y a un acompte : facture d'acompte d'abord, puis la facture finale déduit les acomptes. Sinon : facture complète.
- Avant d'émettre, casô vérifie les mentions obligatoires (SIRET, adresse, TVA ou franchise, assurance décennale, adresse et SIREN du client pro, date des travaux) et bloque tant qu'il en manque. Compléter dans Mon entreprise : forme juridique, RM/RNE, TVA intracommunautaire, IBAN, délai de paiement.
- Une facture émise est figée : numéro continu par année (F2026-0001…), infos de l'entreprise copiées. Pour corriger : un avoir (A2026-0001…). Avec le serveur, c'est lui qui donne les numéros (pas de doublon entre téléphones).
- Mentions gérées : TVA par taux, franchise (art. 293 B du CGI), autoliquidation sous-traitance (art. 283-2 nonies du CGI), mention TVA réduite signée par le client (logement de plus de 2 ans, rénovation énergétique à 5,5 %), retenue de garantie, échéance, pénalités, indemnité de 40 € pour les clients pros, pas d'escompte, IBAN, décennale.
- Paiements (virement, chèque, espèces, carte), reste dû, factures en retard (bannière à l'ouverture), relance du client. Dans le chat : « facture Osvald », « Osvald a payé 500 € ».
- Envoi au client par un lien casô (SMS, WhatsApp, e-mail) : le client voit la facture, l'IBAN, le reste à payer, et certifie en ligne la TVA réduite si besoin. casô sait quand il l'a ouverte. Le lien se met à jour à chaque paiement enregistré.
- Le PDF n'existe qu'une fois la facture payée (« PDF acquittée », avec le tampon ACQUITTÉE et les règlements) — pour l'artisan comme pour le client. Avant, rien ne sort de l'appli. Les avoirs ont leur PDF dès l'émission.
- Le PDF passe par l'impression du téléphone (Partager > Enregistrer en PDF) et reste toujours en français.
- Facturation électronique : réception obligatoire depuis le 1er septembre 2026 ; émission obligatoire pour les TPE et micro-entreprises au 1er septembre 2027, via une plateforme agréée. casô ne remplace pas cette plateforme.

## Créer mon devis (le modèle de ton entreprise)

Menu profil › « Créer mon devis ». Tu construis **une fois** le modèle de devis de ton entreprise, sans client : en-tête et logo, couleurs, police, textes (présentation, conditions de paiement, délais, garanties…), photos de tes réalisations, ordre des blocs. Ensuite, **chaque devis fait dans le chat** (ou par dictée, ou depuis un plan) sort automatiquement avec ce modèle, rempli avec le client, les prestations et les montants du chat.

- La première fois, tu choisis un point de départ (Classique, Moderne, Épuré, Dossier complet, Page blanche), puis tu le modifies. Les fois suivantes, « Créer mon devis » rouvre directement ton modèle.
- Dans l'éditeur, le client, les prestations et les totaux sont des **exemples grisés** : ils seront remplacés par ceux de chaque devis.
- Toucher un bloc le sélectionne (Monter, Descendre, Modifier, Dupliquer, Supprimer) ; la poignée bleue permet de le glisser ; le « + » entre deux blocs en ajoute un. Annuler / Rétablir et Aperçu A4 en haut.
- Dans un texte, les boutons « + Nom du client », « + Total TTC », « + Acompte », « + Date du devis », « + Fin de validité » ajoutent la vraie valeur de chaque devis. Une ligne qui commence par « - » devient une puce.
- Le bloc « Surfaces du plan » se remplit avec les mesures validées quand le devis vient d'un plan ; sinon il n'apparaît pas.
- Les blocs obligatoires (en-tête, client, prestations, totaux, mentions légales, signatures) se déplacent et se règlent mais ne se suppriment pas.
- Le modèle est rangé dans « Mon entreprise » : toute l'équipe l'utilise.
- **À l'envoi pour signature, le modèle est figé dans le devis** : si tu changes ton modèle plus tard, les devis déjà envoyés ou signés ne bougent pas. Le PDF n'existe qu'une fois le devis signé.
- « Revoir le devis » (écran de validation) montre le devis tel qu'il partira, avec un bouton « Modifier mon modèle ».

Tests : `node outils/test-devis-canvas-appli.js` (avec `python3 -m http.server 8765` lancé dans le dossier de devis.html) et `node outils/test-devis-canvas.js` (page de signature).

## Choix du module, clients, achats fournisseurs (4 novembre 2026)

- **Après la création du compte** : un écran demande « Artisan » ou « Bricoleur du dimanche », puis un écran montre le code de secours (bouton « Copier le code »), puis on entre dans l'appli. Le Bricoleur du dimanche n'est pas encore prêt : son choix est gardé, un écran « arrive bientôt » propose d'utiliser casô Artisan en attendant. Le choix se change dans le menu du compte, « Mon module ».
- **Fiche client** : « Coller » remplit la fiche à partir d'un SMS, d'un e-mail ou d'une signature. « Photo » lit une carte de visite ou un papier, sur le téléphone. « Contacts » apparaît seulement sur les téléphones qui le permettent (Android), pas sur iPhone. Avec internet, l'adresse est proposée pendant la frappe (Base Adresse Nationale, service gratuit de l'État : seul le début de l'adresse est envoyé). En haut d'une fiche : Appeler, SMS, E-mail, Itinéraire. Le nom et le téléphone sont remis en forme (« jean dupont » → « Jean Dupont », « 0612345678 » → « 06 12 34 56 78 »).
- **Chat** : l'e-mail est gardé, le code postal et la ville vont dans l'adresse (« 12 rue des Lilas 69003 Lyon », « à Lyon »), « nouveau client Mme Petit » est compris. Un texte collé (nom, téléphone, e-mail, adresse) garde toutes ses coordonnées quand on touche « Client » ou « Fournisseur ». Corrigé : une phrase française avec « à » était parfois prise pour de l'anglais (« client Martin à Lyon » donnait « Martin Un »).
- **Fournisseurs** : « Photo d'un devis ou d'une facture » et « Fichier (PDF ou image) ». La lecture se fait sur le téléphone : le fournisseur, le type (devis, facture, ticket, bon de livraison), le n°, la date, le total TTC et « déjà payé » sont trouvés tout seuls. Les lignes vont dans Mes services, dans le devis en cours, ou nulle part (« Rien (garder le document) »). Le document est gardé dans les **Achats** du fournisseur, avec « À payer » ou « Payé » et un bouton « Marquer payé ». En haut de l'écran Fournisseurs s'affiche le total des factures à payer. Les coordonnées du fournisseur (téléphone, adresse, SIRET) sont remplies depuis le document.
- **Modules de lecture** : la lecture des photos (Tesseract 5.1.1) et des PDF (pdf.js 3.11.174) est gratuite. Ces modules se téléchargent une seule fois, avec internet, puis `sw.js` les garde pour l'utilisation sans réseau. Les versions sont figées et la politique de sécurité n'autorise qu'elles. **Il faut donc aussi remplacer `sw.js` sur GitHub.**
- **Ménage** : Mes services montre une ligne par service (on la touche pour changer le prix, la croix supprime). Au pointage, quand il n'y a encore ni chantier ni personne, on les crée sur place, ou en touchant un client. Le planning du jour sans créneaux va de 6 h à 21 h, et non plus de 0 h à 24 h. « Mon équipe » ne montre plus l'adresse technique d'office. La sauvegarde a un vrai bouton « Restaurer une sauvegarde ». Retirés : le bouton « Retour » en double dans le menu du compte, l'ancienne clé d'IA payante, la bande orange vide du plan et quelques textes d'explication.
- Tests : `test-module-artisan.js`, `test-fiche-client.js`, `test-achats-fournisseurs.js`. La partie PDF du dernier test demande pdf.js dans `outils/pdfjs`, ou la variable `PDFJS`.

## Apprentissage partagé du chat (10 novembre 2026)

- `GET /api/appris?l=fr` et `POST /api/appris` (sans compte) : les appareils envoient les demandes de lecture apprises par leur chat
  (ouvrir un écran, une information), sous forme masquée, et reçoivent celles des autres. Le serveur refuse les chiffres, les nombres,
  les noms, les textes et les commandes qui modifient quelque chose. Les usagers sont comptés par une empreinte de leur adresse réseau
  (l'adresse elle-même n'est pas gardée).
- Rangé à part dans `donnees/appris.json` (1 000 phrases au plus par langue ; plein, une phrase apprise par plusieurs usagers n'est
  jamais remplacée), écrit toutes les minutes sans bloquer le serveur, 10 envois par heure et par adresse au plus.

## Sécurité et anti-fraude (3 novembre 2026)

Deux relectures de sécurité indépendantes (serveur, appli) ; chaque faille trouvée est corrigée et a son test (`outils/test-securite-serveur.js`, `outils/test-securite-appli.js`, `outils/test-anti-fraude.js`).

- **Factures et paiements scellés** : à l'émission, chaque facture reçoit une empreinte SHA-256 ; chaque paiement aussi. « Encaissements › Contrôle d'intégrité » recalcule tout et signale une facture ou un paiement modifié après coup, et tout numéro manquant.
- **Le serveur fige les factures émises** : montants, lignes, client, numéro ne changent plus ; une facture émise ne peut pas être supprimée ; seuls les paiements s'ajoutent. Numérotation sans saut volontaire.
- **Employé (ouvrier)** : le serveur ne lui envoie que ses rendez-vous, ses pointages et sa fiche. Il ne peut plus toucher aux réglages de l'entreprise.
- **Données reçues nettoyées** : tout ce qui arrive par la synchronisation ou une sauvegarde importée est remis en forme (nombres, dates, valeurs connues, images vérifiées) : une donnée piégée ne peut plus exécuter de code dans l'appli.
- **Connexion** : 5 essais, puis attente croissante (30 s à 15 min) ; mots de passe protégés par 600 000 tours de PBKDF2 ; mots de passe du serveur : 8 caractères minimum ; jetons de session gardés sous forme d'empreinte.
- **Supprimer l'espace de l'entreprise** : le mot de passe du serveur est redemandé ; la suite des numéros de facture est gardée.
- **En-têtes de sécurité** (CSP, nosniff, no-referrer, interdiction d'affichage dans un cadre, HSTS derrière Cloudflare), erreurs internes jamais montrées, adresses du réseau local cachées.
- **Réglages de mise en ligne** : `TRUST_CF=1` (vraie adresse du client derrière Cloudflare), `PUBLIC_URL=https://api.caso.fr` (liens de signature), `SETUP_CODE` (création du compte patron à distance).
- **Limites connues** : sur le téléphone, les données ne sont pas chiffrées (le blocage après 5 essais protège l'écran, pas les données) — à traiter avec l'appli native (trousseau iOS / Android, Face ID). Les gestionnaires `onclick` dans la page obligent à garder `'unsafe-inline'` dans la CSP.

## Hors ligne, encaissements, suppression du compte (3 novembre 2026)

- **Sans réseau** : l'appli s'ouvre même sans réseau (le fichier `sw.js` garde une copie de la page). Pour la version GitHub, mets **`sw.js` à côté de `index.html`**. Les modifications faites hors ligne partent toutes seules au retour du réseau.
- **Copie de secours** : les données sont aussi copiées dans la mémoire IndexedDB du téléphone. Si iOS vide la mémoire du navigateur, casô remet tout à la réouverture.
- **Paiements verrouillés** : un paiement enregistré ne se modifie pas et ne s'efface pas. En cas d'erreur, « Annuler » sur la facture ajoute une écriture inverse ; le paiement reste visible, barré.
- **Encaissements** (menu du logo) : total encaissé par période (mois, année, dates au choix), détail par mode de paiement, export CSV pour le comptable.
- **Supprimer mon compte** (Mon entreprise) : demande le mot de passe et propose de télécharger ses données avant (factures à garder 10 ans). Employé : son compte seulement. Patron relié au serveur : tout l'espace de l'entreprise est effacé sur le serveur. Sans réseau, rien n'est effacé.

## Corrections et vitesse (2 novembre 2026)

Relecture complète du code : environ 60 défauts corrigés, chacun avec un test (`outils/test-corrections-appli.js` et `outils/test-corrections-serveur.js`). Les plus importants :

- **Sécurité** : liens de pointage, numéros et identifiants piégés neutralisés ; un ouvrier ne modifie plus que ses propres pointages ; notifications envoyées seulement vers Apple, Google, Mozilla et Microsoft (option `pushAnyHost` réservée aux tests) ; blocage des essais de mot de passe par client derrière Render ; identifiants « __proto__ » refusés.
- **Signature** : un devis signé ne peut plus être modifié, ni par l'appli ni par la synchro ; le devis validé reprend exactement le document signé ; un devis envoyé puis modifié repasse en brouillon et l'ancien lien est annulé ; « Dupliquer » ne recopie plus la signature.
- **Factures** : avoir total juste sur une facture finale ; une facture annulée par avoir n'est plus marquée « payée » ; pas de deuxième avoir au-delà du montant ; numéro de facture jamais perdu ni doublé (double appui, réseau coupé) ; paiements saisis sur deux téléphones tous gardés ; totaux du devis arrondis comme ceux de la facture.
- **Données** : le formulaire du devis s'enregistre tout seul ; alerte si la mémoire du téléphone est pleine ; restauration d'anciennes sauvegardes ; dates locales (plus de devis daté de la veille entre minuit et 2 h) ; serveur : un fichier de données abîmé n'est plus jamais écrasé.
- **Planning** : « mardi de la semaine prochaine », « du 24 au 2 », « annule le rdv de 14h », « déplace le rdv de 9h à 16h », « ce soir », numéros de rue, phrases de travaux prises pour des commandes, etc.
- **Plan et tour** : un mur validé qui change de longueur redevient « à vérifier » ; caméra bien arrêtée ; nouveau tour sans reprise de l'ancienne hauteur.
- **Vieux iPhone** (iOS antérieur à 16.4, par exemple iPhone 6s ou 7) : avant, l'appli restait blanche. Maintenant, seul le module qui comprend les phrases du planning et des paiements dictés manque ; le reste fonctionne (vérifié en simulant l'absence du module, pas sur un vrai vieil iPhone).

Vitesse (mesurée sur un processeur ralenti comme un téléphone) : ouverture environ 25 % plus rapide, enregistrement et historique 2 fois plus rapides, pointage près de 4 fois plus rapide ; l'animation d'accueil s'arrête au lieu de tourner en arrière-plan et dure 1,2 s au lieu de 2,2 s aux ouvertures suivantes.
