import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Parser from 'rss-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceOutputPath = path.resolve(__dirname, '../src/data/ai-news.generated.json');
const publicOutputPath = path.resolve(__dirname, '../public/ai-news.generated.json');
const distOutputPath = path.resolve(__dirname, '../dist/ai-news.generated.json');
export const NEWS_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const feeds = [
  {
    source: '机器之心',
    region: '中国',
    url: 'https://www.jiqizhixin.com/rss',
    homepage: 'https://www.jiqizhixin.com/',
  },
  {
    source: '量子位',
    region: '中国',
    url: 'https://www.qbitai.com/feed',
    homepage: 'https://www.qbitai.com/',
  },
  {
    source: '雷峰网',
    region: '中国',
    url: 'https://www.leiphone.com/feed',
    homepage: 'https://www.leiphone.com/',
  },
  {
    source: '36氪',
    region: '中国',
    url: 'https://36kr.com/feed',
    homepage: 'https://36kr.com/',
  },
  {
    source: 'Google DeepMind',
    region: '国际',
    url: 'https://deepmind.google/blog/rss.xml',
    homepage: 'https://deepmind.google/discover/blog/',
  },
  {
    source: 'Hugging Face Blog',
    region: '国际',
    url: 'https://huggingface.co/blog/feed.xml',
    homepage: 'https://huggingface.co/blog',
  },
  {
    source: 'Microsoft Research',
    region: '国际',
    url: 'https://www.microsoft.com/en-us/research/feed/',
    homepage: 'https://www.microsoft.com/en-us/research/blog/',
  },
];

const parser = new Parser({
  timeout: 12000,
  headers: {
    'User-Agent': 'AICreator-NewsBot/1.0',
    Accept: 'application/rss+xml, application/xml, text/xml',
  },
});

async function loadPreviousData() {
  try {
    const raw = await fs.readFile(sourceOutputPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.items)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

const aiKeywords = [
  'ai',
  'artificial intelligence',
  'machine learning',
  'llm',
  'agent',
  'model',
  'deep learning',
  'multimodal',
  '人工智能',
  '大模型',
  '智能体',
  '机器学习',
  '深度学习',
  '多模态',
  '算法',
  '模型',
  '机器人',
];

function stripHtml(input = '') {
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSummary(item) {
  const text =
    stripHtml(item.contentSnippet) ||
    stripHtml(item.content) ||
    stripHtml(item.summary) ||
    stripHtml(item.title) ||
    '暂无摘要。';

  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

function isAiRelated(item) {
  const text = `${item.title ?? ''} ${item.contentSnippet ?? ''} ${item.content ?? ''}`.toLowerCase();
  return aiKeywords.some((keyword) => text.includes(keyword));
}

function normalizeDate(item) {
  const candidate = item.isoDate || item.pubDate || item.published || '';
  const date = new Date(candidate);

  if (Number.isNaN(date.getTime())) {
    return {
      iso: new Date().toISOString(),
      display: '最近更新',
    };
  }

  return {
    iso: date.toISOString(),
    display: date.toISOString().slice(0, 10),
  };
}

function normalizeUrl(url = '') {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, '');
  } catch {
    return url;
  }
}

function deduplicateItems(items) {
  const seen = new Set();
  const unique = [];

  for (const item of items) {
    const key = `${normalizeUrl(item.url)}|${stripHtml(item.title).toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

async function collectFeedItems(feed) {
  try {
    const result = await parser.parseURL(feed.url);
    const items = (result.items || [])
      .filter((item) => item.link && item.title)
      .filter((item) => isAiRelated(item))
      .slice(0, 6)
      .map((item) => {
        const date = normalizeDate(item);
        return {
          source: feed.source,
          region: feed.region,
          title: stripHtml(item.title ?? ''),
          summary: getSummary(item),
          url: item.link ?? feed.homepage,
          date: date.display,
          publishedAt: date.iso,
        };
      });

    return items;
  } catch (error) {
    console.warn(`[news:update] 拉取失败: ${feed.source} -> ${String(error)}`);
    return [];
  }
}

function getOutputPaths() {
  const outputPaths = [sourceOutputPath, publicOutputPath];
  if (fsSync.existsSync(path.dirname(distOutputPath))) {
    outputPaths.push(distOutputPath);
  }
  return outputPaths;
}

export async function run() {
  const previous = await loadPreviousData();
  const sourceItems = await Promise.all(feeds.map((feed) => collectFeedItems(feed)));
  const diversified = sourceItems.flatMap((items) => items.slice(0, 2));
  const merged = deduplicateItems(diversified)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12)
    .map(({ publishedAt, ...rest }) => rest);

  const finalItems = merged.length >= 6 ? merged : previous?.items || merged;

  const output = {
    updatedAt: new Date().toISOString(),
    total: finalItems.length,
    items: finalItems,
  };

  const outputPaths = getOutputPaths();

  await Promise.all(
    outputPaths.map(async (targetPath) => {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    }),
  );

  console.log(
    `[news:update] 已更新 ${finalItems.length} 条新闻 -> ${outputPaths.join(' & ')}`,
  );

  return output;
}

export function startNewsAutoRefresh(options = {}) {
  const intervalMs = Number(options.intervalMs ?? NEWS_REFRESH_INTERVAL_MS);
  const label = options.label ?? 'news:auto';

  let running = false;

  const refresh = async () => {
    if (running) {
      console.log(`[${label}] 上一次新闻刷新仍在执行，跳过本轮。`);
      return;
    }

    running = true;
    try {
      await run();
      console.log(`[${label}] 下一次刷新将在 ${Math.round(intervalMs / 1000)} 秒后执行。`);
    } catch (error) {
      console.error(`[${label}] 新闻刷新失败`, error);
    } finally {
      running = false;
    }
  };

  refresh();
  const timer = setInterval(refresh, intervalMs);

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  return timer;
}

const executedDirectly = process.argv[1]
  ? path.resolve(process.argv[1]) === __filename
  : false;

if (executedDirectly) {
  run().catch((error) => {
    console.error('[news:update] 执行失败', error);
    process.exitCode = 1;
  });
}
