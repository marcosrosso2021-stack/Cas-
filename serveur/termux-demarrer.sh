#!/data/data/com.termux/files/usr/bin/bash
# Téléphone Android avec l'application Termux (installée depuis F-Droid).
# Usage : bash termux-demarrer.sh
cd "$(dirname "$0")"
command -v node >/dev/null 2>&1 || { pkg update -y && pkg install -y nodejs; }
termux-wake-lock 2>/dev/null
node server.js
