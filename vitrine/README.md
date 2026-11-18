# casô — vitrine 3D

Site vitrine de casô : une maison 3D que l'on fait tourner, que l'on explore pièce par pièce et que l'on rénove à l'écran, puis les fonctionnalités de l'appli.

**Ce dossier est indépendant de l'appli.** Il a ses propres dépendances et ne lit ni ne modifie aucun fichier de casô (`index.html`, `serveur/`, `lib/`…). L'appli continue de se lancer avec `node serveur/server.js`, sans rien installer de plus.

## Lancer

Node.js 22 ou plus.

```bash
cd vitrine
npm install
npm run dev      # site de travail sur http://localhost:3000
npm run types    # contrôle TypeScript
npm run build    # site statique dans out/
npm run apercu   # copie de out/ en chemins relatifs, dans apercu/ (aperçus seulement)
```

Le site est exporté en fichiers statiques : il n'y a pas de serveur Next.js en production.

## Liens vers l'appli

Un seul fichier : `src/config/liens.ts`. L'adresse de l'appli se règle avec la variable `NEXT_PUBLIC_CASO_APP_URL` au moment du build. La vitrine n'appelle aucune API et ne contient aucun secret : « Créer mon compte » et « Accéder à mon espace » ouvrent l'appli, qui gère les comptes.

## Organisation

```
app/                     page, mise en page, styles (couleurs et cartes de l'appli casô)
src/config/              liens vers l'appli, modèle 3D à charger
src/data/                données de démonstration : maison, finitions, textes
src/store/               état partagé (pièce choisie, avant / après, finitions, niveau graphique)
src/lib/                 détection de l'appareil et de WebGL
src/components/dom/      tout ce qui est HTML : en-tête, textes, cartes, curseur, plan 2D de secours
src/components/canvas/   tout ce qui est 3D
  Hero3D                 le canevas
  ShowcaseController     lumière et assemblage de la scène
  ArchitectureViewer     modèle .glb s'il est déclaré, sinon la maison du code
  HouseScene             murs, toit, animation d'entrée, toit qui s'ouvre
  ExteriorScene          socle, jardin, terrasse
  InteriorScene          sols et mobilier des pièces
  RoomHotspots           repères posés sur les éléments
  RenovationScene        limite avant / après dans la pièce
  CameraController       rotation, zoom, transitions vers les pièces
  matieres/              matières et textures dessinées dans le navigateur
public/models/           dossiers prêts pour de futurs modèles .glb
```

## Remplacer la maison par un modèle

La maison actuelle est construite dans le code : aucun fichier 3D n'est téléchargé. Pour un modèle plus réaliste, déposer le `.glb` dans `public/models/house/`, vérifier que sa licence permet l'usage commercial, l'ajouter à `CREDITS.md`, puis renseigner son chemin dans `src/config/modeles.ts`. Si le fichier ne se charge pas, la maison du code reste affichée.

## Niveaux graphiques

Choisis tout seuls selon l'appareil (`src/lib/appareil.ts`) : `high` (ombres fines), `medium` (ombres), `low` (sans ombres ni reflets). Sans WebGL, un plan 2D cliquable remplace la maison. Pour forcer un niveau pendant un essai : `?qualite=high`, `medium` ou `low` à la fin de l'adresse.

## Données de démonstration

La maison, ses mesures et l'avant / après sont un exemple dessiné pour la vitrine. Rien ne sort d'un relevé réel de casô, et le site l'indique (« Maison et mesures d'exemple »).
