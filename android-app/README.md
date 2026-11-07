# casô · enveloppe Android

Le site casô à la racine reste une PWA. Ce dossier l'emballe dans une appli Android qui pointe toute seule.
Dans `index.html`, trois petites modifications du module Pointage y parlent de ce pointage ; elles ne font rien sur le site web.

## Obtenir l'APK de test

1. Sur GitHub : onglet **Actions** > **APK Android** > l'exécution la plus récente (ou **Run workflow**).
2. Télécharger **caso-android-apk**, décompresser, installer `app-debug.apk` sur le téléphone Android.

## Ce que voit la personne (écran Pointage)

Une seule carte, sans bouton :

| Situation | Texte |
|---|---|
| Chantier prévu | nom du chantier et heure, « Prochain chantier » |
| Arrivée détectée | « Sur place · chantier, depuis 08:02 » |
| Sortie détectée | « Sortie en cours de confirmation », puis l'heure est écrite dans le journal |
| Aucun rendez-vous avec adresse | « Aucun chantier prévu avec une adresse. » |
| Adresse non trouvée | « Adresse introuvable · chantier » |
| Position « Toujours » refusée | une phrase et un bouton **Autoriser** (ouvre les réglages si besoin) |
| Téléphone non associé à une personne | « Ce téléphone n'est lié à aucune personne… » |

Le pointage manuel ne disparaît que lorsque l'automatique tourne vraiment (personne reconnue, autorisation donnée, zone inscrite).
Sinon il reste, avec l'état au-dessus. Les entrées et sorties sont écrites dans le journal existant, avec la note « automatique (GPS) ».

## Comment ça marche

- Pour chaque rendez-vous d'aujourd'hui et de demain où la personne est dans l'équipe, avec une adresse :
  recherche des coordonnées (service de l'État, une fois par chantier), zone de 100 m inscrite auprès d'Android.
- Android note l'heure d'entrée et de sortie, casô fermé. Au réveil, `web/pointage-auto.js` (le moteur) traite ces passages.
  Arrivée : 60 s dans la zone. Sortie : 10 min sans retour. Cas douteux : « à vérifier ».
- Personne de ce téléphone : utilisateur de l'entreprise, sinon prénom du compte, sinon l'unique personne de la liste.
- Les textes sont traduits dans les 9 langues de casô (`web/caso-native.js`), sans écraser les traductions existantes.

## Tests

```
cd android-app
npm test            # moteur (18 tests) et pont (18 tests), sans dépendance
npm run test:e2e    # 6 tests : vrai casô dans un navigateur avec un faux Android (demande playwright)
```

`npm test` tourne aussi dans la construction de l'APK.

## Limites connues

- Non testé sur un vrai téléphone : alertes de zone, autorisation « Toujours », économie de batterie.
- Les heures sont exactes mais n'arrivent dans casô qu'à son réveil (au moins une ouverture par jour, ou la minute qui suit un passage si l'appli est ouverte).
- Android peut retarder une alerte de 2 à 6 minutes. Sur Samsung et Xiaomi, exclure casô de l'économie de batterie.
- Les traductions ont été écrites sans relecteur natif.
