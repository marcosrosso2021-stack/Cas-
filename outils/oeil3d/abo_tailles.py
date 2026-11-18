#!/usr/bin/env python3
"""Tailles réelles par sorte d'élément, tirées des fiches produit d'Amazon Berkeley Objects (ABO).

Source : https://amazon-berkeley-objects.s3.amazonaws.com/index.html (archive abo-listings.tar, 83 Mo)
Licence : CC BY 4.0. Crédit des données : Amazon.com. Voir CREDITS.md à la racine du dépôt.

Seuls des chiffres agrégés entrent dans casô (nombre de fiches, 10e centile, médiane, 90e centile par sorte) :
aucune fiche produit, aucun texte, aucune image.

Usage : python3 -I outils/oeil3d/abo_tailles.py <dossier où abo-listings.tar a été ouvert> lib/oeil/taxonomie.json
"""
import glob, gzip, json, sys

# type de produit ABO -> classes de la bibliothèque de casô
CARTE = {
    'CHAIR': ['F09.salon.chaises'], 'SOFA': ['F09.salon.canapes'], 'TABLE': ['F09.salon.tables_a_manger'],
    'RUG': ['F09.salon.tapis'], 'BED': ['F09.chambre.lits'], 'BED_FRAME': ['F09.chambre.lits'],
    'MATTRESS': ['F09.chambre.matelas'], 'DESK': ['F09.chambre.bureaux'], 'DRESSER': ['F09.chambre.commodes'],
    'HOME_MIRROR': ['F09.chambre.miroirs'], 'TRASH_CAN': ['F09.chambre.poubelles'],
    'ELECTRIC_FAN': ['F09.chambre.ventilateurs'], 'SHELF': ['F09.salon.bibliotheques'],
}
UNITE = {'inches': 0.0254, 'centimeters': 0.01, 'meters': 1.0, 'millimeters': 0.001, 'feet': 0.3048}
MINI = 15  # fiches au moins pour retenir une sorte
# Les fiches ne disent pas toujours quel côté est la hauteur (miroirs, étagères, ventilateurs : à plat ou debout selon le vendeur).
# La gamme de casô n'est élargie que pour les meubles posés au sol, où les trois côtés sont fiables.
ELARGIT = {'F09.salon.chaises', 'F09.salon.canapes', 'F09.salon.tables_a_manger', 'F09.chambre.lits',
           'F09.chambre.bureaux', 'F09.chambre.commodes'}


def metres(v):
    if not v:
        return None
    x = v.get('normalized_value') or v
    f = UNITE.get((x.get('unit') or '').lower())
    return x['value'] * f if f and x.get('value') else None


def centile(a, p):
    a = sorted(a); i = (len(a) - 1) * p; lo = int(i); hi = min(lo + 1, len(a) - 1)
    return a[lo] + (a[hi] - a[lo]) * (i - lo)


def main(dossier, taxo):
    par = {}
    for f in sorted(glob.glob(dossier + '/listings/metadata/*.json.gz')):
        for ligne in gzip.open(f, 'rt', encoding='utf-8'):
            o = json.loads(ligne)
            t = (o.get('product_type') or [{}])[0].get('value'); d = o.get('item_dimensions')
            if t not in CARTE or not d:
                continue
            h, a, b = metres(d.get('height')), metres(d.get('length')), metres(d.get('width'))
            if not h or not a or not b:
                continue
            for c in CARTE[t]:
                par.setdefault(c, []).append((max(a, b), min(a, b), h))
    brut = open(taxo, encoding='utf-8').read(); T = json.loads(brut); n = 0
    for fam in T['familles']:
        for cat in fam['categories']:
            for x in cat['classes']:
                v = par.get(x['id'])
                if not v or len(v) < MINI:
                    x.pop('abo', None); continue
                st = lambda i: [round(centile([r[i] for r in v], p), 2) for p in (0.10, 0.5, 0.90)]
                x['abo'] = {'n': len(v), 'l': st(0), 'c': st(1), 'h': st(2)}; n += 1
                g = x.get('gam')
                if g and x['id'] in ELARGIT:  # la gamme s'élargit aux tailles réellement vendues, sans jamais se resserrer
                    for k in ('l', 'c', 'h'):
                        g[k] = [round(min(g[k][0], x['abo'][k][0]), 2), round(max(g[k][1], x['abo'][k][2]), 2)]
    open(taxo, 'w', encoding='utf-8').write(json.dumps(T, ensure_ascii=False, separators=(',', ':')) + ('\n' if brut.endswith('\n') else ''))
    print(n, 'classes renseignées')
    for c in sorted(par):
        print(c, len(par[c]))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
