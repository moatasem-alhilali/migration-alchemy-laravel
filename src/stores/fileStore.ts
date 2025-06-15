
import { create } from "zustand";

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
};

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  setFiles: (files) => {
    set({ files });
    set({ customNames: {} });
  },
  reorderFiles: (from, to) => {
    const arr = [...get().files];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    set({ files: arr });
  },
  clearFiles: () => set({ files: [], customNames: {}, fileOrderHistory: [] }),
  settings: {
    prefix: "",
    suffix: "",
    removeTimestamp: false,
    useCounter: false,
  },
  setPrefix: (prefix) =>
    set((state) => ({ settings: { ...state.settings, prefix } })),
  setSuffix: (suffix) =>
    set((state) => ({ settings: { ...state.settings, suffix } })),
  toggleRemoveTimestamp: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        removeTimestamp: !state.settings.removeTimestamp,
      },
    })),
  toggleUseCounter: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        useCounter: !state.settings.useCounter,
      },
    })),
  customNames: {},
  setCustomName: (originalName, custom) =>
    set((state) => ({
      customNames: {
        ...state.customNames,
        [originalName]: custom,
      },
    })),
  resetCustomNames: () => set({ customNames: {} }),
  // New: Rename mode/preset
  renameMode: "timestamp",
  setRenameMode: (mode) => set({ renameMode: mode }),
  // Smart Sorting (undo support)
  fileOrderHistory: [],
  pushFileOrderHistory: (files) => {
    set((state) => ({
      fileOrderHistory: [...state.fileOrderHistory, files],
    }));
  },
  undoFileOrder: () => {
    set((state) => {
      if (state.fileOrderHistory.length < 1) return {};
      const prev = state.fileOrderHistory[state.fileOrderHistory.length - 1];
      return {
        files: prev,
        fileOrderHistory: state.fileOrderHistory.slice(0, -1),
      };
    });
  },
}));

