
export const LARAVEL_MIGRATION_REGEX = /^\d{4}_\d{2}_\d{2}_\d{6}_.+\.php$/;

export function validateMigrationFile(name: string) {
  return LARAVEL_MIGRATION_REGEX.test(name);
}

export function stripTimestamp(name: string) {
  return name.replace(/^\d{4}_\d{2}_\d{2}_\d{6}_/, "");
}

export function getTableFromMigration(content: string): string | undefined {
  // Naive extraction for future bonus detection
  const match = content.match(/create(?:_|Table\(['"])(\w+)[^'"]*/);
  return match ? match[1] : undefined;
}

export function applyPrefix(name: string, prefix: string) {
  return prefix ? `${prefix}${name}` : name;
}

export function generateNewTimestamp(index: number, startDate = new Date()) {
  // Use current date, increment seconds per file
  const base = new Date(startDate.getTime() + index * 1000);
  const y = base.getFullYear();
  const mo = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  const hms =
    String(base.getHours()).padStart(2, "0") +
    String(base.getMinutes()).padStart(2, "0") +
    String(base.getSeconds()).padStart(2, "0");
  return `${y}_${mo}_${d}_${hms}`;
}
