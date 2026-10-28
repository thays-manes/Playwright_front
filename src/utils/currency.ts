/** Extracts the numeric value from a price label such as "$29.99" or "Total: $43.18". */
export function parsePrice(text: string): number {
  const match = /\$\s*(\d+(?:\.\d+)?)/.exec(text);
  if (!match) {
    throw new Error(`Não foi possível extrair um valor monetário de "${text}".`);
  }
  return Number(match[1]);
}

/** Rounds to cents, avoiding floating point noise when summing prices. */
export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
