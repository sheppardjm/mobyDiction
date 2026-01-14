import { useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';

export function useDocumentImport() {
  const setTextExternal = useEditorStore((state) => state.setTextExternal);
  const setOriginalText = useEditorStore((state) => state.setOriginalText);

  const importFile = useCallback(
    async (file: File) => {
      try {
        const text = await readFileAsText(file);
        setTextExternal(text);
        setOriginalText(text);
      } catch (error) {
        console.error('Error importing file:', error);
        throw new Error('Failed to import file. Please try again.');
      }
    },
    [setTextExternal, setOriginalText]
  );

  const importFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTextExternal(text);
        setOriginalText(text);
      }
    } catch (error) {
      console.error('Error reading from clipboard:', error);
      throw new Error('Failed to read from clipboard. Please check permissions.');
    }
  }, [setTextExternal, setOriginalText]);

  const exportText = useCallback(async () => {
    const text = useEditorStore.getState().text;
    await navigator.clipboard.writeText(text);
  }, []);

  return {
    importFile,
    importFromClipboard,
    exportText,
  };
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
