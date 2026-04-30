import type { MonthlyReport } from "../types";
import { ClientDistributionChart } from "../components/ClientDistributionChart";
import { ClientSummaryCards } from "../components/ClientSummaryCards";
import { FunnelPipelineChart } from "../components/FunnelPipelineChart";
import { HorizontalBarChartCard } from "../components/HorizontalBarChartCard";
import { InsightsGrid } from "../components/InsightsGrid";
import { KpiStrip } from "../components/KpiStrip";
import { PositionTrackerTable } from "../components/PositionTrackerTable";
import { RecruiterPerformanceTable } from "../components/RecruiterPerformanceTable";
import { ReportFooter } from "../components/ReportFooter";

export function DashboardScreen({
  report,
  embedded = false,
}: {
  report: MonthlyReport;
  embedded?: boolean;
}) {
  const recruiterCvData = report.recruiters.map((recruiter) => ({
    id: recruiter.id,
    label: recruiter.name,
    value: recruiter.cvsSubmitted,
    color:
      recruiter.cvsSubmitted >= 70
        ? "#2952a3"
        : recruiter.cvsSubmitted >= 40
          ? "#1e7b56"
          : "#c5922b",
  }));

  const recruiterInterviewData = report.recruiters
    .filter((recruiter) => recruiter.interviews > 0)
    .sort((left, right) => right.interviews - left.interviews)
    .map((recruiter) => ({
      id: recruiter.id,
      label: recruiter.name,
      value: recruiter.interviews,
      color:
        recruiter.interviews >= 30
          ? "#2952a3"
          : recruiter.interviews >= 20
            ? "#1e7b56"
            : "#c5922b",
    }));

  return (
    <div className={`report-page${embedded ? " embedded" : ""}`}>
      <header className="report-masthead">
        <div>
          <div className="brand">{report.meta.brand}</div>
          <h2 className="report-title">
            {report.meta.reportTitle}
            <br />
            <em>{report.meta.reportSubtitle}</em>
          </h2>
          <div className="report-meta">
            Prepared by: <strong>{report.meta.preparedBy}</strong> · Reporting to:{" "}
            <strong>{report.meta.reportingTo}</strong> · Team: <strong>{report.meta.team}</strong>
          </div>
        </div>
        <div className="period-badge">
          <span>{report.meta.periodLabel}</span>
          {report.meta.period}
        </div>
      </header>

      <KpiStrip items={report.kpis} />

      <section className="two-column-grid">
        <ClientDistributionChart clients={report.clients} />
        <FunnelPipelineChart stages={report.funnel} />
      </section>

      <RecruiterPerformanceTable recruiters={report.recruiters} />

      <section className="two-column-grid stack-section">
        <HorizontalBarChartCard title="CVs Submitted — Recruiter Breakdown" data={recruiterCvData} />
        <HorizontalBarChartCard
          title="Interviews Conducted — Recruiter Breakdown"
          data={recruiterInterviewData}
        />
      </section>

      <ClientSummaryCards clients={report.clients} />

      <section className="two-column-grid stack-section">
        <HorizontalBarChartCard title="Stage-Wise Interview Outcomes" data={report.pipeline} />
        <div className="card">
          <div className="card-title">Final Selections — Current Status</div>
          <div className="chart-card">
            <HorizontalBarChartCard
              title="Selection Status"
              data={report.finalSelections}
              framed={false}
            />
          </div>
          <div className="note-card">
            <p>{report.joinedCandidateNote}</p>
            <p>{report.joiningPendingNote}</p>
          </div>
        </div>
      </section>

      <InsightsGrid insights={report.insights} />
      <PositionTrackerTable positions={report.positions} />
      <ReportFooter meta={report.meta} />
    </div>
  );
}
