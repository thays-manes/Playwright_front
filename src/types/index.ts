// Tipos usados no projeto. Um tipo descreve o "formato" de um dado,
// e o TypeScript avisa se usarmos um valor que não segue esse formato.
import type { Locator } from '@playwright/test';

// Nomes de ambiente aceitos. Só estes 4 valores são válidos.
export type EnvironmentName = 'demo' | 'dev' | 'hml' | 'prod';

// Configuração de um ambiente (veja config/environments.ts).
export interface EnvironmentConfig {
  name: EnvironmentName;
  baseURL: string;
  /** Em produção, os testes marcados com @destructive nunca rodam. */
  isProduction: boolean;
}

// Usuário e senha para fazer login.
export interface UserCredentials {
  username: string;
  password: string;
}

// Dados do comprador preenchidos no checkout.
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Um campo de formulário: onde ele está na tela (locator) e o que digitar nele (value).
export interface FormField {
  locator: Locator;
  value: string;
}

// Níveis de log, do mais detalhado (debug) ao mais grave (error).
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Opções de ordenação do catálogo: A-Z, Z-A, menor preço primeiro, maior preço primeiro.
export type ProductSortOption = 'az' | 'za' | 'lohi' | 'hilo';
