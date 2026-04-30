import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { DashboardScreen } from "./DashboardScreen";
import { useReport } from "../report/ReportContext";
import type {
  BadgeTone,
  ClientSummary,
  FinalSelectionStatus,
  FunnelStage,
  InsightItem,
  KpiItem,
  PipelineStage,
  PositionTrackerRow,
  RecruiterPerformance,
} from "../types";

function updateArrayItem<T extends { id: string }>(
  items: T[],
  id: string,
  updater: (item: T) => T,
) {
  return items.map((item) => (item.id === id ? updater(item) : item));
}

function toneOptions() {
  return ["green", "amber", "red", "blue", "gray"] as BadgeTone[];
}

export function AdminScreen() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const {
    adminReport,
    publishedReport,
    isUsingDraft,
    updateAdminReport,
    resetAdminReport,
    importAdminReport,
    exportAdminReport,
  } = useReport();

  const downloadJson = () => {
    const json = exportAdminReport();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `hb-report-${adminReport.meta.period.toLowerCase().replace(/\s+/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      importAdminReport(text);
      setImportError(null);
    } catch {
      setImportError("Could not import that JSON file. Please verify the report format.");
    } finally {
      event.target.value = "";
    }
  };

  const updateMeta = (field: keyof typeof adminReport.meta, value: string) => {
    updateAdminReport((current) => ({
      ...current,
      meta: {
        ...current.meta,
        [field]: value,
      },
    }));
  };

  const updateKpi = (id: string, field: keyof KpiItem, value: string) => {
    updateAdminReport((current) => ({
      ...current,
      kpis: updateArrayItem(current.kpis, id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  const updateClient = (id: string, field: keyof ClientSummary, value: string | number) => {
    updateAdminReport((current) => ({
      ...current,
      clients: updateArrayItem(current.clients, id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  const updateRecruiter = (
    id: string,
    field: keyof RecruiterPerformance,
    value: string | number | null,
  ) => {
    updateAdminReport((current) => ({
      ...current,
      recruiters: updateArrayItem(current.recruiters, id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  const updateFunnel = (
    id: string,
    field: keyof FunnelStage,
    value: string | number | undefined,
  ) => {
    updateAdminReport((current) => ({
      ...current,
      funnel: updateArrayItem(current.funnel, id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  const updatePipeline = (
    collection: "pipeline" | "finalSelections",
    id: string,
    field: keyof PipelineStage | keyof FinalSelectionStatus,
    value: string | number,
  ) => {
    updateAdminReport((current) => ({
      ...current,
      [collection]: updateArrayItem(current[collection], id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  const updateInsight = (id: string, field: keyof InsightItem, value: string) => {
    updateAdminReport((current) => ({
      ...current,
      insights: updateArrayItem(current.insights, id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  const updatePosition = (
    id: string,
    field: keyof PositionTrackerRow,
    value: string | number,
  ) => {
    updateAdminReport((current) => ({
      ...current,
      positions: updateArrayItem(current.positions, id, (item) => ({
        ...item,
        [field]: value,
      })),
    }));
  };

  return (
    <div className="admin-layout">
      <section className="admin-panel">
        <div className="admin-hero">
          <div>
            <div className="section-label">Admin Workspace</div>
            <h2 className="admin-title">Edit the report draft and publish manually</h2>
            <p className="admin-copy">
              Your edits stay in this browser as a local draft. Export the updated JSON, replace the
              canonical report file, and redeploy when you want everyone to see changes.
            </p>
          </div>
          <div className="toolbar">
            <button className="toolbar-button" type="button" onClick={downloadJson}>
              Export JSON
            </button>
            <button className="toolbar-button" type="button" onClick={handleImportClick}>
              Import JSON
            </button>
            <button
              className="toolbar-button toolbar-button-muted"
              type="button"
              onClick={resetAdminReport}
            >
              Reset to Published
            </button>
            <Link className="toolbar-link" to="/dashboard">
              Open Full Dashboard
            </Link>
            <input
              ref={fileInputRef}
              className="hidden-input"
              type="file"
              accept="application/json"
              onChange={handleImportFile}
            />
          </div>
        </div>
        {importError ? <p className="error-text">{importError}</p> : null}
        <div className="publish-note">
          <strong>{isUsingDraft ? "Local draft active." : "No local draft active."}</strong>
          <span>
            Published baseline: {publishedReport.meta.period}. Public viewers only see the bundled
            report until you export, replace <code>src/data/publishedReport.json</code>, and redeploy.
          </span>
        </div>

        <div className="editor-section">
          <h3>Report metadata</h3>
          <div className="form-grid">
            <label>
              Brand
              <input
                value={adminReport.meta.brand}
                onChange={(event) => updateMeta("brand", event.target.value)}
              />
            </label>
            <label>
              Reporting period
              <input
                value={adminReport.meta.period}
                onChange={(event) => updateMeta("period", event.target.value)}
              />
            </label>
            <label>
              Prepared by
              <input
                value={adminReport.meta.preparedBy}
                onChange={(event) => updateMeta("preparedBy", event.target.value)}
              />
            </label>
            <label>
              Reporting to
              <input
                value={adminReport.meta.reportingTo}
                onChange={(event) => updateMeta("reportingTo", event.target.value)}
              />
            </label>
            <label className="span-2">
              Team
              <input
                value={adminReport.meta.team}
                onChange={(event) => updateMeta("team", event.target.value)}
              />
            </label>
            <label>
              Generated date
              <input
                value={adminReport.meta.generatedDate}
                onChange={(event) => updateMeta("generatedDate", event.target.value)}
              />
            </label>
            <label>
              Prepared for
              <input
                value={adminReport.meta.preparedFor}
                onChange={(event) => updateMeta("preparedFor", event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="editor-section">
          <h3>KPIs</h3>
          {adminReport.kpis.map((item) => (
            <div className="editor-card" key={item.id}>
              <div className="form-grid">
                <label>
                  Label
                  <input value={item.label} onChange={(event) => updateKpi(item.id, "label", event.target.value)} />
                </label>
                <label>
                  Value
                  <input value={item.value} onChange={(event) => updateKpi(item.id, "value", event.target.value)} />
                </label>
                <label className="span-2">
                  Subtext
                  <input
                    value={item.subtext}
                    onChange={(event) => updateKpi(item.id, "subtext", event.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="editor-section">
          <h3>Clients</h3>
          {adminReport.clients.map((client) => (
            <div className="editor-card" key={client.id}>
              <div className="section-subtitle">{client.name}</div>
              <div className="form-grid">
                <label>
                  Name
                  <input value={client.name} onChange={(event) => updateClient(client.id, "name", event.target.value)} />
                </label>
                <label>
                  Descriptor
                  <input
                    value={client.description}
                    onChange={(event) => updateClient(client.id, "description", event.target.value)}
                  />
                </label>
                <label>
                  CVs
                  <input
                    type="number"
                    value={client.cvs}
                    onChange={(event) => updateClient(client.id, "cvs", Number(event.target.value))}
                  />
                </label>
                <label>
                  Interviews
                  <input
                    type="number"
                    value={client.interviews}
                    onChange={(event) => updateClient(client.id, "interviews", Number(event.target.value))}
                  />
                </label>
                <label>
                  Selects
                  <input
                    type="number"
                    value={client.selects}
                    onChange={(event) => updateClient(client.id, "selects", Number(event.target.value))}
                  />
                </label>
                <label>
                  Accent color
                  <input
                    value={client.color}
                    onChange={(event) => updateClient(client.id, "color", event.target.value)}
                  />
                </label>
                <label className="span-2">
                  Positions
                  <textarea
                    value={client.positions}
                    onChange={(event) => updateClient(client.id, "positions", event.target.value)}
                  />
                </label>
                <label className="span-2">
                  POC
                  <input value={client.poc} onChange={(event) => updateClient(client.id, "poc", event.target.value)} />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="editor-section">
          <h3>Recruiters</h3>
          {adminReport.recruiters.map((recruiter) => (
            <div className="editor-card" key={recruiter.id}>
              <div className="section-subtitle">{recruiter.name}</div>
              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={recruiter.name}
                    onChange={(event) => updateRecruiter(recruiter.id, "name", event.target.value)}
                  />
                </label>
                <label>
                  Status label
                  <input
                    value={recruiter.statusLabel}
                    onChange={(event) => updateRecruiter(recruiter.id, "statusLabel", event.target.value)}
                  />
                </label>
                <label>
                  CVs
                  <input
                    type="number"
                    value={recruiter.cvsSubmitted}
                    onChange={(event) =>
                      updateRecruiter(recruiter.id, "cvsSubmitted", Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Interviews
                  <input
                    type="number"
                    value={recruiter.interviews}
                    onChange={(event) =>
                      updateRecruiter(recruiter.id, "interviews", Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Final selects
                  <input
                    type="number"
                    value={recruiter.finalSelects}
                    onChange={(event) =>
                      updateRecruiter(recruiter.id, "finalSelects", Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Status tone
                  <select
                    value={recruiter.statusTone}
                    onChange={(event) =>
                      updateRecruiter(recruiter.id, "statusTone", event.target.value as BadgeTone)
                    }
                  >
                    {toneOptions().map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  CV → Interview %
                  <input
                    type="number"
                    step="0.1"
                    value={recruiter.cvToInterviewRate ?? ""}
                    onChange={(event) =>
                      updateRecruiter(
                        recruiter.id,
                        "cvToInterviewRate",
                        event.target.value === "" ? null : Number(event.target.value),
                      )
                    }
                  />
                </label>
                <label>
                  Select rate %
                  <input
                    type="number"
                    step="0.1"
                    value={recruiter.selectRate ?? ""}
                    onChange={(event) =>
                      updateRecruiter(
                        recruiter.id,
                        "selectRate",
                        event.target.value === "" ? null : Number(event.target.value),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="editor-section">
          <h3>Funnel and pipeline</h3>
          {adminReport.funnel.map((stage) => (
            <div className="editor-card" key={stage.id}>
              <div className="form-grid">
                <label>
                  Stage
                  <input value={stage.label} onChange={(event) => updateFunnel(stage.id, "label", event.target.value)} />
                </label>
                <label>
                  Value
                  <input
                    type="number"
                    value={stage.value}
                    onChange={(event) => updateFunnel(stage.id, "value", Number(event.target.value))}
                  />
                </label>
                <label>
                  Conversion %
                  <input
                    type="number"
                    step="0.1"
                    value={stage.conversionPct ?? ""}
                    onChange={(event) =>
                      updateFunnel(
                        stage.id,
                        "conversionPct",
                        event.target.value === "" ? undefined : Number(event.target.value),
                      )
                    }
                  />
                </label>
                <label>
                  Color
                  <input value={stage.color} onChange={(event) => updateFunnel(stage.id, "color", event.target.value)} />
                </label>
              </div>
            </div>
          ))}

          <div className="split-editors">
            <div>
              <div className="section-subtitle">Interview outcomes</div>
              {adminReport.pipeline.map((stage) => (
                <div className="inline-edit-row" key={stage.id}>
                  <input
                    value={stage.label}
                    onChange={(event) =>
                      updatePipeline("pipeline", stage.id, "label", event.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={stage.value}
                    onChange={(event) =>
                      updatePipeline("pipeline", stage.id, "value", Number(event.target.value))
                    }
                  />
                  <input
                    value={stage.color}
                    onChange={(event) =>
                      updatePipeline("pipeline", stage.id, "color", event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="section-subtitle">Final selection statuses</div>
              {adminReport.finalSelections.map((stage) => (
                <div className="inline-edit-row" key={stage.id}>
                  <input
                    value={stage.label}
                    onChange={(event) =>
                      updatePipeline("finalSelections", stage.id, "label", event.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={stage.value}
                    onChange={(event) =>
                      updatePipeline("finalSelections", stage.id, "value", Number(event.target.value))
                    }
                  />
                  <input
                    value={stage.color}
                    onChange={(event) =>
                      updatePipeline("finalSelections", stage.id, "color", event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <label className="span-2">
              Confirmed joined note
              <textarea
                value={adminReport.joinedCandidateNote}
                onChange={(event) =>
                  updateAdminReport((current) => ({
                    ...current,
                    joinedCandidateNote: event.target.value,
                  }))
                }
              />
            </label>
            <label className="span-2">
              Joining pending note
              <textarea
                value={adminReport.joiningPendingNote}
                onChange={(event) =>
                  updateAdminReport((current) => ({
                    ...current,
                    joiningPendingNote: event.target.value,
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="editor-section">
          <h3>Insights</h3>
          {adminReport.insights.map((insight) => (
            <div className="editor-card" key={insight.id}>
              <div className="form-grid">
                <label>
                  Icon
                  <input value={insight.icon} onChange={(event) => updateInsight(insight.id, "icon", event.target.value)} />
                </label>
                <label>
                  Tone
                  <select
                    value={insight.tone}
                    onChange={(event) => updateInsight(insight.id, "tone", event.target.value)}
                  >
                    <option value="positive">positive</option>
                    <option value="warning">warning</option>
                    <option value="info">info</option>
                  </select>
                </label>
                <label className="span-2">
                  Title
                  <input value={insight.title} onChange={(event) => updateInsight(insight.id, "title", event.target.value)} />
                </label>
                <label className="span-2">
                  Body
                  <textarea value={insight.body} onChange={(event) => updateInsight(insight.id, "body", event.target.value)} />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="editor-section">
          <h3>Position tracker</h3>
          {adminReport.positions.map((row) => (
            <div className="editor-card" key={row.id}>
              <div className="form-grid">
                <label>
                  Client
                  <input value={row.client} onChange={(event) => updatePosition(row.id, "client", event.target.value)} />
                </label>
                <label>
                  Team lead
                  <input
                    value={row.teamLead}
                    onChange={(event) => updatePosition(row.id, "teamLead", event.target.value)}
                  />
                </label>
                <label>
                  Open positions
                  <input
                    value={row.openPositions}
                    onChange={(event) => updatePosition(row.id, "openPositions", event.target.value)}
                  />
                </label>
                <label>
                  CVs sourced
                  <input
                    type="number"
                    value={row.cvsSourced}
                    onChange={(event) => updatePosition(row.id, "cvsSourced", Number(event.target.value))}
                  />
                </label>
                <label>
                  Interviews
                  <input
                    value={row.interviews}
                    onChange={(event) => updatePosition(row.id, "interviews", event.target.value)}
                  />
                </label>
                <label>
                  Selects
                  <input value={row.selects} onChange={(event) => updatePosition(row.id, "selects", event.target.value)} />
                </label>
                <label>
                  Priority label
                  <input
                    value={row.priorityLabel}
                    onChange={(event) => updatePosition(row.id, "priorityLabel", event.target.value)}
                  />
                </label>
                <label>
                  Priority tone
                  <select
                    value={row.priorityTone}
                    onChange={(event) =>
                      updatePosition(row.id, "priorityTone", event.target.value as BadgeTone)
                    }
                  >
                    {toneOptions().map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="span-2">
                  Color
                  <input value={row.color} onChange={(event) => updatePosition(row.id, "color", event.target.value)} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="preview-panel">
        <div className="preview-header">
          <div>
            <div className="section-label">Live Preview</div>
            <p className="preview-copy">
              This preview reflects your private local draft, not the public dashboard.
            </p>
          </div>
        </div>
        <div className="preview-surface">
          <DashboardScreen report={adminReport} embedded />
        </div>
      </aside>
    </div>
  );
}
