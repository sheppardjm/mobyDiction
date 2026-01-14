import { create } from 'zustand';

interface EditorStore {
  // State
  text: string;
  originalText: string;
  isDirty: boolean;
  externalVersion: number; // Incremented when text is set externally (import, document switch)

  // Actions
  setText: (text: string) => void;
  setTextExternal: (text: string) => void; // Use for import/document switch to trigger editor sync
  setOriginalText: (text: string) => void;
  applyEdit: (offset: number, length: number, replacement: string) => void;
  resetToOriginal: () => void;
  markDirty: (isDirty: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  text: '',
  originalText: '',
  isDirty: false,
  externalVersion: 0,

  // Actions
  setText: (text) => {
    set({ text, isDirty: text !== get().originalText });
  },

  setTextExternal: (text) => {
    set((state) => ({
      text,
      isDirty: text !== get().originalText,
      externalVersion: state.externalVersion + 1,
    }));
  },

  setOriginalText: (text) => {
    set({ originalText: text });
  },

  applyEdit: (offset, length, replacement) => {
    const { text } = get();
    const before = text.substring(0, offset);
    const after = text.substring(offset + length);
    const newText = before + replacement + after;
    set((state) => ({
      text: newText,
      isDirty: true,
      externalVersion: state.externalVersion + 1,
    }));
  },

  resetToOriginal: () => {
    const { originalText } = get();
    set({ text: originalText, isDirty: false });
  },

  markDirty: (isDirty) => set({ isDirty }),
}));
