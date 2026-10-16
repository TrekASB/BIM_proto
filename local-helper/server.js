const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const EXTENSION_ORIGIN = 'https://trekasb.github.io';
const callbacks = new Map();

function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', EXTENSION_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}

app.use(cors);

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><title>Forma OAuth Helper</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f5f8;color:#101828;padding:32px}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #d9e0ea;border-radius:14px;padding:22px}h1{color:#0057b8;font-size:22px}.ok{color:#067647;font-weight:700}code{background:#eef2f6;padding:2px 5px;border-radius:5px}</style>
</head><body><div class="card"><h1>Forma OAuth Helper</h1><p class="ok">Helperen kjører.</p><p>Autodesk callback: <code>http://localhost:3000/api/forge/callback/oauth</code></p><p>La terminalvinduet stå åpent mens du bruker Forma → Trimble i Trimble Connect.</p></div></body></html>`);
});

app.get('/api/forge/callback/oauth', (req, res) => {
  const payload = {
    type: 'NORCONSULT_APS_OAUTH_CALLBACK',
    code: req.query.code || null,
    state: req.query.state || null,
    error: req.query.error || null,
    error_description: req.query.error_description || null,
    ts: Date.now()
  };

  if (payload.state) {
    callbacks.set(payload.state, payload);
    setTimeout(() => callbacks.delete(payload.state), 5 * 60 * 1000);
  }

  const safePayload = JSON.stringify(payload).replace(/</g, '\\u003c');
  res.type('html').send(`<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><title>Autodesk Forma – innlogging</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f5f8;color:#101828;padding:32px}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #d9e0ea;border-radius:14px;padding:22px}h1{color:#0057b8;font-size:22px}.ok{color:#067647}.bad{color:#b42318}</style>
</head><body><div class="card"><h1>Autodesk Forma</h1><p class="${payload.error ? 'bad' : 'ok'}">${payload.error ? 'Autodesk-innlogging feilet.' : 'Innlogging fullført.'}</p><p>Du kan lukke dette vinduet og gå tilbake til Trimble Connect.</p></div>
<script>
try {
  if (window.opener) {
    window.opener.postMessage(${safePayload}, '${EXTENSION_ORIGIN}');
    setTimeout(() => window.close(), 900);
  }
} catch (_) {}
</script></body></html>`);
});

app.get('/api/forge/callback/status', (req, res) => {
  const state = String(req.query.state || '');
  if (!state) return res.status(400).json({ ready:false, error:'state mangler' });
  const payload = callbacks.get(state);
  if (!payload) return res.json({ ready:false });
  callbacks.delete(state);
  res.json({ ready:true, payload });
});

app.listen(PORT, () => {
  console.log('');
  console.log('Norconsult Forma OAuth Helper');
  console.log('Kjører på: http://localhost:' + PORT);
  console.log('Callback:  http://localhost:' + PORT + '/api/forge/callback/oauth');
  console.log('');
});
