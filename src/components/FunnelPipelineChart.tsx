import {
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { FunnelStage } from "../types";

export function FunnelPipelineChart({ stages }: { stages: FunnelStage[] }) {
  return (
    <div className="card">
      <div className="card-title">Recruitment Conversion Funnel</div>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={320}>
          <RechartsFunnelChart>
            <Tooltip />
            <Funnel data={stages} dataKey="value" isAnimationActive>
              <LabelList position="right" fill="#3d4152" stroke="none" dataKey="label" />
              <LabelList position="center" fill="#ffffff" stroke="none" dataKey="value" />
            </Funnel>
          </RechartsFunnelChart>
        </ResponsiveContainer>
      </div>
      <div className="funnel-summary">
        {stages.slice(1).map((stage) => (
          <div key={stage.id} className="funnel-summary-row">
            <span>{stage.label}</span>
            <strong>{stage.conversionPct?.toFixed(1)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
