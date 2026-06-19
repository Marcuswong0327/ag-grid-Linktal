import { useEffect, useMemo, useRef, useState } from "react";
import { HotTable, HotColumn } from "@handsontable/react-wrapper";
import type { HotTableRef } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import type { CellChange, ChangeSource } from "handsontable/common";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import {
  COMPANIES,
  JOBS,
  STAGES,
  makeCandidates,
  companyForJob,
  type Job,
  type Candidate,
} from "./data";
import { CandidateDrawer } from "./CandidateDrawer";

registerAllModules();

const LICENSE_KEY =
  (import.meta.env.VITE_HANDSONTABLE_LICENSE_KEY as string | undefined) ||
  "non-commercial-and-evaluation";

const JOBS_HEIGHT = 210;
const CANDIDATES_HEIGHT = 420;

interface JobRow extends Job {
  candidateCount: number;
}

interface CandidateRow extends Candidate {
  company: string;
}

const companyNames = COMPANIES.map((c) => c.name);
const jobTitles = JOBS.map((j) => j.title);

export default function App() {
  const jobsRef = useRef<HotTableRef>(null);
  const candsRef = useRef<HotTableRef>(null);

  const [jobs, setJobs] = useState<JobRow[]>(() =>
    JOBS.map((j) => ({ ...j, candidateCount: 0 }))
  );
  const [candidates, setCandidates] = useState<CandidateRow[]>(() =>
    makeCandidates().map((c) => ({ ...c, company: companyForJob(c.job) }))
  );
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setJobs((prev) =>
      prev.map((j) => ({
        ...j,
        candidateCount: candidates.filter((c) => c.job === j.title).length,
      }))
    );
  }, [candidates]);

  const visibleCandidates = useMemo(
    () =>
      selectedJob
        ? candidates.filter((c) => c.job === selectedJob)
        : candidates,
    [candidates, selectedJob]
  );

  const selectedCompany = selectedJob ? companyForJob(selectedJob) : null;
  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.candidateId === selectedCandidateId) ?? null,
    [candidates, selectedCandidateId]
  );

  const onJobsChange = (changes: CellChange[] | null, source: ChangeSource) => {
    if (!changes || source === "loadData") return;
    const hot = jobsRef.current?.hotInstance;
    if (!hot) return;
    const edits = changes.filter(([, prop]) => prop !== "candidateCount");
    if (!edits.length) return;
    setJobs((prev) => {
      const next = [...prev];
      for (const [row, prop, , newVal] of edits) {
        const id = hot.getDataAtRowProp(row, "jobId") as string;
        const idx = next.findIndex((j) => j.jobId === id);
        if (idx >= 0) next[idx] = { ...next[idx], [prop as string]: newVal };
      }
      return next;
    });
  };

  const onCandsChange = (changes: CellChange[] | null, source: ChangeSource) => {
    if (!changes || source === "loadData" || (source as string) === "lookup")
      return;
    const hot = candsRef.current?.hotInstance;
    if (!hot) return;
    setCandidates((prev) => {
      const next = [...prev];
      for (const [row, prop, , newVal] of changes) {
        if (prop === "company") continue;
        const id = hot.getDataAtRowProp(row, "candidateId") as string;
        const idx = next.findIndex((c) => c.candidateId === id);
        if (idx < 0) continue;
        const updated = { ...next[idx], [prop as string]: newVal };
        if (prop === "job") updated.company = companyForJob(newVal as string);
        next[idx] = updated;
      }
      return next;
    });
  };

  const openCandidate = (row: number, col?: number) => {
    // Only open profile when clicking the candidate name (col 0) or row header (-1).
    // Other columns stay editable without the drawer stealing focus.
    if (col !== undefined && col !== 0 && col !== -1) return;
    const hot = candsRef.current?.hotInstance;
    if (!hot || row < 0) return;
    const id = hot.getDataAtRowProp(row, "candidateId") as string;
    if (id) setSelectedCandidateId(id);
  };

  // Re-render grids when drawer opens/closes so Handsontable recalculates width.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      jobsRef.current?.hotInstance?.render();
      candsRef.current?.hotInstance?.render();
    });
    return () => cancelAnimationFrame(raf);
  }, [selectedCandidateId]);

  const stats = useMemo(() => {
    const hired = candidates.filter((c) => c.stage === "Hired").length;
    const active = candidates.filter(
      (c) => c.stage !== "Hired" && c.stage !== "Rejected"
    ).length;
    return { total: candidates.length, hired, active };
  }, [candidates]);

  return (
    <div className={`app ${selectedCandidate ? "app--drawer-open" : ""}`}>
      <header className="app__header">
        <div>
          <h1>Recruitment Operating System</h1>
          <p className="muted">
            Jobs → Candidates relational pipeline. Click a job to filter
            candidates, then click a candidate row to open their profile (Notion
            side-peek style).
          </p>
        </div>
        <span className="links">
          <a href="http://localhost:5173" target="_blank" rel="noreferrer">
            ↔ AG Grid
          </a>
          <a href="http://localhost:5174" target="_blank" rel="noreferrer">
            ↔ SpreadJS
          </a>
        </span>
      </header>

      <div className="workspace">
        <main className="workspace__main">
          {/* ---- Jobs (master) ---- */}
          <section className="block">
            <div className="block__head">
              <h2 className="block__title">Jobs</h2>
              <span className="muted small">
                Click a row to filter candidates below
              </span>
            </div>
            <div className="grid-box" style={{ height: JOBS_HEIGHT }}>
              <HotTable
                ref={jobsRef}
                themeName="ht-theme-main"
                data={jobs}
                licenseKey={LICENSE_KEY}
                height={JOBS_HEIGHT - 2}
                width="100%"
                rowHeaders
                colHeaders={[
                  "Job ID",
                  "Title",
                  "Company",
                  "Department",
                  "Location",
                  "Type",
                  "Openings",
                  "Status",
                  "# Cdd",
                ]}
                colWidths={[80, 185, 155, 115, 105, 95, 75, 90, 65]}
                manualColumnResize
                multiColumnSorting
                filters
                dropdownMenu
                afterChange={onJobsChange}
                afterSelectionEnd={(row) => {
                  const hot = jobsRef.current?.hotInstance;
                  if (!hot || row < 0) return;
                  const title = hot.getDataAtRowProp(row, "title") as string;
                  if (title) setSelectedJob(title);
                }}
              >
                <HotColumn data="jobId" readOnly />
                <HotColumn data="title" />
                <HotColumn data="company" type="dropdown" source={companyNames} />
                <HotColumn data="department" />
                <HotColumn data="location" />
                <HotColumn
                  data="type"
                  type="dropdown"
                  source={["Full-time", "Part-time", "Contract"]}
                />
                <HotColumn data="openings" type="numeric" />
                <HotColumn
                  data="status"
                  type="dropdown"
                  source={["Open", "On hold", "Closed"]}
                />
                <HotColumn data="candidateCount" type="numeric" readOnly />
              </HotTable>
            </div>
          </section>

          {/* ---- Candidates (detail) — Notion-style table ---- */}
          <section className="block block--grow">
            <div className="block__head">
              <h2 className="block__title">
                Candidates
                {selectedJob ? (
                  <>
                    {" "}
                    <span className="filter-pill">
                      {selectedJob}
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        aria-label="Clear filter"
                      >
                        ×
                      </button>
                    </span>
                    <span className="muted small">@ {selectedCompany}</span>
                  </>
                ) : (
                  <span className="muted small"> — all ({stats.total})</span>
                )}
              </h2>
              <span className="muted small">
                Click a <b>candidate name</b> (blue) to open profile · other
                cells edit normally
              </span>
            </div>

            <div className="grid-box" style={{ height: CANDIDATES_HEIGHT }}>
              <HotTable
                key={selectedJob ?? "all"}
                ref={candsRef}
                themeName="ht-theme-main"
                data={visibleCandidates}
                licenseKey={LICENSE_KEY}
                height={CANDIDATES_HEIGHT - 2}
                width="100%"
                rowHeaders
                colHeaders={[
                  "Candidate",
                  "Availability",
                  "Current Stage",
                  "Expected Salary",
                  "Email",
                  "Job",
                  "Company",
                  "Location",
                  "Source",
                  "CV",
                ]}
                colWidths={[150, 120, 115, 125, 195, 175, 145, 110, 95, 55]}
                fillHandle
                contextMenu
                manualColumnResize
                multiColumnSorting
                filters
                dropdownMenu
                afterChange={onCandsChange}
                afterSelectionEnd={(row, col) => openCandidate(row, col)}
              >
                <HotColumn data="name" className="ht-cdd-name" />
                <HotColumn data="availability" />
                <HotColumn data="stage" type="dropdown" source={STAGES} />
                <HotColumn
                  data="expectedSalary"
                  type="numeric"
                  numericFormat={{ pattern: "$0,0.00" }}
                />
                <HotColumn data="email" />
                <HotColumn data="job" type="dropdown" source={jobTitles} />
                <HotColumn data="company" readOnly className="ht-lookup" />
                <HotColumn data="location" />
                <HotColumn data="source" />
                <HotColumn
                  data="hasCv"
                  type="checkbox"
                  readOnly
                  className="htCenter"
                />
              </HotTable>
            </div>

            <div className="totals">
              <span>
                <b>{jobs.length}</b> jobs · <b>{COMPANIES.length}</b> companies
              </span>
              <span>
                Showing <b>{visibleCandidates.length}</b> candidates
              </span>
              <span>
                Active: <b>{stats.active}</b>
              </span>
              <span>
                Hired: <b>{stats.hired}</b>
              </span>
            </div>
          </section>
        </main>

        {selectedCandidate && (
          <CandidateDrawer
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidateId(null)}
          />
        )}
      </div>
    </div>
  );
}
