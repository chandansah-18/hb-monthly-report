import type { KpiItem } from "../types";

export function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <section>
      <div className="section-label">Key Performance Indicators</div>
      <div className="kpi-strip">
        {items.map((item, index) => (
          <article className="kpi-cell" key={item.id} data-accented={index === 0}>
            <span className="kpi-value">{item.value}</span>
            <span className="kpi-label">{item.label}</span>
            <span className="kpi-subtext">{item.subtext}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
