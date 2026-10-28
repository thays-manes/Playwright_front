import type { Locator } from '@playwright/test';

export type EnvironmentName = 'demo' | 'dev' | 'hml' | 'prod';

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseURL: string;
  /** Production must never run tests tagged @destructive. */
  isProduction: boolean;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface FormField {
  locator: Locator;
  value: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type ProductSortOption = 'az' | 'za' | 'lohi' | 'hilo';
