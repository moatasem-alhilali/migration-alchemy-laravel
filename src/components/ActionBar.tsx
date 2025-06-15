
"use client";
import { useFileStore } from "@/stores/fileStore";
import { generateNewFilename, getRenamingMap } from "@/utils/fileUtils";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ActionBar() {
  const files = useFileStore(s => s.files);
  const settings = useFileStore(s => s.settings);
  const clearFiles = useFileStore(s => s.clearFiles);
  const customNames = useFileStore(s => s.customNames);
  const resetCustomNames = useFileStore(s => s.resetCustomNames);
  const renameMode = useFileStore(s => s.renameMode);

  if (!files.length) return null;

  async function handleDownload() {
    const zip = new JSZip();
    for (let i = 0; i < files.length; ++i) {
      const mig = files[i];
      const newName = generateNewFilename(i, mig.originalName, settings, customNames[mig.originalName], renameMode);
      const blob = await mig.file.arrayBuffer();
      zip.file(newName, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "migrations.zip");
  }

  function handleExportSummary() {
    const renaming = getRenamingMap(
      files.map(f => f.originalName),
      settings,
      customNames,
      renameMode
    );
    const blob = new Blob([JSON.stringify(renaming, null, 2)], { type: "application/json" });
    saveAs(blob, "migration_renaming_summary.json");
  }

  // Export mode summary badge
  const summary = [
    "Mode: " +
      (renameMode === "manual"
        ? "Manual"
        : renameMode === "incremental"
        ? "Incremental"
        : renameMode === "prefix"
        ? "Prefix"
        : renameMode === "suffix"
        ? "Suffix"
        : "Timestamp"),
    settings.prefix ? `Prefix: "${settings.prefix}"` : null,
    settings.suffix ? `Suffix: "${settings.suffix}"` : null,
    settings.removeTimestamp ? "Timestamp: Removed" : "Timestamp: Kept",
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <section className="flex flex-col gap-3 my-4 items-start">
      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{summary}</span>
      <div className="flex flex-wrap gap-4 items-center">
        <Button onClick={handleDownload}>Download All</Button>
        <Button onClick={handleExportSummary} variant="secondary">
          Export Renaming Map
        </Button>
        <Button onClick={clearFiles} variant="destructive">
          Reset All
        </Button>
        <Button onClick={resetCustomNames} variant="outline">
          Reset Filenames
        </Button>
      </div>
    </section>
  );
}
