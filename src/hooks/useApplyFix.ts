import { useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';
import { useGrammarStore } from '../store/grammar-store';
import type { GrammarIssue } from '../types/grammar';

export function useApplyFix() {
  const applyEdit = useEditorStore((state) => state.applyEdit);
  const updateIssue = useGrammarStore((state) => state.updateIssue);
  const issues = useGrammarStore((state) => state.issues);

  const applyFix = useCallback(
    (issue: GrammarIssue, replacement: string) => {
      // Apply the text replacement
      applyEdit(issue.offset, issue.length, replacement);

      // Mark issue as accepted
      updateIssue(issue.id, { status: 'accepted' });

      // CRITICAL: Adjust offsets for remaining issues
      // When we change text length, all subsequent issues need their offsets updated
      const offsetDelta = replacement.length - issue.length;

      if (offsetDelta !== 0) {
        issues
          .filter((i) => i.offset > issue.offset && i.status === 'pending')
          .forEach((i) => {
            updateIssue(i.id, {
              offset: i.offset + offsetDelta,
            });
          });
      }
    },
    [applyEdit, updateIssue, issues]
  );

  return { applyFix };
}
