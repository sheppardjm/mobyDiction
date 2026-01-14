import { create } from 'zustand';
import type { Id } from '../../convex/_generated/dataModel';

interface DocumentsStore {
  currentDocumentId: Id<"documents"> | null;
  currentDocumentTitle: string;
  isDocumentListOpen: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  setCurrentDocumentId: (id: Id<"documents"> | null) => void;
  setCurrentDocumentTitle: (title: string) => void;
  openDocumentList: () => void;
  closeDocumentList: () => void;
  toggleDocumentList: () => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date | null) => void;
  clearDocument: () => void;
}

export const useDocumentsStore = create<DocumentsStore>((set) => ({
  currentDocumentId: null,
  currentDocumentTitle: 'Untitled',
  isDocumentListOpen: false,
  isSaving: false,
  lastSaved: null,

  setCurrentDocumentId: (id) => set({ currentDocumentId: id }),
  setCurrentDocumentTitle: (title) => set({ currentDocumentTitle: title }),
  openDocumentList: () => set({ isDocumentListOpen: true }),
  closeDocumentList: () => set({ isDocumentListOpen: false }),
  toggleDocumentList: () => set((state) => ({ isDocumentListOpen: !state.isDocumentListOpen })),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),
  clearDocument: () => set({
    currentDocumentId: null,
    currentDocumentTitle: 'Untitled',
    lastSaved: null,
  }),
}));
