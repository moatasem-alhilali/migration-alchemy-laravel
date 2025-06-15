
import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
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
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File;
  originalName: string;
  defaultValue: string;
};

export default function MigrationFileDialogEditor({
  open,
  onOpenChange,
  file,
  originalName,
  defaultValue
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [fileContents, setFileContents] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setCustomName = useFileStore((s) => s.setCustomName);
  const resetCustomNames = useFileStore((s) => s.resetCustomNames);

  // Cache for future openings
  const fileContentCache = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, open]);

  // Fetch file contents (cache per originalName)
  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    const cacheKey = originalName;
    if (fileContentCache.current[cacheKey] != null) {
      setFileContents(fileContentCache.current[cacheKey]);
      setLoading(false);
      return;
    }
    file
      .text()
      .then((txt) => {
        fileContentCache.current[cacheKey] = txt;
        setFileContents(txt);
        setLoading(false);
      })
      .catch((e) => {
        setFileContents("");
        setLoading(false);
        setError("Could not load file contents");
      });
  }, [file, originalName, open]);

  function handleSave() {
    if (value !== defaultValue) {
      setCustomName(originalName, value);
      toast({
        title: "Filename updated",
        description: "Migration filename was changed for this file.",
      });
    }
    onOpenChange(false);
  }

  function handleReset() {
    setValue(defaultValue);
    setCustomName(originalName, "");
    toast({ title: "Reverted to auto filename." });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 focus:outline-none">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit Migration File</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-3">
          {/* Filename section */}
          <div className="mb-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">
                Original Name:
              </label>
              <div className="w-full rounded bg-muted/40 py-1.5 px-3 text-xs font-mono border text-muted-foreground select-all">
                {originalName}
              </div>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-mono mb-1">
                  Preview Name:
                </label>
                <Input
                  className="font-mono"
                  value={value}
                  autoFocus
                  onChange={e => setValue(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-xs mb-1"
                onClick={handleReset}
              >
                Reset to auto
              </Button>
            </div>
          </div>
          {/* File content preview */}
          <label className="block text-xs font-mono text-muted-foreground mb-1">
            Preview File Content
          </label>
          <div className="rounded bg-neutral-900 p-3 mb-2 max-h-[300px] overflow-auto border font-mono text-sm text-neutral-100 whitespace-pre-wrap leading-tight relative">
            {loading ? (
              <div className="flex items-center justify-center h-28">
                <Loader2 className="animate-spin" size={22}/>
                <span className="ml-2 text-xs text-neutral-300">Loading…</span>
              </div>
            ) : error ? (
              <span className="text-red-400 text-xs">{error}</span>
            ) : (
              <code>{fileContents}</code>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 px-6 pb-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={handleSave}
            disabled={value.trim().length === 0}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
