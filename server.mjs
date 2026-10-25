import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import zlib from 'node:zlib';

const PORT = Number(process.env.PORT || 4325);
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const STORAGE_DIR = path.resolve(process.cwd(), 'storage');
const PROGRESS_FILE = path.join(STORAGE_DIR, 'user-progress.json');

// Caché en memoria para audios de pronunciación japonesa
const ttsCache = new Map();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function ensureStorageFile() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROGRESS_FILE)) {
    const initialData = {
      version: 2,
      updatedAt: new Date().toISOString(),
      xp: 0,
      streak: 1,
      lastDate: new Date().toISOString().slice(0, 10),
      stamps: [],
      masteredVocab: [],
      practicedChars: [],
      quests: {
        voice: 0,
        kanji: 0,
        sim: 0,
        voiceClaimed: false,
        kanjiClaimed: false,
        simClaimed: false,
      },
      itemStats: {},
    };
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(reqUrl.pathname);

    // CORS & Permisos abiertos para funcionar desde cualquier túnel o red local
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // 1. API de Progreso JSON (/api/progress)
    if (pathname === '/api/progress') {
      ensureStorageFile();

      if (req.method === 'GET') {
        const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(raw);
        return;
      }

      if (req.method === 'POST') {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const bodyStr = Buffer.concat(chunks).toString('utf-8');
        const parsed = JSON.parse(bodyStr);
        parsed.updatedAt = new Date().toISOString();
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(parsed, null, 2), 'utf-8');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ ok: true, savedTo: 'storage/user-progress.json' }));
        return;
      }
    }

    // 2. API de Pronunciación Japonesa (/api/tts)
    if (pathname === '/api/tts') {
      const text = (reqUrl.searchParams.get('q') || '').trim();
      const slow = reqUrl.searchParams.get('slow') === '1';

      if (!text) {
        res.statusCode = 400;
        res.end('Missing text parameter');
        return;
      }

      const cacheKey = `${text}_${slow ? 'slow' : 'normal'}`;
      if (ttsCache.has(cacheKey)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(ttsCache.get(cacheKey));
        return;
      }

      const speed = slow ? '0.24' : '1';
      const googleTtsUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ja&ttsspeed=${speed}&q=${encodeURIComponent(text)}`;

      const response = await fetch(googleTtsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });

      if (!response.ok) {
        throw new Error(`Google TTS status ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      ttsCache.set(cacheKey, buffer);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(buffer);
      return;
    }

    // 3. Servir archivos estáticos compilados desde dist/ (sin bloqueo de Host de Vite)
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!filePath.startsWith(DIST_DIR)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    if (ext === '.js' || ext === '.css') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    const compressible = ['.html', '.js', '.mjs', '.css', '.json', '.svg'].includes(ext);
    if (compressible && acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.end(zlib.gzipSync(content));
    } else {
      res.end(content);
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server error', details: String(err) }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  const localIps = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        localIps.push(net.address);
      }
    }
  }
  console.log(`\n⛩️  Servidor de Producción TabiGo activo (Sin bloqueo de Host):`);
  console.log(`   ➜ Local:   http://localhost:${PORT}`);
  localIps.forEach((ip) => console.log(`   ➜ Red LAN: http://${ip}:${PORT}`));
});
