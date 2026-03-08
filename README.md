# AI 少年学习平台

一个面向高年级小学生和中学生的 AI 学习平台网站原型，使用 Vite + React + TypeScript 构建。

当前版本包含：

- 青少年友好的首页视觉风格
- 平台核心课程模块展示
- 学习成长路径说明
- 图书《AI 少年：给未来创造者的超级助手指南》推广板块
- “内容获客 → 课程转化 → 图书赋能 → 社群复购”的商业闭环展示
- AI 最新新闻自动更新板块（中国 + 国际来源，附原文链接）
- 新闻区域筛选（全部 / 中国 / 国际）
- 青少年友好“一句话解读”
- 新闻收藏（浏览器本地保存）
- 家长端周报导出（Markdown / 打印为 PDF）
- 家长周报内置“亲子讨论题 + 本周行动建议”模板
- 老师课堂版讲义（教学目标、课堂任务、导出 Markdown / PDF）
- “AI 基础认知”深入模块（概念可视化、发展时间线、评价维度、科学家成果墙）

## AI 新闻自动更新

新闻聚合脚本位于：

- [scripts/update-news.mjs](scripts/update-news.mjs)

默认来源：

- 中国：机器之心、量子位、雷峰网、36氪
- 国际：Google DeepMind、Hugging Face、Microsoft Research

手动更新新闻数据：

```bash
npm run news:update
```

说明：`npm run dev` 与 `npm run build` 会先自动执行一次新闻更新。

当 Node 后端服务运行时（例如 `node server/visit-api.mjs` 或 `npm run local`），服务启动后会立即刷新一次新闻，并每 5 分钟自动重新抓取一次，前端页面也会每 5 分钟重新拉取最新 JSON。

更新策略：

- 自动去重（标题+链接）
- 单一来源失败不影响整体更新
- 当抓取结果过少时，优先保留上一次有效数据

## 环境要求

- Node.js 20+

## 安装依赖

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

## 构建预览

```bash
npm run build
npm run preview
```

## 云端部署后端（推荐同服务托管前端 + API）

后端入口文件：

- [server/visit-api.mjs](server/visit-api.mjs)

云端部署建议直接运行这个服务：它会同时提供：

- 前端静态页面（读取 `dist/`）
- `/api/visits`
- `/api/summary`
- 启动后立即抓取新闻，并每 5 分钟自动刷新一次

推荐启动命令：

```bash
npm run build:fast
npm run start:server
```

推荐环境变量：

- `PORT`：云平台分配的端口
- `HOST=0.0.0.0`
- `DATA_DIR=/app/.data`（或平台挂载的数据目录）

如果云平台支持 Docker，可直接使用仓库根目录下的 `Dockerfile` 构建并部署。

## 代码检查

```bash
npm run lint
```
