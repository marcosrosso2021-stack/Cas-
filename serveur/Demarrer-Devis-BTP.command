#!/bin/bash
# Mac : double-clic. Linux : ./Demarrer-Devis-BTP.command
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Il faut installer Node.js (gratuit) : https://nodejs.org  puis relancer ce fichier."
  read -r -p "Appuyez sur Entrée pour fermer"; exit 1
fi
OPEN_BROWSER=1 node server.js
read -r -p "Le serveur s'est arrêté. Appuyez sur Entrée pour fermer"
