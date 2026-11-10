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
- léger débruitage ;
- sous l'horizon, le ciel fourni montre une mer qui reflète le soleil. Cette lumière venue d'en bas éclairait les plafonds à travers les fenêtres. Elle est remplacée par un sol uni, éclairé par le ciel ;
- matières « photo », selon le nom que le module 3D donne à chaque matière :
  - parquets et carrelages : vernis (`clearcoat`), où les fenêtres se reflètent ;
  - laques, portes, plinthes : satinées ;
  - sanitaires et écrans : émaillés ;
  - plans de travail et bois : légèrement vernis.
  Le velours des tissus (`sheen`) a été essayé puis écarté : il scintille aux faibles nombres de passes.
- développement « appareil photo » après le débruitage (`look`) :
  - halo autour des zones très claires (fenêtres, lampes) ;
  - balance des blancs ;
  - courbe de tons neutre (`NeutralToneMapping`), plus proche d'une photo de téléphone qu'ACES ou AgX ;
  - léger vignetage et grain fin.

## Vitesse

- Le shader n'est compilé qu'une fois. Ses options sont fixées avant la préparation de la scène (PCG, pas de flou de mise au point, pas de brouillard, ciel en fond). Sans cela, la bibliothèque le recompilait quatre fois.
- La scène n'est pas dessinée en rendu classique pendant la compilation (`rasterizeScene = false`). Elle obligerait à compiler d'autres shaders.
- Le moteur, le shader et le ciel restent en mémoire d'un rendu à l'autre.
- La vue 3D habituelle est affichée tout de suite, floue et assombrie pour qu'on ne la prenne pas pour le résultat. L'image calculée la remplace ensuite.
- La toile est « touchée » à chaque image par un effacement de zone vide (`present`). Le navigateur doit alors l'afficher, et il attend que la carte graphique ait fini avant l'image suivante. Sans cela, les calculs hors écran s'empilaient sans freiner la boucle, et le temps mesuré ne correspondait pas au travail réellement fait.
- La cadence suit l'appareil : tant que les images s'enchaînent en moins de 20 ms, le moteur calcule davantage par image ; au-delà de 40 ms, il en calcule moins. (Les repères `fenceSync` ont été essayés : `getSyncParameter` ne se met pas à jour dans Chrome et `clientWaitSync` y bloque la page.)
- Le débruitage est dessiné au plus 4 fois par seconde. Il est plus fort dans les vues intérieures (`denoise` : rayon et seuil les plus bas atteints), où le plafond n'est éclairé qu'indirectement et reste granuleux plus longtemps.
- Le calcul s'arrête à l'objectif de passes ou au bout du temps donné (`budget`), selon ce qui arrive en premier. Le module 3D règle ces valeurs ainsi :

| | Pixels | Rebonds | Objectif de passes | Durée maximale |
|---|---|---|---|---|
| Téléphone | 0,4 million au plus | 3 dehors, 4 dedans | 120 dehors, 200 dedans | 25 s |
| Ordinateur | 1,2 million au plus | 4 dehors, 5 dedans | 400 dehors, 600 dedans | 40 s |

## Réglages et mesures

- `redraw(dn, look, exposure)` redessine la dernière image avec un autre débruitage, un autre développement ou une autre exposition, sans relancer le calcul. Cela sert à comparer des réglages.
- `onStage(étape, ms)` indique la durée de chaque étape : moteur, aperçu, conversion, préparation de la scène, première passe, fin.

## Reconstruire

Placer les sources dans un dossier de travail, sous `node_modules/` :

- `three` : dépôt mrdoob/three.js, tag r187 (`build/`, `examples/jsm/`, `package.json`).
- `three-mesh-bvh` : dossier `src/`, avec un `package.json` dont `main` est `src/index.js`. Lancer d'abord `python3 gen_bvh.py node_modules/three-mesh-bvh/src` : le script crée les fichiers `*.generated.js` à partir des gabarits.
- `three-gpu-pathtracer` : dossier `src/`, avec un `package.json` dont `main` est `src/index.js`.

Puis lancer :

    bun build ./entry.js --format iife --minify --target browser --outfile ./caso-photo.js

Les licences sont dans `lib/caso-photo.LICENSE`.
