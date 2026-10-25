import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

// Caché en memoria para que los audios pronunciados se reproduzcan al instante
const ttsCache = new Map();

// Carpeta genérica "/storage" para guardar y leer el progreso JSON en disco
const STORAGE_DIR = path.resolve(process.cwd(), 'storage');
const PROGRESS_FILE = path.join(STORAGE_DIR, 'user-progress.json');

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

function japaneseBackendPlugin() {
  return {
    name: 'tabigo-backend-api',
    configureServer(server) {
      // 1. Endpoint de almacenamiento JSON en carpeta "/storage/user-progress.json"
      server.middlewares.use('/api/progress', async (req, res) => {
        try {
          ensureStorageFile();

          if (req.method === 'GET') {
            const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
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

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, savedTo: 'storage/user-progress.json' }));
            return;
          }

          res.statusCode = 405;
          res.end('Method not allowed');
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to read/write progress JSON', details: String(err) }));
        }
      });

      // 2. Endpoint de pronunciación japonesa TTS
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const text = (url.searchParams.get('q') || '').trim();
          const slow = url.searchParams.get('slow') === '1';

          if (!text) {
            res.statusCode = 400;
            res.end('Missing text parameter');
            return;
          }

          const cacheKey = `${text}_${slow ? 'slow' : 'normal'}`;
          if (ttsCache.has(cacheKey)) {
            const cachedBuffer = ttsCache.get(cacheKey);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.end(cachedBuffer);
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

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(buffer);
        } catch (err) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'TTS fetch failed', details: String(err) }));
        }
      });
    },
  };
}

export default defineConfig({
  server: {
    host: true,
    port: 4321,
    allowedHosts: true,
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
    plugins: [japaneseBackendPlugin()],
  },
});
