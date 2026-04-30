import type { ReportMeta } from "../types";

export function ReportFooter({ meta }: { meta: ReportMeta }) {
  return (
    <footer className="report-footer">
      <div className="footer-left">
        HUNTSMEN &amp; BARONS · RECRUITMENT OPERATIONS · Period: {meta.period} · Generated:{" "}
        {meta.generatedDate}
      </div>
      <div className="footer-right">
        <span className="confidential">{meta.confidentialityLabel}</span>
        <span>Prepared for: {meta.preparedFor}</span>
      </div>
    </footer>
  );
}
