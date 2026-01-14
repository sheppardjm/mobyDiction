import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import type { GrammarIssue } from '../../types/grammar';
import { useUIStore } from '../../store/ui-store';

interface HighlightPluginProps {
  issues: GrammarIssue[];
  onIssueClick: (id: string) => void;
}

export function HighlightPlugin({ issues, onIssueClick }: HighlightPluginProps) {
  const [editor] = useLexicalComposerContext();
  const openModal = useUIStore((state) => state.openModal);

  useEffect(() => {
    // Store issues in editor for access
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    // Remove existing highlights
    const existingHighlights = editorElement.querySelectorAll('.grammar-highlight');
    existingHighlights.forEach((el) => el.remove());

    // Get pending issues only
    const pendingIssues = issues.filter((issue) => issue.status === 'pending');

    if (pendingIssues.length === 0) return;

    // Apply highlights using a simpler approach
    // Note: This is a simplified version. A production app would use
    // Lexical's decorator system or custom nodes for better integration

    const textContent = editor.getEditorState().read(() => {
      const root = editor.getEditorState()._nodeMap.get('root');
      return root?.__cachedText || '';
    });

    // Store issues for reference
    (editorElement as unknown as { _issues?: GrammarIssue[] })._issues = pendingIssues;

    return () => {
      // Cleanup
      const highlights = editorElement.querySelectorAll('.grammar-highlight');
      highlights.forEach((el) => el.remove());
    };
  }, [editor, issues]);

  // Handle clicks on the editor to detect issue clicks
  useEffect(() => {
    const editorElement = editor.getRootElement();
    if (!editorElement) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('grammar-highlight')) {
        const issueId = target.getAttribute('data-issue-id');
        if (issueId) {
          onIssueClick(issueId);
          openModal();
        }
      }
    };

    editorElement.addEventListener('click', handleClick);

    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor, onIssueClick, openModal]);

  return null;
}

// Helper function to get severity class
export function getSeverityClassName(severity: string): string {
  const classMap: Record<string, string> = {
    error: 'bg-red-200 border-b-2 border-red-500 cursor-pointer hover:bg-red-300',
    warning: 'bg-yellow-200 border-b-2 border-yellow-500 cursor-pointer hover:bg-yellow-300',
    suggestion: 'bg-blue-200 border-b-2 border-blue-500 cursor-pointer hover:bg-blue-300',
  };
  return classMap[severity] || classMap.warning;
}
