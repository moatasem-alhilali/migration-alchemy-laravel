
"use client";
import { useFileStore } from "@/stores/fileStore";
import { generateNewFilename, getRenamingMap } from "@/utils/fileUtils";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, FileJson, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as React from "react";

export default function ActionBar() {
  const files = useFileStore(s => s.files);
  const settings = useFileStore(s => s.settings);
  const clearFiles = useFileStore(s => s.clearFiles);
  const customNames = useFileStore(s => s.customNames);
  const resetCustomNames = useFileStore(s => s.resetCustomNames);
  const renameMode = useFileStore(s => s.renameMode);
  const saveToLocal = useFileStore(s => s.saveToLocal);
  const clearLocal = useFileStore(s => s.clearLocal);
  const hydrateFromLocal = useFileStore(s => s.hydrateFromLocal);

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
    toast({ title: "Download Ready", description: "Your migrations ZIP is ready.", });
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
    toast({
      title: "Exported Renaming Summary",
      description: "A mapping of file renames has been saved (JSON)."
    });
  }

  // Export JSON map (with order+names as requested)
  function handleExportJsonMap() {
    const rows = files.map((file, i) => ({
      original: file.originalName,
      renamed: generateNewFilename(i, file.originalName, settings, customNames[file.originalName], renameMode),
      order: i + 1
    }));
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    saveAs(blob, "migration_file_order.json");
    toast({
      title: "Exported Migration Map",
      description: "File-order JSON has been downloaded."
    });
  }

  // Export README: Markdown list as requested
  function handleExportReadme() {
    const rows = files.map((file, i) =>
      `${i + 1}. ${generateNewFilename(i, file.originalName, settings, customNames[file.originalName], renameMode)}`
    ).join("\n");
    const md = `## Migration File Order\n\n${rows ? rows : "- (none) -"}`;
    const blob = new Blob([md], { type: "text/markdown" });
    saveAs(blob, "README.md");
    toast({
      title: "Exported README.md",
      description: "Migration order written as markdown.",
    });
  }

  function handleClearSavedState() {
    clearLocal();
    toast({
      title: "Saved State Cleared",
      description: "Local file upload & settings have been cleared.",
    });
  }

  // Export mode summary badge (now more detailed)
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
      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
        {summary}
      </span>
      <div className="flex flex-wrap gap-4 items-center">
        <Button onClick={handleDownload} title="Download all migrations as ZIP" >
          <Download className="mr-1" /> Download All
        </Button>
        <Button onClick={handleExportSummary} variant="secondary" title="Export plain renaming map as JSON">
          <FileJson className="mr-1" /> Export Renaming Map
        </Button>
        <Button onClick={handleExportJsonMap} variant="secondary" title="Export ordered file list (JSON)">
          <FileJson className="mr-1" /> Export JSON Map
        </Button>
        <Button onClick={handleExportReadme} variant="secondary" title="Export ordered migration list (README.md)">
          <FileText className="mr-1" /> Export README.md
        </Button>
        <Button onClick={clearFiles} variant="destructive" title="Remove all current files (does not affect saved)">
          Reset All
        </Button>
        <Button onClick={resetCustomNames} variant="outline" title="Reset all renamed filenames">
          Reset Filenames
        </Button>
        <Button onClick={handleClearSavedState} variant="ghost" title="Clear saved uploads/settings from localStorage">
          Clear Saved State
        </Button>
      </div>
    </section>
  );
}
