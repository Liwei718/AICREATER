import { useMemo, useState } from 'react';

type Scientist = {
  name: string;
  region: '中国' | '国际';
  contribution: string;
  story: string;
  avatar: string;
};

type Company = {
  name: string;
  region: '中国' | '国际';
  focus: string;
  scene: string;
  logo: string;
  website: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  tip: string;
};

const conceptCards = [
  {
    title: 'AI 是什么？',
    desc: 'AI 像一个会学习的助手：通过大量例子总结规律，帮我们识别、预测和生成内容。',
    emoji: '🧠',
  },
  {
    title: '模型是什么？',
    desc: '模型就像“思考方法包”。它学到的规律越多，解决问题就越快越准。',
    emoji: '🧩',
  },
  {
    title: '数据是什么？',
    desc: '数据就像练习题。练习题越丰富、越干净，AI 就越容易学会本领。',
    emoji: '📚',
  },
  {
    title: '提示词是什么？',
    desc: '提示词就是和 AI 说话的方式。问得越清楚，AI 回答通常越靠谱。',
    emoji: '💬',
  },
];

const scientists: Scientist[] = [
  {
    name: '李飞飞',
    region: '中国',
    contribution: '推动 ImageNet 建设，帮助计算机“看懂图片”。',
    story: '跨学科视角很重要：AI 不只在实验室，也能帮助教育和医疗。',
    avatar: 'https://profiles.stanford.edu/proxy/api/cap/profiles/15052/resources/profilephoto/350x350.jpg',
  },
  {
    name: '吴恩达',
    region: '中国',
    contribution: '推动 AI 教育普及，让更多人能系统学习 AI。',
    story: '把复杂知识讲清楚，也是很厉害的创新能力。',
    avatar: 'https://www.deeplearning.ai/wp-content/uploads/2021/03/AndrewNg-Headshot.jpg',
  },
  {
    name: '李开复',
    region: '中国',
    contribution: '长期推动 AI 创新教育与产业生态建设。',
    story: '学习科技也要关注“如何真正帮助社会”。',
    avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kai-Fu%20Lee%20in%202018.jpg',
  },
  {
    name: '姚期智',
    region: '中国',
    contribution: '图灵奖得主，推动中国计算机与人工智能人才培养。',
    story: '扎实的数学与计算机基础，是走向 AI 的长期力量。',
    avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/Andrew%20Yao%20at%20Tsinghua.jpg',
  },
  {
    name: 'John McCarthy',
    region: '国际',
    contribution: '提出“Artificial Intelligence”术语。',
    story: '一个新概念，可能改变几十年的科技方向。',
    avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/John_McCarthy_%282314859532%29.jpg',
  },
  {
    name: 'Geoffrey Hinton',
    region: '国际',
    contribution: '深度学习先驱，推动神经网络重新崛起。',
    story: '长期坚持很重要：好想法有时需要很多年才会被看见。',
    avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/SD_2025_-_Geoffrey_Hinton_01.jpg',
  },
  {
    name: 'Yann LeCun',
    region: '国际',
    contribution: '卷积神经网络代表人物，推动计算机视觉发展。',
    story: '把一个方向做深做透，就能改变整个行业。',
    avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yann_LeCun_at_the_University_of_Minnesota.jpg',
  },
  {
    name: 'Demis Hassabis',
    region: '国际',
    contribution: '推动 AI 在科学研究中的突破（如 AlphaFold）。',
    story: 'AI 不只会聊天，也能帮助科学家探索生命奥秘。',
    avatar:
      'https://commons.wikimedia.org/wiki/Special:FilePath/PhotonQ-Demis_Hassabis_on_Artificial_Playful_Intelligence_%2815366514658%29_%282%29.jpg',
  },
  {
    name: 'Andrew Barto',
    region: '国际',
    contribution: '强化学习奠基者之一，推动“试错学习”理论发展。',
    story: '不断尝试和迭代，本身就是学习力。',
    avatar: 'https://commons.wikimedia.org/wiki/Special:FilePath/Andrew_Barto.jpg',
  },
];

const companies: Company[] = [
  {
    name: '百度',
    region: '中国',
    focus: '大模型与智能应用',
    scene: '让搜索、学习和办公更高效。',
    logo: 'https://logo.clearbit.com/baidu.com',
    website: 'https://www.baidu.com',
  },
  {
    name: '阿里云',
    region: '中国',
    focus: '云计算 + AI 服务',
    scene: '为学校和企业提供 AI 工具底座。',
    logo: 'https://logo.clearbit.com/aliyun.com',
    website: 'https://www.aliyun.com',
  },
  {
    name: '科大讯飞',
    region: '中国',
    focus: '语音识别与教育 AI',
    scene: '在课堂、语言学习等场景帮助师生。',
    logo: 'https://logo.clearbit.com/iflytek.com',
    website: 'https://www.iflytek.com',
  },
  {
    name: '商汤科技',
    region: '中国',
    focus: '计算机视觉与多模态 AI',
    scene: '服务智慧城市、智能终端与教育场景。',
    logo: 'https://logo.clearbit.com/sensetime.com',
    website: 'https://www.sensetime.com',
  },
  {
    name: 'Google DeepMind',
    region: '国际',
    focus: '通用 AI 与科学 AI',
    scene: '在科研和复杂问题求解上持续创新。',
    logo: 'https://logo.clearbit.com/deepmind.google',
    website: 'https://deepmind.google',
  },
  {
    name: 'OpenAI',
    region: '国际',
    focus: '生成式 AI',
    scene: '帮助写作、编程、学习与创作。',
    logo: 'https://logo.clearbit.com/openai.com',
    website: 'https://openai.com',
  },
  {
    name: 'NVIDIA',
    region: '国际',
    focus: 'AI 计算平台',
    scene: '提供训练大模型所需的“算力引擎”。',
    logo: 'https://logo.clearbit.com/nvidia.com',
    website: 'https://www.nvidia.com',
  },
  {
    name: 'Microsoft',
    region: '国际',
    focus: 'AI 平台与生产力应用',
    scene: '将 AI 融入办公、开发与学习工具。',
    logo: 'https://logo.clearbit.com/microsoft.com',
    website: 'https://www.microsoft.com',
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: '下面哪一句更像“好的提示词”？',
    options: ['帮我写点东西', '请用三句话解释什么是 AI，并举一个校园例子'],
    answer: '请用三句话解释什么是 AI，并举一个校园例子',
    tip: '提示词越具体，AI 回答通常越有用。',
  },
  {
    id: 'q2',
    question: 'AI 给出的结果最正确的做法是？',
    options: ['直接相信并转发', '交叉核对后再使用'],
    answer: '交叉核对后再使用',
    tip: 'AI 是助手，不是最终裁判。',
  },
  {
    id: 'q3',
    question: '“数据”在 AI 学习里更像什么？',
    options: ['练习题', '奖杯'],
    answer: '练习题',
    tip: '高质量数据是 AI 学习的基础。',
  },
];

export default function AiBasicsLearningPage() {
  const [scientistRegion, setScientistRegion] = useState<'全部' | '中国' | '国际'>('全部');
  const [companyRegion, setCompanyRegion] = useState<'全部' | '中国' | '国际'>('全部');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const visibleScientists = useMemo(
    () =>
      scientistRegion === '全部' ? scientists : scientists.filter((item) => item.region === scientistRegion),
    [scientistRegion],
  );

  const visibleCompanies = useMemo(
    () => (companyRegion === '全部' ? companies : companies.filter((item) => item.region === companyRegion)),
    [companyRegion],
  );

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, item) => {
    return sum + (answers[item.id] === item.answer ? 1 : 0);
  }, 0);

  const badge = score === quizQuestions.length ? '🏅 AI 探索小达人' : score >= 2 ? '🎖️ AI 进阶学员' : '⭐ AI 新手启航';

  return (
    <main className="site ai-kids-page">
      <section className="panel hero ai-kids-hero">
        <p className="eyebrow">AI 基础认知 · 独立学习页</p>
        <h1>欢迎来到 AI 探索站</h1>
        <p className="subtitle">从“AI 是什么”出发，认识中外科学家、创新企业，再完成闯关挑战，拿下你的学习徽章。</p>
        <div className="hero-actions">
          <button type="button" onClick={() => (window.location.href = '/')}>
            返回首页
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>第一站：认识 AI 基本概念</h2>
        <div className="ai-kids-grid">
          {conceptCards.map((card) => (
            <article className="card ai-kids-card" key={card.title}>
              <p className="ai-kids-emoji">{card.emoji}</p>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="ai-kids-head">
          <h2>第二站：国内外 AI 科学家</h2>
          <div className="ai-kids-filters">
            {(['全部', '中国', '国际'] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={scientistRegion === item ? 'chip active' : 'chip'}
                onClick={() => setScientistRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="scientists-grid">
          {visibleScientists.map((person) => (
            <article className="scientist-card" key={person.name}>
              <img
                className="scientist-avatar"
                src={person.avatar}
                alt={`${person.name} 头像`}
                loading="lazy"
                onError={(event) => {
                  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=DFE9FF&color=2A468A&size=200`;
                  if (event.currentTarget.src !== fallback) {
                    event.currentTarget.src = fallback;
                  }
                }}
              />
              <h4>{person.name}</h4>
              <p className="person-area">{person.region}</p>
              <p>{person.contribution}</p>
              <p>
                <strong>给同学的启发：</strong>
                {person.story}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="ai-kids-head">
          <h2>第三站：国内外 AI 创新企业</h2>
          <div className="ai-kids-filters">
            {(['全部', '中国', '国际'] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={companyRegion === item ? 'chip active' : 'chip'}
                onClick={() => setCompanyRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="ai-kids-grid">
          {visibleCompanies.map((company) => (
            <article className="card ai-company-card" key={company.name}>
              <p className="week-tag">{company.region}</p>
              <h3>
                <img
                  className="company-logo"
                  src={company.logo}
                  alt={`${company.name} logo`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                {company.name}
              </h3>
              <p>
                <strong>创新方向：</strong>
                {company.focus}
              </p>
              <p>
                <strong>真实应用：</strong>
                {company.scene}
              </p>
              <a className="news-link" href={company.website} target="_blank" rel="noreferrer">
                访问官网
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>第四站：AI 安全小守则</h2>
        <ul className="path-list">
          <li>不上传个人隐私信息（身份证号、家庭住址、账号密码）。</li>
          <li>不盲信 AI，重要内容要核对来源。</li>
          <li>发现不当内容，及时和老师/家长沟通。</li>
        </ul>
      </section>

      <section className="panel">
        <h2>闯关挑战：3 题拿徽章</h2>
        <div className="ai-kids-quiz">
          {quizQuestions.map((item, index) => (
            <article key={item.id} className="card quiz-card">
              <p className="week-tag">第 {index + 1} 题</p>
              <h3>{item.question}</h3>
              <div className="quiz-options">
                {item.options.map((option) => {
                  const selected = answers[item.id] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={selected ? 'chip active' : 'chip'}
                      onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option }))}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {answers[item.id] ? <p className="quiz-tip">提示：{item.tip}</p> : null}
            </article>
          ))}
        </div>
        <div className="ai-kids-result">
          <p>
            当前进度：{answeredCount}/{quizQuestions.length} 题 · 正确 {score} 题
          </p>
          <strong>{badge}</strong>
        </div>
      </section>
    </main>
  );
}
