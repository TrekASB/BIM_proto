import * as TC from 'https://cdn.jsdelivr.net/npm/trimble-connect-sdk@4.0.11/+esm';

function dataOf(response) {
  if (response && typeof response === 'object' && 'data' in response) return response.data;
  return response;
}

function normalizePath(path) {
  return String(path || '/')
    .trim()
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+|\/+$/g, '');
}

async function configure(token) {
  TC.TCPSClient.config.credentials = { token };
  TC.TCPSClient.config.serviceUri = 'https://app.connect.trimble.com/tc/api/2.0/';
}

async function getProject(projectId, onStatus = () => {}) {
  onStatus('Finner Trimble Connect-region og prosjekt …');
  const servers = dataOf(await TC.TCPSClient.listServers()) || [];

  // Try the regional pods first. A Trimble Connect project belongs to one fixed region.
  for (const server of servers) {
    try {
      const project = dataOf(await TC.TCPSClient.getProject(projectId, server));
      if (project && project.id === projectId) return project;
    } catch (_) {
      // Project is simply not hosted on this pod, try the next one.
    }
  }

  // Keep a final master-endpoint fallback for environments where the SDK resolves the region itself.
  try {
    const project = dataOf(await TC.TCPSClient.getProject(projectId));
    if (project && project.id === projectId) return project;
  } catch (_) {}

  throw new Error('Fant ikke aktivt Trimble Connect-prosjekt via Trimble Connect SDK.');
}

async function resolveTargetFolder(project, targetPath, onStatus = () => {}) {
  const normalized = normalizePath(targetPath);
  if (!normalized) {
    return { id: project.rootId, name: '/', type: 'FOLDER', origin: project.origin };
  }

  const parts = normalized.split('/').filter(Boolean);
  let parent = project;
  let folder = null;

  for (const part of parts) {
    const entries = dataOf(await TC.TCPSClient.listFolderEntries(parent)) || [];
    folder = entries.find(entry =>
      entry && entry.type === 'FOLDER' && String(entry.name || '').localeCompare(part, undefined, { sensitivity: 'accent' }) === 0
    );
    if (!folder) {
      throw new Error(`Trimble-mappen «${part}» finnes ikke i målbanen /${parts.join('/')}. Opprett mappen i Connect eller velg en eksisterende mappe.`);
    }
    onStatus(`Trimble-mappe funnet: ${folder.name}`);
    parent = folder;
  }

  return folder;
}

async function uploadBlob({ token, projectId, targetPath = '/', blob, fileName, mimeType, onStatus = () => {} }) {
  if (!token) throw new Error('Trimble access token mangler.');
  if (!projectId) throw new Error('Trimble prosjekt-ID mangler.');
  if (!blob) throw new Error('Ingen fil er klar for opplasting.');
  if (!fileName) throw new Error('Filnavn mangler.');

  await configure(token);
  const project = await getProject(projectId, onStatus);
  const target = await resolveTargetFolder(project, targetPath, onStatus);
  const parentId = target.id || project.rootId;
  const file = new File([blob], fileName, { type: mimeType || blob.type || 'application/octet-stream' });

  onStatus(`Laster opp ${fileName} til Trimble Connect …`);
  const responses = await TC.TCPSClient.uploadFileContent(project, [file], parentId, 'FOLDER');
  if (!Array.isArray(responses) || responses.length === 0) {
    throw new Error('Trimble Connect SDK returnerte ikke et filresultat etter opplasting.');
  }

  const first = dataOf(responses[0]);
  if (!first || !first.id) {
    throw new Error('Trimble Connect SDK fullførte forespørselen, men fil-ID mangler i svaret.');
  }

  return {
    project,
    folder: target,
    file: first,
    name: first.name || fileName,
    fileId: first.id,
    versionId: first.versionId || null
  };
}

window.TrimbleTcpsBridge = {
  uploadBlob,
  sdkVersion: '4.0.11'
};

window.dispatchEvent(new CustomEvent('trimble-tcps-bridge-ready'));
