# Campagne ŒIL 3D : 100 utilisateurs

Banc de test de bout en bout : chaque utilisateur joue dans une session de navigateur vierge sur l'appli casô réelle.

- `scenarios.js` : les 100 demandes. Pour chacune : profil, mode, donnée de test, résultat attendu, correction envoyée ensuite.
- `runner.js` : exécution avec Playwright. Il écrit dans `<JOURNAL>/<id>.json` les réponses, l'état de la maquette avant et après, les temps et les erreurs, avec les captures.
- `evaluate.js` : notation sur 100. Crée `rapport.json`.
- `seed.js` : données de test du compte Artisan (clients, devis, planning de la semaine).
- `data/plan_main.jpg` : plan dessiné. Vérité : 10 × 8 m, 4 pièces de 27, 21, 18 et 14 m².

## Lancer

1. Servir la racine du dépôt sur le port 8790 : `python3 -m http.server 8790`.
2. Copier la vidéo de test dans `data/chambre.webm` et 5 photos de la même pièce dans `data/photo_{1,3,5,7,9}.png`. Elles ne sont pas dans le dépôt.
3. Lancer `JOURNAL=run WORKERS=2 node runner.js`, puis `node evaluate.js run`.

En test hors ligne, les modèles DETR et OWLv2 et le moteur ONNX peuvent être copiés dans `lib/vision/`. casô vérifie leur empreinte.
Le module 3D reçoit au chargement une sonde de lecture (`window.__m3dS`), uniquement dans le banc. Le logiciel n'est pas modifié.
