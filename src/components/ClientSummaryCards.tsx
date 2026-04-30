import type { ClientSummary } from "../types";
import { formatInteger } from "../utils/formatters";

export function ClientSummaryCards({ clients }: { clients: ClientSummary[] }) {
  return (
    <section className="stack-section">
      <div className="section-label">Client-Wise Performance Summary</div>
      <div className="client-card-grid">
        {clients
          .filter((client) => client.id !== "others")
          .map((client) => (
            <article className="card client-summary-card" key={client.id}>
              <div className="client-summary-header">
                <div
                  className="client-summary-accent"
                  style={{ backgroundColor: client.color }}
                />
                <div>
                  <div className="client-summary-name" style={{ color: client.color }}>
                    {client.name}
                  </div>
                  <div className="client-summary-description">{client.description}</div>
                </div>
              </div>
              <div className="client-metric-grid">
                <div>
                  <span className="metric-label">CVs</span>
                  <strong>{formatInteger(client.cvs)}</strong>
                </div>
                <div>
                  <span className="metric-label">Interviews</span>
                  <strong>{formatInteger(client.interviews)}</strong>
                </div>
                <div>
                  <span className="metric-label">Selects</span>
                  <strong>{formatInteger(client.selects)}</strong>
                </div>
              </div>
              <p className="client-meta-line">
                <strong>Positions:</strong> {client.positions}
              </p>
              <p className="client-meta-line">
                <strong>H&amp;B POC:</strong> {client.poc}
              </p>
            </article>
          ))}
      </div>
    </section>
  );
}
