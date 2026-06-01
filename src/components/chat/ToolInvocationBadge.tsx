"use client";

import { Loader2, FileEdit, FilePlus, FileSearch, FileX, FolderEdit, Undo2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolName: string;
  args?: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
  result?: unknown;
}

const TOOL_LABELS: Record<string, Record<string, { label: string; Icon: React.ElementType }>> = {
  str_replace_editor: {
    create:      { label: "Creating file",  Icon: FilePlus },
    str_replace: { label: "Editing file",   Icon: FileEdit },
    view:        { label: "Reading file",   Icon: FileSearch },
    insert:      { label: "Inserting code", Icon: FileEdit },
    undo_edit:   { label: "Undoing edit",   Icon: Undo2 },
    _default:    { label: "Editing code",   Icon: FileEdit },
  },
  file_manager: {
    rename:   { label: "Renaming file",  Icon: FolderEdit },
    delete:   { label: "Deleting file",  Icon: FileX },
    _default: { label: "Managing files", Icon: FolderEdit },
  },
};

function getLabel(toolName: string, args?: Record<string, unknown>) {
  const toolMap = TOOL_LABELS[toolName];
  if (!toolMap) return { label: toolName, Icon: FileEdit };
  const command = typeof args?.command === "string" ? args.command : "_default";
  return toolMap[command] ?? toolMap["_default"];
}

export function ToolInvocationBadge({ toolName, args, state, result }: ToolInvocationBadgeProps) {
  const isDone = state === "result" && result != null;
  const { label, Icon } = getLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-medium border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" data-testid="done-indicator" />
          <Icon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" data-testid="loading-indicator" />
          <Icon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
