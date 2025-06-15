"use client";
import { useFileStore } from "@/stores/fileStore";
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { generateNewFilename } from "@/utils/fileUtils";
import SortableFileItem from "./SortableFileItem";

export default function MigrationList() {
  const files = useFileStore(s => s.files);
  const settings = useFileStore(s => s.settings);
  const setFiles = useFileStore(s => s.setFiles);
  const customNames = useFileStore(s => s.customNames);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (files.length === 0) return null;

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = files.findIndex(f => f.originalName === active.id);
    const newIdx = files.findIndex(f => f.originalName === over.id);
    const reordered = arrayMove(files, oldIdx, newIdx);
    setFiles(reordered);
  }

  return (
    <section className="border border-muted rounded-lg bg-card/95 p-5 shadow-sm">
      <div className="flex font-mono text-xs text-muted-foreground mb-2 pl-1">
        <span className="w-9 mr-2">#</span>
        <span className="flex-1">Original Filename</span>
        <span className="w-2"></span>
        <span className="flex-1">New Filename Preview</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={files.map(f => f.originalName)} strategy={verticalListSortingStrategy}>
          <ul className="divide-y border-t">
            {files.map((file, idx) => (
              <SortableFileItem
                key={file.originalName}
                id={file.originalName}
                index={idx}
                originalName={file.originalName}
                newName={generateNewFilename(idx, file.originalName, settings, customNames[file.originalName])}
                valid={file.valid}
                error={file.error}
                customName={customNames[file.originalName]}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}
