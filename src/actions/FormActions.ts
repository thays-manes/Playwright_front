import type { Locator } from '@playwright/test';
import type { FormField } from '../types';

/**
 * Generic form behavior reused by any page object that has a form.
 * Page objects describe *which* fields exist; this class knows *how* to fill them.
 */
export class FormActions {
  /** Fills fields in order. Empty values clear the field, which lets tests cover required-field rules. */
  static async fillFields(fields: FormField[]): Promise<void> {
    for (const { locator, value } of fields) {
      await locator.fill(value);
    }
  }

  static async submit(submitButton: Locator): Promise<void> {
    await submitButton.click();
  }
}
