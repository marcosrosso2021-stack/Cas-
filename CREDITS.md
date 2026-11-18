# Crédits

casô utilise les données et logiciels suivants, avec les mentions que leurs licences demandent.

## Amazon Berkeley Objects (ABO)

- Ce qui est utilisé : des tailles agrégées par sorte de mobilier (nombre de fiches, 10e centile, médiane, 90e centile), calculées à partir des dimensions des fiches produit. Elles sont dans `lib/oeil/taxonomie.json` (champ `abo`) et ont servi à élargir certaines gammes de tailles (champ `gam`). Aucune fiche produit, aucun texte, aucune image, aucun modèle 3D n'est repris.
- Source : https://amazon-berkeley-objects.s3.amazonaws.com/index.html
- Licence : Creative Commons Attribution 4.0 International (CC BY 4.0) — https://creativecommons.org/licenses/by/4.0/
- Crédit des données : Amazon.com
- Crédit de la constitution du jeu de données : Matthieu Guillaumin (Amazon.com), Thomas Dideriksen (Amazon.com), Kenan Deng (Amazon.com), Himanshu Arora (Amazon.com), Jasmine Collins (UC Berkeley) et Jitendra Malik (UC Berkeley)
- Modifications : les dimensions ont été converties en mètres et résumées par sorte d'élément (`outils/oeil3d/abo_tailles.py`).
