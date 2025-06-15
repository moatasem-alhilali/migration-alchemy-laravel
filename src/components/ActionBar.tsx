
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

  if (!files.length) return null;

  async function handleDownload() {
    const zip = new JSZip();
    for (let i = 0; i < files.length; ++i) {
      const mig = files[i];
      const newName = generateNewFilename(i, mig.originalName, settings);
      const blob = await mig.file.arrayBuffer();
      zip.file(newName, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "migrations.zip");
  }

  function handleExportSummary() {
    const renaming = getRenamingMap(files.map(f => f.originalName), settings);
    const blob = new Blob([JSON.stringify(renaming, null, 2)], { type: "application/json" });
    saveAs(blob, "migration_renaming_summary.json");
  }

  return (
    <section className="flex flex-wrap gap-4 my-4 items-center">
      <Button onClick={handleDownload}>Download All</Button>
      <Button onClick={handleExportSummary} variant="secondary">
        Export Renaming Map
      </Button>
      <Button onClick={clearFiles} variant="destructive">
        Reset All
      </Button>
    </section>
  );
}
