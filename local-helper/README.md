# Forma OAuth Helper

Denne lille lokale serveren gjør Autodesk-innlogging mulig fra **Forma → Trimble**-extensionen når APS-applikasjonen har callback:

`http://localhost:3000/api/forge/callback/oauth`

Helperen inneholder **ingen Client Secret** og håndterer ikke modellfiler. Den mottar bare Autodesk sin kortlivede authorization code + state. Extensionen henter callback-resultatet tilbake fra localhost og bruker PKCE-verifieren som allerede ligger i extensionens nettlesersesjon.

## Første gangs oppsett

1. Installer Node.js LTS (18 eller nyere).
2. Kjør `01_INSTALL.bat`.
3. Kjør `02_START.bat`.
4. La terminalvinduet stå åpent.
5. Åpne **Forma → Trimble** i Trimble Connect.
6. Trykk **Test localhost-helper**. Du skal få siden «Helperen kjører».
7. Lim inn Norconsult sin **felles APS Client ID** fra IT og trykk **Lagre Client ID**.
8. Trykk **Logg inn Autodesk**.

## Forventet test

Når innloggingen lykkes skal extensionen vise:

- Autodesk: tilkoblet
- OAuth helper: OK
- Forma-huben, for eksempel **Norconsult Group**
- prosjekter og mapper fra Forma Data Management

Deretter kan du velge en modellfil og bruke **Kopier til Trimble Connect**.

## Hva som skjer

`Trimble extension → Autodesk authorize → localhost:3000 callback → extension → Forma Data Management API → fil → Trimble Connect SDK`

Helperen lagrer callback-resultatet i minnet i maksimalt 5 minutter og sletter det når extensionen henter det.
