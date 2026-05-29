import { useRef } from "react";
import { Download, Upload, FileJson, FileSpreadsheet, RotateCcw } from "lucide-react";
import { usePosStore } from "../store/usePosStore";
import { exportJsonBackup, exportInventoryCsv, parseImportedBackup } from "../lib/dataExport";

export default function DataBackupPanel() {
  const exportState = usePosStore((s) => s.exportState);
  const importData = usePosStore((s) => s.importData);
  const resetAllData = usePosStore((s) => s.resetAllData);
  const fileRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = parseImportedBackup(reader.result);
        if (!confirm("Replace all current data with the imported backup?")) {
          e.target.value = "";
          return;
        }
        importData(data);
        alert("Data imported successfully. The page will reload.");
        window.location.reload();
      } catch (err) {
        alert(err.message || "Failed to import backup.");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card space-y-4">
      <div>
        <h3 className="font-[Poppins] font-semibold text-slate-800">Data backup & sync</h3>
        <p className="mt-1 text-sm text-slate-500">
          All data is saved automatically in this browser. Export a file to move data to another device
          (no login or server required).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => exportJsonBackup(exportState())}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Download size={16} /> Export Data (JSON)
        </button>
        <button
          type="button"
          onClick={() => exportInventoryCsv(exportState().products)}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
        >
          <FileSpreadsheet size={16} /> Export Inventory (CSV)
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-accent px-4 py-2.5 text-sm font-medium text-accent"
        >
          <Upload size={16} /> Import Data
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <FileJson size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong>Cross-device sync:</strong> Export JSON on one phone or computer, send the file (email,
            USB, cloud drive), then Import on the other device.
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm("Reset ALL data to defaults? This cannot be undone.")) {
            resetAllData();
            window.location.reload();
          }
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <RotateCcw size={14} /> Reset all data
      </button>
    </section>
  );
}
