import type { LTCheckResponse, LTMatch } from './types';
import type { GrammarIssue, IssueCategory, IssueSeverity, CheckOptions } from '../../types/grammar';
import { getEinsohnPrincipleForRule } from '../einsohn/rule-mapping';

function generateId(): string {
  return `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function categorizeLTRule(ltCategory: string): IssueCategory {
  const categoryMap: Record<string, IssueCategory> = {
    'TYPOS': 'spelling',
    'GRAMMAR': 'grammar',
    'PUNCTUATION': 'punctuation',
    'CASING': 'consistency',
    'STYLE': 'style',
    'TYPOGRAPHY': 'typography',
    'REDUNDANCY': 'style',
    'CONFUSED_WORDS': 'spelling',
    'MISC': 'grammar',
  };

  const normalized = ltCategory.toUpperCase();
  return categoryMap[normalized] || 'grammar';
}

function determineSeverity(match: LTMatch): IssueSeverity {
  const issueType = match.rule.issueType.toLowerCase();
  const ruleId = match.rule.id.toLowerCase();

  // Spelling errors are typically errors
  if (issueType.includes('misspelling') || ruleId.includes('spell')) {
    return 'error';
  }

  // Grammar issues are errors
  if (issueType.includes('grammar') || ruleId.includes('grammar')) {
    return 'error';
  }

  // Style suggestions
  if (issueType.includes('style') || ruleId.includes('style')) {
    return 'suggestion';
  }

  // Punctuation can be warnings or errors
  if (issueType.includes('punctuation')) {
    return 'warning';
  }

  // Default to warning
  return 'warning';
}

function transformMatch(match: LTMatch): GrammarIssue {
  const category = categorizeLTRule(match.rule.category.id);
  const severity = determineSeverity(match);
  const einsohnPrinciple = getEinsohnPrincipleForRule(match.rule.id);

  return {
    id: generateId(),
    message: match.message,
    shortMessage: match.shortMessage || match.message,
    offset: match.offset,
    length: match.length,
    replacements: match.replacements.map((r) => ({
      value: r.value,
      shortDescription: r.shortDescription,
    })),
    rule: {
      id: match.rule.id,
      description: match.rule.description,
      issueType: match.rule.issueType,
      category,
    },
    category,
    severity,
    einsohnPrinciple,
    context: {
      text: match.context.text,
      offset: match.context.offset,
    },
    status: 'pending',
  };
}

export function transformToGrammarIssues(
  response: LTCheckResponse,
  options: CheckOptions = {}
): GrammarIssue[] {
  const issues = response.matches.map(transformMatch);

  // Filter by categories if specified
  if (options.enabledCategories && options.enabledCategories.length > 0) {
    return issues.filter((issue) =>
      options.enabledCategories!.includes(issue.category)
    );
  }

  return issues;
}
