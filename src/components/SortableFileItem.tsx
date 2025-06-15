"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, AlertCircle, Pencil } from "lucide-react";
import { useFileStore } from "@/stores/fileStore";
import FileManualRenameInput from "./FileManualRenameInput";

type Props = {
  id: string;
  index: number;
  originalName: string;
  newName: string;
  valid: boolean;
  error?: string;
  customName?: string;
};

export default function SortableFileItem({
  id,
  index,
  originalName,
  newName,
  valid,
  error,
  customName,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [editing, setEditing] = useState(false);
  const setCustomName = useFileStore(s => s.setCustomName);

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: isDragging ? "var(--tw-prose-bg-muted)" : undefined
      }}
      className="flex items-center px-1 py-3 hover:bg-muted transition-colors group"
    >
      <span className="font-mono text-sm w-9 text-foreground/70 select-none">{index + 1}</span>
      <span className="mr-2 flex items-center justify-center cursor-grab" {...attributes} {...listeners}>
        <GripVertical size={16} className="text-muted-foreground opacity-60" />
      </span>
      <span className={`flex-1 font-mono truncate ${!valid ? "text-red-700" : ""}`}
        title={originalName}
      >
        {originalName}
        {!valid && <AlertCircle size={15} className="inline ml-1 text-red-700 align-text-bottom" />}
      </span>
      {/* Edit (manual rename) icon */}
      <span className="mx-1">
        {!editing ? (
          <button
            type="button"
            title="Edit filename"
            className="text-muted-foreground hover:text-primary"
            onClick={e => { e.stopPropagation(); setEditing(true); }}
          >
            <Pencil size={15} />
          </button>
        ) : (
          <FileManualRenameInput
            current={customName || newName}
            onSave={(val) => {
              setCustomName(originalName, val);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}
      </span>
      <span className="w-2 mx-2 text-muted-foreground">&#8594;</span>
      <span className={`flex-1 font-mono truncate text-primary group-hover:underline ${customName ? "font-semibold" : ""}`}
        title={newName}
      >
        {customName || newName}
      </span>
    </li>
  );
}
