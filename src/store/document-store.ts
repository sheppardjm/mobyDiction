import { create } from "zustand";
import type { Id } from "../../convex/_generated/dataModel";

interface DocumentState {
  currentDocumentId: Id<"documents"> | null;
  currentDocumentTitle: string;
  isDirty: boolean;
  isDocumentsPanelOpen: boolean;

  setCurrentDocument: (id: Id<"documents"> | null, title: string) => void;
  setDirty: (dirty: boolean) => void;
  clearDocument: () => void;
  toggleDocumentsPanel: () => void;
  setDocumentsPanelOpen: (open: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  currentDocumentId: null,
  currentDocumentTitle: "",
  isDirty: false,
  isDocumentsPanelOpen: false,

  setCurrentDocument: (id, title) =>
    set({ currentDocumentId: id, currentDocumentTitle: title, isDirty: false }),

  setDirty: (dirty) => set({ isDirty: dirty }),

  clearDocument: () =>
    set({ currentDocumentId: null, currentDocumentTitle: "", isDirty: false }),

  toggleDocumentsPanel: () =>
    set((state) => ({ isDocumentsPanelOpen: !state.isDocumentsPanelOpen })),

  setDocumentsPanelOpen: (open) => set({ isDocumentsPanelOpen: open }),
}));
