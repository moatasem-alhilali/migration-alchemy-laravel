
import { create } from "zustand";

export type MigrationFile = {
  file: File;
  originalName: string;
  valid: boolean;
  table?: string;
  error?: string;
};

export type MigrationSettings = {
  prefix: string;
  removeTimestamp: boolean;
  useCounter: boolean;
};

type FileStore = {
  files: MigrationFile[];
  setFiles: (files: MigrationFile[]) => void;
  reorderFiles: (from: number, to: number) => void;
  clearFiles: () => void;
  settings: MigrationSettings;
  setPrefix: (prefix: string) => void;
  toggleRemoveTimestamp: () => void;
  toggleUseCounter: () => void;
};

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  setFiles: (files) => set({ files }),
  reorderFiles: (from, to) => {
    const arr = [...get().files];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    set({ files: arr });
  },
  clearFiles: () => set({ files: [] }),
  settings: {
    prefix: "",
    removeTimestamp: false,
    useCounter: false,
  },
  setPrefix: (prefix) =>
    set((state) => ({ settings: { ...state.settings, prefix } })),
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
}));
