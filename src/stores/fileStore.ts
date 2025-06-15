
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RenameMode = "timestamp" | "incremental" | "prefix" | "suffix" | "manual";

export type MigrationFile = {
  file: File;
  originalName: string;
  valid: boolean;
  table?: string;
  error?: string;
};

export type MigrationSettings = {
  prefix: string;
  suffix: string;
  removeTimestamp: boolean;
  useCounter: boolean; // still needed for special use?
};

type FileStore = {
  files: MigrationFile[];
  setFiles: (files: MigrationFile[]) => void;
  reorderFiles: (from: number, to: number) => void;
  clearFiles: () => void;
  settings: MigrationSettings;
  setPrefix: (prefix: string) => void;
  setSuffix: (suffix: string) => void;
  toggleRemoveTimestamp: () => void;
  toggleUseCounter: () => void;
  // Manual rename
  customNames: Record<string, string>;
  setCustomName: (originalName: string, custom: string) => void;
  resetCustomNames: () => void;
  // Rename mode/presets
  renameMode: RenameMode;
  setRenameMode: (mode: RenameMode) => void;
  // History for undo smart sorting
  fileOrderHistory: MigrationFile[][];
  pushFileOrderHistory: (files: MigrationFile[]) => void;
  undoFileOrder: () => void;
  // LocalStorage helpers
  saveToLocal: () => void;
  hydrateFromLocal: (force?: boolean) => void;
  clearLocal: () => void;
};

const LOCAL_KEY = "migration_master__state";

function serializeFiles(files: MigrationFile[]) {
  // Serializes meta but not File objects (which can't be directly serialized)
  return files.map(f => ({
    originalName: f.originalName,
    valid: f.valid,
    table: f.table,
    error: f.error
  }));
}
function unserializeFiles(arr: any[], storedFiles: MigrationFile[] | undefined): MigrationFile[] {
  // Must rely on File blobs being missing after reload
  if (!arr) return [];
  // Try to re-pair with already loaded File objects on page (when available)
  if (!storedFiles) return arr;
  return arr.map(({ originalName, ...meta }) => {
    let fileObj = storedFiles.find(f => f.originalName === originalName)?.file;
    return {
      ...meta,
      originalName,
      file: fileObj || undefined,
    };
  });
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  setFiles: (files) => {
    set({ files });
    set({ customNames: {} });
    get().saveToLocal();
  },
  reorderFiles: (from, to) => {
    const arr = [...get().files];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    set({ files: arr });
    get().saveToLocal();
  },
  clearFiles: () => {
    set({ files: [], customNames: {}, fileOrderHistory: [] });
    get().saveToLocal();
  },
  settings: {
    prefix: "",
    suffix: "",
    removeTimestamp: false,
    useCounter: false,
  },
  setPrefix: (prefix) =>
    set((state) => {
      const next = { settings: { ...state.settings, prefix } };
      setTimeout(get().saveToLocal, 80);
      return next;
    }),
  setSuffix: (suffix) =>
    set((state) => {
      const next = { settings: { ...state.settings, suffix } };
      setTimeout(get().saveToLocal, 80);
      return next;
    }),
  toggleRemoveTimestamp: () =>
    set((state) => {
      const next = {
        settings: {
          ...state.settings,
          removeTimestamp: !state.settings.removeTimestamp,
        },
      };
      setTimeout(get().saveToLocal, 80);
      return next;
    }),
  toggleUseCounter: () =>
    set((state) => {
      const next = {
        settings: {
          ...state.settings,
          useCounter: !state.settings.useCounter,
        },
      };
      setTimeout(get().saveToLocal, 80);
      return next;
    }),
  customNames: {},
  setCustomName: (originalName, custom) =>
    set((state) => {
      setTimeout(get().saveToLocal, 80);
      return {
        customNames: {
          ...state.customNames,
          [originalName]: custom,
        },
      };
    }),
  resetCustomNames: () => {
    set({ customNames: {} });
    setTimeout(get().saveToLocal, 80);
  },
  // New: Rename mode/preset
  renameMode: "timestamp",
  setRenameMode: (mode) => {
    set({ renameMode: mode });
    setTimeout(get().saveToLocal, 80);
  },
  // Smart Sorting (undo support)
  fileOrderHistory: [],
  pushFileOrderHistory: (files) => {
    set((state) => ({
      fileOrderHistory: [...state.fileOrderHistory, files],
    }));
    setTimeout(get().saveToLocal, 100);
  },
  undoFileOrder: () => {
    set((state) => {
      if (state.fileOrderHistory.length < 1) return {};
      const prev = state.fileOrderHistory[state.fileOrderHistory.length - 1];
      setTimeout(get().saveToLocal, 80);
      return {
        files: prev,
        fileOrderHistory: state.fileOrderHistory.slice(0, -1),
      };
    });
  },
  // LocalStorage helpers
  saveToLocal: () => {
    const state = get();
    // Save just meta for files, not File objects (can't be serialized)
    const data = {
      filesMeta: serializeFiles(state.files),
      settings: state.settings,
      customNames: state.customNames,
      renameMode: state.renameMode,
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  },
  hydrateFromLocal: (force = false) => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      set((state) => ({
        files: force
          ? state.files // Keep files as-is (for compatibility)
          : parsed.filesMeta
            ? unserializeFiles(parsed.filesMeta, state.files)
            : [],
        settings: parsed.settings || state.settings,
        customNames: parsed.customNames || {},
        renameMode: parsed.renameMode || "timestamp"
      }));
    } catch {}
  },
  clearLocal: () => {
    localStorage.removeItem(LOCAL_KEY);
  }
}));

// On first load, hydrate if localStorage present
if (typeof window !== "undefined") {
  try {
    useFileStore.getState().hydrateFromLocal?.();
  } catch {}
}

// Subscribe to changes for autosave
if (typeof window !== "undefined") {
  useFileStore.subscribe(() => {
    useFileStore.getState().saveToLocal?.();
  });
}
