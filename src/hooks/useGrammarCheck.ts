import { useCallback, useMemo } from 'react';
import { useGrammarStore } from '../store/grammar-store';
import { languageToolClient } from '../lib/languagetool/client';
import { debounce } from '../lib/utils/debounce';

export function useGrammarCheck() {
  const setIssues = useGrammarStore((state) => state.setIssues);
  const setIsChecking = useGrammarStore((state) => state.setIsChecking);
  const setCheckError = useGrammarStore((state) => state.setCheckError);

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
    () => debounce((textToCheck: string) => checkGrammar(textToCheck), 1500),
    [checkGrammar]
  );

  return {
    checkGrammar,
    checkGrammarDebounced: debouncedCheck,
  };
}
