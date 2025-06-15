"use client";
import { useFileStore } from "@/stores/fileStore";
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { generateNewFilename, extractTableName } from "@/utils/fileUtils";
import SortableFileItem from "./SortableFileItem";
import { AlertTriangle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { suggestLogicalOrder } from "@/utils/fileUtils";
import { toast } from "@/hooks/use-toast";
import React from "react";

export default function MigrationList() {
  const files = useFileStore(s => s.files);
  const settings = useFileStore(s => s.settings);
  const setFiles = useFileStore(s => s.setFiles);
  const customNames = useFileStore(s => s.customNames);
  const renameMode = useFileStore(s => s.renameMode);
  const pushHistory = useFileStore(s => s.pushFileOrderHistory);
  const undoFileOrder = useFileStore(s => s.undoFileOrder);
  const fileOrderHistory = useFileStore(s => s.fileOrderHistory);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (files.length === 0) return null;

  // --- Table & Conflict Detection Logic ---
  // Map: tableName -> [indexes]
  const tableIndexes: Record<string, number[]> = {};
  files.forEach((f, i) => {
    const t = extractTableName(
      generateNewFilename(
        i,
        f.originalName,
        settings,
        customNames[f.originalName],
        renameMode
      )
    );
    if (t) {
      if (!tableIndexes[t]) tableIndexes[t] = [];
      tableIndexes[t].push(i);
    }
  });

  // Handle drag-and-drop
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = files.findIndex(f => f.originalName === active.id);
    const newIdx = files.findIndex(f => f.originalName === over.id);
    const reordered = arrayMove(files, oldIdx, newIdx);
    setFiles(reordered);
  }

  // Suggest Logical Order
  function handleSuggestOrder() {
    pushHistory(files); // Save for undo
    // Just pass files directly, result will be MigrationFile[]
    const sorted = suggestLogicalOrder(files);
    setFiles(sorted);
    toast({
      title: "Files reordered by logical structure",
      description: "Files have been reordered based on migration intent (create → add → update → drop → delete).",
    });
  }

  // Undo restoration
  function handleUndoOrder() {
    undoFileOrder();
    toast({
      title: "File order restored",
      description: "Previous file order has been restored.",
    });
  }

  // --- Render UI ---
  return (
    <section>
      {/* Suggest Order & Undo UI (above list) */}
      <div className="mb-3 flex flex-col sm:flex-row items-baseline gap-3">
        <Button variant="secondary" size="sm" onClick={handleSuggestOrder}>
          🔀 Suggest Logical Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndoOrder}
          disabled={fileOrderHistory.length === 0}
        >
          Undo
        </Button>
      </div>
      <div className="border border-muted rounded-lg bg-card/95 p-5 shadow-sm">
        <div className="flex font-mono text-xs text-muted-foreground mb-2 pl-1">
          <span className="w-9 mr-2">#</span>
          <span className="flex-1">Original Filename</span>
          <span className="w-2"></span>
          <span className="flex-1">New Filename Preview</span>
          <span className="w-40 pl-2">Affected Table</span>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={files.map(f => f.originalName)} strategy={verticalListSortingStrategy}>
            <ul className="divide-y border-t">
              {files.map((file, idx) => {
                const newName = generateNewFilename(
                  idx,
                  file.originalName,
                  settings,
                  useFileStore.getState().customNames[file.originalName],
                  renameMode
                );
                const customName = useFileStore.getState().customNames[file.originalName];
                const highlightChanged = file.originalName !== newName;
                // Table extraction with current name
                const affectedTable = extractTableName(newName);
                // Conflict: is this table name shared?
                const isConflict = affectedTable && tableIndexes[affectedTable]?.length > 1;
                const conflictMsg =
                  isConflict && affectedTable
                    ? `Multiple files affect the "${affectedTable}" table`
                    : "";

                return (
                  <React.Fragment key={file.originalName}>
                    <SortableFileItem
                      id={file.originalName}
                      index={idx}
                      originalName={file.originalName}
                      newName={newName}
                      valid={file.valid}
                      error={file.error}
                      customName={customName}
                      highlightChanged={highlightChanged}
                      renameMode={renameMode}
                      // Pass conflict/highlight info to FileItem for style
                      affectedTable={affectedTable}
                      conflict={isConflict}
                      conflictMsg={conflictMsg}
                    />
                  </React.Fragment>
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
