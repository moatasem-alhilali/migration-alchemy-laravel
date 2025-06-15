"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, AlertCircle, Pencil, AlertTriangle, Eye } from "lucide-react";
import { useFileStore } from "@/stores/fileStore";
import FileManualRenameInput from "./FileManualRenameInput";
import FileNameDialogEditor from "./FileNameDialogEditor";
import MigrationFileDialogEditor from "./MigrationFileDialogEditor";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type Props = {
  id: string;
  index: number;
  originalName: string;
  newName: string;
  valid: boolean;
  error?: string;
  customName?: string;
  highlightChanged?: boolean;
  renameMode?: string;
  affectedTable?: string;
  conflict?: boolean;
  conflictMsg?: string;
};

export default function SortableFileItem({
  id,
  index,
  originalName,
  newName,
  valid,
  error,
  customName,
  highlightChanged,
  renameMode,
  affectedTable,
  conflict,
  conflictMsg,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const setCustomName = useFileStore(s => s.setCustomName);

  // Find matching file object for preview
  // This lookup is required so modal gets the file: File reference!
  const fileObj = useFileStore.getState().files.find(
    (f) => f.originalName === originalName
  )?.file;

  // Highlight logic (add warning if table conflict)
  let highlightClass = highlightChanged
    ? "bg-blue-50 border-l-4 border-blue-300"
    : "bg-muted/10";
  if (conflict) highlightClass = "bg-yellow-50 border-l-4 border-yellow-400";

  // Badge for rename mode
  const modeLabel =
    renameMode === "manual"
      ? "Manual"
      : renameMode === "incremental"
      ? "Incremental"
      : renameMode === "prefix"
      ? "Prefix"
      : renameMode === "suffix"
      ? "Suffix"
      : "Timestamp";

  const badgeColor =
    renameMode === "manual"
      ? "bg-yellow-200 text-yellow-800"
      : renameMode === "incremental"
      ? "bg-blue-200 text-blue-800"
      : renameMode === "prefix"
      ? "bg-green-200 text-green-700"
      : renameMode === "suffix"
      ? "bg-purple-200 text-purple-800"
      : "bg-gray-200 text-gray-700";

  return (
    <>
      <li
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.4 : 1,
          background: isDragging ? "var(--tw-prose-bg-muted)" : undefined
        }}
        className={`flex items-center px-1 py-3 hover:bg-muted transition-colors group relative ${highlightClass}`}
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
        <span className="mx-1 flex items-center gap-0.5">
          {!editing ? (
            <button
              type="button"
              title="Edit filename"
              className="text-muted-foreground hover:text-primary"
              onClick={e => { e.stopPropagation(); setEditing(true); }}
              disabled={renameMode !== "manual"}
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
          {/* Eye (view/edit modal) icon - always enabled */}
          <span className="ml-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="hover:text-primary cursor-pointer"
                  title="View and Edit Migration File"
                  aria-label="View and Edit Migration File"
                  tabIndex={0}
                  onClick={e => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                >
                  <Eye size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                View and Edit Migration File
              </TooltipContent>
            </Tooltip>
          </span>
        </span>
        <span className="w-2 mx-2 text-muted-foreground">&#8594;</span>
        <span
          className={`flex-1 font-mono truncate group-hover:underline ${customName || highlightChanged ? "text-blue-700 font-semibold" : "text-muted-foreground"}`}
          title={newName}
        >
          {customName || newName}
          {/* Mode badge */}
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-normal align-middle select-none border ${badgeColor}`}
            title={`Rename mode: ${modeLabel}`}
            style={{ marginLeft: "0.5rem", minWidth: 60, display: "inline-block", verticalAlign: "middle" }}
          >
            {modeLabel}
          </span>
        </span>
        {/* Table/conflict column */}
        <span className="w-40 flex items-center justify-start ml-2 font-mono text-xs truncate relative">
          {affectedTable ? (
            <span className={conflict ? "text-yellow-700 font-semibold flex items-center" : ""}>
              {conflict ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center">
                      <AlertTriangle size={16} className="inline mr-1 text-yellow-700" />
                      <span>{affectedTable}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {conflictMsg || "Multiple files affect this table"}
                  </TooltipContent>
                </Tooltip>
              ) : (
                affectedTable
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </span>
      </li>
      {/* Modal dialog for viewing/editing filename and contents */}
      {fileObj && (
        <MigrationFileDialogEditor
          originalName={originalName}
          defaultValue={customName || newName}
          open={modalOpen}
          onOpenChange={setModalOpen}
          file={fileObj}
        />
      )}
    </>
  );
}
