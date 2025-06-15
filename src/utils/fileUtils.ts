
const LARAVEL_PATTERN = /^\d{4}_\d{2}_\d{2}_\d{6}_.+\.php$/;

export function validateLaravelMigrationFile(name: string) {
  return LARAVEL_PATTERN.test(name);
}

export function stripLaravelTimestamp(name: string) {
  return name.replace(/^\d{4}_\d{2}_\d{2}_\d{6}_/, "");
}

export function extractTableName(name: string) {
  const match = name.match(/_(create|update|add|drop|delete)_(.+)_table\.php$/i);
  return match ? match[2] : undefined;
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
