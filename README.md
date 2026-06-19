# Excel-like Grid Bake-off: AG Grid vs SpreadJS vs Handsontable

A side-by-side prototype to evaluate which spreadsheet/grid library to build the
product on. Three apps, same dataset, run together on different ports so you can
A/B the developer experience and the end-user "Excel feel" — and decide whether
the free AG Grid Community tier is enough or an upgrade (AG Grid Enterprise,
commercial SpreadJS, or commercial Handsontable) is justified.

## Quick start

```bash
npm install        # one install for the whole monorepo
npm run dev        # runs ALL THREE apps at once
```

| App                    | URL                     | Notes                                       |
| ---------------------- | ----------------------- | ------------------------------------------- |
| AG Grid (Community)    | http://localhost:5173   | Free OSS tier                               |
| SpreadJS (trial)       | http://localhost:5174   | Commercial; runs in unlicensed trial        |
| Handsontable           | http://localhost:5175   | Commercial; free non-commercial/eval key    |

Run a single app:

```bash
npm run dev:ag-grid       # only 5173
npm run dev:spreadjs      # only 5174
npm run dev:handsontable  # only 5175
```

Each app's header has links to jump to the others.

## Repo structure

This is an **npm workspaces** monorepo. Dependencies are hoisted to one root
`node_modules`, so a single `npm install` covers both apps.

```
ag-grid-Linktal/
├── package.json              # workspaces + concurrently (root runner)
├── apps/
│   ├── ag-grid/              # AG Grid Community prototype (port 5173)
│   │   └── src/
│   │       ├── App.tsx       # grid config, toolbar, locked-feature buttons
│   │       ├── EvalPanel.tsx # Community vs Enterprise legend
│   │       └── data.ts       # mock inventory dataset
│   ├── spreadjs/             # SpreadJS prototype (port 5174)
│   │   └── src/
│   │       ├── App.tsx       # tabbed: Designer (Excel ribbon) + embedded grid
│   │       ├── DesignerView.tsx
│   │       ├── GridView.tsx
│   │       ├── designer-addons.ts
│   │       ├── inventory.ts  # shared sheet-population logic
│   │       └── data.ts
│   └── handsontable/         # Handsontable prototype (port 5175)
│       └── src/
│           ├── App.tsx       # fill handle, range paste, dropdowns, context menu
│           └── data.ts       # same dataset shape
└── README.md
```

All three apps are **React 19 + TypeScript + Vite**.

## Target production stack (reference)

The prototypes use mock data; the intended real architecture is:

- **Frontend:** Next.js + React + TypeScript + Tailwind CSS + Shadcn UI + (chosen grid)
- **Backend:** .NET 10 Web API
- **Database:** PostgreSQL
- **Hosting (Azure):** Static Web Apps (frontend), Container Apps (backend),
  PostgreSQL Flexible Server, Blob Storage, Entra ID auth

## The decision: Community vs Enterprise vs SpreadJS

### AG Grid — what's free vs paid

**Community (free):** inline editing, type-specific editors, dropdown editor,
sorting, column filters + floating filters, quick filter, "formula" columns
(`valueGetter`), conditional formatting (`cellClassRules`), undo/redo, CSV
export, single-cell copy, pagination, pinning/resize/reorder, row selection,
custom renderers, manual totals row.

**Enterprise (paid, per-developer annual license):** range selection, fill
handle / drag-to-fill, paste blocks from Excel (multi-cell clipboard), `.xlsx`
export with styles, Set Filter (checkbox list), row grouping + aggregation,
pivot tables, master/detail, integrated charts, tree data, status bar,
**Server-Side Row Model (SSRM)**.

> The AG Grid app marks Enterprise features with disabled 🔒 buttons and a
> legend panel so you can see exactly where the paywall sits.

### SpreadJS — what you get

Every Excel feature above is **native and built-in, no tiers**: real cell
formulas, fill handle, range copy/paste, data validation dropdowns, checkbox
cells, conditional formatting, number formats. But SpreadJS is **commercial**
with **no free production tier** — it runs here in trial mode (license banner on
the grid) and requires a paid license to ship. It is also a heavier bundle.

The SpreadJS app has two tabs:

- **Full Designer (Excel ribbon)** — the `@mescius/spread-sheets-designer`
  component: a complete Excel clone with ribbon (Home/Insert/Formulas/Data/View),
  formula bar, sheet tabs, context menus, charts, shapes, and `.xlsx` open/save.
  Add-on modules wired in: `-io` (xlsx), `-charts`, `-shapes`, `-print`,
  `-pdf` (File → Export → PDF), `-barcode`, `-pivot-addon`, `-tablesheet`,
  `-ganttsheet`, `-slicers`, `-formula-panel`, `-reportsheet-addon`,
  `-languagepackages`.
- **Embedded Grid** — the lightweight workbook (no ribbon), same dataset.

Everything in the Designer works during the trial. To remove the watermark, add
your trial/license key — see "Activating the SpreadJS trial key" below.

### Activating the SpreadJS trial key

1. Copy `apps/spreadjs/.env.example` to `apps/spreadjs/.env.local` (git-ignored).
2. Paste your key: `VITE_SPREADJS_LICENSE_KEY=your-key-here`
3. Restart the dev server (Vite reads env only at startup).

All features work without a key; it only hides the trial watermark.

### Handsontable — what you get

The middle ground. **Fill handle, range selection, copy/paste blocks from
Excel, dropdowns, checkboxes, context menu, filters, and column sorting are all
native** — including under the free `non-commercial-and-evaluation` key. Real
in-cell formulas are available via the optional HyperFormula plugin (not wired
in this prototype; derived columns recalc via an `afterChange` handler instead).

Caveats:

- **Commercial license required for production / commercial use.** The free key
  is strictly non-commercial + evaluation.
- Lighter than SpreadJS (≈330 KB gzipped vs ≈6 MB) but no full "Designer"/ribbon
  app — it's a grid, not an Excel clone.
- To use a purchased key, set `VITE_HANDSONTABLE_LICENSE_KEY` in
  `apps/handsontable/.env.local`.

### Rule of thumb

| Need                                                              | Recommended            |
| ---------------------------------------------------------------- | ---------------------- |
| Free, and "a data grid that edits" is enough                     | AG Grid **Community**  |
| Fill handle + paste-from-Excel, lighter weight, OK paying        | **Handsontable**       |
| Excel-grade grid UX inside AG Grid + OK paying                   | AG Grid **Enterprise** |
| True spreadsheet engine (live formulas, ribbon, full Excel feel) | **SpreadJS**           |

The usual deal-breakers that force a paid tier are **fill handle**,
**paste-from-Excel**, and **`.xlsx` export**. If none of those are hard
requirements, AG Grid Community wins. If you need fill handle + range paste but
not a full Excel clone, Handsontable is the lightest paid option.

## Cost note (Azure, at scale)

Internet egress (bytes shipped to the browser) is the data-transfer cost that
scales; intra-region service traffic (API ↔ Postgres ↔ Blob) is free/cheap. Keep
payloads small with **server-side pagination** (AG Grid's Infinite Row Model is
in Community), **gzip/brotli** on the API, and column projection. Co-locate all
Azure services in one region. At realistic scale, compute dominates the bill —
not transfer — as long as full datasets aren't dumped to the client.

## Scripts

| Command                  | What it does                            |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Run all three apps concurrently         |
| `npm run dev:ag-grid`    | Run only the AG Grid app (5173)         |
| `npm run dev:spreadjs`   | Run only the SpreadJS app (5174)        |
| `npm run dev:handsontable` | Run only the Handsontable app (5175)  |
| `npm run build`          | Production build of all apps            |
