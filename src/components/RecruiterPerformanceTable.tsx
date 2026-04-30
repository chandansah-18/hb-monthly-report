import type { RecruiterPerformance } from "../types";
import { formatInteger, formatPercent } from "../utils/formatters";
import { Badge } from "./Badge";

export function RecruiterPerformanceTable({
  recruiters,
}: {
  recruiters: RecruiterPerformance[];
}) {
  return (
    <section className="stack-section">
      <div className="section-label">Recruiter Performance</div>
      <div className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Recruiter</th>
              <th>CVs Submitted</th>
              <th>Interviews</th>
              <th>Final Selects</th>
              <th>CV → Interview</th>
              <th>Select Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((recruiter, index) => (
              <tr key={recruiter.id}>
                <td>{index + 1}</td>
                <td>
                  <strong>{recruiter.name}</strong>
                </td>
                <td>{formatInteger(recruiter.cvsSubmitted)}</td>
                <td>{formatInteger(recruiter.interviews)}</td>
                <td>{formatInteger(recruiter.finalSelects)}</td>
                <td>{formatPercent(recruiter.cvToInterviewRate)}</td>
                <td>{formatPercent(recruiter.selectRate)}</td>
                <td>
                  <Badge label={recruiter.statusLabel} tone={recruiter.statusTone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
