
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

export function generateNewFilename(
  index: number,
  originalName: string,
  settings: {
    prefix: string;
    removeTimestamp: boolean;
    useCounter: boolean;
  }
) {
  let name = originalName;
  if (settings.removeTimestamp) {
    name = stripLaravelTimestamp(name);
  }
  if (settings.useCounter) {
    name = `${String(index + 1).padStart(3, "0")}_${name}`;
  }
  // Remove old prefix if present
  if (settings.prefix && !name.startsWith(settings.prefix)) {
    name = settings.prefix + name;
  }
  return name;
}

export function getRenamingMap(files: string[], settings: any): Record<string, string> {
  return Object.fromEntries(
    files.map((original, i) => [
      original,
      generateNewFilename(i, original, settings)
    ])
  );
}
