import React, { useMemo } from 'react';
import { useGrammarStore } from '../../store/grammar-store';
import { useUIStore } from '../../store/ui-store';
import { ScrollArea } from '../ui/scroll-area';
import { IssueListItem } from './IssueListItem';
import type { IssueCategory } from '../../types/grammar';

const categoryConfig: Record<IssueCategory, { label: string; icon: React.ReactElement }> = {
  grammar: {
    label: 'Grammar',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  spelling: {
    label: 'Spelling',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  punctuation: {
    label: 'Punctuation',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
      </svg>
    ),
  },
  style: {
    label: 'Style',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  typography: {
    label: 'Typography',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  consistency: {
    label: 'Consistency',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
};

export function IssuesSidebar() {
  const issues = useGrammarStore((state) => state.issues);
  const setCurrentIssue = useGrammarStore((state) => state.setCurrentIssue);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const activeFilters = useUIStore((state) => state.activeFilters);
  const openModal = useUIStore((state) => state.openModal);

  const pendingIssues = useMemo(() => {
    return issues.filter((issue) => issue.status === 'pending');
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (activeFilters.length === 0) return pendingIssues;
    return pendingIssues.filter((issue) => activeFilters.includes(issue.category));
  }, [pendingIssues, activeFilters]);

  const issuesByCategory = useMemo(() => {
    const grouped: Record<IssueCategory, typeof filteredIssues> = {
      grammar: [],
      spelling: [],
      punctuation: [],
      style: [],
      typography: [],
      consistency: [],
    };

    filteredIssues.forEach((issue) => {
      grouped[issue.category].push(issue);
    });

    return grouped;
  }, [filteredIssues]);

  const handleIssueClick = (issueId: string) => {
    setCurrentIssue(issueId);
    openModal();
  };

  if (!isSidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-24 bg-card border border-r-0 border-border/60 rounded-l-xl shadow-lg hover:bg-accent/50 transition-all duration-300 group"
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {pendingIssues.length > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
              {pendingIssues.length}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <aside className="w-80 border-l border-border/50 bg-gradient-to-b from-card via-card to-background flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 border border-primary/10">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <h2 className="text-lg font-display font-semibold">Review</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm ${
            filteredIssues.length > 0
              ? 'bg-destructive/10 text-destructive'
              : 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]'
          }`}>
            {filteredIssues.length > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span className="font-medium">{filteredIssues.length}</span>
                <span className="opacity-70">{filteredIssues.length === 1 ? 'issue' : 'issues'}</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">All clear</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Issues list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {Object.entries(issuesByCategory).map(([category, categoryIssues]) => {
            if (categoryIssues.length === 0) return null;
            const config = categoryConfig[category as IssueCategory];

            return (
              <div key={category} className="animate-fade-in">
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {config.icon}
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {config.label}
                    </span>
                  </div>
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold bg-muted text-muted-foreground rounded-full">
                    {categoryIssues.length}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
                </div>

                {/* Issues */}
                <div className="space-y-2 animate-stagger">
                  {categoryIssues.map((issue) => (
                    <IssueListItem
                      key={issue.id}
                      issue={issue}
                      onClick={() => handleIssueClick(issue.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {filteredIssues.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--success))]/10">
                <svg className="w-8 h-8 text-[hsl(var(--success))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-display text-lg font-medium text-foreground mb-1">
                {pendingIssues.length === 0 ? 'Excellent work!' : 'No matches'}
              </p>
              <p className="text-sm text-muted-foreground">
                {pendingIssues.length === 0
                  ? 'Your writing is looking polished.'
                  : 'No issues match the selected filters.'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
