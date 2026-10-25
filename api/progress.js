import fs from 'node:fs';
import path from 'node:path';

// En Vercel (serverless) el directorio escribible es /tmp; en local usa ./storage
const IS_VERCEL = Boolean(process.env.VERCEL);
const STORAGE_DIR = IS_VERCEL ? '/tmp/tabigo-storage' : path.resolve(process.cwd(), 'storage');
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

export default async function handler(req, res) {
  try {
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
      let parsed = req.body;
      if (!parsed || typeof parsed === 'string') {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const bodyStr = typeof req.body === 'string' ? req.body : Buffer.concat(chunks).toString('utf-8');
        parsed = JSON.parse(bodyStr || '{}');
      }
      parsed.updatedAt = new Date().toISOString();
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(parsed, null, 2), 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: true, savedTo: 'storage/user-progress.json' }));
      return;
    }

    res.statusCode = 405;
    res.end('Method not allowed');
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Progress API error', details: String(err) }));
  }
}

