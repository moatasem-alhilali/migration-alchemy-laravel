"use client";
import { useFileStore } from "@/stores/fileStore";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const PRESETS = [
  { value: "timestamp", label: "Default (Timestamp)" },
  { value: "incremental", label: "Ordered (001_...)" },
  { value: "prefix", label: "Prefix Only" },
  { value: "suffix", label: "Suffix Only" },
  { value: "manual", label: "Custom Manual" },
];

export default function UtilitiesPanel() {
  const settings = useFileStore(s => s.settings);
  const setPrefix = useFileStore(s => s.setPrefix);
  const setSuffix = useFileStore(s => s.setSuffix);
  const toggleRemoveTimestamp = useFileStore(s => s.toggleRemoveTimestamp);
  const resetCustomNames = useFileStore(s => s.resetCustomNames);
  const renameMode = useFileStore(s => s.renameMode);
  const setRenameMode = useFileStore(s => s.setRenameMode);

  // Group UI state for prefix/suffix batch apply
  const [prefixDraft, setPrefixDraft] = useState(settings.prefix);
  const [suffixDraft, setSuffixDraft] = useState(settings.suffix);

  // Determine which controls are disabled based on renameMode
  const prefixDisabled = renameMode === "suffix";
  const suffixDisabled = renameMode === "prefix";
  const manualDisabled = renameMode !== "manual";

  return (
    <section className="flex flex-col gap-4 border border-muted rounded-md bg-card/95 p-4 shadow-sm">
      {/* Quick Rename Mode */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
        <div className="flex-1 flex flex-wrap gap-4 items-center font-mono">
          <label className="text-xs text-muted-foreground">Quick Rename Mode:</label>
          <select
            value={renameMode}
            onChange={e => {
              setRenameMode(e.target.value as any);
              if (e.target.value !== "manual") resetCustomNames();
            }}
            className="max-w-[200px] text-xs bg-muted rounded px-2 py-1 border"
            title="Select how filenames should be transformed"
          >
            {PRESETS.map(p => (
              <option value={p.value} key={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Controls group */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 font-mono">
        {/* Prefix group */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground">Prefix</label>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Custom prefix..."
              className="max-w-[120px] font-mono"
              value={prefixDraft}
              onChange={e => setPrefixDraft(e.target.value)}
              disabled={prefixDisabled}
            />
            <Button
              size="sm"
              onClick={() => setPrefix(prefixDraft)}
              variant="secondary"
              className="font-mono"
              disabled={prefixDisabled}
            >
              Apply to all
            </Button>
          </div>
        </div>
        {/* Suffix group */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground">Suffix</label>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Suffix (before .php)..."
              className="max-w-[120px] font-mono"
              value={suffixDraft}
              onChange={e => setSuffixDraft(e.target.value)}
              disabled={suffixDisabled}
            />
            <Button
              size="sm"
              onClick={() => setSuffix(suffixDraft)}
              variant="secondary"
              className="font-mono"
              disabled={suffixDisabled}
            >
              Apply to all
            </Button>
          </div>
        </div>
        {/* Remove timestamp group */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground">Options</label>
          <div className="flex gap-2 items-center">
            <Switch checked={settings.removeTimestamp} onCheckedChange={toggleRemoveTimestamp} />
            <span className="text-xs">Remove timestamp</span>
          </div>
        </div>
        {/* Reset group */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground">Reset</label>
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
