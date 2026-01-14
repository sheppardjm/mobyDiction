import type { EinsohnPrinciple } from '../../types/einsohn';
import { findPrinciplesByRuleId } from './principles';

/**
 * Maps LanguageTool rule IDs to Einsohn principles from The Copy Editor's Handbook.
 * This provides educational context for grammar issues.
 */

// Extended mapping of LanguageTool rules to Einsohn principle IDs
const RULE_TO_EINSOHN_MAP: Record<string, string> = {
  // Grammar & Syntax
  'SUBJECT_VERB_AGREEMENT': 'einsohn-subject-verb-agreement',
  'AGREEMENT_ERRORS': 'einsohn-subject-verb-agreement',
  'EN_A_VS_AN': 'einsohn-subject-verb-agreement',
  'PRONOUN_AGREEMENT': 'einsohn-pronoun-antecedent',
  'HE_VERB_AGR': 'einsohn-pronoun-antecedent',
  'IT_VBZ': 'einsohn-pronoun-antecedent',
  'PARALLELISM': 'einsohn-parallel-construction',
  'AND_NOT_VERB': 'einsohn-parallel-construction',
  'DANGLING_MODIFIER': 'einsohn-dangling-modifiers',
  'MISPLACED_MODIFIER': 'einsohn-dangling-modifiers',
  'FRAGMENT_SENTENCE': 'einsohn-sentence-fragments',
  'SENTENCE_FRAGMENT': 'einsohn-sentence-fragments',
  'COMMA_SPLICE': 'einsohn-run-on-sentences',
  'RUN_ON_SENTENCE': 'einsohn-run-on-sentences',

  // Punctuation
  'OXFORD_COMMA': 'einsohn-serial-comma',
  'COMMA_COMPOUND_SENTENCE': 'einsohn-serial-comma',
  'COMMA_PARENTHESIS_WHITESPACE': 'einsohn-comma-splice',
  'MISSING_COMMA_AFTER_INTRODUCTORY_PHRASE': 'einsohn-comma-splice',
  'APOSTROPHE_ERRORS': 'einsohn-apostrophes',
  'ITS_CONTRACTION': 'einsohn-apostrophes',
  'EN_CONTRACTION_SPELLING': 'einsohn-apostrophes',
  'MISSING_HYPHEN': 'einsohn-hyphens',
  'COMPOUND_HYPHEN': 'einsohn-hyphens',
  'DASH_RULE': 'einsohn-dashes',
  'EN_DASH_RULE': 'einsohn-dashes',

  // Style & Clarity
  'PASSIVE_VOICE': 'einsohn-passive-voice',
  'EN_PASSIVE_VOICE': 'einsohn-passive-voice',
  'REDUNDANCY': 'einsohn-wordiness',
  'WORDINESS': 'einsohn-wordiness',
  'SEND_BACK_AGAIN': 'einsohn-wordiness',
  'AMBIGUOUS_PRONOUN': 'einsohn-ambiguous-pronouns',
  'PLAIN_ENGLISH': 'einsohn-jargon',

  // Consistency
  'NUMBER_STYLE': 'einsohn-number-style',
  'UPPERCASE_SENTENCE_START': 'einsohn-capitalization',
  'CAPITALIZATION': 'einsohn-capitalization',
  'ABBREVIATION_CONSISTENCY': 'einsohn-abbreviations',

  // Typography
  'EN_QUOTES': 'einsohn-quotation-marks',
  'QUOTE_PUNCTUATION': 'einsohn-quotation-marks',
  'ELLIPSIS_SPACING': 'einsohn-ellipses',
  'DOUBLE_SPACE': 'einsohn-spacing',
  'WHITESPACE_RULE': 'einsohn-spacing',
  'PUNCTUATION_PARAGRAPH_END': 'einsohn-spacing',
};

/**
 * Get the Einsohn principle for a given LanguageTool rule ID.
 * Returns the first matching principle, or undefined if no match found.
 */
export function getEinsohnPrincipleForRule(
  ruleId: string
): EinsohnPrinciple | undefined {
  // Try direct mapping first
  const principleId = RULE_TO_EINSOHN_MAP[ruleId];
  if (principleId) {
    const principles = findPrinciplesByRuleId(ruleId);
    return principles[0];
  }

  // Try pattern matching for rules with variations
  const upperRuleId = ruleId.toUpperCase();

  // Subject-verb agreement patterns
  if (
    upperRuleId.includes('SUBJECT') ||
    upperRuleId.includes('VERB') ||
    upperRuleId.includes('AGREEMENT')
  ) {
    const principles = findPrinciplesByRuleId('SUBJECT_VERB_AGREEMENT');
    return principles[0];
  }

  // Pronoun patterns
  if (upperRuleId.includes('PRONOUN')) {
    const principles = findPrinciplesByRuleId('PRONOUN_AGREEMENT');
    return principles[0];
  }

  // Comma patterns
  if (upperRuleId.includes('COMMA')) {
    const principles = findPrinciplesByRuleId('COMMA_COMPOUND_SENTENCE');
    return principles[0];
  }

  // Apostrophe patterns
  if (upperRuleId.includes('APOSTROPHE')) {
    const principles = findPrinciplesByRuleId('APOSTROPHE_ERRORS');
    return principles[0];
  }

  // Passive voice patterns
  if (upperRuleId.includes('PASSIVE')) {
    const principles = findPrinciplesByRuleId('PASSIVE_VOICE');
    return principles[0];
  }

  // No matching principle found
  return undefined;
}

/**
 * Get all LanguageTool rules that should be enabled for Einsohn mode.
 */
export function getEinsohnEnabledRules(): string[] {
  return Object.keys(RULE_TO_EINSOHN_MAP);
}

/**
 * Check if a rule ID is related to an Einsohn principle.
 */
export function isEinsohnRule(ruleId: string): boolean {
  return getEinsohnPrincipleForRule(ruleId) !== undefined;
}
