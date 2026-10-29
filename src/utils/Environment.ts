import path from 'node:path';
import dotenv from 'dotenv'; // biblioteca que lê o arquivo .env

// Carrega as variáveis do arquivo .env (na pasta do projeto) para dentro de process.env.
// quiet: true evita mensagens no terminal.
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

/**
 * Centraliza a leitura das variáveis de ambiente.
 * Se uma variável obrigatória faltar, o teste para logo no início com uma mensagem clara,
 * em vez de falhar depois com um erro difícil de entender (como um timeout).
 */
export class Environment {
  /** Lê uma variável. Se estiver vazia ou não existir, devolve o valor padrão (fallback). */
  static get(name: string, fallback?: string): string | undefined {
    // trim() remove espaços do começo e do fim. O "?." evita erro se a variável não existir.
    const value = process.env[name]?.trim();
    return value ? value : fallback;
  }

  /** Lê uma variável OBRIGATÓRIA. Se não existir, lança um erro explicando o que fazer. */
  static require(name: string): string {
    const value = Environment.get(name);
    if (!value) {
      throw new Error(
        `Variável de ambiente obrigatória "${name}" não definida. ` +
          'Copie .env.example para .env e preencha os valores.',
      );
    }
    return value;
  }

  /** Retorna true se TODAS as variáveis informadas estiverem preenchidas. */
  static has(...names: string[]): boolean {
    return names.every((name) => Boolean(Environment.get(name)));
  }

  /** Lê uma variável como número. Se não existir, usa o padrão. Se não for número, lança erro. */
  static number(name: string, fallback: number): number {
    const raw = Environment.get(name);
    if (raw === undefined) return fallback;
    const parsed = Number(raw);
    // NaN = "Not a Number", acontece quando o texto não é um número (ex.: "abc").
    if (Number.isNaN(parsed)) {
      throw new Error(`Variável de ambiente "${name}" deve ser numérica, recebido: "${raw}".`);
    }
    return parsed;
  }

  /** true quando está rodando na CI (o GitHub Actions define a variável CI automaticamente). */
  static get isCI(): boolean {
    return Boolean(process.env.CI);
  }
}
