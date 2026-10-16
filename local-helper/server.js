const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const EXTENSION_ORIGIN = 'https://trekasb.github.io';

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><title>Forma OAuth Helper</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f5f8;color:#101828;padding:32px}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #d9e0ea;border-radius:14px;padding:22px}h1{color:#0057b8;font-size:22px}.ok{color:#067647;font-weight:700}code{background:#eef2f6;padding:2px 5px;border-radius:5px}</style>
</head><body><div class="card"><h1>Forma OAuth Helper</h1><p class="ok">Helperen kjører.</p><p>Trimble Connect-extensionen bruker automatisk <code>http://localhost:3000/api/forge/callback/oauth</code> ved Autodesk-innlogging.</p></div></body></html>`);
});

app.get('/api/forge/callback/oauth', (req, res) => {
  const payload = {
    type: 'NORCONSULT_APS_OAUTH_CALLBACK',
    code: req.query.code || null,
    state: req.query.state || null,
    error: req.query.error || null,
    error_description: req.query.error_description || null
  };

  const encoded = JSON.stringify(payload).replace(/</g, '\\u003c');

  const html = `<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><title>Autodesk Forma – innlogging</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f5f8;color:#101828;padding:32px}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #d9e0ea;border-radius:14px;padding:22px}h1{color:#0057b8;font-size:22px}.ok{color:#067647}.bad{color:#b42318}</style>
</head><body><div class="card"><h1>Autodesk Forma</h1><p id="message">Sender innloggingen tilbake til Trimble Connect …</p></div>
<script>
(function(){
  const payload = ${encoded};
  const el = document.getElementById('message');
  if (!window.opener) {
    el.className = 'bad';
    el.textContent = 'Fant ikke Trimble Connect-vinduet som startet innloggingen. Lukk dette vinduet og start innloggingen på nytt fra extensionen.';
    return;
  }
  try {
    window.opener.postMessage(payload, '${EXTENSION_ORIGIN}');
    el.className = payload.error ? 'bad' : 'ok';
    el.textContent = payload.error ? 'Autodesk-innlogging feilet. Du kan lukke vinduet.' : 'Innlogging fullført. Går tilbake til Trimble Connect …';
    setTimeout(() => window.close(), 700);
  } catch (err) {
    el.className = 'bad';
    el.textContent = 'Kunne ikke sende callback til Trimble Connect: ' + err.message;
  }
})();
</script></body></html>`;

  res.type('html').send(html);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('Norconsult Forma OAuth Helper');
  console.log('Kjører på: http://localhost:' + PORT);
  console.log('Callback:  http://localhost:' + PORT + '/api/forge/callback/oauth');
  console.log('');
});
