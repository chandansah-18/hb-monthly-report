import type { PositionTrackerRow } from "../types";
import { Badge } from "./Badge";

export function PositionTrackerTable({ positions }: { positions: PositionTrackerRow[] }) {
  return (
    <section className="stack-section">
      <div className="section-label">Active Position Tracker</div>
      <div className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Team Lead</th>
              <th>Open Positions</th>
              <th>CVs Sourced</th>
              <th>Interviews</th>
              <th>Selects</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong style={{ color: row.color }}>{row.client}</strong>
                </td>
                <td>{row.teamLead}</td>
                <td>{row.openPositions}</td>
                <td>{row.cvsSourced}</td>
                <td>{row.interviews}</td>
                <td>{row.selects}</td>
                <td>
                  <Badge label={row.priorityLabel} tone={row.priorityTone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
