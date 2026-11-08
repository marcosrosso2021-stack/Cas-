@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Devis BTP - serveur
where node >nul 2>nul
if %errorlevel%==0 (
  set "NODE=node"
  goto run
)
if exist "%~dp0node\node.exe" (
  set "NODE=%~dp0node\node.exe"
  goto run
)
echo.
echo   Premier lancement : telechargement de l'outil necessaire (environ 30 Mo).
echo   Cela ne se fait qu'une seule fois. Patientez...
echo.
curl -L -s -o node.zip https://nodejs.org/dist/v22.12.0/node-v22.12.0-win-x64.zip
if errorlevel 1 goto err
tar -xf node.zip
if errorlevel 1 goto err
ren node-v22.12.0-win-x64 node
del node.zip
set "NODE=%~dp0node\node.exe"
:run
set OPEN_BROWSER=1
"%NODE%" server.js
echo.
echo   Le serveur s'est arrete.
pause
goto :eof
:err
echo.
echo   Telechargement impossible. Verifiez la connexion internet et relancez.
pause
