import type { InsightItem } from "../types";

export function InsightsGrid({ insights }: { insights: InsightItem[] }) {
  return (
    <section className="stack-section">
      <div className="section-label">Management Insights &amp; Recommendations</div>
      <div className="insights-grid">
        {insights.map((insight) => (
          <article className={`insight-card ${insight.tone}`} key={insight.id}>
            <div className="insight-icon">{insight.icon}</div>
            <h3 className="insight-heading">{insight.title}</h3>
            <p className="insight-body">{insight.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
