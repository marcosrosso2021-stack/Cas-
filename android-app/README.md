# casô · enveloppe Android

Cette branche ajoute un dossier `android-app/` et un fichier `.github/workflows/android-apk.yml`.
Le site casô à la racine n'est pas modifié.

## Obtenir l'APK de test

1. Sur GitHub : onglet **Actions** > **APK Android** > **Run workflow**.
2. Attendre la fin (quelques minutes), ouvrir l'exécution, télécharger **caso-android-apk**.
3. Décompresser le zip sur le téléphone Android et installer `app-debug.apk`
   (Android demande d'autoriser l'installation depuis cette source).

## Ce que fait le pointage automatique

- Pour chaque rendez-vous d'aujourd'hui et de demain où la personne est dans l'équipe, avec une adresse,
  casô trouve les coordonnées du chantier et inscrit la zone (100 m par défaut) auprès d'Android.
- Android note l'heure d'entrée et de sortie même quand casô est fermé.
- À chaque ouverture de casô, ces passages sont traités par le moteur
  (`web/pointage-auto.js`, testé par `test/pointage-auto.test.js`) et écrits dans le pointage existant,
  avec la note « automatique (GPS) ».

## Limites de cette première version

- Les heures sont exactes, mais elles n'arrivent dans casô qu'au réveil de l'appli.
  L'envoi immédiat vers le serveur de l'entreprise demande un point d'entrée côté serveur.
- casô doit s'ouvrir au moins un jour sur deux pour inscrire les zones des rendez-vous suivants.
- Le code Android n'a pas encore été compilé : la première exécution du workflow peut révéler des erreurs à corriger.
- Pas de lien d'invitation par QR code dans l'appli (il s'ouvre dans le navigateur).
- Android demande une fois la localisation puis « Toujours autoriser » (réglages de l'appli).
  Sur certaines marques, exclure casô de l'économie de batterie.
