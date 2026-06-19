import * as GC from "@mescius/spread-sheets";
import { CATEGORIES, makeRows } from "./data";

export const HEADERS = [
  "SKU",
  "Product",
  "Category",
  "Qty",
  "Reorder At",
  "Unit Cost",
  "Unit Price",
  "Margin %",
  "Stock Value",
  "In Stock",
  "Last Restock",
];
const WIDTHS = [90, 190, 130, 70, 90, 100, 100, 90, 110, 80, 120];

/** Fills the active sheet of a workbook with the demo inventory dataset. */
export function fillInventory(spread: GC.Spread.Sheets.Workbook) {
  const sheet = spread.getActiveSheet();
  const rows = makeRows();
  const Area = GC.Spread.Sheets.SheetArea;

  sheet.suspendPaint();
  try {
    sheet.setRowCount(rows.length);
    sheet.setColumnCount(HEADERS.length);
    sheet.frozenColumnCount(1);

    HEADERS.forEach((h, c) => {
      sheet.setValue(0, c, h, Area.colHeader);
      sheet.setColumnWidth(c, WIDTHS[c]);
    });

    rows.forEach((r, i) => {
      const n = i + 1; // 1-based for A1 formulas
      sheet.setValue(i, 0, r.sku);
      sheet.setValue(i, 1, r.product);
      sheet.setValue(i, 2, r.category);
      sheet.setValue(i, 3, r.qty);
      sheet.setValue(i, 4, r.reorderLevel);
      sheet.setValue(i, 5, r.unitCost);
      sheet.setValue(i, 6, r.unitPrice);
      sheet.setFormula(i, 7, `=IF(G${n}=0,0,(G${n}-F${n})/G${n})`);
      sheet.setFormula(i, 8, `=D${n}*F${n}`);
      sheet.setValue(i, 9, r.inStock);
      sheet.setValue(i, 10, r.lastRestock);
    });

    for (let i = 0; i < rows.length; i++) {
      sheet.getCell(i, 5).formatter("$#,##0.00");
      sheet.getCell(i, 6).formatter("$#,##0.00");
      sheet.getCell(i, 7).formatter("0.0%");
      sheet.getCell(i, 8).formatter("$#,##0.00");
    }

    const dv = GC.Spread.Sheets.DataValidation.createListValidator(
      CATEGORIES.join(",")
    );
    sheet.setDataValidator(0, 2, rows.length, 1, dv, Area.viewport);

    const checkbox = new GC.Spread.Sheets.CellTypes.CheckBox();
    sheet.getRange(0, 9, rows.length, 1).cellType(checkbox);

    const danger = new GC.Spread.Sheets.Style();
    danger.backColor = "#fee2e2";
    danger.foreColor = "#b91c1c";
    sheet.conditionalFormats.addFormulaRule(`=$D1<=$E1`, danger, [
      new GC.Spread.Sheets.Range(0, 3, rows.length, 1),
    ]);

    const good = new GC.Spread.Sheets.Style();
    good.backColor = "#dcfce7";
    good.foreColor = "#15803d";
    sheet.conditionalFormats.addCellValueRule(
      GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators
        .greaterThanOrEqualsTo,
      0.4,
      "",
      good,
      [new GC.Spread.Sheets.Range(0, 7, rows.length, 1)]
    );

    const totalRow = rows.length;
    sheet.setRowCount(rows.length + 1);
    sheet.setValue(totalRow, 1, "TOTAL");
    sheet.setFormula(totalRow, 3, `=SUM(D1:D${rows.length})`);
    sheet.setFormula(totalRow, 8, `=SUM(I1:I${rows.length})`);
    sheet.getCell(totalRow, 8).formatter("$#,##0.00");
    const totalStyle = new GC.Spread.Sheets.Style();
    totalStyle.backColor = "#f1f5f9";
    totalStyle.font = "bold 13px sans-serif";
    sheet.getRange(totalRow, 0, 1, HEADERS.length).setStyle(totalStyle);
  } finally {
    sheet.resumePaint();
  }
}
