import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type ValueGetterParams,
  type ValueFormatterParams,
  type CellClassParams,
  type CellClassRules,
} from "ag-grid-community";
import { CATEGORIES, makeRows, type Product } from "./data";
import { EvalPanel } from "./EvalPanel";

// Register ALL Community features. Note: there is no "AllEnterpriseModule"
// imported here — that is intentional. Everything you see working is free.
ModuleRegistry.registerModules([AllCommunityModule]);

const currency = (p: ValueFormatterParams) =>
  p.value == null
    ? ""
    : p.value.toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function App() {
  const gridRef = useRef<AgGridReact<Product>>(null);
  const apiRef = useRef<GridApi<Product> | null>(null);
  const [rowData, setRowData] = useState<Product[]>(() => makeRows());
  const [quickFilter, setQuickFilter] = useState("");

  const columnDefs = useMemo<ColDef<Product>[]>(
    () => [
      {
        field: "sku",
        headerName: "SKU",
        pinned: "left",
        width: 110,
        editable: false,
        filter: "agTextColumnFilter",
      },
      {
        field: "product",
        headerName: "Product",
        flex: 1,
        minWidth: 180,
        filter: "agTextColumnFilter",
      },
      {
        field: "category",
        headerName: "Category",
        width: 140,
        // Excel-like dropdown editor — Community feature.
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: CATEGORIES },
        filter: "agTextColumnFilter",
      },
      {
        field: "qty",
        headerName: "Qty",
        width: 100,
        type: "numericColumn",
        filter: "agNumberColumnFilter",
        // Conditional formatting (like Excel) — Community.
        cellClassRules: {
          "cell-danger": (p: CellClassParams<Product>) =>
            !p.node?.rowPinned &&
            (p.data?.qty ?? 0) <= (p.data?.reorderLevel ?? 0),
        } as CellClassRules<Product>,
      },
      {
        field: "reorderLevel",
        headerName: "Reorder At",
        width: 120,
        type: "numericColumn",
        filter: "agNumberColumnFilter",
      },
      {
        field: "unitCost",
        headerName: "Unit Cost",
        width: 120,
        type: "numericColumn",
        valueFormatter: currency,
        filter: "agNumberColumnFilter",
      },
      {
        field: "unitPrice",
        headerName: "Unit Price",
        width: 120,
        type: "numericColumn",
        valueFormatter: currency,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "Margin %",
        colId: "margin",
        width: 110,
        editable: false,
        type: "numericColumn",
        // "Formula" column via valueGetter — recomputes live as you edit.
        valueGetter: (p: ValueGetterParams<Product>) => {
          if (p.node?.rowPinned) return null;
          const c = p.data?.unitCost ?? 0;
          const s = p.data?.unitPrice ?? 0;
          return s ? Number((((s - c) / s) * 100).toFixed(1)) : 0;
        },
        valueFormatter: (p) => (p.value == null ? "" : `${p.value}%`),
        cellClassRules: {
          "cell-good": (p) => !p.node?.rowPinned && (p.value ?? 0) >= 40,
          "cell-warn": (p) => !p.node?.rowPinned && (p.value ?? 0) < 20,
        } as CellClassRules<Product>,
      },
      {
        headerName: "Stock Value",
        colId: "stockValue",
        width: 130,
        editable: false,
        type: "numericColumn",
        valueGetter: (p: ValueGetterParams<Product>) => {
          if (p.node?.rowPinned)
            return (p.data as Product & { stockValue?: number })?.stockValue ?? 0;
          return (p.data?.qty ?? 0) * (p.data?.unitCost ?? 0);
        },
        valueFormatter: currency,
      },
      {
        field: "inStock",
        headerName: "In Stock",
        width: 110,
        // Boolean -> checkbox renderer + editor automatically (Community).
        cellDataType: "boolean",
      },
      {
        field: "lastRestock",
        headerName: "Last Restock",
        width: 140,
        // Gives a date editor + date filter for free.
        cellDataType: "dateString",
        filter: "agDateColumnFilter",
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      editable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      enableCellChangeFlash: true,
    }),
    []
  );

  // Manual SUM footer (pinned bottom row). Real aggregation/grouping is
  // Enterprise, but a totals row like this is achievable in Community.
  const pinnedBottomRowData = useMemo(() => {
    const totalQty = rowData.reduce((s, r) => s + r.qty, 0);
    const totalStockValue = rowData.reduce((s, r) => s + r.qty * r.unitCost, 0);
    return [
      {
        product: `TOTAL (${rowData.length} items)`,
        qty: totalQty,
        unitCost: null,
        unitPrice: null,
        stockValue: totalStockValue,
      } as unknown as Product,
    ];
  }, [rowData]);

  const onGridReady = useCallback((e: GridReadyEvent<Product>) => {
    apiRef.current = e.api;
  }, []);

  const exportCsv = () => apiRef.current?.exportDataAsCsv({ fileName: "inventory.csv" });
  const undo = () => apiRef.current?.undoCellEditing();
  const redo = () => apiRef.current?.redoCellEditing();
  const addRow = () =>
    setRowData((rows) => [
      ...rows,
      {
        id: Math.max(0, ...rows.map((r) => r.id)) + 1,
        sku: `SKU-${1000 + rows.length}`,
        product: "New Product",
        category: "Home",
        qty: 0,
        reorderLevel: 10,
        unitCost: 0,
        unitPrice: 0,
        inStock: false,
        lastRestock: new Date().toISOString().slice(0, 10),
      },
    ]);
  const reset = () => setRowData(makeRows());

  const lockedAlert = (feature: string) =>
    alert(
      `🔒 "${feature}" is an AG Grid ENTERPRISE feature.\n\n` +
        `It is NOT available in ag-grid-community. To enable it you'd add the\n` +
        `enterprise package + a license key. This button is disabled on purpose\n` +
        `so you can see exactly where the paywall sits.`
    );

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Excel-like Grid — AG Grid Community Prototype</h1>
          <p className="muted">
            Everything in the grid below is 100% free (Community). Locked buttons
            show what would force an Enterprise upgrade.
          </p>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="search"
          placeholder="🔎 Quick filter (search all columns)…"
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
        />
        <span className="toolbar__group">
          <button onClick={addRow}>+ Add row</button>
          <button onClick={undo}>↶ Undo</button>
          <button onClick={redo}>↷ Redo</button>
          <button onClick={exportCsv}>⬇ Export CSV</button>
          <button onClick={reset}>♻ Reset data</button>
        </span>
        <span className="toolbar__group toolbar__group--locked">
          <button className="locked" onClick={() => lockedAlert("Export to Excel (.xlsx)")}>
            🔒 Export .xlsx
          </button>
          <button className="locked" onClick={() => lockedAlert("Range selection + Fill handle")}>
            🔒 Fill handle
          </button>
          <button className="locked" onClick={() => lockedAlert("Row grouping / Pivot")}>
            🔒 Group / Pivot
          </button>
          <button className="locked" onClick={() => lockedAlert("Integrated charts")}>
            🔒 Charts
          </button>
        </span>
      </div>

      <div className="main">
        <div className="grid-wrap">
          <AgGridReact<Product>
            ref={gridRef}
            theme={themeQuartz}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            quickFilterText={quickFilter}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            undoRedoCellEditing
            undoRedoCellEditingLimit={20}
            rowSelection={{ mode: "multiRow", headerCheckbox: true }}
            pinnedBottomRowData={pinnedBottomRowData}
            stopEditingWhenCellsLoseFocus
          />
        </div>
        <EvalPanel />
      </div>
    </div>
  );
}
