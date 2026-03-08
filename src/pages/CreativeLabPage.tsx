export default function CreativeLabPage() {
  return (
    <main className="site">
      <section className="panel hero">
        <p className="eyebrow">模块页面</p>
        <h1>创意实战工坊</h1>
        <p className="subtitle">已从首页拆分为独立页面展示，后续可继续在这里扩展完整工坊内容。</p>
        <div className="hero-actions">
          <button type="button" onClick={() => (window.location.href = '/')}>
            返回首页
          </button>
        </div>
      </section>
    </main>
  );
}
