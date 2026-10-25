const ttsCache = new Map();

export default async function handler(req, res) {
  try {
    const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
    const text = (url.searchParams.get('q') || '').trim();
    const slow = url.searchParams.get('slow') === '1';

    if (!text) {
      res.statusCode = 400;
      res.end('Missing text parameter');
      return;
    }

    const cacheKey = `${text}_${slow ? 'slow' : 'normal'}`;
    if (ttsCache.has(cacheKey)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
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
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.end(buffer);
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'TTS fetch failed', details: String(err) }));
  }
}
