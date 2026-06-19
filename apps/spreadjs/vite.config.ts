import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const mesciusDeps = [
  "@mescius/spread-sheets",
  "@mescius/spread-sheets-designer",
  "@mescius/spread-sheets-designer-resources-en",
  "@mescius/spread-sheets-io",
  "@mescius/spread-sheets-charts",
  "@mescius/spread-sheets-shapes",
  "@mescius/spread-sheets-print",
  "@mescius/spread-sheets-pdf",
  "@mescius/spread-sheets-barcode",
  "@mescius/spread-sheets-languagepackages",
  "@mescius/spread-sheets-tablesheet",
  "@mescius/spread-sheets-pivot-addon",
  "@mescius/spread-sheets-slicers",
  "@mescius/spread-sheets-ganttsheet",
  "@mescius/spread-sheets-reportsheet-addon",
  "@mescius/spread-sheets-formula-panel",
];

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  optimizeDeps: {
    include: mesciusDeps,
  },
});
