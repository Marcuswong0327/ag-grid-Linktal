import { useState } from "react";
import * as GC from "@mescius/spread-sheets";
import GridView from "./GridView";
import DesignerView from "./DesignerView";
import "./index.css";

// Apply the SpreadJS trial license key (if provided) to remove the trial
// banner. Put your key in apps/spreadjs/.env.local as:
//   VITE_SPREADJS_LICENSE_KEY=your-key-here
// All features work with or without it; the key only hides the watermark.
const LICENSE_KEY = import.meta.env.VITE_SPREADJS_LICENSE_KEY as
  | string
  | undefined;
if (LICENSE_KEY) {
  GC.Spread.Sheets.LicenseKey = LICENSE_KEY;
}

type Tab = "grid" | "designer";

export default function App() {
  const [tab, setTab] = useState<Tab>("designer");

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Excel-like Grid — SpreadJS Prototype</h1>
          <p className="muted">
            Same dataset as the AG Grid app. Real formulas, fill handle, range
            copy/paste, charts and .xlsx — all native, no feature tiers. Features
            work unlicensed; a trial/license key only removes the watermark (set{" "}
            <code>VITE_SPREADJS_LICENSE_KEY</code> in <code>.env.local</code>).
          </p>
        </div>
        <a
          className="switch"
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
        >
          ↔ Compare AG Grid (5173)
        </a>
      </header>

      <div className="tabs">
        <button
          className={tab === "designer" ? "tab tab--active" : "tab"}
          onClick={() => setTab("designer")}
        >
          Full Designer (Excel ribbon)
        </button>
        <button
          className={tab === "grid" ? "tab tab--active" : "tab"}
          onClick={() => setTab("grid")}
        >
          Embedded Grid
        </button>
      </div>

      {/* Remount on tab change so each view initializes its own SpreadJS host. */}
      {tab === "designer" ? <DesignerView key="designer" /> : <GridView key="grid" />}
    </div>
  );
}
