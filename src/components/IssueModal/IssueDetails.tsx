import type { GrammarIssue } from '../../types/grammar';

interface IssueDetailsProps {
  issue: GrammarIssue;
}

const severityConfig = {
  error: {
    label: 'Error',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
    dot: 'bg-destructive',
  },
  warning: {
    label: 'Warning',
    bg: 'bg-[hsl(var(--warning))]/10',
    text: 'text-[hsl(var(--warning))]',
    border: 'border-[hsl(var(--warning))]/20',
    dot: 'bg-[hsl(var(--warning))]',
  },
  suggestion: {
    label: 'Suggestion',
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
    dot: 'bg-primary/60',
  },
};

export function IssueDetails({ issue }: IssueDetailsProps) {
  const severity = severityConfig[issue.severity];
  const { before, highlighted, after } = getHighlightedContext(issue);

  return (
    <div className="space-y-4">
      {/* Context preview */}
      <div className="relative p-5 rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
        {/* Decorative quote marks */}
        <div className="absolute top-2 left-3 text-4xl text-muted-foreground/10 font-display leading-none">"</div>
        <div className="absolute bottom-2 right-3 text-4xl text-muted-foreground/10 font-display leading-none">"</div>

        <div className="relative font-body text-[0.9375rem] leading-relaxed text-foreground/80 pl-4">
          {before}
          <span className="relative inline-block">
            <span className="relative z-10 px-0.5 font-medium text-destructive">
              {highlighted}
            </span>
            <span className="absolute inset-x-0 bottom-0 h-2 bg-destructive/20 -z-0 rounded-sm" />
          </span>
          {after}
        </div>
      </div>

      {/* Message */}
      <div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {issue.message}
        </p>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
          ${severity.bg} ${severity.text} ${severity.border}
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
          {severity.label}
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          {issue.category}
        </span>

        {issue.rule.id && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground/60 bg-muted/30 border border-border/30">
            {issue.rule.id}
          </span>
        )}
      </div>
    </div>
  );
}

function getHighlightedContext(issue: GrammarIssue): {
  before: string;
  highlighted: string;
  after: string;
} {
  const contextText = issue.context.text;
  const contextOffset = issue.context.offset;
  const issueLength = issue.length;

  return {
    before: contextText.substring(0, contextOffset),
    highlighted: contextText.substring(contextOffset, contextOffset + issueLength),
    after: contextText.substring(contextOffset + issueLength),
  };
}
