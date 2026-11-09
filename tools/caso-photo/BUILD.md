# lib/caso-photo.js — rendu photoréaliste du module 3D

`lib/caso-photo.js` est un seul fichier, chargé par une simple balise `<script>` seulement quand on touche « Rendu photo ». Il expose `window.CasoPhoto`. Il regroupe trois bibliothèques MIT :

- three.js r187
- three-mesh-bvh 0.9.18
- three-gpu-pathtracer 0.0.28

`entry.js` est le point d'entrée. Il reçoit la scène du module 3D (three r128) et la convertit pour three r187. Il calcule ensuite l'image par lancer de rayons. Ces choix sont faits :

- ciel HDR et soleil de la maquette, pour des ombres nettes ;
- panneaux d'éclairage au plafond pour les vues intérieures ;
- verre et eau traités comme vraiment transparents ;
- tirage aléatoire PCG, car l'échantillonnage « stratifié » ne converge pas ;
- léger débruitage.

## Reconstruire

Placer les sources dans un dossier de travail, sous `node_modules/` :

- `three` : dépôt mrdoob/three.js, tag r187 (`build/`, `examples/jsm/`, `package.json`).
- `three-mesh-bvh` : dossier `src/`, avec un `package.json` dont `main` est `src/index.js`. Lancer d'abord `python3 gen_bvh.py node_modules/three-mesh-bvh/src` : le script crée les fichiers `*.generated.js` à partir des gabarits.
- `three-gpu-pathtracer` : dossier `src/`, avec un `package.json` dont `main` est `src/index.js`.

Puis lancer :

    bun build ./entry.js --format iife --minify --target browser --outfile ./caso-photo.js

Les licences sont dans `lib/caso-photo.LICENSE`.
