import { useCallback, useMemo, useRef } from 'react';
import { useGrammarStore } from '../store/grammar-store';
import { useEditorStore } from '../store/editor-store';
import { languageToolClient } from '../lib/languagetool/client';
import { debounce } from '../lib/utils/debounce';

export function useGrammarCheck() {
  const setIssues = useGrammarStore((state) => state.setIssues);
  const setIsChecking = useGrammarStore((state) => state.setIsChecking);
  const setCheckError = useGrammarStore((state) => state.setCheckError);
  const text = useEditorStore((state) => state.text);

  const checkGrammar = useCallback(
    async (textToCheck: string) => {
      if (!textToCheck || textToCheck.trim().length === 0) {
        setIssues([]);
        return;
      }

      setIsChecking(true);
      setCheckError(null);

      try {
        const issues = await languageToolClient.check(textToCheck, {
          einsohnMode: true,
        });
        setIssues(issues);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to check grammar. Please try again.';
        setCheckError(errorMessage);
        console.error('Grammar check error:', error);
      } finally {
        setIsChecking(false);
      }
    },
    [setIssues, setIsChecking, setCheckError]
  );

  // Debounced version for real-time checking
  const debouncedCheck = useMemo(
    () => debounce(checkGrammar, 1500),
    [checkGrammar]
  );

  return {
    checkGrammar,
    checkGrammarDebounced: debouncedCheck,
  };
}
