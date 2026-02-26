import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

function stripHtmlToText(html) {
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

function summarizeText(text, targetLength = 100) {
	const cleaned = String(text ?? '').replace(/\s+/g, ' ').trim();
	if (!cleaned) return '';

	const parts = cleaned
		.split(/(?<=[。！？!?；;\n])\s*/)
		.map((s) => s.trim())
		.filter(Boolean);

	const take = (input) => {
		if (input.length <= targetLength) return input;
		return `${input.slice(0, targetLength - 1).trim()}…`;
	};

	if (parts.length <= 1) return take(cleaned);

	let out = '';
	for (const sentence of parts) {
		const next = out ? `${out}${sentence}` : sentence;
		if (next.length > targetLength + 20) break;
		out = next;
		if (out.length >= targetLength) break;
	}

	if (!out) out = parts[0] ?? cleaned;
	return take(out);
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

let visitCount = 1000 + Math.floor(Math.random() * 500);

const server = http.createServer(async (req, res) => {
	try {
		const url = new URL(req.url ?? '/', 'http://127.0.0.1');

		if (url.pathname === '/api/visits') {
			if (req.method === 'POST') visitCount += 1;
			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			res.end(JSON.stringify({ count: visitCount }));
			return;
		}

		if (url.pathname === '/api/summary') {
			const target = url.searchParams.get('url') ?? '';
			const fallbackTitle = url.searchParams.get('title') ?? '';
			const fallbackSummary = url.searchParams.get('summary') ?? '';

			let safeTarget;
			try {
				const parsed = new URL(target);
				if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
					throw new Error('invalid protocol');
				}
				safeTarget = parsed;
			} catch {
				res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
				res.end(JSON.stringify({ summary: '' }));
				return;
			}

			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 12_000);
			let html = '';
			try {
				const response = await fetch(safeTarget.toString(), {
					signal: controller.signal,
					redirect: 'follow',
					headers: {
						'User-Agent':
							'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
						Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
						'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
					},
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

			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			res.end(JSON.stringify({ summary }));
			return;
		}

		// Static
		const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
		const safePath = path.normalize(requestPath).replace(/^\.+/, '');
		const filePath = path.join(DIST_DIR, safePath);
		if (!filePath.startsWith(DIST_DIR)) {
			res.writeHead(403);
			res.end('Forbidden');
			return;
		}

		const data = await fs.readFile(filePath);
		res.writeHead(200, {
			'Content-Type': contentTypeByExt(path.extname(filePath)),
			'Cache-Control': 'no-store',
		});
		res.end(data);
	} catch {
		res.writeHead(500);
		res.end('Internal Server Error');
	}
});

const PORT = Number(process.env.PORT ?? 4173);
server.listen(PORT, '127.0.0.1', () => {
	// eslint-disable-next-line no-console
	console.log(`Local server: http://127.0.0.1:${PORT}/`);
});
