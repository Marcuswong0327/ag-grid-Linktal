import { useEffect, useRef } from "react";
import * as GC from "@mescius/spread-sheets";
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import { fillInventory } from "./inventory";

export default function GridView() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const spread = new GC.Spread.Sheets.Workbook(hostRef.current, {
      sheetCount: 1,
      allowUserDragFill: true,
      allowUserDragDrop: true,
      allowCopyPasteExcelStyle: true,
      allowUserResize: true,
      allowUserZoom: true,
    });
    fillInventory(spread);
    return () => spread.destroy();
  }, []);

  return (
    <>
      <div className="hint">
        Try it like Excel: type <code>=D1*G1</code> in an empty cell, drag the
        fill handle (bottom-right of a selection) to copy down, or select a block
        and Ctrl+C → paste into real Excel.
      </div>
      <div ref={hostRef} className="ss-host" />
    </>
  );
}
