import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import newsData from './data/ai-news.generated.json';
import AiBasicsLearningPage from './pages/AiBasicsLearningPage';
import CreativeLabPage from './pages/CreativeLabPage';
import CreatorChallengePage from './pages/CreatorChallengePage';

type RegionFilter = 'all' | '中国' | '国际';
const FAVORITES_KEY = 'ai-news-favorites-v1';
const NEWS_SUMMARY_KEY = 'ai-news-summaries-v1';
const SHOWCASE_KEY = 'creative-lab-showcase-v1';
const ROLE_KEY = 'creative-lab-role-v1';
const AUTH_USERS_KEY = 'ai-platform-users-v1';
const AUTH_SESSION_KEY = 'ai-platform-session-v1';
type ModuleKey = 'ai-basics' | 'creative-lab' | 'creator-challenge';
type WorkshopWeek = { week: string; title: string; output: string };
type ShowcaseStatus = 'pending' | 'approved' | 'rejected';
type ViewerRole = 'student' | 'mentor';
type ShowcaseReview = {
  id: string;
  comment: string;
  time: string;
  source: 'manual' | 'template';
};

type ChallengeTeam = {
  id: string;
  teamName: string;
  gradeBand: string;
  projectTopic: string;
  status: '报名成功' | '方案已提交' | '决赛准备中';
};

type ChallengeSubmission = {
  id: string;
  teamName: string;
  title: string;
  summary: string;
  score: number;
};

type AuthUser = {
  id: string;
  nickname: string;
  loginType: 'phone' | 'wechat';
  phone?: string;
  createdAt: string;
};

type ShowcaseItem = {
  id: string;
  student: string;
  project: string;
  summary: string;
  link: string;
  status: ShowcaseStatus;
  mentorComment?: string;
  reviewedAt?: string;
  reviews?: ShowcaseReview[];
};

type NewsItem = {
  source: string;
  region?: '中国' | '国际';
  date: string;
  title: string;
  summary: string;
  url: string;
};

type NewsFeedPayload = {
  updatedAt?: string;
  items: NewsItem[];
};

type NewsSummaryPayload = {
  summary: string;
  updatedAt: string;
};

function toTeenFriendlySummary(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();

  if (text.includes('agent') || text.includes('智能体')) {
    return '青少年版：这条新闻讲的是“会自己分步骤做事的 AI 助手”正在变得更聪明。';
  }

  if (text.includes('robot') || text.includes('具身') || text.includes('机器人')) {
    return '青少年版：这条新闻重点是“AI+机器人”，让机器更像人一样看懂环境并完成任务。';
  }

  if (text.includes('model') || text.includes('大模型') || text.includes('llm')) {
    return '青少年版：这条新闻在说 AI 大模型能力升级，能更好地写作、推理或解决问题。';
  }

  return '青少年版：这条新闻反映 AI 技术正在加速进入学习、工作和真实生活场景。';
}

function isTeenReadable(news: NewsItem) {
  const text = `${news.title} ${news.summary}`;
  const hardWords = ['融资', '估值', '并购', '股价', '财报', '交易'];
  const tooLong = text.length > 180;
  const hasTooManyHardWords = hardWords.filter((word) => text.includes(word)).length >= 3;
  return !tooLong && !hasTooManyHardWords;
}

function getNewsScore(news: NewsItem) {
  const text = `${news.title} ${news.summary}`.toLowerCase();
  let score = 0;
  const positiveKeywords = ['智能体', 'agent', '机器人', '具身', '大模型', 'model', '学习', '教育'];
  positiveKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      score += 2;
    }
  });
  if (text.length <= 120) {
    score += 1;
  }
  return score;
}

function App() {
  const isAiBasicsPage = window.location.pathname === '/ai-basics';
  const isCreativeLabPage = window.location.pathname === '/creative-lab';
  const isCreatorChallengePage = window.location.pathname === '/creator-challenge';
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [teenOnly, setTeenOnly] = useState(false);
  const [favoriteUrls, setFavoriteUrls] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState<ModuleKey>('ai-basics');
  const learningDetailRef = useRef<HTMLElement | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    studentName: '',
    grade: '',
    parentContact: '',
    goal: '',
  });
  const [showcaseForm, setShowcaseForm] = useState({
    student: '',
    project: '',
    summary: '',
    link: '',
  });
  const [viewerRole, setViewerRole] = useState<ViewerRole>('student');
  const [showcaseFilter, setShowcaseFilter] = useState<'all' | ShowcaseStatus>('all');
  const [showcaseList, setShowcaseList] = useState<ShowcaseItem[]>([
    {
      id: 'demo-1',
      student: '七年级 · 林同学',
      project: 'AI 错题复盘助手',
      summary: '把错题自动归类，并生成“本周复习卡片”。',
      link: 'https://example.com/demo-learning-assistant',
      status: 'approved',
      mentorComment: '问题定义清晰，建议下一版加入“错因标签自动推荐”。',
      reviewedAt: '2026-02-10',
      reviews: [
        {
          id: 'demo-1-r1',
          comment: '问题定义清晰，建议下一版加入“错因标签自动推荐”。',
          time: '2026-02-10',
          source: 'manual',
        },
      ],
    },
    {
      id: 'demo-2',
      student: '五年级 · 周同学',
      project: '校园环保海报生成器',
      summary: '输入主题后可生成海报文案与视觉风格建议。',
      link: 'https://example.com/demo-green-poster',
      status: 'pending',
    },
  ]);
  const [challengeTeamForm, setChallengeTeamForm] = useState({
    teamName: '',
    gradeBand: '',
    projectTopic: '',
  });
  const [challengeSubmitForm, setChallengeSubmitForm] = useState({
    teamName: '',
    title: '',
    summary: '',
  });
  const [challengeTeams, setChallengeTeams] = useState<ChallengeTeam[]>([
    {
      id: 'team-1',
      teamName: '北斗少年队',
      gradeBand: '初一-初二',
      projectTopic: '校园作业规划助手',
      status: '方案已提交',
    },
    {
      id: 'team-2',
      teamName: '星火创客组',
      gradeBand: '五年级-六年级',
      projectTopic: '校园节水提醒系统',
      status: '决赛准备中',
    },
  ]);
  const [challengeSubmissions, setChallengeSubmissions] = useState<ChallengeSubmission[]>([
    {
      id: 'sub-1',
      teamName: '北斗少年队',
      title: '作业规划助手 V1',
      summary: '根据课程表自动生成学习清单，并提示复盘节点。',
      score: 88,
    },
    {
      id: 'sub-2',
      teamName: '星火创客组',
      title: '节水提醒系统 V1',
      summary: '通过校园饮水点数据生成节水倡议海报与打卡任务。',
      score: 84,
    },
  ]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [sentPhone, setSentPhone] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [authEntry, setAuthEntry] = useState<'phone' | 'wechat'>('phone');
  const [liveNewsData, setLiveNewsData] = useState<NewsFeedPayload>(() => ({
    updatedAt: newsData.updatedAt,
    items: Array.isArray(newsData.items) ? (newsData.items as NewsItem[]) : [],
  }));
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [newsSummaries, setNewsSummaries] = useState<Record<string, NewsSummaryPayload>>({});
  const [summaryLoading, setSummaryLoading] = useState<Record<string, boolean>>({});

  const coreModules = [
    {
      id: 'ai-basics' as const,
      title: 'AI 基础认知',
      desc: '用生活案例讲清楚“模型、数据、提示词”是什么，让学生先理解再上手。',
      tag: '认知',
      cta: '进入学习',
    },
    {
      id: 'creative-lab' as const,
      title: '创意实战工坊',
      desc: '围绕短视频脚本、学习助手、海报创作等任务做项目，提升表达与动手能力。',
      tag: '实践',
      cta: '进入工坊',
    },
    {
      id: 'creator-challenge' as const,
      title: '未来创造者挑战',
      desc: '用小组挑战赛把 AI 用到校园真实场景，培养协作、沟通与解决问题能力。',
      tag: '挑战',
      cta: '即将上线',
    },
  ];

  const aiTimeline = [
    {
      stage: '起点（1956）',
      title: 'Dartmouth 会议：AI 名称出现',
      detail: 'John McCarthy 在达特茅斯会议上提出“Artificial Intelligence”概念。',
    },
    {
      stage: '探索期（1960s-1980s）',
      title: '专家系统与符号推理',
      detail: '科学家尝试让机器用“规则”模拟专家判断。',
    },
    {
      stage: '复兴期（1990s-2010s）',
      title: '机器学习与深度学习崛起',
      detail: '数据和算力提升让神经网络在图像、语音中取得突破。',
    },
    {
      stage: '大模型时代（2020s-）',
      title: '生成式 AI 与智能体',
      detail: 'LLM、AIGC、AI Agent 加速进入学习、创作与产业应用。',
    },
  ];

  const workshopWeeks: WorkshopWeek[] = [
    { week: '第1周', title: '安全上手 + 提示词基础', output: '完成“我的 AI 使用规则卡”' },
    { week: '第2周', title: '文本创作实战', output: '产出 1 份短视频脚本或演讲稿' },
    { week: '第3周', title: '图像与视觉表达', output: '完成 1 张主题海报' },
    { week: '第4周', title: '学习助手设计', output: '提交“错题整理助手”原型' },
    { week: '第5周', title: '校园问题发现', output: '形成 1 份问题访谈记录' },
    { week: '第6周', title: '方案原型搭建', output: '完成小组作品 V1' },
    { week: '第7周', title: '打磨与路演训练', output: '完成路演讲稿与演示页' },
    { week: '第8周', title: '成果发布会', output: '进行公开展示 + 评审反馈' },
  ];

  const workshopFlow = [
    { time: '10 分钟', action: '热点导入', note: '结合 AI 新闻引出本节任务' },
    { time: '20 分钟', action: '概念讲解', note: '用生活案例讲清核心方法' },
    { time: '35 分钟', action: '分组实操', note: '按任务卡完成作品片段' },
    { time: '15 分钟', action: '展示点评', note: '同伴互评 + 导师建议' },
    { time: '10 分钟', action: '反思作业', note: '记录成长日志与下一步改进' },
  ];

  const workshopTracks = [
    {
      name: '学习效率赛道',
      examples: '错题助手、记忆卡片、复习计划器',
      scene: '服务“学得更快、更清晰”',
    },
    {
      name: '创意表达赛道',
      examples: '绘本创作、校园短视频、海报设计',
      scene: '服务“表达更有趣、更有影响力”',
    },
    {
      name: '校园公益赛道',
      examples: '环保提醒、活动组织助手、心理关怀提示',
      scene: '服务“让校园更友好”',
    },
  ];

  const workshopRubric = [
    { item: '创意分', weight: '25%', desc: '想法是否新颖，有没有自己的角度' },
    { item: '实用分', weight: '25%', desc: '是否解决真实问题，能否落地使用' },
    { item: '表达分', weight: '20%', desc: '展示是否清晰，故事是否有逻辑' },
    { item: '协作分', weight: '20%', desc: '分工是否合理，团队协作是否顺畅' },
    { item: '责任分', weight: '10%', desc: '是否遵守 AI 安全与伦理规范' },
  ];

  const conversionPath = [
    '体验课入口：第 2 周开放“30 分钟快闪创作营”',
    '正课转化：第 4 周举办家长阶段展示课',
    '图书联动：每周绑定《AI 少年》对应章节任务',
    '持续复购：第 8 周后发放进阶营邀请',
  ];

  const challengeStages = [
    { stage: '第 1 阶段', title: '问题发现', detail: '从校园真实场景中选出可改进的问题。' },
    { stage: '第 2 阶段', title: '方案设计', detail: '完成用户画像、AI 方案草图与风险清单。' },
    { stage: '第 3 阶段', title: '原型冲刺', detail: '用 2 周快速产出可演示版本并迭代。' },
    { stage: '第 4 阶段', title: '路演答辩', detail: '进行公开展示，接受导师与家长评审。' },
  ];

  const challengeTopics = [
    '学习效率：复习计划、错题诊断、知识点闯关',
    '校园公益：环保、心理关怀、校园协作服务',
    '创意表达：校史讲述、科学传播、社团活动传播',
  ];

  const challengeRubric = [
    { item: '问题价值', weight: '25%', note: '是否解决真实且有意义的问题' },
    { item: 'AI 方案质量', weight: '30%', note: '是否合理使用 AI，方案是否完整' },
    { item: '作品完成度', weight: '25%', note: '可演示性、稳定性、可复现性' },
    { item: '表达与协作', weight: '20%', note: '路演逻辑、团队分工、回应问题能力' },
  ];

  const mentorTemplates = [
    '优点：问题定义清楚，作品完成度高。建议：补充 1 个真实使用场景数据。下一步：优化交互流程并录制 1 分钟演示视频。',
    '优点：创意角度新颖，表达逻辑清晰。建议：把目标用户再聚焦到一个年级段。下一步：完成 3 次同学试用反馈记录。',
    '优点：技术应用合理，功能链路完整。建议：加强 AI 使用安全说明。下一步：补充“数据来源与免责声明”页面。',
  ];

  const evalDimensions = [
    { label: '准确性', score: 86 },
    { label: '推理能力', score: 79 },
    { label: '创造力', score: 74 },
    { label: '安全与伦理', score: 81 },
    { label: '效率与成本', score: 69 },
    { label: '可解释性', score: 63 },
  ];

  const scientists = [
    {
      name: 'John McCarthy',
      area: '美国',
      contribution: '提出“Artificial Intelligence”术语（1956）',
      products: 'LISP 语言、早期 AI 理论体系',
      org: 'Stanford AI Lab',
      avatar:
        'https://commons.wikimedia.org/wiki/Special:FilePath/John_McCarthy_%282314859532%29.jpg',
    },
    {
      name: 'Geoffrey Hinton',
      area: '加拿大',
      contribution: '深度学习先驱，推动神经网络复兴',
      products: '反向传播与深度网络研究成果',
      org: 'University of Toronto / Google',
      avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/SD_2025_-_Geoffrey_Hinton_01.jpg',
    },
    {
      name: 'Yann LeCun',
      area: '法国/美国',
      contribution: '卷积神经网络代表人物',
      products: 'CNN 体系，推动计算机视觉应用',
      org: 'Meta AI',
      avatar:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Yann_LeCun_at_the_University_of_Minnesota.jpg',
    },
    {
      name: 'Demis Hassabis',
      area: '英国',
      contribution: 'AI 与科学交叉突破',
      products: 'AlphaGo、AlphaFold',
      org: 'Google DeepMind',
      avatar:
        'https://commons.wikimedia.org/wiki/Special:FilePath/PhotonQ-Demis_Hassabis_on_Artificial_Playful_Intelligence_%2815366514658%29_%282%29.jpg',
    },
    {
      name: '李飞飞',
      area: '中国/美国',
      contribution: '推动计算机视觉教育与数据体系',
      products: 'ImageNet 数据集',
      org: 'Stanford HAI',
      avatar: 'https://profiles.stanford.edu/proxy/api/cap/profiles/15052/resources/profilephoto/350x350.jpg',
    },
    {
      name: '吴恩达',
      area: '中国/美国',
      contribution: 'AI 教育普及与产业化实践',
      products: '在线 AI 课程体系、产业 AI 方案',
      org: 'DeepLearning.AI / Landing AI',
      avatar: 'https://www.deeplearning.ai/wp-content/uploads/2021/03/AndrewNg-Headshot.jpg',
    },
    {
      name: '张亚勤',
      area: '中国',
      contribution: '推动 AI 与产业创新融合',
      products: '智能驾驶、智慧城市相关研究',
      org: '清华大学智能产业研究院',
      avatar: 'https://www.ai100.net/upload/image/20201010/1602296296111143.jpg',
    },
    {
      name: '王小川',
      area: '中国',
      contribution: '推动中文大模型应用生态',
      products: '百川智能系列模型',
      org: '百川智能',
      avatar: 'https://www.baichuan-ai.com/static/images/leader-wangxiaochuan.jpg',
    },
  ];

  const fallbackNews = [
    {
      source: 'Google DeepMind',
      region: '国际',
      date: '2026-02',
      title: 'Gemini Deep Think 加速数学与科学发现',
      summary:
        'DeepMind 展示了 Gemini Deep Think 在科学探索中的应用方向，强调 AI 在研究辅助和问题求解中的潜力。',
      url: 'https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/',
    },
    {
      source: 'Hugging Face Blog',
      region: '国际',
      date: '2026-02-12',
      title: 'OpenEnv in Practice：真实环境中的智能体评测',
      summary:
        'Hugging Face 社区发布 OpenEnv 实践文章，关注 AI Agent 在真实工具环境中的评测方法与可复现测试流程。',
      url: 'https://huggingface.co/blog/openenv-turing',
    },
    {
      source: 'Microsoft Research Blog',
      region: '国际',
      date: '2026-02-05',
      title: 'Predictive Inverse Dynamics Models（PIDM）',
      summary:
        '微软研究团队提出 PIDM 在模仿学习中的优势：减少示例依赖、提升学习效率，为教育与机器人训练提供新思路。',
      url: 'https://www.microsoft.com/en-us/research/blog/rethinking-imitation-learning-with-predictive-inverse-dynamics-models/',
    },
    {
      source: '量子位',
      region: '中国',
      date: '2026-02',
      title: '中国 AI 行业动态追踪',
      summary: '聚焦国内大模型、智能体和产业落地进展，方便学生理解中国 AI 生态变化。',
      url: 'https://www.qbitai.com/',
    },
    {
      source: '机器之心',
      region: '中国',
      date: '2026-02',
      title: '前沿技术与论文速览',
      summary: '面向中文读者持续发布 AI 技术解读、研究进展和应用案例。',
      url: 'https://www.jiqizhixin.com/',
    },
  ];

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch(`/ai-news.generated.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { updatedAt?: string; items?: unknown };
        if (!Array.isArray(payload.items)) {
          return;
        }

        const normalizedItems = payload.items
          .filter((item): item is NewsItem => typeof item === 'object' && item !== null)
          .map((item): NewsItem => {
            const record = item as Record<string, unknown>;
            const region: NewsItem['region'] =
              record.region === '中国' || record.region === '国际' ? record.region : undefined;
            return {
              source: String(record.source ?? ''),
              region,
              date: String(record.date ?? ''),
              title: String(record.title ?? ''),
              summary: String(record.summary ?? ''),
              url: String(record.url ?? ''),
            };
          })
          .filter((item) => item.source && item.title && item.url);

        setLiveNewsData({
          updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : '',
          items: normalizedItems,
        });
      } catch {
        // ignore runtime fetch failure and keep local fallback news
      }
    };

    fetchLatestNews();
    const timer = window.setInterval(fetchLatestNews, 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const increaseVisitCount = async () => {
      try {
        const response = await fetch(`/api/visits?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { count?: unknown };
        if (typeof payload.count !== 'number') {
          return;
        }
        if (!cancelled) {
          setVisitCount(payload.count);
        }
      } catch {
        // ignore visit counter failure
      }
    };

    increaseVisitCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const latestNews: NewsItem[] =
    liveNewsData.items.length > 0
      ? liveNewsData.items
      : ((newsData.items.length > 0 ? newsData.items : fallbackNews) as NewsItem[]);
  const displayedNews = useMemo<NewsItem[]>(() => {
    if (regionFilter === 'all') {
      return latestNews
        .filter((item) => (teenOnly ? isTeenReadable(item) : true))
        .filter((item) => {
          if (!keyword.trim()) {
            return true;
          }
          const text = `${item.title} ${item.summary} ${item.source}`.toLowerCase();
          return text.includes(keyword.trim().toLowerCase());
        });
    }

    return latestNews
      .filter((item) => item.region === regionFilter)
      .filter((item) => (teenOnly ? isTeenReadable(item) : true))
      .filter((item) => {
        if (!keyword.trim()) {
          return true;
        }
        const text = `${item.title} ${item.summary} ${item.source}`.toLowerCase();
        return text.includes(keyword.trim().toLowerCase());
      });
  }, [keyword, latestNews, regionFilter, teenOnly]);

  const weeklyHighlights = useMemo(() => {
    return [...displayedNews]
      .sort((a, b) => {
        const dateDelta = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (!Number.isNaN(dateDelta) && dateDelta !== 0) {
          return dateDelta;
        }
        return getNewsScore(b) - getNewsScore(a);
      })
      .slice(0, 3);
  }, [displayedNews]);

  const latestNewsUpdatedAt = (liveNewsData.updatedAt || newsData.updatedAt)
    ? new Date(liveNewsData.updatedAt || newsData.updatedAt).toLocaleString('zh-CN', { hour12: false })
    : '未更新';

  useEffect(() => {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setFavoriteUrls(parsed.filter((value): value is string => typeof value === 'string'));
      }
    } catch {
      setFavoriteUrls([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteUrls));
  }, [favoriteUrls]);

  useEffect(() => {
    const raw = localStorage.getItem(NEWS_SUMMARY_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Record<string, NewsSummaryPayload>;
      if (parsed && typeof parsed === 'object') {
        setNewsSummaries(parsed);
      }
    } catch {
      // ignore invalid cache
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NEWS_SUMMARY_KEY, JSON.stringify(newsSummaries));
  }, [newsSummaries]);

  useEffect(() => {
    const raw = localStorage.getItem(SHOWCASE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized: ShowcaseItem[] = parsed
          .filter((item: unknown): item is Record<string, unknown> => typeof item === 'object' && item !== null)
          .map((item): ShowcaseItem => {
            const reviews: ShowcaseReview[] = Array.isArray(item.reviews)
              ? item.reviews
                  .filter(
                    (review: unknown): review is Record<string, unknown> =>
                      typeof review === 'object' && review !== null,
                  )
                  .map((review): ShowcaseReview => ({
                    id: String(review.id ?? `${Date.now()}-${Math.random()}`),
                    comment: String(review.comment ?? ''),
                    time: String(review.time ?? new Date().toISOString().slice(0, 10)),
                    source: review.source === 'template' ? 'template' : 'manual',
                  }))
                  .filter((review) => review.comment)
              : typeof item.mentorComment === 'string'
                ? [
                    {
                      id: `${String(item.id ?? Date.now())}-legacy`,
                      comment: String(item.mentorComment),
                      time:
                        typeof item.reviewedAt === 'string'
                          ? String(item.reviewedAt)
                          : new Date().toISOString().slice(0, 10),
                      source: 'manual',
                    },
                  ]
                : [];

            return {
              id: String(item.id ?? Date.now()),
              student: String(item.student ?? ''),
              project: String(item.project ?? ''),
              summary: String(item.summary ?? ''),
              link: String(item.link ?? ''),
              status:
                item.status === 'approved' || item.status === 'rejected' || item.status === 'pending'
                  ? item.status
                  : 'pending',
              mentorComment: typeof item.mentorComment === 'string' ? item.mentorComment : undefined,
              reviewedAt: typeof item.reviewedAt === 'string' ? item.reviewedAt : undefined,
              reviews,
            };
          })
          .filter((item) => item.student && item.project && item.summary && item.link);

        if (normalized.length > 0) {
          setShowcaseList(normalized);
        }
      }
    } catch {
      // ignore invalid local data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SHOWCASE_KEY, JSON.stringify(showcaseList));
  }, [showcaseList]);

  useEffect(() => {
    const raw = localStorage.getItem(ROLE_KEY);
    if (raw === 'student' || raw === 'mentor') {
      setViewerRole(raw);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, viewerRole);
  }, [viewerRole]);

  useEffect(() => {
    const rawUsers = localStorage.getItem(AUTH_USERS_KEY);
    if (rawUsers) {
      try {
        const parsed = JSON.parse(rawUsers);
        if (Array.isArray(parsed)) {
          const users = parsed
            .filter((item: unknown): item is Record<string, unknown> => typeof item === 'object' && item !== null)
            .map(
              (item): AuthUser => ({
                id: String(item.id ?? Date.now()),
                nickname: String(item.nickname ?? '同学'),
                loginType: item.loginType === 'wechat' ? 'wechat' : 'phone',
                phone: typeof item.phone === 'string' ? item.phone : undefined,
                createdAt:
                  typeof item.createdAt === 'string'
                    ? item.createdAt
                    : new Date().toISOString().slice(0, 10),
              }),
            );
          setAuthUsers(users);
        }
      } catch {
        setAuthUsers([]);
      }
    }

    const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession) as AuthUser;
        if (parsed && typeof parsed.id === 'string') {
          setCurrentUser(parsed);
        }
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(authUsers));
  }, [authUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  function toggleFavorite(url: string) {
    setFavoriteUrls((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  }

  async function ensureNewsSummary(url: string) {
    if (newsSummaries[url]?.summary) {
      return;
    }
    if (summaryLoading[url]) {
      return;
    }

    setSummaryLoading((prev) => ({ ...prev, [url]: true }));
    try {
      const response = await fetch(`/api/summary?url=${encodeURIComponent(url)}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { summary?: unknown };
      const summary = typeof payload.summary === 'string' ? payload.summary.trim() : '';
      if (!summary) {
        return;
      }
      setNewsSummaries((prev) => ({
        ...prev,
        [url]: {
          summary,
          updatedAt: new Date().toISOString(),
        },
      }));
    } catch {
      // ignore
    } finally {
      setSummaryLoading((prev) => ({ ...prev, [url]: false }));
    }
  }

  function openModule(module: ModuleKey) {
    if (module === 'ai-basics') {
      window.location.href = '/ai-basics';
      return;
    }
    if (module === 'creative-lab') {
      window.location.href = '/creative-lab';
      return;
    }
    if (module === 'creator-challenge') {
      window.location.href = '/creator-challenge';
      return;
    }
    setActiveModule(module);
    window.location.hash = module;
    requestAnimationFrame(() => {
      learningDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  const filteredShowcaseList = useMemo(() => {
    if (showcaseFilter === 'all') {
      return showcaseList;
    }
    return showcaseList.filter((item) => item.status === showcaseFilter);
  }, [showcaseFilter, showcaseList]);
  const visibleShowcaseList = useMemo(() => {
    if (viewerRole === 'mentor') {
      return filteredShowcaseList;
    }
    return showcaseList.filter((item) => item.status === 'approved');
  }, [filteredShowcaseList, showcaseList, viewerRole]);
  const pendingShowcaseCount = useMemo(
    () => showcaseList.filter((item) => item.status === 'pending').length,
    [showcaseList],
  );

  function downloadWeekTask(week: WorkshopWeek) {
    const lines = [
      `# 创意实战工坊任务卡 - ${week.week}`,
      '',
      `## 主题`,
      week.title,
      '',
      '## 本周产出',
      week.output,
      '',
      '## 完成清单',
      '- 我们解决的真实问题是：',
      '- 我们使用了哪些 AI 工具：',
      '- 我们做出的关键改进：',
      '- 我们的展示链接：',
    ];

    const markdown = `${lines.join('\n')}\n`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `creative-lab-${week.week}-task.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function downloadWorkshopPlan() {
    const lines = [
      '# 创意实战工坊 8 周计划单',
      '',
      ...workshopWeeks.flatMap((item) => [
        `## ${item.week} ${item.title}`,
        `- 本周产出：${item.output}`,
        '- 课堂展示：每组 3 分钟演示 + 2 分钟答辩',
        '',
      ]),
      '---',
      '可打印后用于家校共学与课堂跟进。',
    ];

    const markdown = `${lines.join('\n')}\n`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'creative-lab-8-week-plan.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function handleEnrollSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnrollSuccess(true);
    setShowEnrollModal(false);
    setEnrollForm({ studentName: '', grade: '', parentContact: '', goal: '' });
  }

  function handleShowcaseSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!showcaseForm.student || !showcaseForm.project || !showcaseForm.summary || !showcaseForm.link) {
      return;
    }

    setShowcaseList((prev) => [
      {
        id: `${Date.now()}`,
        student: showcaseForm.student,
        project: showcaseForm.project,
        summary: showcaseForm.summary,
        link: showcaseForm.link,
        status: 'pending',
      },
      ...prev,
    ]);

    setShowcaseForm({ student: '', project: '', summary: '', link: '' });
  }

  function reviewShowcase(id: string, status: ShowcaseStatus) {
    setShowcaseList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reviewedAt: new Date().toISOString().slice(0, 10),
            }
          : item,
      ),
    );
  }

  function addMentorComment(id: string) {
    const comment = window.prompt('请输入导师点评：');
    if (!comment || !comment.trim()) {
      return;
    }
    setShowcaseList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              mentorComment: comment.trim(),
              reviewedAt: new Date().toISOString().slice(0, 10),
              reviews: [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  comment: comment.trim(),
                  time: new Date().toISOString().slice(0, 10),
                  source: 'manual',
                },
                ...(item.reviews ?? []),
              ],
            }
          : item,
      ),
    );
  }

  function applyMentorTemplate(id: string, template: string) {
    setShowcaseList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              mentorComment: template,
              reviewedAt: new Date().toISOString().slice(0, 10),
              reviews: [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  comment: template,
                  time: new Date().toISOString().slice(0, 10),
                  source: 'template',
                },
                ...(item.reviews ?? []),
              ],
            }
          : item,
      ),
    );
  }

  function downloadChallengeHandbook() {
    const lines = [
      '# 未来创造者挑战赛手册',
      '',
      '## 挑战赛目标',
      '让学生用 AI 解决校园真实问题，形成“问题发现-方案设计-原型实现-公开路演”的完整项目经历。',
      '',
      '## 四阶段赛制',
      ...challengeStages.flatMap((item) => [`- ${item.stage} ${item.title}：${item.detail}`]),
      '',
      '## 推荐赛题方向',
      ...challengeTopics.map((item) => `- ${item}`),
      '',
      '## 评分标准',
      ...challengeRubric.map((item) => `- ${item.item}（${item.weight}）：${item.note}`),
      '',
      '## 提交清单',
      '- 项目说明（问题、目标用户、方案）',
      '- 原型演示链接',
      '- 2 分钟路演稿',
      '- 风险与伦理说明',
    ];

    const markdown = `${lines.join('\n')}\n`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'future-creator-challenge-handbook.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function handleChallengeTeamSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChallengeTeams((prev) => [
      {
        id: `${Date.now()}`,
        teamName: challengeTeamForm.teamName,
        gradeBand: challengeTeamForm.gradeBand,
        projectTopic: challengeTeamForm.projectTopic,
        status: '报名成功',
      },
      ...prev,
    ]);
    setChallengeTeamForm({ teamName: '', gradeBand: '', projectTopic: '' });
  }

  function handleChallengeSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChallengeSubmissions((prev) => [
      {
        id: `${Date.now()}`,
        teamName: challengeSubmitForm.teamName,
        title: challengeSubmitForm.title,
        summary: challengeSubmitForm.summary,
        score: 75,
      },
      ...prev,
    ]);
    setChallengeSubmitForm({ teamName: '', title: '', summary: '' });
  }

  function isValidChinaPhone(phone: string) {
    return /^1\d{10}$/.test(phone);
  }

  function sendPhoneCode() {
    if (!isValidChinaPhone(phoneInput)) {
      setAuthMessage('请输入正确的手机号（11位，以1开头）。');
      return;
    }
    if (countdown > 0) {
      return;
    }

    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    setSentCode(code);
    setSentPhone(phoneInput);
    setCountdown(60);
    setAuthMessage(`验证码已发送（演示环境）：${code}`);
  }

  function handlePhoneAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidChinaPhone(phoneInput)) {
      setAuthMessage('手机号格式不正确。');
      return;
    }

    if (!sentCode || sentPhone !== phoneInput) {
      setAuthMessage('请先获取当前手机号验证码。');
      return;
    }

    if (codeInput !== sentCode) {
      setAuthMessage('验证码错误，请重试。');
      return;
    }

    if (authMode === 'register') {
      if (!nicknameInput.trim()) {
        setAuthMessage('注册时请填写昵称。');
        return;
      }
      const existing = authUsers.find((user) => user.phone === phoneInput);
      if (existing) {
        setCurrentUser(existing);
        setAuthMessage('该手机号已注册，已直接登录。');
      } else {
        const newUser: AuthUser = {
          id: `u-${Date.now()}`,
          phone: phoneInput,
          nickname: nicknameInput.trim(),
          loginType: 'phone',
          createdAt: new Date().toISOString().slice(0, 10),
        };
        setAuthUsers((prev) => [newUser, ...prev]);
        setCurrentUser(newUser);
        setAuthMessage('手机号注册成功，已登录。');
      }
    } else {
      const existing = authUsers.find((user) => user.phone === phoneInput);
      if (!existing) {
        setAuthMessage('该手机号未注册，请先注册。');
        return;
      }
      setCurrentUser(existing);
      setAuthMessage('登录成功，欢迎回来。');
    }
  }

  function handleWechatLogin() {
    const wechatUser: AuthUser = {
      id: `wx-${Date.now()}`,
      nickname: `微信用户${Math.floor(Math.random() * 1000)}`,
      loginType: 'wechat',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAuthUsers((prev) => [wechatUser, ...prev]);
    setCurrentUser(wechatUser);
    setAuthMessage('微信快捷登录成功（演示模式）。');
  }

  function logout() {
    setCurrentUser(null);
    setAuthMessage('你已退出登录。');
  }

  function openAuthPage(entry: 'phone' | 'wechat') {
    setAuthEntry(entry);
    setShowAuthPage(true);
    setAuthMessage('');
    if (entry === 'phone') {
      setAuthMode('register');
    }
  }

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'ai-basics' || hash === 'creative-lab' || hash === 'creator-challenge') {
      setActiveModule(hash);
    }
  }, []);

  if (isAiBasicsPage) {
    return <AiBasicsLearningPage />;
  }

  if (isCreativeLabPage) {
    return <CreativeLabPage />;
  }

  if (isCreatorChallengePage) {
    return <CreatorChallengePage />;
  }

  return (
    <main className="site">
      <div className="auth-quick-entry" aria-label="登录入口">
        <div className="traffic-counter" aria-label="访问量">
          <span className="traffic-label">访问量：</span>
          <strong className="traffic-value">{visitCount === null ? '-' : visitCount}</strong>
        </div>
        {currentUser ? (
          <button type="button" className="auth-icon user" onClick={() => setShowAuthPage((prev) => !prev)}>
            👤
            <span className="login-tooltip">{`已登录：${currentUser.nickname}`}</span>
          </button>
        ) : (
          <>
            <button type="button" className="auth-icon phone" onClick={() => openAuthPage('phone')}>
              📱
              <span className="login-tooltip">点击登录</span>
            </button>
            <button type="button" className="auth-icon wechat" onClick={() => openAuthPage('wechat')}>
              💬
              <span className="login-tooltip">点击登录</span>
            </button>
          </>
        )}
      </div>

      {showAuthPage ? (
        <section className="panel auth-panel auth-page">
          <div className="auth-page-head">
            <h2>账号登录中心</h2>
            <button type="button" className="ghost" onClick={() => setShowAuthPage(false)}>
              关闭
            </button>
          </div>

          {currentUser ? (
            <div className="auth-logged-in">
              <p>
                当前已登录：
                <strong>{currentUser.nickname}</strong>
                （{currentUser.loginType === 'wechat' ? '微信账号' : `手机号 ${currentUser.phone ?? ''}`}）
              </p>
              <button type="button" className="ghost" onClick={logout}>
                退出登录
              </button>
            </div>
          ) : (
            <div className="auth-grid">
              <article className={authEntry === 'phone' ? 'auth-card active' : 'auth-card'}>
                <div className="auth-mode-switch" role="tablist" aria-label="手机号登录注册切换">
                  <button
                    type="button"
                    className={authMode === 'register' ? 'chip active' : 'chip'}
                    onClick={() => setAuthMode('register')}
                  >
                    手机号注册
                  </button>
                  <button
                    type="button"
                    className={authMode === 'login' ? 'chip active' : 'chip'}
                    onClick={() => setAuthMode('login')}
                  >
                    手机号登录
                  </button>
                </div>

                <form className="auth-form" onSubmit={handlePhoneAuth}>
                  <input
                    type="tel"
                    placeholder="手机号（11位）"
                    value={phoneInput}
                    onChange={(event) => setPhoneInput(event.target.value.trim())}
                    required
                  />
                  {authMode === 'register' ? (
                    <input
                      type="text"
                      placeholder="昵称"
                      value={nicknameInput}
                      onChange={(event) => setNicknameInput(event.target.value)}
                      required
                    />
                  ) : null}
                  <div className="code-row">
                    <input
                      type="text"
                      placeholder="短信验证码"
                      value={codeInput}
                      onChange={(event) => setCodeInput(event.target.value.trim())}
                      required
                    />
                    <button type="button" className="ghost" onClick={sendPhoneCode} disabled={countdown > 0}>
                      {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                    </button>
                  </div>
                  <button type="submit">{authMode === 'register' ? '注册并登录' : '登录'}</button>
                </form>
              </article>

              <article className={authEntry === 'wechat' ? 'auth-card active' : 'auth-card'}>
                <h3>微信快捷登录</h3>
                <p>支持一键登录，快速进入学习平台。</p>
                <button type="button" onClick={handleWechatLogin}>
                  微信账号直接登录
                </button>
                <p className="auth-note">说明：当前为演示版。生产环境需接入微信开放平台 OAuth。</p>
              </article>
            </div>
          )}
          {authMessage ? <p className="auth-message">{authMessage}</p> : null}
        </section>
      ) : null}

      <section className="hero panel">
        <p className="eyebrow">给青少年的AI学习平台</p>
        <h1>让孩子像“未来创造者”一样学习 AI</h1>
        <p className="subtitle" style={{ whiteSpace: 'nowrap' }}>
          用通俗、好玩、可实操的方式，帮助青少年理解并应用 AI，从“会用工具”走向“
          <span style={{ whiteSpace: 'nowrap' }}>学会用 AI 解决真实问题</span>
          ”。
        </p>
      </section>

      <section className="panel">
        <h2>平台核心模块</h2>
        <div className="grid-3">
          {coreModules.map((module) => (
            <article
              className="card module-card"
              key={module.title}
              onClick={() => openModule(module.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openModule(module.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="tag">{module.tag}</span>
              <h3>{module.title}</h3>
              <p>{module.desc}</p>
              <button
                type="button"
                className="ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  openModule(module.id);
                }}
              >
                {module.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      {activeModule !== 'ai-basics' ? (
        <section className="panel" ref={learningDetailRef}>
          <h2>模块深入：{coreModules.find((m) => m.id === activeModule)?.title}</h2>
          {activeModule === 'creative-lab' ? (
          <div className="creative-lab-detail">
            <div className="lab-intro">
              <h3>创意实战工坊总目标</h3>
              <p>
                让学生从“会用 AI”升级到“会做作品”：每位同学至少完成 1 个可展示项目，培养表达、协作与解决真实问题的能力。
              </p>
              <div className="lab-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEnrollModal(true);
                    setEnrollSuccess(false);
                  }}
                >
                  预约工坊体验
                </button>
                <button className="ghost" type="button" onClick={downloadWorkshopPlan}>
                  下载 8 周计划单
                </button>
              </div>
              {enrollSuccess ? <p className="success-tip">已收到预约信息，我们会尽快联系你。</p> : null}
            </div>

            <div className="lab-weeks">
              <h3>8 周课程地图</h3>
              <div className="weeks-grid">
                {workshopWeeks.map((item) => (
                  <article className="week-card" key={item.week}>
                    <p className="week-tag">{item.week}</p>
                    <h4>{item.title}</h4>
                    <p>{item.output}</p>
                    <button className="ghost" type="button" onClick={() => downloadWeekTask(item)}>
                      下载任务卡
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div className="lab-flow">
              <h3>每节课 90 分钟流程</h3>
              <ul>
                {workshopFlow.map((step) => (
                  <li key={step.time + step.action}>
                    <strong>{step.time}</strong>
                    <span>{step.action}</span>
                    <p>{step.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lab-tracks">
              <h3>三条项目赛道</h3>
              <div className="tracks-grid">
                {workshopTracks.map((track) => (
                  <article className="track-card" key={track.name}>
                    <h4>{track.name}</h4>
                    <p>
                      <strong>项目示例：</strong>
                      {track.examples}
                    </p>
                    <p>
                      <strong>应用场景：</strong>
                      {track.scene}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="lab-rubric">
              <h3>学生评价标准（透明可见）</h3>
              <table>
                <thead>
                  <tr>
                    <th>维度</th>
                    <th>权重</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  {workshopRubric.map((metric) => (
                    <tr key={metric.item}>
                      <td>{metric.item}</td>
                      <td>{metric.weight}</td>
                      <td>{metric.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lab-conversion">
              <h3>商业闭环嵌入点</h3>
              <ul>
                {conversionPath.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="lab-showcase">
              <h3>作品墙提交入口</h3>
              <div className="role-switch">
                <span>当前模式：</span>
                <button
                  type="button"
                  className={viewerRole === 'student' ? 'chip active' : 'chip'}
                  onClick={() => setViewerRole('student')}
                >
                  学生/家长视角
                </button>
                <button
                  type="button"
                  className={viewerRole === 'mentor' ? 'chip active' : 'chip'}
                  onClick={() => setViewerRole('mentor')}
                >
                  导师审核视角
                </button>
              </div>
              <p>
                {viewerRole === 'mentor'
                  ? `当前待审核作品 ${pendingShowcaseCount} 个。`
                  : '学生/家长视角仅展示已通过审核作品。'}
              </p>
              <form className="showcase-form" onSubmit={handleShowcaseSubmit}>
                <input
                  value={showcaseForm.student}
                  onChange={(event) => setShowcaseForm((prev) => ({ ...prev, student: event.target.value }))}
                  placeholder="学生信息（如：七年级·李同学）"
                  required
                />
                <input
                  value={showcaseForm.project}
                  onChange={(event) => setShowcaseForm((prev) => ({ ...prev, project: event.target.value }))}
                  placeholder="项目名称"
                  required
                />
                <input
                  type="url"
                  value={showcaseForm.link}
                  onChange={(event) => setShowcaseForm((prev) => ({ ...prev, link: event.target.value }))}
                  placeholder="作品链接（https://...）"
                  required
                />
                <textarea
                  value={showcaseForm.summary}
                  onChange={(event) => setShowcaseForm((prev) => ({ ...prev, summary: event.target.value }))}
                  placeholder="作品简介"
                  rows={3}
                  required
                />
                <button type="submit">提交到作品墙</button>
              </form>

              {viewerRole === 'mentor' ? (
                <div className="showcase-filters" role="tablist" aria-label="作品墙审核筛选">
                  <button
                    type="button"
                    className={showcaseFilter === 'all' ? 'chip active' : 'chip'}
                    onClick={() => setShowcaseFilter('all')}
                  >
                    全部
                  </button>
                  <button
                    type="button"
                    className={showcaseFilter === 'pending' ? 'chip active' : 'chip'}
                    onClick={() => setShowcaseFilter('pending')}
                  >
                    待审核
                  </button>
                  <button
                    type="button"
                    className={showcaseFilter === 'approved' ? 'chip active' : 'chip'}
                    onClick={() => setShowcaseFilter('approved')}
                  >
                    已通过
                  </button>
                  <button
                    type="button"
                    className={showcaseFilter === 'rejected' ? 'chip active' : 'chip'}
                    onClick={() => setShowcaseFilter('rejected')}
                  >
                    已退回
                  </button>
                </div>
              ) : null}

              <div className="showcase-grid">
                {visibleShowcaseList.map((item) => (
                  <article className="showcase-card" key={item.id}>
                    <p className="week-tag">{item.student}</p>
                    <p className={`review-badge ${item.status}`}>
                      审核状态：{item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已退回'}
                    </p>
                    <h4>{item.project}</h4>
                    <p>{item.summary}</p>
                    <a className="news-link" href={item.link} target="_blank" rel="noreferrer">
                      查看作品
                    </a>
                    {viewerRole === 'mentor' ? (
                      <div className="review-actions">
                        <button className="ghost" type="button" onClick={() => addMentorComment(item.id)}>
                          导师点评
                        </button>
                        {item.status !== 'approved' ? (
                          <button className="ghost" type="button" onClick={() => reviewShowcase(item.id, 'approved')}>
                            通过
                          </button>
                        ) : null}
                        {item.status !== 'rejected' ? (
                          <button className="ghost" type="button" onClick={() => reviewShowcase(item.id, 'rejected')}>
                            退回
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                    {viewerRole === 'mentor' ? (
                      <div className="template-actions">
                        {mentorTemplates.map((template, index) => (
                          <button
                            key={`${item.id}-tpl-${index}`}
                            className="ghost"
                            type="button"
                            onClick={() => applyMentorTemplate(item.id, template)}
                          >
                            模板 {index + 1}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {item.mentorComment ? <p className="mentor-comment">导师点评：{item.mentorComment}</p> : null}
                    {item.reviewedAt ? <p className="review-time">最近处理：{item.reviewedAt}</p> : null}
                    {item.reviews && item.reviews.length > 0 ? (
                      <div className="review-history">
                        <h5>点评历史</h5>
                        <ul>
                          {item.reviews.slice(0, 5).map((review) => (
                            <li key={review.id}>
                              <p>{review.comment}</p>
                              <span>
                                {review.time} · {review.source === 'template' ? '模板点评' : '手动点评'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
              {visibleShowcaseList.length === 0 ? (
                <p className="empty-tip">当前筛选下暂无作品，先提交一个试试吧。</p>
              ) : null}
            </div>
          </div>
        ) : activeModule === 'creator-challenge' ? (
          <div className="creator-challenge-detail">
            <div className="challenge-intro">
              <h3>未来创造者挑战赛目标</h3>
              <p>
                面向高年级小学生和中学生，以“真实问题 + AI 方案 + 团队路演”为核心，帮助学生建立系统化项目能力与创造者思维。
              </p>
              <div className="lab-actions">
                <button type="button" onClick={downloadChallengeHandbook}>
                  下载挑战赛手册
                </button>
                <button className="ghost" type="button" onClick={() => window.print()}>
                  打印赛制说明
                </button>
              </div>
            </div>

            <div className="challenge-stages">
              <h3>四阶段赛制</h3>
              <div className="weeks-grid">
                {challengeStages.map((item) => (
                  <article className="week-card" key={item.stage}>
                    <p className="week-tag">{item.stage}</p>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="challenge-topics">
              <h3>推荐赛题包</h3>
              <ul>
                {challengeTopics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="challenge-rubric">
              <h3>评审标准</h3>
              <table>
                <thead>
                  <tr>
                    <th>维度</th>
                    <th>权重</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  {challengeRubric.map((row) => (
                    <tr key={row.item}>
                      <td>{row.item}</td>
                      <td>{row.weight}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="challenge-ops">
              <article className="challenge-form-card">
                <h3>团队报名</h3>
                <form className="showcase-form" onSubmit={handleChallengeTeamSubmit}>
                  <input
                    value={challengeTeamForm.teamName}
                    onChange={(event) => setChallengeTeamForm((prev) => ({ ...prev, teamName: event.target.value }))}
                    placeholder="团队名称"
                    required
                  />
                  <input
                    value={challengeTeamForm.gradeBand}
                    onChange={(event) => setChallengeTeamForm((prev) => ({ ...prev, gradeBand: event.target.value }))}
                    placeholder="年级段（如：六年级-初一）"
                    required
                  />
                  <input
                    value={challengeTeamForm.projectTopic}
                    onChange={(event) =>
                      setChallengeTeamForm((prev) => ({
                        ...prev,
                        projectTopic: event.target.value,
                      }))
                    }
                    placeholder="拟解决的问题"
                    required
                  />
                  <button type="submit">提交报名</button>
                </form>
              </article>

              <article className="challenge-form-card">
                <h3>项目提交</h3>
                <form className="showcase-form" onSubmit={handleChallengeSubmission}>
                  <input
                    value={challengeSubmitForm.teamName}
                    onChange={(event) =>
                      setChallengeSubmitForm((prev) => ({
                        ...prev,
                        teamName: event.target.value,
                      }))
                    }
                    placeholder="团队名称"
                    required
                  />
                  <input
                    value={challengeSubmitForm.title}
                    onChange={(event) => setChallengeSubmitForm((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="作品标题"
                    required
                  />
                  <textarea
                    value={challengeSubmitForm.summary}
                    onChange={(event) =>
                      setChallengeSubmitForm((prev) => ({
                        ...prev,
                        summary: event.target.value,
                      }))
                    }
                    placeholder="作品摘要"
                    rows={3}
                    required
                  />
                  <button type="submit">提交作品</button>
                </form>
              </article>
            </div>

            <div className="challenge-board">
              <h3>挑战赛看板</h3>
              <div className="grid-2 challenge-list-wrap">
                <article className="challenge-list">
                  <h4>参赛团队</h4>
                  <ul>
                    {challengeTeams.map((team) => (
                      <li key={team.id}>
                        <p>
                          <strong>{team.teamName}</strong> · {team.gradeBand}
                        </p>
                        <p>{team.projectTopic}</p>
                        <span className="review-badge approved">{team.status}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="challenge-list">
                  <h4>作品排行榜（示例）</h4>
                  <ol>
                    {[...challengeSubmissions]
                      .sort((a, b) => b.score - a.score)
                      .map((submission) => (
                        <li key={submission.id}>
                          <p>
                            <strong>{submission.title}</strong> · {submission.teamName}
                          </p>
                          <p>{submission.summary}</p>
                          <span className="week-tag">当前评分：{submission.score}</span>
                        </li>
                      ))}
                  </ol>
                </article>
              </div>
            </div>
          </div>
        ) : (
          <p className="coming-soon-tip">
            你当前选择的是“{coreModules.find((m) => m.id === activeModule)?.title}”。该模块的深入内容正在制作中，将包含项目闯关与互动练习。
          </p>
          )}
        </section>
      ) : null}

      <section className="panel book">
        <div>
          <p className="eyebrow">新书联动板块</p>
          <h2>《AI 少年：给未来创造者的超级助手指南》</h2>
          <p>
            把课程内容和图书体系打通：学生课后可按章节复习，家长可据此进行家庭陪伴式学习，
            让“平台学习 + 图书阅读 + 社群互动”形成完整学习闭环。
          </p>
          <div className="hero-actions">
            <button type="button">加入图书抢先试读</button>
            <button className="ghost" type="button">
              申请校园分享会
            </button>
          </div>
        </div>
        <aside className="book-highlight">
          <h3>推广与转化建议</h3>
          <ul>
            <li>每周 1 个“书中案例”短视频，引流到体验课。</li>
            <li>课程学员享图书专属福利，提升购买转化。</li>
            <li>读书会 + 挑战赛联动，沉淀长期社群用户。</li>
          </ul>
        </aside>
      </section>

      <section className="panel">
        <h2>AI 最新新闻速递</h2>
        <p className="news-note">
          自动汇总中国与国际 AI 前沿网站公开内容，帮助学生和家长快速了解行业趋势。
        </p>
        <p className="news-sources">
          来源覆盖：中国（机器之心、量子位、雷峰网、36氪）与国际（Google DeepMind、Hugging Face、Microsoft Research）。
        </p>
        <p className="news-updated">最近更新：{latestNewsUpdatedAt}</p>
        <div className="news-tools">
          <input
            className="news-search"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索关键词（如：智能体 / 大模型 / 机器人）"
            aria-label="搜索新闻关键词"
          />
          <label className="teen-toggle">
            <input type="checkbox" checked={teenOnly} onChange={(event) => setTeenOnly(event.target.checked)} />
            仅看中学生更易读
          </label>
        </div>

        <div className="news-filters" role="tablist" aria-label="新闻来源区域筛选">
          <button
            type="button"
            className={regionFilter === 'all' ? 'chip active' : 'chip'}
            onClick={() => setRegionFilter('all')}
          >
            全部
          </button>
          <button
            type="button"
            className={regionFilter === '中国' ? 'chip active' : 'chip'}
            onClick={() => setRegionFilter('中国')}
          >
            中国
          </button>
          <button
            type="button"
            className={regionFilter === '国际' ? 'chip active' : 'chip'}
            onClick={() => setRegionFilter('国际')}
          >
            国际
          </button>
        </div>

        <div className="highlights">
          <h3>每周 AI 热点（Top 3）</h3>
          <ol>
            {weeklyHighlights.map((news) => (
              <li key={`top-${news.url}`}>
                <a className="news-link" href={news.url} target="_blank" rel="noreferrer">
                  {news.title}
                </a>
                <span className="highlight-meta">
                  {' '}
                  · {news.source}
                  {news.region ? `（${news.region}）` : ''}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="news-grid">
          {displayedNews.map((news) => (
            <article className="news-card" key={news.url}>
              <p className="news-meta">
                {news.source}
                {news.region ? `（${news.region}）` : ''} · {news.date}
              </p>
              <h3>{news.title}</h3>
              <p>{news.summary}</p>
              <p className="news-teen">{toTeenFriendlySummary(news.title, news.summary)}</p>
              <div className="news-actions">
                <button
                  type="button"
                  className={favoriteUrls.includes(news.url) ? 'ghost active-favorite' : 'ghost'}
                  onClick={() => toggleFavorite(news.url)}
                >
                  {favoriteUrls.includes(news.url) ? '已收藏' : '收藏'}
                </button>

                <span className="summary-wrap" onMouseEnter={() => ensureNewsSummary(news.url)}>
                  <button type="button" className="ghost" aria-label="查看摘要">
                    摘要
                  </button>
                  <span className="summary-pop" role="tooltip">
                    {newsSummaries[news.url]?.summary
                      ? newsSummaries[news.url].summary
                      : summaryLoading[news.url]
                        ? '正在生成摘要...'
                        : '将鼠标移到此处以生成摘要'}
                  </span>
                </span>
                <a className="news-link" href={news.url} target="_blank" rel="noreferrer">
                  阅读原文
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">AI 少年学习平台 · 让每个孩子都能成为 AI 时代的创造者</footer>

      {showEnrollModal ? (
        <div className="modal-mask" role="dialog" aria-modal="true" aria-label="预约工坊体验">
          <div className="modal-card">
            <h3>预约创意实战工坊</h3>
            <form className="enroll-form" onSubmit={handleEnrollSubmit}>
              <input
                value={enrollForm.studentName}
                onChange={(event) => setEnrollForm((prev) => ({ ...prev, studentName: event.target.value }))}
                placeholder="学生姓名"
                required
              />
              <input
                value={enrollForm.grade}
                onChange={(event) => setEnrollForm((prev) => ({ ...prev, grade: event.target.value }))}
                placeholder="年级（如：六年级 / 初一）"
                required
              />
              <input
                value={enrollForm.parentContact}
                onChange={(event) => setEnrollForm((prev) => ({ ...prev, parentContact: event.target.value }))}
                placeholder="家长联系方式"
                required
              />
              <textarea
                value={enrollForm.goal}
                onChange={(event) => setEnrollForm((prev) => ({ ...prev, goal: event.target.value }))}
                placeholder="希望重点提升什么能力？"
                rows={3}
                required
              />
              <div className="modal-actions">
                <button type="submit">提交预约</button>
                <button className="ghost" type="button" onClick={() => setShowEnrollModal(false)}>
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
