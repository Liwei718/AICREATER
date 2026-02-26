import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function summarizeText(text: string, targetLength = 100): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return '';
  }

  // Split by common sentence punctuation (CN + EN)
  const parts = cleaned
    .split(/(?<=[。！？!?；;\n])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const take = (input: string) => {
    if (input.length <= targetLength) {
      return input;
    }
    return `${input.slice(0, targetLength - 1).trim()}…`;
  };

  if (parts.length <= 1) {
    return take(cleaned);
  }

  let out = '';
  for (const sentence of parts) {
    const next = out ? `${out}${sentence}` : sentence;
    if (next.length > targetLength + 20) {
      break;
    }
    out = next;
    if (out.length >= targetLength) {
      break;
    }
  }

  if (!out) {
    out = parts[0] ?? cleaned;
  }
  return take(out);
}

function localApiPlugin(): Plugin {
  // simple in-memory counter for local dev
  let visitCount = 1000 + Math.floor(Math.random() * 500);

  return {
    name: 'aicreator-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        // Local visits API (best-effort for dev)
        if (req.url.startsWith('/api/visits')) {
          if (req.method === 'POST') {
            visitCount += 1;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ count: visitCount }));
          return;
        }

        // Local summary API: fetch original HTML server-side and summarize ~100 chars.
        if (!req.url.startsWith('/api/summary')) {
          next();
          return;
        }

        try {
          const parsed = new URL(req.url, 'http://localhost');
          const url = parsed.searchParams.get('url') ?? '';
          const fallbackTitle = parsed.searchParams.get('title') ?? '';
          const fallbackSummary = parsed.searchParams.get('summary') ?? '';

          const safeUrl = (() => {
            try {
              const u = new URL(url);
              if (u.protocol !== 'http:' && u.protocol !== 'https:') {
                return null;
              }
              return u;
            } catch {
              return null;
            }
          })();

          if (!safeUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ summary: '' }));
            return;
          }

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12_000);
          let html = '';
          try {
            const response = await fetch(safeUrl.toString(), {
              signal: controller.signal,
              headers: {
                // Some sites block empty/unknown UA.
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
              },
              redirect: 'follow',
            });
            if (response.ok) {
              const ct = response.headers.get('content-type') ?? '';
              if (ct.includes('text/html') || ct.includes('application/xhtml+xml') || ct === '') {
                html = await response.text();
              }
            }
          } catch {
            // ignore
          } finally {
            clearTimeout(timeout);
          }

          const rawText = html ? stripHtmlToText(html) : '';
          const merged = rawText ? `${fallbackTitle}\n${rawText}` : `${fallbackTitle} ${fallbackSummary}`;
          const summary = summarizeText(merged, 100);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ summary }));
        } catch {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ summary: '' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
