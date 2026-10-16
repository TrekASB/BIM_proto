const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const RETURN_URL = 'https://trekasb.github.io/BIM_proto/apps/forma-auth-return.html';

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><title>Forma OAuth Helper</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f5f8;color:#101828;padding:32px}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #d9e0ea;border-radius:14px;padding:22px}h1{color:#0057b8;font-size:22px}.ok{color:#067647;font-weight:700}code{background:#eef2f6;padding:2px 5px;border-radius:5px}</style>
</head><body><div class="card"><h1>Forma OAuth Helper</h1><p class="ok">Helperen kjører.</p><p>Autodesk callback: <code>http://localhost:3000/api/forge/callback/oauth</code></p><p>Etter callback videresendes popupen automatisk tilbake til Forma → Trimble-extensionen.</p></div></body></html>`);
});

app.get('/api/forge/callback/oauth', (req, res) => {
  const fragment = new URLSearchParams();
  for (const key of ['code','state','error','error_description']) {
    const value = req.query[key];
    if (value) fragment.set(key, String(value));
  }
  res.redirect(302, RETURN_URL + '#' + fragment.toString());
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('Norconsult Forma OAuth Helper');
  console.log('Kjører på: http://localhost:' + PORT);
  console.log('Callback:  http://localhost:' + PORT + '/api/forge/callback/oauth');
  console.log('');
});
