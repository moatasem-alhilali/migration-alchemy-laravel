
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFileStore } from "@/stores/fileStore";
import { toast } from "@/hooks/use-toast";

type FileNameDialogEditorProps = {
  originalName: string;
  defaultValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FileNameDialogEditor: React.FC<FileNameDialogEditorProps> = ({
  originalName,
  defaultValue,
  open,
  onOpenChange
}) => {
  const [value, setValue] = useState(defaultValue);
  const setCustomName = useFileStore(s => s.setCustomName);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, open]);

  const handleSave = () => {
    setCustomName(originalName, value);
    toast({
      title: "Filename updated",
      description: "Migration filename was changed for this file."
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Migration Filename</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1">Original Filename</label>
            <div className="w-full rounded bg-muted/40 py-1.5 px-3 text-xs font-mono border border-muted text-muted-foreground select-all cursor-text">
              {originalName}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono mb-1">Preview Filename</label>
            <Input
              className="font-mono"
              value={value}
              autoFocus
              onChange={e => setValue(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} type="button" variant="default">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileNameDialogEditor;
