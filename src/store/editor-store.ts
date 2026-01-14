import { create } from 'zustand';

interface EditorStore {
  // State
  text: string;
  originalText: string;
  isDirty: boolean;

  // Actions
  setText: (text: string) => void;
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

  // Actions
  setText: (text) => {
    set({ text, isDirty: text !== get().originalText });
  },

  setOriginalText: (text) => {
    set({ originalText: text });
  },

  applyEdit: (offset, length, replacement) => {
    const { text } = get();
    const before = text.substring(0, offset);
    const after = text.substring(offset + length);
    const newText = before + replacement + after;
    set({ text: newText, isDirty: true });
  },

  resetToOriginal: () => {
    const { originalText } = get();
    set({ text: originalText, isDirty: false });
  },

  markDirty: (isDirty) => set({ isDirty }),
}));
