// LanguageTool API response types

export interface LTReplacement {
  value: string;
  shortDescription?: string;
}

export interface LTRule {
  id: string;
  description: string;
  issueType: string;
  category: {
    id: string;
    name: string;
  };
}

export interface LTContext {
  text: string;
  offset: number;
  length: number;
}

export interface LTMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: LTReplacement[];
  context: LTContext;
  rule: LTRule;
  type: {
    typeName: string;
  };
}

export interface LTCheckResponse {
  matches: LTMatch[];
  language: {
    name: string;
    code: string;
  };
}

export interface LTCheckRequest {
  text: string;
  language?: string;
  enabledRules?: string;
  disabledRules?: string;
  enabledCategories?: string;
  disabledCategories?: string;
}
