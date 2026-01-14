import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { useEditorStore } from '../../store/editor-store';

export function SetContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const text = useEditorStore((state) => state.text);
  const externalVersion = useEditorStore((state) => state.externalVersion);
  const lastVersionRef = useRef(-1);

  useEffect(() => {
    // Only update the editor when externalVersion changes (external update)
    if (externalVersion === lastVersionRef.current) {
      return;
    }
    lastVersionRef.current = externalVersion;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      if (text) {
        // Split text by newlines and create paragraphs
        const paragraphs = text.split('\n');
        paragraphs.forEach((paragraphText) => {
          const paragraph = $createParagraphNode();
          if (paragraphText) {
            paragraph.append($createTextNode(paragraphText));
          }
          root.append(paragraph);
        });
      } else {
        // Empty text - add empty paragraph for cursor
        root.append($createParagraphNode());
      }
    });
  }, [editor, text, externalVersion]);

  return null;
}
