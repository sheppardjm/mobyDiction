import type { EinsohnPrinciple } from './einsohn';

export type IssueCategory =
  | 'grammar'
  | 'spelling'
  | 'punctuation'
  | 'style'
  | 'typography'
  | 'consistency';

export type IssueSeverity = 'error' | 'warning' | 'suggestion';

export type IssueStatus = 'pending' | 'accepted' | 'rejected' | 'modified';

export type Replacement = {
  value: string;
  shortDescription?: string;
};

export type RuleInfo = {
  id: string;
  description: string;
  issueType: string;
  category: IssueCategory;
};

export type IssueContext = {
  text: string;
  offset: number;
};

export type GrammarIssue = {
  id: string;
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: Replacement[];
  rule: RuleInfo;
  category: IssueCategory;
  severity: IssueSeverity;
  einsohnPrinciple?: EinsohnPrinciple;
  context: IssueContext;
  status: IssueStatus;
};

export type CheckOptions = {
  einsohnMode?: boolean;
  language?: string;
  enabledCategories?: IssueCategory[];
};
