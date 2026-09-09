# BIM Tools – Trimble Connect prototype

Denne pakken samler fire eksisterende Trimble Connect-verktøy i én Project Extension:

- MiniMap E39
- MultiPropertyLabel
- MultiPropertyChecker
- BCFTopicPulse

## Struktur

- `manifest.json` – registrering av Project Extension
- `index.html` – startside / verktøykasse
- `apps/` – de fire verktøyene
- `assets/` – ikon og lokal logo-plassholder

## Publisering

1. Legg hele mappen på en offentlig tilgjengelig HTTPS-host, f.eks. GitHub Pages, Azure Static Web Apps eller intern webserver som Trimble Connect-brukerne får tilgang til.
2. Bytt `https://YOUR-HOST.example.com` i `manifest.json` med den virkelige basis-URL-en.
3. Test at `index.html`, `manifest.json` og ikonfilen kan åpnes direkte i nettleser.
4. Registrer URL-en til `manifest.json` som Custom / Project Extension i Trimble Connect-prosjektets app-/extension-innstillinger.
5. Åpne BIM Tools fra prosjektmenyen og test hvert verktøy mot en modell.

## Viktig

Verktøyene åpnes med vanlig navigasjon (`window.location.href`) og ikke i en ekstra iframe. Dermed beholder hvert verktøy sitt eksisterende kall `TrimbleConnectWorkspace.connect(window.parent, ...)`, der `window.parent` fortsatt er Trimble Connect.

`MiniMap_E39_NTM7.json` i originalmaterialet hadde ugyldig JSON (duplisert `icon` og manglende komma). Denne prototypen bruker derfor en ny, gyldig felles `manifest.json`.

Logoen i `assets/../assets/norconsult-logo-black.png` er en enkel lokal plassholder/wordmark for prototypen. Bytt den med godkjent Norconsult-logo før produksjonsbruk.

## Multi-app vinduer / faner

Denne versjonen støtter flere åpne BIM-verktøy samtidig. Hvert verktøy åpnes i en egen fane,
kan aktiveres uten å lastes på nytt, og kan lukkes med ×. Verktøyene bruker en felles
BIMToolsBridge mot Trimble Connect når de kjører inne i hovedappen, men kan fortsatt åpnes
som selvstendige extensions.
