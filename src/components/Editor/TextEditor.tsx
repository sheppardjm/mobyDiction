import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import type { EditorState } from 'lexical';
import { useEditorStore } from '../../store/editor-store';
import { HighlightPlugin } from './HighlightPlugin';
import { EditorToolbar } from './EditorToolbar';
import { useGrammarStore } from '../../store/grammar-store';

const editorTheme = {
  paragraph: 'mb-4 leading-relaxed',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline underline-offset-2',
  },
};

export function TextEditor() {
  const setText = useEditorStore((state) => state.setText);
  const issues = useGrammarStore((state) => state.issues);
  const setCurrentIssue = useGrammarStore((state) => state.setCurrentIssue);

  const initialConfig = {
    namespace: 'GrammarEditor',
    theme: editorTheme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      // Get text content from the editor state using the root element
      const root = editorState._nodeMap.get('root');
      const textContent = root?.getTextContent?.() || '';
      setText(textContent);
    });
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-sm border border-border/60 bg-card">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar />

        <div className="flex-1 relative overflow-hidden">
          {/* Paper texture background */}
          <div className="absolute inset-0 paper-texture opacity-50" />

          {/* Decorative margin line */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-destructive/20 via-destructive/10 to-transparent" />

          {/* Content area */}
          <div className="relative h-full overflow-auto">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-full py-8 px-8 pl-20 outline-none text-foreground/90 text-[1.0625rem] leading-[1.8] font-body selection:bg-primary/10"
                  style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
                />
              }
              placeholder={
                <div className="absolute top-8 left-20 right-8 text-muted-foreground/60 pointer-events-none select-none text-[1.0625rem] leading-[1.8] font-body italic">
                  Begin writing or paste your text here...
                  <br />
                  <span className="text-sm not-italic opacity-75 mt-2 block">
                    Your prose will be analyzed for grammar, spelling, and style.
                  </span>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <OnChangePlugin onChange={handleChange} />
            <HighlightPlugin issues={issues} onIssueClick={setCurrentIssue} />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </LexicalComposer>
    </div>
  );
}
