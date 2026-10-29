import type { LogLevel } from '../types';
import { Environment } from './Environment';

// Ordem de importância dos níveis: quanto maior o número, mais grave.
const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

/**
 * Logger simples: escreve mensagens no terminal com data, nível e origem.
 * Exemplo de saída: [2026-10-29T12:00:00.000Z] [INFO] [LoginPage] Login com usuário "x"
 * Coloque LOG_LEVEL=debug no .env para ver também as mensagens de detalhe.
 */
export class Logger {
  // Nível mínimo: mensagens abaixo dele não são exibidas.
  private readonly minLevel: LogLevel;

  // context = de onde vem a mensagem (ex.: "LoginPage").
  constructor(private readonly context: string) {
    this.minLevel = (Environment.get('LOG_LEVEL', 'info') as LogLevel) ?? 'info';
  }

  // Um método para cada nível. Todos chamam o método log() lá embaixo.
  debug(message: string): void {
    this.log('debug', message);
  }

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  private log(level: LogLevel, message: string): void {
    // Se o nível da mensagem for menor que o mínimo configurado, não mostra nada.
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    // Monta a linha: [data] [NÍVEL] [origem] mensagem
    const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${this.context}] ${message}`;
    // Usa a função do console adequada para cada nível.
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  }
}
