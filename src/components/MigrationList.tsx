
import { useMigrationStore } from "@/store/useMigrationStore";
import { stripTimestamp, generateNewTimestamp, applyPrefix } from "@/utils/laravel";
import React from "react";
// NOTE: This basic version uses mouse down/up for accessibility; DnD-kit will be added soon

export default function MigrationList() {
  const { migrations, settings } = useMigrationStore((s) => ({
    migrations: s.migrations,
    settings: s.settings
  }));

  if (!migrations.length) return null;

  return (
    <section className="border border-muted rounded-lg bg-card/95 p-5 animate-fade-in shadow-sm">
      <div className="flex font-mono text-xs text-muted-foreground mb-2 pl-1">
        <span className="w-9 mr-2">#</span>
        <span className="flex-1">Original Filename</span>
        <span className="w-2"></span>
        <span className="flex-1">New Filename Preview</span>
      </div>
      <ul className="divide-y border-t">
        {migrations.map((mig, idx) => {
          const newBase =
            settings.preserveNames
              ? mig.originalName
              : generateNewTimestamp(idx) + "_" + stripTimestamp(mig.originalName);
          const newFilename = applyPrefix(newBase, settings.prefix);
          return (
            <li
              key={mig.originalName + idx}
              className="flex items-center px-1 py-3 hover:bg-muted transition-colors group"
            >
              <span className="font-mono text-sm w-9 text-foreground/70 select-none">{idx + 1}</span>
              <span className="flex-1 font-mono truncate" title={mig.originalName}>
                {mig.originalName}
              </span>
              <span className="w-2 text-muted-foreground mx-2">&#8594;</span>
              <span className="flex-1 font-mono truncate text-primary group-hover:underline" title={newFilename}>
                {newFilename}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
