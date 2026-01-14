import type { EinsohnPrinciple } from '../../types/einsohn';

export const EINSOHN_PRINCIPLES: EinsohnPrinciple[] = [
  // GRAMMAR & SYNTAX (Chapters 6-7)
  {
    id: 'einsohn-subject-verb-agreement',
    chapter: '6',
    section: '6.1',
    title: 'Subject-Verb Agreement',
    description:
      'The verb must agree with its subject in number and person. Collective nouns typically take singular verbs in American English.',
    examples: [
      'Correct: The group of students is ready.',
      'Incorrect: The group of students are ready.',
      'Correct: Neither the manager nor the employees were aware of the change.',
    ],
    relatedRules: ['SUBJECT_VERB_AGREEMENT', 'AGREEMENT_ERRORS', 'EN_A_VS_AN'],
  },
  {
    id: 'einsohn-pronoun-antecedent',
    chapter: '6',
    section: '6.2',
    title: 'Pronoun-Antecedent Agreement',
    description:
      'Pronouns must agree with their antecedents in number, gender, and person. Singular antecedents require singular pronouns.',
    examples: [
      'Correct: Each student must bring their own lunch. (singular they)',
      'Correct: Each student must bring his or her own lunch.',
      'Incorrect: Each student must bring their lunches.',
    ],
    relatedRules: ['PRONOUN_AGREEMENT', 'HE_VERB_AGR', 'IT_VBZ'],
  },
  {
    id: 'einsohn-parallel-construction',
    chapter: '6',
    section: '6.3',
    title: 'Parallel Construction',
    description:
      'Elements in a series or comparison should be parallel in form. Use consistent grammatical structures for items in a list.',
    examples: [
      'Correct: She likes reading, writing, and editing.',
      'Incorrect: She likes reading, writing, and to edit.',
      'Correct: The job requires patience, attention to detail, and communication skills.',
    ],
    relatedRules: ['PARALLELISM', 'AND_NOT_VERB'],
  },
  {
    id: 'einsohn-dangling-modifiers',
    chapter: '7',
    section: '7.1',
    title: 'Dangling and Misplaced Modifiers',
    description:
      'Modifiers should be placed as close as possible to the words they modify. Dangling modifiers have no clear subject.',
    examples: [
      'Dangling: Walking down the street, the trees were beautiful.',
      'Correct: Walking down the street, I noticed the beautiful trees.',
      'Misplaced: She nearly ate all the cookies. (implies she almost ate)',
      'Clear: She ate nearly all the cookies.',
    ],
    relatedRules: ['DANGLING_MODIFIER', 'MISPLACED_MODIFIER'],
  },
  {
    id: 'einsohn-sentence-fragments',
    chapter: '7',
    section: '7.2',
    title: 'Sentence Fragments',
    description:
      'A sentence must contain a subject and a predicate and express a complete thought. Fragments are acceptable in certain contexts (dialogue, informal writing).',
    examples: [
      'Fragment: Because it was raining.',
      'Complete: Because it was raining, we stayed inside.',
      'Acceptable fragment: "Where are you going?" "To the store."',
    ],
    relatedRules: ['FRAGMENT_SENTENCE', 'SENTENCE_FRAGMENT'],
  },
  {
    id: 'einsohn-run-on-sentences',
    chapter: '7',
    section: '7.3',
    title: 'Run-On Sentences and Comma Splices',
    description:
      'Two independent clauses cannot be joined with only a comma (comma splice) or with no punctuation (run-on). Use a semicolon, period, or coordinating conjunction.',
    examples: [
      'Comma splice: The rain stopped, we went outside.',
      'Correct: The rain stopped, and we went outside.',
      'Correct: The rain stopped; we went outside.',
      'Correct: The rain stopped. We went outside.',
    ],
    relatedRules: ['COMMA_SPLICE', 'RUN_ON_SENTENCE'],
  },

  // PUNCTUATION (Chapter 4)
  {
    id: 'einsohn-serial-comma',
    chapter: '4',
    section: '4.1',
    title: 'Serial Comma (Oxford Comma)',
    description:
      'Use a comma before the coordinating conjunction in a series of three or more items. This prevents ambiguity.',
    examples: [
      'Correct: I bought apples, oranges, and bananas.',
      'Without serial comma: I bought apples, oranges and bananas.',
      'Ambiguous: I dedicate this to my parents, Jane Austen and God.',
      'Clear: I dedicate this to my parents, Jane Austen, and God.',
    ],
    relatedRules: ['OXFORD_COMMA', 'COMMA_COMPOUND_SENTENCE'],
  },
  {
    id: 'einsohn-comma-splice',
    chapter: '4',
    section: '4.2',
    title: 'Comma Usage',
    description:
      'Commas separate independent clauses joined by coordinating conjunctions, set off introductory elements, and separate items in a series.',
    examples: [
      'Correct: After the meeting, we went to lunch.',
      'Correct: The book, which was published in 1960, remains popular.',
      'Incorrect: The book that was published in 1960, remains popular.',
    ],
    relatedRules: [
      'COMMA_PARENTHESIS_WHITESPACE',
      'COMMA_COMPOUND_SENTENCE',
      'MISSING_COMMA_AFTER_INTRODUCTORY_PHRASE',
    ],
  },
  {
    id: 'einsohn-apostrophes',
    chapter: '4',
    section: '4.3',
    title: 'Apostrophes',
    description:
      'Use apostrophes for possessives and contractions. Do not use apostrophes for plural forms.',
    examples: [
      "Correct: The dog's bone (possessive)",
      "Correct: It's raining (contraction of it is)",
      "Incorrect: The dog's are barking (plural, should be dogs)",
      "Correct: The 1990s (plural decade, no apostrophe)",
    ],
    relatedRules: ['APOSTROPHE_ERRORS', 'ITS_CONTRACTION', 'EN_CONTRACTION_SPELLING'],
  },
  {
    id: 'einsohn-hyphens',
    chapter: '4',
    section: '4.4',
    title: 'Hyphenation',
    description:
      'Use hyphens in compound modifiers before nouns, with prefixes in certain cases, and to avoid ambiguity.',
    examples: [
      'Correct: well-known author (before noun)',
      'Correct: The author is well known (after noun, no hyphen)',
      'Correct: twenty-five, self-aware, re-enter',
      'Ambiguous: small business owner vs. small-business owner',
    ],
    relatedRules: ['MISSING_HYPHEN', 'COMPOUND_HYPHEN'],
  },
  {
    id: 'einsohn-dashes',
    chapter: '4',
    section: '4.5',
    title: 'Em Dashes and En Dashes',
    description:
      'Em dashes (—) set off parenthetical elements or indicate interruption. En dashes (–) show ranges and connections.',
    examples: [
      'Em dash: The decision—made after much debate—was final.',
      'En dash: The 2020–2021 season, the New York–London flight',
      'Em dash for emphasis: She had one goal—victory.',
    ],
    relatedRules: ['DASH_RULE', 'EN_DASH_RULE'],
  },

  // STYLE & CLARITY (Chapter 9)
  {
    id: 'einsohn-passive-voice',
    chapter: '9',
    section: '9.3',
    title: 'Passive Voice',
    description:
      'Prefer active voice for directness and clarity. Passive voice is acceptable when the actor is unknown or unimportant.',
    examples: [
      'Active: The committee approved the proposal.',
      'Passive: The proposal was approved by the committee.',
      'Acceptable passive: The building was constructed in 1920.',
      'Acceptable passive: Mistakes were made.',
    ],
    relatedRules: ['PASSIVE_VOICE', 'EN_PASSIVE_VOICE'],
  },
  {
    id: 'einsohn-wordiness',
    chapter: '9',
    section: '9.4',
    title: 'Wordiness and Redundancy',
    description:
      'Eliminate unnecessary words and redundant phrases. Choose precise, concise language.',
    examples: [
      'Wordy: at this point in time → now',
      'Wordy: due to the fact that → because',
      'Redundant: free gift → gift',
      'Redundant: advance planning → planning',
    ],
    relatedRules: ['REDUNDANCY', 'WORDINESS', 'SEND_BACK_AGAIN'],
  },
  {
    id: 'einsohn-ambiguous-pronouns',
    chapter: '9',
    section: '9.5',
    title: 'Ambiguous Pronoun References',
    description:
      'Pronouns must have clear antecedents. Avoid vague references with "this," "that," "it," and "which."',
    examples: [
      'Ambiguous: John told Bill that he was wrong.',
      'Clear: John told Bill, "You are wrong."',
      'Ambiguous: The report criticized the policy, which was controversial.',
      "Clear: The report's criticism of the policy was controversial.",
    ],
    relatedRules: ['AMBIGUOUS_PRONOUN'],
  },
  {
    id: 'einsohn-jargon',
    chapter: '9',
    section: '9.6',
    title: 'Jargon and Technical Terms',
    description:
      'Avoid unnecessary jargon. Use technical terms appropriately for your audience, and define them when needed.',
    examples: [
      'Jargon: leverage synergies → work together effectively',
      'Jargon: utilize → use',
      'Appropriate technical term: DNA methylation (in scientific context)',
    ],
    relatedRules: ['WORDINESS', 'PLAIN_ENGLISH'],
  },

  // CONSISTENCY (Chapter 10)
  {
    id: 'einsohn-number-style',
    chapter: '10',
    section: '10.1',
    title: 'Number Style',
    description:
      'Be consistent with number style. General rule: spell out one through nine, use numerals for 10 and above. Follow style guide conventions.',
    examples: [
      'Correct: She bought five apples and 12 oranges.',
      'Correct: The meeting starts at 3:00 p.m.',
      'Special cases: 21st century, $5 million, Chapter 3',
    ],
    relatedRules: ['NUMBER_STYLE'],
  },
  {
    id: 'einsohn-capitalization',
    chapter: '10',
    section: '10.2',
    title: 'Capitalization',
    description:
      'Maintain consistent capitalization for titles, headings, and proper nouns. Follow style guide rules (AP, Chicago, etc.).',
    examples: [
      'Title case: The Art of Grammar and Style',
      'Sentence case: The art of grammar and style',
      'Proper nouns: President Biden, Congress, the White House',
    ],
    relatedRules: ['UPPERCASE_SENTENCE_START', 'CAPITALIZATION'],
  },
  {
    id: 'einsohn-abbreviations',
    chapter: '10',
    section: '10.3',
    title: 'Abbreviations and Acronyms',
    description:
      'Spell out abbreviations on first use, followed by the acronym in parentheses. Be consistent with punctuation (U.S. vs. US).',
    examples: [
      'First use: National Aeronautics and Space Administration (NASA)',
      'Subsequent: NASA announced...',
      'Consistent: U.S. (not US in one place and U.S. in another)',
    ],
    relatedRules: ['ABBREVIATION_CONSISTENCY'],
  },

  // TYPOGRAPHY (Chapter 11)
  {
    id: 'einsohn-quotation-marks',
    chapter: '11',
    section: '11.1',
    title: 'Quotation Marks',
    description:
      'Use typographically correct "curly" or "smart" quotes rather than straight quotes. In American English, commas and periods go inside closing quotes.',
    examples: [
      'Correct: She said, "Hello."',
      'Incorrect: She said, "Hello".',
      'Correct: "Hello," she said.',
    ],
    relatedRules: ['EN_QUOTES', 'QUOTE_PUNCTUATION'],
  },
  {
    id: 'einsohn-ellipses',
    chapter: '11',
    section: '11.2',
    title: 'Ellipses',
    description:
      'Use ellipses (…) to indicate omitted text in quotations. Include spaces before and after, or use the single character.',
    examples: [
      'Original: "The quick brown fox jumps over the lazy dog."',
      'With ellipsis: "The quick brown fox … the lazy dog."',
      'At end: "The quick brown fox..."',
    ],
    relatedRules: ['ELLIPSIS_SPACING'],
  },
  {
    id: 'einsohn-spacing',
    chapter: '11',
    section: '11.3',
    title: 'Spacing',
    description:
      'Use single spaces after periods. Avoid double spaces, multiple spaces, or spaces before punctuation.',
    examples: [
      'Correct: End sentence. Start new sentence.',
      'Incorrect: End sentence.  Start new sentence. (two spaces)',
      'Incorrect: Word , punctuation (space before comma)',
    ],
    relatedRules: ['DOUBLE_SPACE', 'WHITESPACE_RULE', 'PUNCTUATION_PARAGRAPH_END'],
  },
];

// Create a map for quick lookup
export const EINSOHN_PRINCIPLES_MAP = new Map<string, EinsohnPrinciple>(
  EINSOHN_PRINCIPLES.map((principle) => [principle.id, principle])
);

// Get principle by ID
export function getEinsohnPrinciple(id: string): EinsohnPrinciple | undefined {
  return EINSOHN_PRINCIPLES_MAP.get(id);
}

// Search principles by rule ID
export function findPrinciplesByRuleId(ruleId: string): EinsohnPrinciple[] {
  return EINSOHN_PRINCIPLES.filter((principle) =>
    principle.relatedRules.includes(ruleId)
  );
}
