export default function CreatorChallengePage() {
  return (
    <main className="site">
      <section className="panel hero">
        <p className="eyebrow">模块页面</p>
        <h1>未来创造者挑战</h1>
        <p className="subtitle">挑战模块已从首页拆分为独立页面展示，后续将在此持续完善完整赛制与活动内容。</p>
        <div className="hero-actions">
          <button type="button" onClick={() => (window.location.href = '/')}>
            返回首页
          </button>
        </div>
      </section>
    </main>
  );
}
