
"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, AlertCircle } from "lucide-react";

type Props = {
  id: string;
  index: number;
  originalName: string;
  newName: string;
  valid: boolean;
  error?: string;
};

export default function SortableFileItem({ id, index, originalName, newName, valid, error }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

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
      <span className="w-2 mx-2 text-muted-foreground">&#8594;</span>
      <span className="flex-1 font-mono truncate text-primary group-hover:underline" title={newName}>
        {newName}
      </span>
    </li>
  );
}
