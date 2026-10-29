/**
 * Extrai o número de um texto com preço.
 * Exemplos: "$29.99" → 29.99   |   "Total: $43.18" → 43.18
 */
export function parsePrice(text: string): number {
  // Expressão regular: procura o "$" seguido de um número com ou sem casas decimais.
  const match = /\$\s*(\d+(?:\.\d+)?)/.exec(text);
  // Se não encontrar um preço no texto, para o teste com uma mensagem clara.
  if (!match) {
    throw new Error(`Não foi possível extrair um valor monetário de "${text}".`);
  }
  // match[1] é a parte do número (sem o "$"); Number() converte o texto em número.
  return Number(match[1]);
}

/**
 * Arredonda para 2 casas decimais (centavos).
 * Necessário porque somas com decimais no JavaScript podem dar resultados como 0.1 + 0.2 = 0.30000000000000004.
 */
export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
