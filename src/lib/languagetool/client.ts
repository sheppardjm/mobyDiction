import type { LTCheckResponse } from './types';
import { transformToGrammarIssues } from './transformer';
import type { GrammarIssue, CheckOptions } from '../../types/grammar';

const LANGUAGETOOL_API_URL = 'https://api.languagetool.org/v2/check';
const MAX_CHUNK_SIZE = 15000; // Safe limit below API's 20k limit

export class LanguageToolClient {
  private apiUrl: string;

  constructor(apiUrl: string = LANGUAGETOOL_API_URL) {
    this.apiUrl = apiUrl;
  }

  // Split text into chunks at sentence boundaries
  private splitIntoChunks(text: string): { chunk: string; offset: number }[] {
    if (text.length <= MAX_CHUNK_SIZE) {
      return [{ chunk: text, offset: 0 }];
    }

    const chunks: { chunk: string; offset: number }[] = [];
    let currentOffset = 0;

    while (currentOffset < text.length) {
      let endIndex = currentOffset + MAX_CHUNK_SIZE;

      if (endIndex >= text.length) {
        chunks.push({ chunk: text.slice(currentOffset), offset: currentOffset });
        break;
      }

      // Find a sentence boundary (., !, ?) followed by space or newline
      let breakPoint = endIndex;
      for (let i = endIndex; i > currentOffset + MAX_CHUNK_SIZE / 2; i--) {
        const char = text[i];
        if ((char === '.' || char === '!' || char === '?') &&
            (text[i + 1] === ' ' || text[i + 1] === '\n' || text[i + 1] === undefined)) {
          breakPoint = i + 1;
          break;
        }
      }

      // If no sentence boundary found, try to break at a space
      if (breakPoint === endIndex) {
        for (let i = endIndex; i > currentOffset + MAX_CHUNK_SIZE / 2; i--) {
          if (text[i] === ' ' || text[i] === '\n') {
            breakPoint = i + 1;
            break;
          }
        }
      }

      chunks.push({ chunk: text.slice(currentOffset, breakPoint), offset: currentOffset });
      currentOffset = breakPoint;
    }

    return chunks;
  }

  private async checkChunk(text: string, options: CheckOptions): Promise<LTCheckResponse> {
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('language', options.language || 'en-US');

    if (options.einsohnMode) {
      formData.append('enabledOnly', 'false');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status === 413) {
        throw new Error('Text chunk too large. Please try with less text.');
      }
      throw new Error(`LanguageTool API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async check(text: string, options: CheckOptions = {}): Promise<GrammarIssue[]> {
    if (!text || text.trim().length === 0) {
      return [];
    }

    try {
      const chunks = this.splitIntoChunks(text);
      const allIssues: GrammarIssue[] = [];

      // Process chunks sequentially to avoid rate limiting
      for (const { chunk, offset } of chunks) {
        const data = await this.checkChunk(chunk, options);
        const issues = transformToGrammarIssues(data, options);

        // Adjust offsets for issues from this chunk
        const adjustedIssues = issues.map(issue => ({
          ...issue,
          offset: issue.offset + offset,
        }));

        allIssues.push(...adjustedIssues);
      }

      return allIssues;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to check grammar. Please check your connection and try again.');
    }
  }
}

// Singleton instance
export const languageToolClient = new LanguageToolClient();
