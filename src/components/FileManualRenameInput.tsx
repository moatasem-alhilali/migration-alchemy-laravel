
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FileManualRenameInput({
  current,
  onSave,
  onCancel,
}: {
  current: string;
  onSave: (val: string) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(current);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-2">
      <Input
        ref={ref}
        type="text"
        className="max-w-[240px] font-mono text-xs"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            onSave(val);
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        autoFocus
      />
      <Button size="sm" onClick={() => onSave(val)} title="Save">
        Save
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} title="Cancel">
        Cancel
      </Button>
    </div>
  );
}
