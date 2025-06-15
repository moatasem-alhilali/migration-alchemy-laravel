
"use client";
import React, { useRef, useState } from "react";
import { useFileStore } from "@/stores/fileStore";
import { validateLaravelMigrationFile } from "@/utils/fileUtils";
import { AlertCircle } from "lucide-react";

export default function MigrationUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setFiles = useFileStore(s => s.setFiles);
  const [error, setError] = useState<string>("");

  function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files).map((file) => {
      const valid = validateLaravelMigrationFile(file.name);
      return {
        file,
        originalName: file.name,
        valid,
        error: valid ? undefined : "Invalid Laravel migration filename",
      };
    });
    setFiles(arr);
    if (arr.some(f => !f.valid)) {
      setError(
        "Some files were invalid. Only files in the format YYYY_MM_DD_HHMMSS_xxx.php are allowed."
      );
    } else {
      setError("");
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
        <div className="text-xl mb-2 font-mono text-primary">Drag &amp; drop Laravel migration files here</div>
        <div className="text-sm opacity-70 font-mono">
          or <span className="underline text-blue-600 cursor-pointer">click to select</span> multiple <span className="font-bold">.php</span> files
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".php"
          multiple
          onChange={onInput}
          className="hidden"
        />
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        Accepted pattern: <b>YYYY_MM_DD_HHMMSS_name.php</b>
      </div>
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 font-mono text-sm mt-2">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}
    </section>
  );
}
