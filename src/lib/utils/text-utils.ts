export function getTextPreview(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function highlightTextSpan(
  text: string,
  offset: number,
  length: number
): { before: string; highlight: string; after: string } {
  return {
    before: text.substring(0, offset),
    highlight: text.substring(offset, offset + length),
    after: text.substring(offset + length),
  };
}

export function getContextAroundOffset(
  text: string,
  offset: number,
  contextSize: number = 40
): { text: string; relativeOffset: number } {
  const start = Math.max(0, offset - contextSize);
  const end = Math.min(text.length, offset + contextSize);
  const contextText = text.substring(start, end);
  const relativeOffset = offset - start;

  return {
    text: (start > 0 ? '...' : '') + contextText + (end < text.length ? '...' : ''),
    relativeOffset: relativeOffset + (start > 0 ? 3 : 0),
  };
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
