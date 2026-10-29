import { randomInt, randomUUID } from 'node:crypto'; // funções do Node para gerar valores aleatórios
import type { CustomerInfo, UserCredentials } from '../types';

/**
 * Fábrica de dados de teste: gera dados novos a cada execução,
 * para os testes não dependerem de valores fixos.
 */
export class TestDataFactory {
  /** Gera um texto aleatório de 8 caracteres (ex.: "3f9a1c2b"). */
  static uniqueSuffix(): string {
    return randomUUID().slice(0, 8);
  }

  /** Gera um usuário e senha que não existem, para testar login inválido. */
  static invalidCredentials(): UserCredentials {
    const suffix = TestDataFactory.uniqueSuffix();
    return { username: `invalid_user_${suffix}`, password: `wrong_pass_${suffix}` };
  }

  /**
   * Gera os dados de um comprador.
   * overrides permite trocar algum campo. Ex.: customer({ firstName: '' }) gera um comprador sem nome,
   * útil para testar campo obrigatório.
   */
  static customer(overrides: Partial<CustomerInfo> = {}): CustomerInfo {
    const suffix = TestDataFactory.uniqueSuffix();
    return {
      firstName: `Cliente ${suffix}`,
      lastName: 'Teste',
      postalCode: String(randomInt(10_000_000, 99_999_999)), // CEP aleatório de 8 dígitos
      ...overrides, // "..." aplica por cima os campos que vieram em overrides
    };
  }
}
