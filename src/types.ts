export type BadgeTone = "green" | "amber" | "red" | "blue" | "gray";
export type InsightTone = "positive" | "warning" | "info";

export interface ReportMeta {
  brand: string;
  reportTitle: string;
  reportSubtitle: string;
  preparedBy: string;
  reportingTo: string;
  team: string;
  periodLabel: string;
  period: string;
  generatedDate: string;
  preparedFor: string;
  confidentialityLabel: string;
}

export interface KpiItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ClientSummary {
  id: string;
  name: string;
  description: string;
  color: string;
  cvs: number;
  interviews: number;
  selects: number;
  positions: string;
  poc: string;
}

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  conversionPct?: number;
  color: string;
}

export interface RecruiterPerformance {
  id: string;
  name: string;
  cvsSubmitted: number;
  interviews: number;
  finalSelects: number;
  cvToInterviewRate: number | null;
  selectRate: number | null;
  statusLabel: string;
  statusTone: BadgeTone;
}

export interface PipelineStage {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface FinalSelectionStatus {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface InsightItem {
  id: string;
  title: string;
  body: string;
  tone: InsightTone;
  icon: string;
}

export interface PositionTrackerRow {
  id: string;
  client: string;
  teamLead: string;
  openPositions: string;
  cvsSourced: number;
  interviews: string;
  selects: string;
  priorityLabel: string;
  priorityTone: BadgeTone;
  color: string;
}

export interface MonthlyReport {
  meta: ReportMeta;
  kpis: KpiItem[];
  clients: ClientSummary[];
  funnel: FunnelStage[];
  recruiters: RecruiterPerformance[];
  pipeline: PipelineStage[];
  finalSelections: FinalSelectionStatus[];
  joinedCandidateNote: string;
  joiningPendingNote: string;
  insights: InsightItem[];
  positions: PositionTrackerRow[];
}
