import { Environment } from '../utils/Environment';
import type { UserCredentials } from '../types';

/**
 * Usuários usados nos testes.
 * Usuário e senha SEMPRE vêm de variáveis de ambiente (.env na máquina local,
 * Secrets do GitHub na CI). Nenhuma senha fica salva no código.
 * Cada usuário é uma função, para ler as variáveis só na hora em que o teste precisa.
 */
export const users = {
  // Usuário comum, que consegue fazer login e comprar.
  standard: (): UserCredentials => ({
    username: Environment.require('TEST_USERNAME'),
    password: Environment.require('TEST_PASSWORD'),
  }),
  // Usuário bloqueado, usado para testar a mensagem de acesso negado.
  lockedOut: (): UserCredentials => ({
    username: Environment.require('TEST_LOCKED_USERNAME'),
    password: Environment.require('TEST_PASSWORD'),
  }),
};

// Retornam true se as variáveis do usuário estiverem preenchidas.
// Os testes usam isso para serem pulados (skip) quando o .env não tem as credenciais.
export const hasStandardUser = (): boolean => Environment.has('TEST_USERNAME', 'TEST_PASSWORD');
export const hasLockedOutUser = (): boolean =>
  Environment.has('TEST_LOCKED_USERNAME', 'TEST_PASSWORD');

/** Mensagens de erro exibidas pelo site na tela de login. */
export const loginMessages = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials:
    'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  // Esta mensagem muda conforme a página, por isso é uma função que recebe a rota.
  protectedRoute: (route: string) =>
    `Epic sadface: You can only access '${route}' when you are logged in.`,
};
