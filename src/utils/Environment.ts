import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

/**
 * Centralizes access to environment variables so tests fail fast
 * with a clear message instead of an obscure timeout.
 */
export class Environment {
  static get(name: string, fallback?: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : fallback;
  }

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

  static has(...names: string[]): boolean {
    return names.every((name) => Boolean(Environment.get(name)));
  }

  static number(name: string, fallback: number): number {
    const raw = Environment.get(name);
    if (raw === undefined) return fallback;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      throw new Error(`Variável de ambiente "${name}" deve ser numérica, recebido: "${raw}".`);
    }
    return parsed;
  }

  static get isCI(): boolean {
    return Boolean(process.env.CI);
  }
}
