import type { GrammarIssue } from '../../types/grammar';

interface IssueListItemProps {
  issue: GrammarIssue;
  onClick: () => void;
}

const severityStyles = {
  error: {
    border: 'border-l-destructive/60',
    bg: 'hover:bg-destructive/5',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
  warning: {
    border: 'border-l-[hsl(var(--warning))]/60',
    bg: 'hover:bg-[hsl(var(--warning))]/5',
    badge: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20',
    dot: 'bg-[hsl(var(--warning))]',
  },
  suggestion: {
    border: 'border-l-primary/40',
    bg: 'hover:bg-primary/5',
    badge: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary/60',
  },
};

export function IssueListItem({ issue, onClick }: IssueListItemProps) {
  const styles = severityStyles[issue.severity];
  const contextPreview = getContextPreview(issue);

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3.5 rounded-lg border border-border/40 border-l-[3px]
        ${styles.border} ${styles.bg}
        bg-card/50 backdrop-blur-sm
        transition-all duration-200
        hover:shadow-sm hover:border-border/60
        group
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-sm font-medium text-foreground/90 line-clamp-1 group-hover:text-foreground transition-colors">
          {contextPreview}
        </span>
        <span className={`
          shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border
          ${styles.badge}
        `}>
          <span className={`w-1 h-1 rounded-full ${styles.dot}`} />
          {issue.severity}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {issue.shortMessage}
      </p>

      {/* Hover indicator */}
      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors">
        <span>Click to review</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </button>
  );
}

function getContextPreview(issue: GrammarIssue): string {
  const contextText = issue.context.text;
  const contextOffset = issue.context.offset;
  const issueLength = issue.length;

  // Get a bit of text before and after the issue
  const start = Math.max(0, contextOffset - 10);
  const end = Math.min(contextText.length, contextOffset + issueLength + 10);

  let preview = contextText.substring(start, end);

  // Add ellipsis if truncated
  if (start > 0) preview = '...' + preview;
  if (end < contextText.length) preview = preview + '...';

  return preview;
}
