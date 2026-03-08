import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startNewsAutoRefresh } from '../scripts/update-news.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';
const dataDir = process.env.DATA_DIR || path.resolve(process.cwd(), '.data');
const dataFile = process.env.DATA_FILE || path.join(dataDir, 'visits.json');
const summaryFile = process.env.SUMMARY_FILE || path.join(dataDir, 'summaries.json');
const distDir = path.resolve(__dirname, '../dist');

const SUMMARY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const allowedHostSuffixes = [
  'jiqizhixin.com',
  'qbitai.com',
  'leiphone.com',
  '36kr.com',
  'deepmind.google',
  'huggingface.co',
  'microsoft.com',
];

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function readCount() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    const count = Number(parsed?.count ?? 0);
    return Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;
  } catch {
    return 0;
  }
}

async function writeCount(count) {
  await ensureDir(dataFile);
  const tmp = `${dataFile}.tmp`;
  const payload = `${JSON.stringify({ count, updatedAt: new Date().toISOString() })}\n`;
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, dataFile);
}

let count = await readCount();
let writing = Promise.resolve();

async function readSummaryCache() {
  try {
    const raw = await fs.readFile(summaryFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeSummaryCache(cache) {
  await ensureDir(summaryFile);
  const tmp = `${summaryFile}.tmp`;
  const payload = `${JSON.stringify(cache, null, 2)}\n`;
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, summaryFile);
}

let summaries = await readSummaryCache();
let summaryWriting = Promise.resolve();

function normalizeArticleUrl(input) {
  const url = new URL(input);
  url.hash = '';
  return url.toString();
}

function isAllowedArticleUrl(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    return { ok: false, reason: 'invalid url' };
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, reason: 'unsupported protocol' };
  }

  const hostname = url.hostname.toLowerCase();
  const allowed = allowedHostSuffixes.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
  if (!allowed) {
    return { ok: false, reason: 'host not allowed' };
  }

  return { ok: true, url };
}

function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  return text
    .split(/(?<=[。！？!?；;])\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);
}

function summarize(text, maxChars = 110) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) {
    return '';
  }

  const sentences = splitSentences(clean);
  if (sentences.length === 0) {
    return clean.length > maxChars ? `${clean.slice(0, maxChars)}…` : clean;
  }

  const stopwords = new Set(['的', '了', '和', '是', '在', '与', '及', '为', '对', '将', '就', '也', '都', '而', '或']);
  const freq = new Map();

  for (const sentence of sentences) {
    const tokens = sentence.match(/[\u4e00-\u9fa5]{1,2}|[a-zA-Z]{2,}/g) || [];
    for (const token of tokens) {
      if (stopwords.has(token)) continue;
      freq.set(token, (freq.get(token) || 0) + 1);
    }
  }

  const scored = sentences
    .map((sentence, index) => {
      const tokens = sentence.match(/[\u4e00-\u9fa5]{1,2}|[a-zA-Z]{2,}/g) || [];
      const score = tokens.reduce((sum, token) => sum + (freq.get(token) || 0), 0);
      return { sentence, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  const joined = scored.join('');
  if (!joined) {
    return clean.length > maxChars ? `${clean.slice(0, maxChars)}…` : clean;
  }
  return joined.length > maxChars ? `${joined.slice(0, maxChars)}…` : joined;
}

function json(res, statusCode, body) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': String(data.length),
  });
  res.end(data);
}

function contentTypeByExt(ext) {
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

async function sendStaticFile(res, filePath) {
  const data = await fs.readFile(filePath);
  res.writeHead(200, {
    'Content-Type': contentTypeByExt(path.extname(filePath)),
    'Cache-Control': path.basename(filePath) === 'ai-news.generated.json' ? 'no-store' : 'public, max-age=300',
  });
  res.end(data);
}

async function tryServeStatic(urlPath, res) {
  const requestPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalized = path.normalize(decodeURIComponent(requestPath)).replace(/^([.][.][\\/])+/, '');
  const relativePath = normalized.replace(/^[/\\]+/, '');
  const candidatePath = path.join(distDir, relativePath);

  if (!candidatePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return true;
  }

  try {
    const stats = await fs.stat(candidatePath);
    if (stats.isFile()) {
      await sendStaticFile(res, candidatePath);
      return true;
    }
  } catch {
    // fall through to SPA fallback
  }

  if (!path.extname(relativePath)) {
    try {
      await sendStaticFile(res, path.join(distDir, 'index.html'));
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    json(res, 400, { error: 'bad request' });
    return;
  }

  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/health') {
    json(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/visits') {
    // Each call increments once.
    count += 1;

    // Serialize disk writes to avoid corruption.
    writing = writing
      .then(() => writeCount(count))
      .catch(() => {
        // ignore write errors; keep in-memory count
      });

    json(res, 200, { count });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/summary') {
    const rawUrl = url.searchParams.get('url') || '';
    const verdict = isAllowedArticleUrl(rawUrl);
    if (!verdict.ok) {
      json(res, 400, { error: verdict.reason || 'bad url' });
      return;
    }

    const normalized = normalizeArticleUrl(verdict.url.toString());
    const cached = summaries?.[normalized];
    const cachedAt = typeof cached?.updatedAt === 'string' ? new Date(cached.updatedAt).getTime() : 0;
    if (cached && typeof cached.summary === 'string' && Date.now() - cachedAt < SUMMARY_TTL_MS) {
      json(res, 200, { summary: cached.summary });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch(normalized, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'AICreator-SummaryBot/1.0',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (!response.ok) {
        throw new Error(`fetch failed: ${response.status}`);
      }

      const html = await response.text();
      const text = stripHtml(html);
      const summary = summarize(text, 110);
      if (!summary) {
        throw new Error('empty summary');
      }

      summaries = {
        ...(summaries || {}),
        [normalized]: {
          summary,
          updatedAt: new Date().toISOString(),
        },
      };

      summaryWriting = summaryWriting
        .then(() => writeSummaryCache(summaries))
        .catch(() => {
          // ignore disk write errors
        });

      json(res, 200, { summary });
    } catch (error) {
      json(res, 502, { error: String(error) });
    } finally {
      clearTimeout(timeout);
    }

    return;
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    const served = await tryServeStatic(url.pathname, res);
    if (served) {
      return;
    }
  }

  json(res, 404, { error: 'not found' });
});

startNewsAutoRefresh({ label: 'visit-api:news' });

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`[visit-api] listening on http://${host}:${port} (data: ${dataFile})`);
});
