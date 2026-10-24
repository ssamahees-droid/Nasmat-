/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const CIPHER_PROGRESS_KEY = 'nesma_cipher_progress_v1';
export const CIPHER_SECRETS_SOLVED_KEY = 'nesma_cipher_solved_secrets_v1';
export const CIPHER_SOUND_KEY = 'nesma_cipher_sound_enabled';
export const CIPHER_GRAND_SOLVED_KEY = 'nesma_cipher_grand_solved';

export interface CipherProgressData {
  completedLevels: number[];
  solvedSecrets: string[];
  soundEnabled: boolean;
  grandSecretSolved: boolean;
}

export const nesmaCipherStorage = {
  getCompletedLevels(): number[] {
    try {
      const saved = localStorage.getItem(CIPHER_PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  },

  saveCompletedLevels(levels: number[]): void {
    try {
      localStorage.setItem(CIPHER_PROGRESS_KEY, JSON.stringify(levels));
    } catch (_) {}
  },

  getSolvedSecrets(): string[] {
    try {
      const saved = localStorage.getItem(CIPHER_SECRETS_SOLVED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  },

  saveSolvedSecrets(secrets: string[]): void {
    try {
      localStorage.setItem(CIPHER_SECRETS_SOLVED_KEY, JSON.stringify(secrets));
    } catch (_) {}
  },

  isGrandSecretSolved(): boolean {
    return localStorage.getItem(CIPHER_GRAND_SOLVED_KEY) === 'true';
  },

  setGrandSecretSolved(solved: boolean): void {
    localStorage.setItem(CIPHER_GRAND_SOLVED_KEY, String(solved));
  },

  isSoundEnabled(): boolean {
    return localStorage.getItem(CIPHER_SOUND_KEY) !== 'false';
  },

  setSoundEnabled(enabled: boolean): void {
    localStorage.setItem(CIPHER_SOUND_KEY, String(enabled));
  }
};
