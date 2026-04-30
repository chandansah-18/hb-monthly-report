import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { publishedReport } from "./publishedReport";
import type { MonthlyReport } from "../types";

const DRAFT_STORAGE_KEY = "hb-monthly-report-admin-draft";

interface ReportContextValue {
  publishedReport: MonthlyReport;
  adminReport: MonthlyReport;
  isUsingDraft: boolean;
  setAdminReport: (report: MonthlyReport) => void;
  updateAdminReport: (updater: (current: MonthlyReport) => MonthlyReport) => void;
  resetAdminReport: () => void;
  importAdminReport: (jsonText: string) => void;
  exportAdminReport: () => string;
}

const ReportContext = createContext<ReportContextValue | null>(null);

function readStoredDraft(): MonthlyReport | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as MonthlyReport;
  } catch {
    return null;
  }
}

export function ReportProvider({ children }: { children: ReactNode }) {
  const storedDraft = readStoredDraft();
  const [adminReport, setAdminReportState] = useState<MonthlyReport>(storedDraft ?? publishedReport);
  const [isUsingDraft, setIsUsingDraft] = useState<boolean>(storedDraft !== null);

  const setAdminReport = useCallback((nextReport: MonthlyReport) => {
    setIsUsingDraft(true);
    setAdminReportState(nextReport);
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextReport));
  }, []);

  const updateAdminReport = useCallback((updater: (current: MonthlyReport) => MonthlyReport) => {
    setAdminReportState((current) => {
      const nextReport = updater(current);
      setIsUsingDraft(true);
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextReport));
      return nextReport;
    });
  }, []);

  const resetAdminReport = useCallback(() => {
    setIsUsingDraft(false);
    setAdminReportState(publishedReport);
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  const importAdminReport = useCallback((jsonText: string) => {
    const parsed = JSON.parse(jsonText) as MonthlyReport;
    setIsUsingDraft(true);
    setAdminReportState(parsed);
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(parsed));
  }, []);

  const exportAdminReport = useCallback(
    () => JSON.stringify(adminReport, null, 2),
    [adminReport],
  );

  const value = useMemo(
    () => ({
      publishedReport,
      adminReport,
      isUsingDraft,
      setAdminReport,
      updateAdminReport,
      resetAdminReport,
      importAdminReport,
      exportAdminReport,
    }),
    [
      adminReport,
      exportAdminReport,
      importAdminReport,
      isUsingDraft,
      resetAdminReport,
      setAdminReport,
      updateAdminReport,
    ],
  );

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReport() {
  const context = useContext(ReportContext);

  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }

  return context;
}
