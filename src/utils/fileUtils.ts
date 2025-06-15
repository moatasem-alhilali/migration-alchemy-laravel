const LARAVEL_PATTERN = /^\d{4}_\d{2}_\d{2}_\d{6}_.+\.php$/;

export function validateLaravelMigrationFile(name: string) {
  return LARAVEL_PATTERN.test(name);
}

export function stripLaravelTimestamp(name: string) {
  return name.replace(/^\d{4}_\d{2}_\d{2}_\d{6}_/, "");
}

// Enhanced: Parse various migration patterns to get affected table name.
export function extractTableName(name: string) {
  // Sanitize (remove .php)
  const filename = name.replace(/\.php$/, "");
  // Common patterns
  let m;
  // create_{table}_table
  m = filename.match(/create_(.+)_table$/i);
  if (m) return m[1];
  // add_{columns}_to_{table}_table
  m = filename.match(/add_.+_to_(.+)_table$/i);
  if (m) return m[1];
  // drop_{columns}_from_{table}_table
  m = filename.match(/drop_.+_from_(.+)_table$/i);
  if (m) return m[1];
  // update_{table}_table
  m = filename.match(/update_(.+)_table$/i);
  if (m) return m[1];
  // delete_{table}_table
  m = filename.match(/delete_(.+)_table$/i);
  if (m) return m[1];
  return undefined;
}

// Suggest logical order based on migration operation
export function suggestLogicalOrder(
  files: { originalName: string; [key: string]: any }[]
): { originalName: string; [key: string]: any }[] {
  // Order: create > add > update > drop > delete > others (alphabetical within group)
  function getKind(filename: string) {
    const n = filename.toLowerCase();
    if (/^create_.*_table(\.php)?$/.test(n)) return 0;
    if (/^add_.*_to_.*_table(\.php)?$/.test(n)) return 1;
    if (/^update_.*_table(\.php)?$/.test(n)) return 2;
    if (/^drop_.*_from_.*_table(\.php)?$/.test(n)) return 3;
    if (/^delete_.*_table(\.php)?$/.test(n)) return 4;
    return 5;
  }
  // Stable sort: kind, then table, then filename
  return [...files].sort((a, b) => {
    const ka = getKind(a.originalName);
    const kb = getKind(b.originalName);
    if (ka !== kb) return ka - kb;
    // By table name if possible
    const ta = extractTableName(a.originalName) || "";
    const tb = extractTableName(b.originalName) || "";
    if (ta !== tb) return ta.localeCompare(tb);
    // Else alphabetically
    return a.originalName.localeCompare(b.originalName);
  });
}

// Main filename generator now depends on global renameMode
export function generateNewFilename(
  index: number,
  originalName: string,
  settings: {
    prefix: string;
    suffix: string;
    removeTimestamp: boolean;
    useCounter: boolean;
  },
  customName?: string,
  renameMode: "timestamp" | "incremental" | "prefix" | "suffix" | "manual" = "timestamp"
) {
  // Mode selection for file naming
  let finalName = originalName;

  // Manual always overrides everything
  if (renameMode === "manual" && customName) {
    return customName.endsWith(".php") ? customName : customName + ".php";
  }

  // Remove .php for suffix + re-add at end
  let baseName = originalName.replace(/\.php$/, "");
  if (renameMode === "timestamp") {
    // Optionally remove timestamp
    if (settings.removeTimestamp) baseName = stripLaravelTimestamp(baseName);
    if (settings.prefix) baseName = settings.prefix + baseName;
    if (settings.suffix) baseName = baseName + settings.suffix;
    finalName = baseName + ".php";
  } else if (renameMode === "incremental") {
    baseName = originalName;
    if (settings.removeTimestamp) baseName = stripLaravelTimestamp(baseName);
    baseName = baseName.replace(/\.php$/, "");
    let numbered = `${String(index + 1).padStart(3, "0")}_${baseName}`;
    if (settings.prefix) numbered = settings.prefix + numbered;
    if (settings.suffix) numbered = numbered + settings.suffix;
    finalName = numbered + ".php";
  } else if (renameMode === "prefix") {
    baseName = originalName.replace(/\.php$/, "");
    if (settings.prefix && !baseName.startsWith(settings.prefix)) baseName = settings.prefix + baseName;
    finalName = baseName + ".php";
  } else if (renameMode === "suffix") {
    baseName = originalName.replace(/\.php$/, "");
    if (settings.suffix && !baseName.endsWith(settings.suffix)) baseName = baseName + settings.suffix;
    finalName = baseName + ".php";
  }
  return finalName;
}

export function getRenamingMap(
  files: string[],
  settings: any,
  customNames: Record<string, string> = {},
  renameMode: "timestamp" | "incremental" | "prefix" | "suffix" | "manual" = "timestamp"
): Record<string, string> {
  return Object.fromEntries(
    files.map((original, i) => [
      original,
      generateNewFilename(i, original, settings, customNames[original], renameMode)
    ])
  );
}
