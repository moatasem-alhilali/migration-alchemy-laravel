
import { create } from "zustand";

type MigrationFile = {
  file: File;
  originalName: string;
  sha1: string;
  valid: boolean;
  reason?: string;
  table?: string; // will try to extract main table if possible (for future)
};

type MigrationSettings = {
  prefix: string;
  preserveNames: boolean;
};

interface MigrationState {
  migrations: MigrationFile[];
  setMigrations: (files: MigrationFile[]) => void;
  moveMigration: (from: number, to: number) => void;
  clear: () => void;
  setPrefix: (prefix: string) => void;
  setPreserveNames: (v: boolean) => void;
  settings: MigrationSettings;
}

export const useMigrationStore = create<MigrationState>((set, get) => ({
  migrations: [],
  setMigrations: (files) => set({ migrations: files }),
  moveMigration: (from, to) => {
    const migs = [...get().migrations];
    const [removed] = migs.splice(from, 1);
    migs.splice(to, 0, removed);
    set({ migrations: migs });
  },
  clear: () => set({ migrations: [] }),
  settings: {
    prefix: "",
    preserveNames: false
  },
  setPrefix: (prefix: string) =>
    set((state) => ({ settings: { ...state.settings, prefix } })),
  setPreserveNames: (v: boolean) =>
    set((state) => ({ settings: { ...state.settings, preserveNames: v } })),
}));
