/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { arTranslations } from './ar';
import { enTranslations } from './en';

export type SupportedLanguage = 'ar' | 'en';

export const allTranslations: Record<SupportedLanguage, Record<string, string>> = {
  ar: arTranslations,
  en: enTranslations
};

export { arTranslations, enTranslations };
