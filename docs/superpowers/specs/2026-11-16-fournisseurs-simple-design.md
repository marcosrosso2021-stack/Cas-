# Fournisseurs : écran simple, résultats par magasin (16 nov. 2026)

## Pourquoi
Marcos trouve l'écran Fournisseurs confus : dans « Prix en ligne », produit, prix et magasin sont mêlés, tous magasins confondus, et les boutons prennent trop de place. Il manque aussi des magasins français. Il veut un écran simple, dynamique, moderne, avec des boutons discrets.

## Buts
- Lire d'un coup d'œil : quel magasin, quel produit, quel prix.
- Moins de boutons visibles, plus petits.
- Donner un accès aux enseignes absentes des résultats.

## Hors sujet
- Changer de service de prix.
- Photos des produits : la sécurité de l'appli bloque les images venues d'ailleurs (`img-src 'self'`). À voir à part, après lecture d'une vraie réponse du service.
- Fiche d'un fournisseur et import de facture : inchangés.

## À éviter
- Un texte ou un bouton sans nécessité (règle de casô).
- Un prix présenté comme « le moins cher » alors que des enseignes manquent.

## Approches
1. **Par magasin (choisie par Marcos)** : un bloc par enseigne, ses produits dessous. On voit tout de suite qui vend quoi.
2. Par produit : cartes avec le magasin en étiquette et filtres. Reste une longue liste mêlée.
3. Comparatif : une ligne par magasin. Cache les autres offres du magasin.

## L'écran
Titre, deux onglets, une barre de recherche. Demande de Marcos après lecture : plus de globe, une loupe qui est le bouton de recherche ; elle s'allume en jaune dans « Prix en ligne » dès qu'il y a un mot à chercher.

Accord de Marcos le 16 nov. 2026 (rangement par magasin, puis la loupe).

### Onglet « Mes fournisseurs »
- Trois icônes rondes discrètes à droite de la barre : photo d'une facture, fichier, nouveau fournisseur. Plus de grands boutons ni de ligne « + Nouveau ».
- Liste : pastille avec l'initiale, nom, une ligne de détail (téléphone, ville).
- « À payer » seulement s'il y a quelque chose à payer.

### Onglet « Prix en ligne »
- Barre vide : dernières recherches, puis « Mes favoris » rangés par magasin.
- Résultats : un bloc par magasin, du magasin le moins cher au plus cher.
  - En-tête : nom du magasin, nombre d'offres.
  - Lignes : nom du produit (2 lignes au plus) à gauche, prix TTC en gros à droite, du moins cher au plus cher.
  - 3 offres visibles par magasin, puis « n de plus » qui déplie.
  - Par ligne, deux icônes sans cadre : étoile (favori) et + (Mes prix). Toucher la ligne ouvre la page du magasin.
- Sous les résultats, « Autres magasins » : les enseignes françaises absentes des résultats (Point.P, Cedeo, Rexel, Brico Dépôt, Bricoman, Gedimat, Würth…), en pastilles qui ouvrent la recherche du produit sur leur site.
- Plus de prix en vert « le moins cher ».

## Technique (choix de Claude)
- Tout dans `index.html` (page `s-fou`), mêmes fonctions `prx*` / `fav*` / `fou*`, mêmes données (`db.favs`, `db.prices`, `db.suppliers`).
- Regroupement fait dans l'appli à partir de la liste déjà renvoyée par `/api/prix` ; le serveur ne change pas.
- « Autres magasins » : liste fixe par pays dans l'appli ; lien `https://www.google.com/search?q=<produit> site:<domaine>`.
- Traductions des nouveaux textes dans les 9 langues ; cache suivant.

## Contrôles
- Tests existants (prix, coffre, serveur).
- Essai dans Chromium en thème sombre avec un service simulé : regroupement, « n de plus », favoris, autres magasins, onglet Mes fournisseurs.
