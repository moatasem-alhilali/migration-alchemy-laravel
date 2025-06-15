"use client";
import React, { useRef, useState } from "react";
import { useFileStore } from "@/stores/fileStore";
import { validateLaravelMigrationFile } from "@/utils/fileUtils";
import JSZip from "jszip";
import { AlertCircle, FileArchive } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MigrationUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setFiles = useFileStore(s => s.setFiles);
  const [error, setError] = useState<string>("");

  async function handleFiles(files: FileList | File[]) {
    // Gather migration files (php) directly and from zips
    let allFiles: { file: File; originalName: string; valid: boolean; error?: string }[] = [];
    let zipCount = 0;

    for (const file of Array.from(files)) {
      if (file.name.toLowerCase().endsWith(".zip")) {
        // Handle ZIP
        try {
          const data = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(data);
          let phpFiles: File[] = [];
          // Only .php root or in folders
          await Promise.all(
            Object.entries(zip.files).map(async ([name, entry]) => {
              if (!entry.dir && name.toLowerCase().endsWith(".php")) {
                const content = await entry.async("blob");
                // Recreate as File for compatibility, try keeping real filename
                phpFiles.push(new File([content], name.split("/").pop() || name, { type: "text/x-php" }));
              }
            })
          );
          if (phpFiles.length > 0) {
            zipCount += phpFiles.length;
            allFiles.push(
              ...phpFiles.map(f => {
                const valid = validateLaravelMigrationFile(f.name);
                return {
                  file: f,
                  originalName: f.name,
                  valid,
                  error: valid ? undefined : "Invalid Laravel migration filename",
                };
              })
            );
          }
        } catch (e) {
          setError("Could not extract zip file: " + file.name);
        }
      } else {
        // Normal .php file
        const valid = validateLaravelMigrationFile(file.name);
        allFiles.push({
          file,
          originalName: file.name,
          valid,
          error: valid ? undefined : "Invalid Laravel migration filename",
        });
      }
    }
    setFiles(allFiles);
    if (allFiles.some(f => !f.valid)) {
      setError(
        "Some files were invalid. Only files in the format YYYY_MM_DD_HHMMSS_xxx.php are allowed."
      );
    } else {
      setError("");
    }
    if (zipCount) {
      toast({
        title: "ZIP extraction complete",
        description: `${zipCount} migration file${zipCount > 1 ? "s" : ""} extracted from ZIP.`,
      });
    }
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  return (
    <section className="border border-muted rounded-lg bg-card/90 p-6 mb-1 text-center flex flex-col gap-4 shadow-sm">
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-2 py-8 rounded-lg border-2 border-dashed border-primary hover:bg-accent transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="text-xl mb-2 font-mono text-primary">Drag &amp; drop Laravel migration files or ZIP here</div>
        <div className="text-sm opacity-70 font-mono">
          or <span className="underline text-blue-600 cursor-pointer">click to select</span> multiple <span className="font-bold">.php or .zip</span> files
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".php,.zip"
          multiple
          onChange={onInput}
          className="hidden"
        />
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <FileArchive className="w-4 h-4" /> ZIP supported
        </div>
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        Accepted pattern: <b>YYYY_MM_DD_HHMMSS_name.php</b> &nbsp;or <span className="font-bold">.zip</span>
      </div>
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 font-mono text-sm mt-2">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}
    </section>
  );
}
