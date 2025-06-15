
import { useMigrationStore } from "@/store/useMigrationStore";
import React, { useRef } from "react";

export default function ActionBar() {
  const { migrations, settings, setPrefix, setPreserveNames, clear } = useMigrationStore((s) => ({
    migrations: s.migrations,
    settings: s.settings,
    setPrefix: s.setPrefix,
    setPreserveNames: s.setPreserveNames,
    clear: s.clear,
  }));
  const prefixRef = useRef<HTMLInputElement | null>(null);

  if (!migrations.length) return null;

  return (
    <section className="bg-accent/40 border border-muted rounded-lg shadow-md my-3 p-4 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center flex-wrap gap-4">
        <label className="flex items-center gap-2 font-mono text-sm">
          <input
            type="checkbox"
            checked={settings.preserveNames}
            onChange={e => setPreserveNames(e.target.checked)}
            className="accent-primary mr-1"
          />
          Preserve original file names
        </label>
        <input
          ref={prefixRef}
          className="rounded border px-2 py-1 font-mono text-sm bg-background"
          placeholder="Custom prefix..."
          value={settings.prefix}
          onChange={e => setPrefix(e.target.value)}
          style={{width:200}}
        />
        <button
          className="ml-2 px-3 py-1 bg-primary text-white rounded text-xs font-mono hover:scale-105 transition-transform"
          onClick={() => setPrefix("")}
        >
          Clear Prefix
        </button>
        <button
          className="ml-2 px-3 py-1 bg-destructive text-white rounded text-xs font-mono"
          onClick={clear}
        >
          Reset All
        </button>
        <a
          href="/api/download" // [TODO] implement actual download logic for zip.
          className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm text-white font-mono shadow-sm transition-colors"
        >
          Download ZIP
        </a>
      </div>
      <div className="text-xs text-muted-foreground font-mono px-0.5 pl-1">
        Rename options and utilities are coming soon: file suffix, smart order, ZIP export, summary.
      </div>
    </section>
  );
}
