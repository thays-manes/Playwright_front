import type { LogLevel } from '../types';
import { Environment } from './Environment';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

/** Minimal leveled logger. Set LOG_LEVEL=debug in .env to see step details. */
export class Logger {
  private readonly minLevel: LogLevel;

  constructor(private readonly context: string) {
    this.minLevel = (Environment.get('LOG_LEVEL', 'info') as LogLevel) ?? 'info';
  }

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
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${this.context}] ${message}`;
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  }
}
