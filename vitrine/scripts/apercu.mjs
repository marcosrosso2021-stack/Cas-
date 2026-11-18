/**
 * Prépare un aperçu qui s'ouvre depuis n'importe quel dossier.
 * Copie out/ vers apercu/, puis :
 *   - renomme _next/ en next/ et les fichiers qui commencent par « _ »
 *     (certains hébergeurs d'aperçus refusent ce préfixe) ;
 *   - remplace les chemins absolus « /_next/ » par des chemins relatifs « ./next/ ».
 * Ne sert qu'aux aperçus : le site en production utilise out/ tel quel.
 */
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'out'
const DST = 'apercu'
rmSync(DST, { recursive: true, force: true })
cpSync(SRC, DST, { recursive: true })
if (existsSync(join(DST, '_next'))) renameSync(join(DST, '_next'), join(DST, 'next'))
rmSync(join(DST, '_not-found'), { recursive: true, force: true })

const renommes = []
const fichiers = []
const parcourir = (dossier) => {
  for (const nom of readdirSync(dossier)) {
    let chemin = join(dossier, nom)
    if (statSync(chemin).isDirectory()) {
      parcourir(chemin)
      continue
    }
    if (nom.startsWith('_')) {
      const neuf = join(dossier, nom.slice(1))
      renameSync(chemin, neuf)
      renommes.push(nom)
      chemin = neuf
    }
    if (/\.(html|js|css|txt)$/.test(nom)) fichiers.push(chemin)
  }
}
parcourir(DST)

let n = 0
for (const chemin of fichiers) {
  const avant = readFileSync(chemin, 'utf8')
  // dans une feuille de style, les chemins partent du dossier du fichier (next/static/chunks/)
  let apres = chemin.endsWith('.css')
    ? avant.replaceAll('url(/fonts/', 'url(../../../fonts/').replaceAll('/_next/static/', '../')
    : avant.replaceAll('/_next/', './next/')
  for (const nom of renommes) apres = apres.replaceAll(`/${nom}`, `/${nom.slice(1)}`)
  if (apres !== avant) {
    writeFileSync(chemin, apres)
    n++
  }
}
console.log(`apercu/ prêt : ${n} fichiers ajustés, ${renommes.length} renommés`)
