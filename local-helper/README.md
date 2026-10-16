# Forma OAuth Helper

Denne lokale serveren er kun et callback-relé mellom Autodesk APS og **Forma → Trimble**-extensionen.

Den:
- kjører på `http://localhost:3000`
- bruker callback `http://localhost:3000/api/forge/callback/oauth`
- lagrer ingen Autodesk Client Secret
- lagrer ingen modellfiler
- lagrer ingen OAuth-token
- sender kun Autodesk sin kortlivede authorization code + state tilbake til extensionen med `postMessage`

## Første gangs oppsett

1. Installer Node.js 18 eller nyere.
2. Kjør `01_INSTALL.bat`.
3. Kjør `02_START.bat`.
4. La terminalvinduet stå åpent mens du bruker Forma → Trimble i Trimble Connect.
5. I extensionen limer du inn Norconsult sin **felles APS Client ID** fra IT og trykker **Logg inn Autodesk**.

IT har registrert callbacken:

`http://localhost:3000/api/forge/callback/oauth`

## Test

Trykk **Test localhost-helper** i Trimble Connect-extensionen. Du skal få en side som sier **Helperen kjører**.

Forventet flyt:

Trimble Connect → Autodesk login → localhost callback → extension → Forma hub → prosjekt → modellfil → Trimble Connect.
