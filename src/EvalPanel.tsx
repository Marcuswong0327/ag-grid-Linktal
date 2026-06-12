interface Item {
  label: string;
  note?: string;
}

const COMMUNITY: Item[] = [
  { label: "Inline cell editing", note: "double-click / Enter / F2" },
  { label: "Type-specific editors", note: "text, number, dropdown, date, checkbox" },
  { label: "Dropdown (select) editor" },
  { label: "Sorting (multi-column: shift-click)" },
  { label: "Column filters + floating filters" },
  { label: "Quick filter (global search)" },
  { label: '"Formula" columns', note: "valueGetter, live recompute" },
  { label: "Conditional formatting", note: "cellClassRules" },
  { label: "Undo / Redo of edits" },
  { label: "CSV export" },
  { label: "Single-cell copy (Ctrl+C)" },
  { label: "Pagination" },
  { label: "Column pin / resize / reorder" },
  { label: "Row selection + checkboxes" },
  { label: "Totals row", note: "manual pinned bottom row" },
  { label: "Custom cell renderers" },
];

const ENTERPRISE: Item[] = [
  { label: "Range selection", note: "drag-select a block" },
  { label: "Fill handle / drag-to-fill" },
  { label: "Paste blocks from Excel", note: "multi-cell clipboard" },
  { label: "Excel (.xlsx) export with styles" },
  { label: "Set Filter (checkbox list)" },
  { label: "Row grouping + aggregation" },
  { label: "Pivot tables" },
  { label: "Master / detail rows" },
  { label: "Integrated charts" },
  { label: "Tree data" },
  { label: "Status bar aggregations" },
  { label: "Context menu (custom)" },
];

export function EvalPanel() {
  return (
    <aside className="eval">
      <h2>Upgrade decision</h2>
      <p className="muted">
        Try the grid. If nothing in the right column is a hard requirement, stay
        on Community (free).
      </p>

      <section>
        <h3 className="eval__title eval__title--ok">✓ Community (free)</h3>
        <ul className="eval__list">
          {COMMUNITY.map((i) => (
            <li key={i.label}>
              <span>{i.label}</span>
              {i.note && <em className="muted"> — {i.note}</em>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="eval__title eval__title--lock">🔒 Enterprise (paid)</h3>
        <ul className="eval__list eval__list--lock">
          {ENTERPRISE.map((i) => (
            <li key={i.label}>
              <span>{i.label}</span>
              {i.note && <em className="muted"> — {i.note}</em>}
            </li>
          ))}
        </ul>
      </section>

      <p className="muted small">
        Enterprise is a per-developer annual license. Verdict guidance: the
        deal-breakers are usually <b>fill handle</b>, <b>paste-from-Excel</b>,
        and <b>.xlsx export</b>. If you don't need those, Community wins.
      </p>
    </aside>
  );
}
