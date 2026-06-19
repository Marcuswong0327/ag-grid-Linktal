import { useEffect, useRef } from "react";
import * as GC from "@mescius/spread-sheets";
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "./designer-addons";
// Designer ribbon UI + the default English ribbon config + its styles:
import "@mescius/spread-sheets-designer-resources-en";
import * as GCDesigner from "@mescius/spread-sheets-designer";
import "@mescius/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import { fillInventory } from "./inventory";

export default function DesignerView() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    // Full Excel-like Designer: ribbon, formula bar, sheet tabs, context menus.
    const designer = new GCDesigner.Spread.Sheets.Designer.Designer(
      hostRef.current
    );
    const spread = designer.getWorkbook() as GC.Spread.Sheets.Workbook;
    fillInventory(spread);
    return () => designer.destroy();
  }, []);

  return (
    <>
      <div className="hint">
        This is the full <b>SpreadJS Designer</b> — a complete Excel clone
        (ribbon, formula bar, charts, pivot, shapes, .xlsx open/save). Everything
        in the ribbon works in the trial. Try <b>Insert → Chart</b>,
        <b> File → Save</b> to export a real <code>.xlsx</code>, or
        <b> File → Export → PDF</b>.
      </div>
      <div ref={hostRef} className="designer-host" />
    </>
  );
}
