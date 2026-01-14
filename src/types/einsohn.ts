export type EinsohnPrinciple = {
  id: string;
  chapter: string;
  section: string;
  title: string;
  description: string;
  examples: string[];
  relatedRules: string[];
}

export type EinsohnCategory =
  | 'grammar-syntax'
  | 'punctuation'
  | 'style-clarity'
  | 'consistency'
  | 'typography';
