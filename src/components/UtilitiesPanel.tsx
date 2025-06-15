
"use client";
import { useFileStore } from "@/stores/fileStore";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function UtilitiesPanel() {
  const settings = useFileStore(s => s.settings);
  const setPrefix = useFileStore(s => s.setPrefix);
  const setSuffix = useFileStore(s => s.setSuffix);
  const toggleRemoveTimestamp = useFileStore(s => s.toggleRemoveTimestamp);
  const toggleUseCounter = useFileStore(s => s.toggleUseCounter);
  const resetCustomNames = useFileStore(s => s.resetCustomNames);

  return (
    <section className="flex flex-col gap-4 border border-muted rounded-md bg-card/95 p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
        <div className="flex-1 flex gap-2 items-center font-mono">
          <Input
            placeholder="Custom prefix..."
            className="max-w-[120px] font-mono"
            value={settings.prefix}
            onChange={e => setPrefix(e.target.value)}
          />
          <Input
            placeholder="Suffix (before .php)..."
            className="max-w-[120px] font-mono"
            value={settings.suffix}
            onChange={e => setSuffix(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => { setPrefix(""); setSuffix(""); }}
            variant="secondary"
            className="font-mono"
          >
            Clear Prefix/Suffix
          </Button>
        </div>
        <div className="flex-1 flex items-center gap-3 font-mono">
          <Switch checked={settings.removeTimestamp} onCheckedChange={toggleRemoveTimestamp} />
          <span>Remove Laravel timestamp</span>
        </div>
        <div className="flex-1 flex items-center gap-3 font-mono">
          <Switch checked={settings.useCounter} onCheckedChange={toggleUseCounter} />
          <span>Rename with ordered counter</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="font-mono"
            onClick={resetCustomNames}
            type="button"
            title="Reset all file custom names back to original"
          >
            Reset All Filenames
          </Button>
        </div>
      </div>
    </section>
  );
}
