import { useEffect } from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { TextEditor } from './components/Editor/TextEditor';
import { IssuesSidebar } from './components/Sidebar/IssuesSidebar';
import { IssueModal } from './components/IssueModal/IssueModal';
import { useEditorStore } from './store/editor-store';
import { useGrammarCheck } from './hooks/useGrammarCheck';

function App() {
  const text = useEditorStore((state) => state.text);
  const { checkGrammarDebounced } = useGrammarCheck();

  // Check grammar whenever text changes
  useEffect(() => {
    if (text.trim().length > 0) {
      checkGrammarDebounced(text);
    }
  }, [text, checkGrammarDebounced]);

  return (
    <AppLayout>
      <div className="flex-1 p-6">
        <TextEditor />
      </div>
      <IssuesSidebar />
      <IssueModal />
    </AppLayout>
  );
}

export default App;
