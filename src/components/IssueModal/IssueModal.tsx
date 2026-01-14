import { useEffect, useMemo } from 'react';
import { useGrammarStore } from '../../store/grammar-store';
import { useUIStore } from '../../store/ui-store';
import { useApplyFix } from '../../hooks/useApplyFix';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { IssueDetails } from './IssueDetails';
import { Button } from '../ui/button';

export function IssueModal() {
  const issues = useGrammarStore((state) => state.issues);
  const currentIssueId = useGrammarStore((state) => state.currentIssueId);
  const navigateToNextIssue = useGrammarStore((state) => state.navigateToNextIssue);
  const navigateToPreviousIssue = useGrammarStore((state) => state.navigateToPreviousIssue);
  const rejectIssue = useGrammarStore((state) => state.rejectIssue);

  const currentIssue = useMemo(() => {
    if (!currentIssueId) return null;
    return issues.find((issue) => issue.id === currentIssueId) || null;
  }, [issues, currentIssueId]);

  const activeIssues = useMemo(() => issues.filter((issue) => issue.status === 'pending'), [issues]);

  const currentIssueIndex = useMemo(() => {
    return activeIssues.findIndex((issue) => issue.id === currentIssueId);
  }, [activeIssues, currentIssueId]);

  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const closeModal = useUIStore((state) => state.closeModal);

  const { applyFix } = useApplyFix();

  // Keyboard shortcuts
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateToPreviousIssue();
      } else if (e.key === 'ArrowRight') {
        navigateToNextIssue();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, navigateToNextIssue, navigateToPreviousIssue, closeModal]);

  if (!currentIssue) return null;

  const handleAccept = (replacementIndex: number) => {
    const replacement = currentIssue.replacements[replacementIndex];
    applyFix(currentIssue, replacement.value);
    navigateToNextIssue();
  };

  const handleReject = () => {
    rejectIssue(currentIssue.id);
    navigateToNextIssue();
  };

  const issueNumber = currentIssueIndex + 1;
  const totalIssues = activeIssues.length;

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border-border/60 shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-display text-xl font-semibold text-foreground mb-1 pr-8">
                {currentIssue.rule.description}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Review and resolve this issue
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50">
                {issueNumber} / {totalIssues}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <IssueDetails issue={currentIssue} />

          {/* Suggestions */}
          {currentIssue.replacements.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[hsl(var(--success))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Suggested corrections
              </h4>
              <div className="space-y-2">
                {currentIssue.replacements.slice(0, 4).map((replacement, index) => (
                  <button
                    key={index}
                    onClick={() => handleAccept(index)}
                    className={`
                      w-full text-left p-4 rounded-lg border transition-all duration-200 group
                      ${index === 0
                        ? 'border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 hover:bg-[hsl(var(--success))]/10 hover:border-[hsl(var(--success))]/50'
                        : 'border-border/50 bg-card hover:bg-accent/50 hover:border-border'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground group-hover:text-foreground/90 flex items-center gap-2">
                          <span className="font-display">{replacement.value || '(remove)'}</span>
                          {index === 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border border-[hsl(var(--success))]/30">
                              Best match
                            </span>
                          )}
                        </div>
                        {replacement.shortDescription && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {replacement.shortDescription}
                          </div>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Copy Editor's Handbook reference */}
          {currentIssue.einsohnPrinciple && (
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1">
                    The Copy Editor's Handbook
                  </p>
                  <p className="font-display font-semibold text-foreground mb-1">
                    {currentIssue.einsohnPrinciple.title}
                    <span className="text-muted-foreground font-normal ml-2">
                      Chapter {currentIssue.einsohnPrinciple.chapter}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentIssue.einsohnPrinciple.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToPreviousIssue}
              disabled={activeIssues.length <= 1}
              className="gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReject} className="gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
                </svg>
                Skip
              </Button>
              {currentIssue.replacements.length > 0 && (
                <Button onClick={() => handleAccept(0)} className="gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Accept Fix
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToNextIssue}
              disabled={activeIssues.length <= 1}
              className="gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Button>
          </div>

          {/* Keyboard hints */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/30">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 font-mono text-[10px]">←</kbd>
              <span>prev</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 font-mono text-[10px]">→</kbd>
              <span>next</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 font-mono text-[10px]">esc</kbd>
              <span>close</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
