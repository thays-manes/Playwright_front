import type { Locator } from '@playwright/test';
import type { FormField } from '../types';

/**
 * Ações genéricas de formulário, reaproveitadas por qualquer página que tenha um formulário.
 * A página diz QUAIS campos existem; esta classe sabe COMO preenchê-los.
 * Os métodos são "static": chamamos direto pela classe, sem criar objeto (FormActions.fillFields(...)).
 */
export class FormActions {
  /**
   * Preenche os campos na ordem da lista.
   * Um valor vazio ('') limpa o campo — isso permite testar as mensagens de campo obrigatório.
   */
  static async fillFields(fields: FormField[]): Promise<void> {
    // Percorre cada campo da lista, pegando o locator (onde está o campo) e o value (o que digitar).
    for (const { locator, value } of fields) {
      await locator.fill(value); // fill apaga o conteúdo atual e digita o novo valor
    }
  }

  /** Envia o formulário clicando no botão recebido. */
  static async submit(submitButton: Locator): Promise<void> {
    await submitButton.click();
  }
}
