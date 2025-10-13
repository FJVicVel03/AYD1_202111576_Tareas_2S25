import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { key, coords, summary, provider } = req.body || {};
    if (!key || !Array.isArray(coords)) {
      return res.status(400).json({ error: 'Parámetros inválidos: key y coords son requeridos' });
    }

    const projectRoot = path.resolve(process.cwd());
    const publicDir = path.join(projectRoot, 'public');
    const cachePath = path.join(publicDir, 'routes-cache.json');

    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    let data = {};
    try {
      if (fs.existsSync(cachePath)) {
        data = JSON.parse(fs.readFileSync(cachePath, 'utf-8')) || {};
      }
    } catch (_) { data = {}; }

    data[key] = { coords, summary: summary || null, provider: provider || 'ors', ts: Date.now() };
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');

    return res.status(200).json({ ok: true, path: '/routes-cache.json' });
  } catch (err) {
    console.error('save-route-cache error:', err);
    return res.status(500).json({ error: err?.message || 'Error interno' });
  }
}
