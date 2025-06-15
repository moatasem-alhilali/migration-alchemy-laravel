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

// New: supports customName, suffix, prefix, etc
export function generateNewFilename(
  index: number,
  originalName: string,
  settings: {
    prefix: string;
    suffix: string;
    removeTimestamp: boolean;
    useCounter: boolean;
  },
  customName?: string
) {
  // If manual rename is set, use it, else transform
  let name = customName
    ? customName.endsWith(".php")
      ? customName
      : customName + ".php"
    : originalName;

  if (settings.removeTimestamp && !customName) {
    name = stripLaravelTimestamp(name);
  }
  // Always remove ".php" for suffix + re-add at end
  let baseName = name.replace(/\.php$/, "");

  if (settings.suffix && !baseName.endsWith(settings.suffix)) {
    baseName = baseName + settings.suffix;
  }

  if (settings.useCounter && !customName) {
    baseName = `${String(index + 1).padStart(3, "0")}_${baseName}`;
  }

  if (settings.prefix && !baseName.startsWith(settings.prefix)) {
    baseName = settings.prefix + baseName;
  }

  // Clean up: avoid double prefix if manual rename
  return baseName.endsWith(".php") ? baseName : baseName + ".php";
}

export function getRenamingMap(files: string[], settings: any, customNames: Record<string, string> = {}): Record<string, string> {
  return Object.fromEntries(
    files.map((original, i) => [
      original,
      generateNewFilename(i, original, settings, customNames[original])
    ])
  );
}
